import { Request, Response } from 'express';
import Sessions from '@entities/Session';

import {
  generateToken,
  getConnectionClient,
  startSession,
} from '@src/services/whatsapp/whatsapp';
import { getAssistant } from '@src/services/openai/functions/assistants/assistant';
import OpenAI from 'openai';

interface SessionInterface {
  id?: string;
  assistant_id: string;
  role: string;
  email: string;
  token: string;
  password: string;
  secret?: string;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});
/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: Operações relativas aos usuários
 */

class SessionController {
  /**
   * @swagger
   * /session/{id}:
   *   get:
   *     summary: Retorna o usuário procurado pelo ID
   *     tags: [Usuários]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID do usuário
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
  public async findSessions(req: Request, res: Response): Promise<void> {
    try {
      const session = await Sessions.find();

      if (!session) {
        res.status(404).json({ message: 'Usuário não encontrado.' });
        return;
      }
      const sessions = await Promise.all(
        session.map(async (s) => {
          const assistant = await getAssistant(openai, s.assistant_id);
          const connection = await getConnectionClient(s.token, s.id);

          return {
            id: s.id,
            name: assistant.name,
            status: connection?.status || 'Disconnected',
            waiting_time: s.waiting_time || 20,
            stop_trigger: s.stop_trigger || '',
          };
        }),
      );

      res.status(200).json(sessions);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: 'Erro interno ao buscar usuário, tente novamente.' });
    }
  }
  /**
   * @swagger
   * /session/{id}:
   *   get:
   *     summary: Retorna o usuário procurado pelo ID
   *     tags: [Usuários]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID do usuário
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
  public async findSessionById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;

      const session = await Sessions.findOne(id);

      if (!session) {
        res.status(404).json({ message: 'Usuário não encontrado.' });
        return;
      }

      res.status(200).json(session);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: 'Erro interno ao buscar usuário, tente novamente.' });
    }
  }

  /**
   * @swagger
   * /session:
   *   post:
   *     summary: Cria um novo usuário
   *     tags: [Usuários]
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
   *         description: Valores inválidos para o novo usuário
   *       409:
   *         description: Usuário já existe
   *       500:
   *         description: Erro interno ao criar o usuário
   */
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const { assistant_id }: SessionInterface = req.body;

      console.log(req.body);

      if (!assistant_id) {
        res
          .status(400)
          .json({ message: 'Valores inválidos para o novo usuário.' });
        return;
      }

      const session = await Sessions.create({
        assistant_id,
      }).save();

      if (!session) {
        res.status(500).json({
          message: 'Erro interno ao criar o usuário, tente novamente.',
        });
        return;
      }

      res.status(201).json({ id: session.id });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: 'Erro interno no registro, tente novamente.' });
    }
  }
  /**
   * @swagger
   * /session:
   *   post:
   *     summary: Cria um novo usuário
   *     tags: [Usuários]
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
   *         description: Valores inválidos para o novo usuário
   *       409:
   *         description: Usuário já existe
   *       500:
   *         description: Erro interno ao criar o usuário
   */
  public async connect(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const session = await Sessions.findOne(id);

      if (!session) {
        res.status(404).json({ message: 'Sessão não encontrado.' });
        return;
      }

      const token = await generateToken(session.id);

      if (!token) {
        res.status(500).json({
          message: 'Erro interno ao criar o usuário, tente novamente.',
        });
        return;
      }

      await Sessions.update(session.id, { token });

      const qr = await startSession(token, session.id);

      res.status(200).json({ id: session.id, qr_code: qr });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: 'Erro interno no registro, tente novamente.' });
    }
  }

  /**
   * @swagger
   * /session/{id}:
   *   put:
   *     summary: Atualiza os dados de um usuário
   *     tags: [Usuários]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID do usuário a ser atualizado
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
   *         description: Erro interno ao atualizar o usuário
   */
  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const session = await Sessions.findOne(id);

      if (!session) {
        res.status(404).json({ message: 'Usuário não encontrado.' });
        return;
      }
      await Sessions.softRemove(session);

      res.status(204).send({ message: 'Usuário atualizado com sucesso' });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Erro interno ao atualizar o usuário, tente novamente.',
      });
    }
  }
}

export default new SessionController();
