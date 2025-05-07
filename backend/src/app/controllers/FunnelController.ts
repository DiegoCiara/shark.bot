import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import emailValidator from '@utils/emailValidator';
import Funnel from '@entities/Funnel';
import User from '@entities/User';
import Pipeline from '@entities/Pipeline';
import Deal from '@entities/Deal';

interface FunnelInterface {
  name: string;
  description: string;
  deal_status: string[];
  pipelines: Pipeline[];
}

interface PipelineInterface {
  name: string;
  description: string;
}

/**
 * @swagger
 * tags:
 *   name: Funis
 *   description: Operações relativas às declarações
 */

class FunnelController {
  /**
   * @swagger
   * /funnel:
   *   get:
   *     summary: Retorna todas as declarações de um usuário autenticado
   *     tags: [Funis]
   *     responses:
   *       200:
   *         description: Funis encontradas
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
  public async findFunnels(req: Request, res: Response): Promise<void> {
    try {
      const user = await User.findOne(req.userId);

      if (!user) {
        res.status(401).json({ message: 'Usuário não encontrado.' });
        return;
      }

      const funnels = await Funnel.find({
        order: { name: 'DESC', created_at: 'DESC' },
      });

      res.status(200).json(funnels);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: 'Erro ao procurar declarações, tente novamente mais tarde',
      });
    }
  }
  /**
   * @swagger
   * /funnel:
   *   get:
   *     summary: Retorna todas as declarações de um usuário autenticado
   *     tags: [Funis]
   *     responses:
   *       200:
   *         description: Funis encontradas
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
  public async findPipelines(req: Request, res: Response): Promise<void> {
    try {
      const { funnelId } = req.params;
      const funnel = await Funnel.findOne(funnelId, {
        relations: ['pipelines'],
      });
      if (!funnel) {
        res.status(404).json({ message: 'Funil não encontrada.' });
        return;
      }
      const pipelines = funnel.pipelines;
      if (!pipelines) {
        res.status(404).json({ message: 'Funil não encontrada.' });
        return;
      }
      res.status(200).json(pipelines);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: 'Erro ao procurar declarações, tente novamente mais tarde',
      });
    }
  }

  /**
   * @swagger
   * /funnel/{id}:
   *   get:
   *     summary: Retorna um funil específica pelo ID
   *     tags: [Funis]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID do funil
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Funil encontrada
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
   *         description: Funil não encontrada
   *       500:
   *         description: Erro ao buscar funil
   */
  public async findFunnelById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const funnel = await Funnel.findOne(id, { relations: ['pipelines'] });

