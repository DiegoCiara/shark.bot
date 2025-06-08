import { Request, Response } from 'express';
import Thread from '@entities/Thread';
import { getAssistant } from '@src/services/openai/functions/assistants/assistant';
import OpenAI from 'openai';

import { v4 } from 'uuid';
import Message from '@entities/Message';
import User from '@entities/User';

interface ThreadInterface {
  id?: string;
  assistant_id: string;
  role: string;
  email: string;
  token: string;
  password: string;
  secret?: string;
  waiting_time: number;
  human_support_phone: string;
  stop_trigger: string;
  close_trigger: string;
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

class ThreadController {
  /**
   * @swagger
   * /thread/{id}:
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
  public async findThreads(req: Request, res: Response): Promise<void> {
    try {
      const threads = await Thread.find({ relations: ['contact']});

      if (!threads) {
        res.status(404).json({ message: 'Ocorreu um erro, tente novamente.' });
        return;
      }

      res.status(200).json(threads);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: 'Erro interno ao buscar usuário, tente novamente.' });
    }
  }
  /**
   * @swagger
   * /thread/{id}:
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
  public async findThreadById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;

      const thread = await Thread.findOne(id, { relations: ['contact']});

      if (!thread) {
        res.status(404).json({ message: 'Usuário não encontrado.' });
        return;
      }

      const messages = await Message.find({
        where: { thread },
        order: { created_at: 'ASC' },
      });

      res.status(200).json({ thread, messages });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: 'Erro interno ao buscar usuário, tente novamente.' });
    }
  }  /**
   * @swagger
   * /thread/{id}:
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
  public async assumeThread(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;

      const thread = await Thread.findOne(id, { relations: ['contact']});

      if (!thread) {
        res.status(404).json({ message: 'Usuário não encontrado.' });
        return;
      }

      const user = await User.findOne(req.userId);

      if (!user) {
        res.status(404).json({ message: 'Usuário não encontrado.' });
        return;
      }


       await Thread.update(thread.id, {
        user,
        responsible: 'USER'
      });

      res.status(200).json({ message: 'Conversa assumida com sucesso!' });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: 'Erro interno ao buscar usuário, tente novamente.' });
    }
  }
}

export default new ThreadController();
