import { Request, Response } from 'express';
import Workspace from '@entities/Workspace';
import User from '@entities/User';

interface WorkspaceInterface {
  id?: string;
  name: string;
}

/**
 * @swagger
 * tags:
 *   name: Workspace
 *   description: Operações relativas aos workspaces
 */

class UserController {
  /**
   * @swagger
   * /workspace/{id}:
   *   get:
   *     summary: Retorna o workspace procurado pelo ID
   *     tags: [Workspace]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID do workspace
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Usuário encontrado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                 name:
   *                   type: string
   *                 email:
   *                   type: string
   *       404:
   *         description: Usuário não encontrado
   *       500:
   *         description: Erro interno
   */
  public async findWorkspaceById(req: Request, res: Response): Promise<void> {
    try {
      const workspace = await Workspace.findOne({
        select: ['id', 'name', 'created_at'],
      });

      if (!workspace) {
        res.status(404).json({ message: 'Workspace não encontrado.' });
        return;
      }

      res.status(200).json(workspace);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: 'Erro interno ao buscar workspace, tente novamente.' });
    }
  }

  /**
   * @swagger
   * /workspace:
   *   post:
   *     summary: Cria um novo workspace
   *     tags: [Workspace]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *     responses:
   *       201:
   *         description: Usuário criado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *       400:
   *         description: Valores inválidos para o novo workspace
   *       409:
   *         description: Usuário já existe
   *       500:
   *         description: Erro interno ao criar o workspace
   */

  public async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, price_id, payment_method_id } = req.body;

      if (!name) {
        res
          .status(404)
          .json({ message: 'Informe um nome para seu workspace.' });
        return;
      }

      // const subscription = await createSubscription(workspace.Contact_id, price_id, payment_method_id);

      // if (!subscription || !subscription.id) {
      //   res.status(400).json({ message: 'Não foi possível realizar a assinatura, altere o método de pagamento e tente novamente.' });
      //   return;
      // }

      const workspace = await Workspace.create({
        name,
        // subscription_id: subscription.id,
      }).save();

      res.status(200).json(workspace);
    } catch (error) {
      console.error(error);
      res.status(404).json({ message: 'Algo deu errado, tente novamente.' });
    }
  }

  /**
   * @swagger
   * /workspace/{id}:
   *   put:
   *     summary: Atualiza os dados de um workspace
   *     tags: [Workspace]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID do workspace a ser atualizado
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
   *               email:
   *                 type: string
   *     responses:
   *       204:
   *         description: Usuário atualizado com sucesso
   *       400:
   *         description: Formato de e-mail inválido
   *       404:
   *         description: Usuário não encontrado
   *       500:
   *         description: Erro interno ao atualizar o workspace
   */
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name }: WorkspaceInterface = req.body;

      const workspace = await Workspace.findOne(id);

      if (!workspace) {
        res.status(404).json({ message: 'Usuário não encontrado.' });
        return;
      }

      const valuesToUpdate = {
        name: name || workspace.name,
      };

      await Workspace.update(workspace.id, { ...valuesToUpdate });

      res.status(204).send({ message: 'Usuário atualizado com sucesso' });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Erro interno ao atualizar o workspace, tente novamente.',
      });
    }
  }
}

export default new UserController();