      if (!funnel) {
        res.status(404).json({ message: 'Funil não encontrada.' });
        return;
      }
      console.log(funnel);
      res.status(200).json(funnel);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao buscar funil, tente novamente' });
    }
  }
  /**
   * @swagger
   * /funnel/pipeline/{id}:
   *   get:
   *     summary: Retorna um pipeline específica pelo ID
   *     tags: [Funis]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID do funil
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Funil encontrada
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
   *         description: Funil não encontrada
   *       500:
   *         description: Erro ao buscar funil
   */
  public async findPipelineById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const funnel = await Pipeline.findOne(id);

      if (!funnel) {
        res.status(404).json({ message: 'Pipeline não encontrada.' });
        return;
      }
      console.log(funnel);
      res.status(200).json(funnel);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: 'Erro ao buscar pipeline, tente novamente' });
    }
  }

  /**
   * @swagger
   * /funnel:
   *   post:
   *     summary: Cria uma novo funil para o usuário autenticado
   *     tags: [Funis]
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
   *         description: Funil criada com sucesso
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

      const { name, description, deal_status, pipelines }: FunnelInterface =
        req.body;

      if (!name || !description) {
        res
          .status(400)
          .json({ message: 'Dados inválidos para criação do funil.' });
        return;
      }

      const workspace = await user.workspace;

      if (!workspace) {
        res.status(401).json({ message: 'Usuário não autorizado.' });
        return;
      }
      const hasFunnel = await Funnel.findOne({ where: { name } });
      if (hasFunnel) {
        res.status(400).json({ message: 'Funil já existe.' });
        return;
      }

      const funnel = await Funnel.create({
        name,
        description,
        workspace,
        deal_status: deal_status || [],
      }).save();

      for (const pipeline of pipelines) {
        await Pipeline.create({ ...pipeline, funnel }).save();
        console.log(`${pipeline.name} criado com sucesso`);
      }

      res.status(201).json({ id: funnel.id });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: 'Erro ao registrar o funil, tente novamente.' });
    }
  }

  /**
   * @swagger
   * /funnel:
   *   post:
   *     summary: Cria uma novo funil para o usuário autenticado
   *     tags: [Funis]
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
   *         description: Funil criada com sucesso
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
  public async createPipeline(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;

      const funnel = await Funnel.findOne(id, { relations: ['pipelines'] });

      if (!funnel) {
        res.status(401).json({ message: 'Usuário não autorizado.' });
        return;
      }

      const { name, description }: FunnelInterface = req.body;

      if (!name || !description) {
        res
          .status(400)
          .json({ message: 'Dados inválidos para criação do funil.' });
        return;
      }

      const pipeline = await Pipeline.create({
        name,
        description,
        funnel,
        position: funnel.pipelines.length,
      }).save();

      res.status(201).json({ id: pipeline.id });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: 'Erro ao registrar o funil, tente novamente.' });
    }
  }

  /**
   * @swagger
   * /funnel/{id}:
   *   put:
   *     summary: Atualiza um funil existente
   *     tags: [Funis]
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
   *         description: Funil atualizada com sucesso
   *       404:
   *         description: Funil não encontrada
   *       500:
   *         description: Erro ao atualizar o funil
   */
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const { name, description, deal_status, pipelines }: FunnelInterface =
        req.body;

      const funnel = await Funnel.findOne(id);

      if (!funnel) {
        res.status(404).json({ message: 'Funil não encontrada.' });
        return;
      }

      const descriptionToUpdate = {
        name: name || funnel.name,
        description: description || funnel.description,
        deal_status: deal_status,
      };

      await Funnel.update(funnel.id, { ...descriptionToUpdate });

      for (const pipeline of pipelines) {
        await Pipeline.update(pipeline.id, { position: pipeline.position });
        console.log(`${pipeline.name} criado com sucesso`);
      }

      res.status(204).json({ message: 'Funil atualizada com sucesso.' });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: 'Erro ao atualizar o funil, tente novamente.' });
    }
  }

  /**
   * @swagger
   * /funnel/pipeline/{id}:
   *   put:
   *     summary: Atualiza um pipeline existente
   *     tags: [Funis]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID do pipeline a ser atualizada
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
   *         description: Funil atualizada com sucesso
   *       404:
   *         description: Funil não encontrada
   *       500:
   *         description: Erro ao atualizar o funil
   */
  public async updatePipeline(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const { name, description }: FunnelInterface = req.body;

      const pipeline = await Pipeline.findOne(id);

      if (!pipeline) {
        res.status(404).json({ message: 'Funil não encontrada.' });
        return;
      }

      const descriptionToUpdate = {
        name: name || pipeline.name,
        description: description || pipeline.description,
      };

      await Pipeline.update(pipeline.id, { ...descriptionToUpdate });

      res.status(204).json({ message: 'Funil atualizada com sucesso.' });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: 'Erro ao atualizar o funil, tente novamente.' });
    }
  }

  /**
   * @swagger
   * /funnel/{id}:
   *   delete:
   *     summary: Deleta um funil existente
   *     tags: [Funis]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID do funil a ser deletada
   *         schema:
   *           type: string
   *     responses:
   *       204:
   *         description: Funil deletada com sucesso
   *       404:
   *         description: Funil não encontrada
   *       401:
   *         description: Não é possível remover declarações submetidas
   *       500:
   *         description: Erro ao deletar o funil
   */
  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const funnel = await Funnel.findOne(id, {
        relations: ['pipelines', 'pipelines.deals'],
      });

      if (!funnel) {
        res.status(404).json({ message: 'Funil não encontrada.' });
        return;
      }

      if (funnel.pipelines.length > 0) {
        const pipelines = funnel.pipelines;
        for (const pipeline of pipelines) {
          const deals = pipeline.deals;
          for (const deal of deals) {
            await Deal.update(deal.id, { status: 'ARCHIVED' });
          }
          await Pipeline.softRemove(pipeline);
        }
      }

      await Funnel.softRemove(funnel);

      res.status(204).json({ messsage: 'Funil deletado com sucesso.' });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: 'Erro ao deletar o funil, tente novamente.' });
    }
  }
  /**
   * @swagger
   * /funnel/pipeline/{id}:
   *   delete:
   *     summary: Deleta um funil existente
   *     tags: [Funis]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID do funil a ser deletada
   *         schema:
   *           type: string
   *     responses:
   *       204:
   *         description: Funil deletada com sucesso
   *       404:
   *         description: Funil não encontrada
   *       401:
   *         description: Não é possível remover declarações submetidas
   *       500:
   *         description: Erro ao deletar o funil
   */
  public async deletePipeline(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const pipeline = await Pipeline.findOne(id, {
        relations: ['deals'],
      });

      if (!pipeline) {
        res.status(404).json({ message: 'Pipeline não encontrada.' });
        return;
      }

      const deals = pipeline.deals;
      if (deals.length > 0) {
        for (const deal of deals) {
          await Deal.update(deal.id, { status: 'ARCHIVED' });
        }
      }
      await Pipeline.softRemove(pipeline);

      res.status(204).json({ messsage: 'Pipeline deletado com sucesso.' });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: 'Erro ao deletar o funil, tente novamente.' });
    }
  }
}

export default new FunnelController();
