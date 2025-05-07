import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import emailValidator from '@utils/emailValidator';
import Profile from '@entities/Profile';
import User from '@entities/User';

interface ProfileInterface {
  name: string;
  description: string
}

/**
 * @swagger
 * tags:
 *   name: Perfis
 *   description: Operações relativas às declarações
 */

class ProfileController {
  /**
   * @swagger
   * /profile:
   *   get:
   *     summary: Retorna todas as declarações de um usuário autenticado
   *     tags: [Perfis]
   *     responses:
   *       200:
   *         description: Perfis encontradas
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
  public async findProfiles(req: Request, res: Response): Promise<void> {
    try {
      const user = await User.findOne(req.userId);

      if (!user) {
        res.status(401).json({ message: 'Usuário não encontrado.' });
        return;
      }

      const profiles = await Profile.find({
        order: { name: 'DESC', created_at: 'DESC' },
      });

      res.status(200).json(profiles);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: 'Erro ao procurar declarações, tente novamente mais tarde',
      });
    }
  }

  /**
   * @swagger
   * /profile/{id}:
   *   get:
   *     summary: Retorna um perfil específica pelo ID
   *     tags: [Perfis]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID do perfil
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Perfil encontrada
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
   *         description: Perfil não encontrada
   *       500:
   *         description: Erro ao buscar declaração
   */
  public async findProfileById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const profile = await Profile.findOne(id);

      if (!profile) {
        res.status(404).json({ message: 'Perfil não encontrada.' });
        return;
      }
      console.log(profile)
      res.status(200).json(profile);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: 'Erro ao buscar declaração, tente novamente' });
    }
  }


  /**
   * @swagger
   * /profile:
   *   post:
   *     summary: Cria uma novo perfil para o usuário autenticado
   *     tags: [Perfis]
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
   *         description: Perfil criado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *       400:
   *         description: Dados inválidos para criação do perfil
   *       401:
   *         description: Usuário não autorizado
   *       500:
   *         description: Erro ao registrar o perfil
   */
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const user = await User.findOne(req.userId);

      if (!user) {
        res.status(401).json({ message: 'Usuário não autorizado.' });
        return;
      }

      const { name, description }: ProfileInterface = req.body;

      if (!name || !description) {
        res
          .status(400)
          .json({ message: 'Dados inválidos para criação do perfil.' });
        return;
      }

      const profile = await Profile.create({
        name,
        description,
      }).save();

      res.status(201).json({ id: profile.id });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: 'Erro ao registrar o perfil, tente novamente.' });
    }
  }

  /**
   * @swagger
   * /profile/{id}:
   *   put:
   *     summary: Atualiza um perfil existente
   *     tags: [Perfis]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID do perfil a ser atualizada
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
   *         description: Perfil atualizada com sucesso
   *       404:
   *         description: Perfil não encontrada
   *       500:
   *         description: Erro ao atualizar o perfil
   */
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, description }: ProfileInterface = req.body;

      const profile = await Profile.findOne(id);

      if (!profile) {
        res.status(404).json({ message: 'Perfil não encontrada.' });
        return;
      }

      const descriptionToUpdate = {
        name: name || profile.name,
        description: description || profile.description,
      };

      await Profile.update(profile.id, { ...descriptionToUpdate });

      res.status(204).json({ message: 'Perfil atualizada com sucesso.' });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: 'Erro ao atualizar o perfil, tente novamente.' });
    }
  }

  /**
   * @swagger
   * /profile/{id}:
   *   delete:
   *     summary: Deleta um perfil existente
   *     tags: [Perfis]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID do perfil a ser deletada
   *         schema:
   *           type: string
   *     responses:
   *       204:
   *         description: Perfil deletada com sucesso
   *       404:
   *         description: Perfil não encontrada
   *       401:
   *         description: Não é possível remover declarações submetidas
   *       500:
   *         description: Erro ao deletar o perfil
   */
  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const profile = await Profile.findOne(id);

      if (!profile) {
        res.status(404).json({ message: 'Perfil não encontrada.' });
        return;
      }

      await Profile.softRemove(profile);

      res.status(204).json({ messsage: 'Perfil deletada com sucesso.' });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: 'Erro ao deletar o perfil, tente novamente.' });
    }
  }
}

export default new ProfileController();
