import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import emailValidator from '@utils/emailValidator';
import Deal from '@entities/Deal';
import User from '@entities/User';
import Contact from '@entities/Contact';
import Pipeline from '@entities/Pipeline';
import Product from '@entities/Product';
import Partner from '@entities/Partner';

interface DealInterface {
  contact_id: string;
  pipeline_id: string;
  partner_id: string;
  product_id: string;
  observation: string;
  value: string;
}

/**
 * @swagger
 * tags:
 *   name: Oportunidades
 *   description: Operações relativas às declarações
 */

class DealController {
  /**
   * @swagger
   * /deal:
   *   get:
   *     summary: Retorna todas as declarações de um usuário autenticado
   *     tags: [Oportunidades]
   *     responses:
   *       200:
   *         description: Oportunidades encontradas
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   name:
   *                     type: string
   *                   description:
   *                     type: object
   *                     properties:
   *                       rent:
   *                         type: number
   *                       deduction:
   *                         type: number
   *       401:
   *         description: Usuário não encontrado ou token inválido
   *       500:
   *         description: Erro ao procurar declarações
   */
  public async findDeals(req: Request, res: Response): Promise<void> {
    try {
      const user = await User.findOne(req.userId);

      if (!user) {
        res.status(401).json({ message: 'Usuário não encontrado.' });
        return;
      }

      const deals = await Deal.find({
        // order: { name: 'DESC', created_at: 'DESC' },
        relations: ['contact', 'product', 'pipeline', 'partner', 'user'],
        // where: { user, workspace: user.workspace },
      });

      if (!deals) {
        res.status(404).json({ message: 'Nenhuma oportunidade encontrada.' });
        return;
      }

      const dealsMap = deals.map((deal) => {
        return {
          id: deal.id,
          contact_name: deal.contact.name,
          contact_phone: deal.contact.phone,
          contact_cpf_cnpj: deal.contact.cpf_cnpj,
          value: deal.value,
          pipeline_name: deal.pipeline.name,
          product_name: deal.product.name,
          user_name: deal.user.name,
          status: deal.status,
          created_at: deal.created_at,
          deadline: deal.deadline,
        };
      });

      res.status(200).json(dealsMap);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: 'Erro ao procurar declarações, tente novamente mais tarde',
      });
    }
  }

  /**
   * @swagger
   * /deal/{id}:
   *   get:
   *     summary: Retorna um funil específica pelo ID
   *     tags: [Oportunidades]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID do funil
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Oportunidade encontrada
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 name:
   *                   type: string
   *                 description:
   *                   type: object
   *                   properties:
   *                     rent:
   *                       type: number
   *                     deduction:
   *                       type: number
   *       404:
   *         description: Oportunidade não encontrada
   *       500:
   *         description: Erro ao buscar oportunidade
   */
  public async findDealById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const deal = await Deal.findOne(id, { relations: ['contact', 'contact.profile', 'pipeline', 'product', 'partner'] });

      if (!deal) {
        res.status(404).json({ message: 'Oportunidade não encontrada.' });
        return;
      }
      console.log(deal, id);

      res.status(200).json(deal);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: 'Erro ao buscar oportunidade, tente novamente' });
    }
  }

  /**
   * @swagger
   * /deal:
   *   post:
   *     summary: Cria uma novo funil para o usuário autenticado
   *     tags: [Oportunidades]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               description:
   *                 type: object
   *                 properties:
   *                   rent:
   *                     type: number
   *                   deduction:
   *                     type: number
   *     responses:
   *       201:
   *         description: Oportunidade criada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *       400:
   *         description: Dados inválidos para criação do funil
   *       401:
   *         description: Usuário não autorizado
   *       500:
   *         description: Erro ao registrar o funil
   */
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const user = await User.findOne(req.userId, { relations: ['workspace'] });

      if (!user) {
        res.status(401).json({ message: 'Usuário não autorizado.' });
        return;
      }

      const { contact_id, pipeline_id, product_id, partner_id, observation, value }: DealInterface = req.body;

      if (!contact_id || !pipeline_id || !product_id || !partner_id) {
        res
          .status(400)
          .json({ message: 'Dados inválidos para criação do funil.' });
        return;
      }

      const contact = await Contact.findOne(contact_id);

      if (!contact) {
        res.status(404).json({ message: 'Cliente não encontrado.' });
        return;
      }

      const pipeline = await Pipeline.findOne(pipeline_id);

      if (!pipeline) {
        res.status(404).json({ message: 'Cliente não encontrado.' });
        return;
      }

      const product = await Product.findOne(product_id);

      if (!product) {
        res.status(404).json({ message: 'Cliente não encontrado.' });
        return;
      }


      const partner = await Partner.findOne(partner_id);

      if (!partner) {
        res.status(404).json({ message: 'Cliente não encontrado.' });
        return;
      }

      console.log(value)

      const deal = await Deal.create({
        // name,
        // description,
        contact,
        pipeline,
        product,
        partner,
        observation,
        value: Number(value),
        user,
        workspace: user.workspace,
      }).save();

      res.status(201).json({ id: deal.id });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: 'Erro ao registrar o funil, tente novamente.' });
    }
  }

  /**
   * @swagger
   * /deal/{id}:
   *   put:
   *     summary: Atualiza um funil existente
   *     tags: [Oportunidades]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID do funil a ser atualizada
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               description:
   *                 type: object
   *                 properties:
   *                   rent:
   *                     type: number
   *                   deduction:
   *                     type: number
   *               status:
   *                 type: string
   *     responses:
   *       204:
   *         description: Oportunidade atualizada com sucesso
   *       404:
   *         description: Oportunidade não encontrada
   *       500:
   *         description: Erro ao atualizar o funil
   */
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // const { name, description, deal_status }: DealInterface = req.body;

      const deal = await Deal.findOne(id);

      if (!deal) {
        res.status(404).json({ message: 'Oportunidade não encontrada.' });
        return;
      }

      // const descriptionToUpdate = {
      //   name: name || deal.name,
      //   description: description || deal.description,
      //   deal_status: deal_status,
      // };

      // await Deal.update(deal.id, { ...descriptionToUpdate });

      res.status(204).json({ message: 'Oportunidade atualizada com sucesso.' });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: 'Erro ao atualizar o funil, tente novamente.' });
    }
  }

  /**
   * @swagger
   * /deal/{id}:
   *   delete:
   *     summary: Deleta um funil existente
   *     tags: [Oportunidades]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID do funil a ser deletada
   *         schema:
   *           type: string
   *     responses:
   *       204:
   *         description: Oportunidade deletada com sucesso
   *       404:
   *         description: Oportunidade não encontrada
   *       401:
   *         description: Não é possível remover declarações submetidas
   *       500:
   *         description: Erro ao deletar o funil
   */
  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const deal = await Deal.findOne(id);

      if (!deal) {
        res.status(404).json({ message: 'Oportunidade não encontrada.' });
        return;
      }

      await Deal.softRemove(deal);

      res.status(204).json({ messsage: 'Oportunidade deletada com sucesso.' });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: 'Erro ao deletar o funil, tente novamente.' });
    }
  }
}

export default new DealController();
