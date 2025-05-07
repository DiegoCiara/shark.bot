import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import emailValidator from '@utils/emailValidator';

import User from '@entities/User';
import Partner from '@entities/Partner';

interface PartnerInterface {
  name: string;
  description: string;
}

/**
 * @swagger
 * tags:
 *   name: Produtos
 *   description: Operações relativas às produtos
 */

class PartnerController {
  /**
   * @swagger
   * /partner:
   *   get:
   *     summary: Retorna todas as produtos de um usuário autenticado
   *     tags: [Produtos]
   *     responses:
   *       200:
   *         description: Produtos encontradas
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
   *       500:
   *         description: Erro ao procurar produtos
   */
  public async findPartners(req: Request, res: Response): Promise<void> {
    try {
      const partners = await Partner.find({
        order: { name: 'DESC', created_at: 'DESC' },
      });

      res.status(200).json(partners);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: 'Erro ao procurar produtos, tente novamente mais tarde',
      });
    }
  }

  /**
   * @swagger
   * /partner/{id}:
   *   get:
   *     summary: Retorna um produto específica pelo ID
   *     tags: [Produtos]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID do produto
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Produto encontrada
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
   *         description: Produto não encontrada
   *       500:
   *         description: Erro ao buscar declaração
   */
  public async findPartnerById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const partner = await Partner.findOne(id);

      if (!partner) {
        res.status(404).json({ message: 'Produto não encontrada.' });
        return;
      }
      console.log(partner);
      res.status(200).json(partner);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: 'Erro ao buscar declaração, tente novamente' });
    }
  }

  /**
   * @swagger
   * /partner:
   *   post:
   *     summary: Cria uma novo produto para o usuário autenticado
   *     tags: [Produtos]
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
   *         description: Produto criada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *       400:
   *         description: Dados inválidos para criação do produto
   *       401:
   *         description: Usuário não autorizado
   *       500:
   *         description: Erro ao registrar o produto
   */
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const user = await User.findOne(req.userId, { relations: ['workspace'] });

      if (!user) {
        res.status(401).json({ message: 'Usuário não autorizado.' });
        return;
      }

      const { name }: PartnerInterface = req.body;

      if (!name) {
        res
          .status(400)
          .json({ message: 'Dados inválidos para criação do parceiro.' });
        return;
      }

      const partner = await Partner.create({
        name,
        workspace: user.workspace,
      }).save();

      res.status(201).json({ id: partner.id });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: 'Erro ao registrar o produto, tente novamente.' });
    }
  }

  /**
   * @swagger
   * /partner/{id}:
   *   put:
   *     summary: Atualiza um produto existente
   *     tags: [Produtos]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID do produto a ser atualizada
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
   *         description: Produto atualizada com sucesso
   *       404:
   *         description: Produto não encontrada
   *       500:
   *         description: Erro ao atualizar o produto
   */
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, description }: PartnerInterface = req.body;

      const partner = await Partner.findOne(id);

      if (!partner) {
        res.status(404).json({ message: 'Produto não encontrada.' });
        return;
      }

      const descriptionToUpdate = {
        name: name || partner.name,
      };

      await Partner.update(partner.id, { ...descriptionToUpdate });

      res.status(204).json({ message: 'Produto atualizada com sucesso.' });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: 'Erro ao atualizar o produto, tente novamente.' });
    }
  }

  /**
   * @swagger
   * /partner/{id}:
   *   delete:
   *     summary: Deleta um produto existente
   *     tags: [Produtos]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID do produto a ser deletada
   *         schema:
   *           type: string
   *     responses:
   *       204:
   *         description: Produto deletada com sucesso
   *       404:
   *         description: Produto não encontrada
   *       401:
   *         description: Não é possível remover produtos submetidas
   *       500:
   *         description: Erro ao deletar o produto
   */
  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const partner = await Partner.findOne(id);

      if (!partner) {
        res.status(404).json({ message: 'Produto não encontrada.' });
        return;
      }

      await Partner.softRemove(partner);

      res.status(204).json({ messsage: 'Produto deletada com sucesso.' });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: 'Erro ao deletar o produto, tente novamente.' });
    }
  }
}

export default new PartnerController();
