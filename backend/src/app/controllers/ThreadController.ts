import { Request, Response } from 'express';
import Thread from '@entities/Thread';
import { getAssistant } from '@src/services/openai/functions/assistants/assistant';
import OpenAI from 'openai';

import { v4 } from 'uuid';
import Message from '@entities/Message';
import User from '@entities/User';
import { formatToWhatsAppNumber } from '@utils/formats';
import { sendMessage } from '@src/services/whatsapp/whatsapp';
import { ioSocket } from '@src/socket';
import { getRepository } from 'typeorm';

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
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const threadRepo = getRepository(Thread);
      const messageRepo = getRepository(Message);

      const threadsQuery = threadRepo
        .createQueryBuilder('thread')
        .leftJoinAndSelect('thread.contact', 'contact')
        .orderBy('thread.updated_at', 'DESC')
        .skip(skip)
        .take(limit);

      const threads = await threadsQuery.getMany();

      const threadsWithMessages = await Promise.all(
        threads.map(async (thread) => {
          const lastMessage = await messageRepo
            .createQueryBuilder('message')
            .where('message.thread = :threadId', { thread: thread.id })
            .orderBy('message.created_at', 'DESC')
            .limit(1)
            .getOne();

          return {
            ...thread,
            lastMessage: lastMessage?.content || null,
            lastMessageRead: lastMessage?.viewed || false,
          };
        }),
      );

      const total = await threadRepo.count();

      res.status(200).json({
        threads: threadsWithMessages,
        total,
        page,
        limit,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro interno ao buscar threads.' });
    }
  } /**
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

      const thread = await Thread.findOne(id, { relations: ['contact'] });

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
  public async assumeThread(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;

      const thread = await Thread.findOne(id, { relations: ['contact'] });

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
        responsible: 'USER',
      });

      res.status(200).json({ message: 'Conversa assumida com sucesso!' });
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
  public async send(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;

      const { content } = req.body;

      const thread = await Thread.findOne(id, {
        relations: ['contact', 'session'],
      });

      if (!thread) {
        res.status(404).json({ message: 'Usuário não encontrado.' });
        return;
      }

      const user = await User.findOne(req.userId);

      if (!user) {
        res.status(404).json({ message: 'Usuário não encontrado.' });
        return;
      }

      await sendMessage(
        thread.session.session_id,
        thread.session.token,
        `55${formatToWhatsAppNumber(thread.contact.phone)}`,
        content,
      );

      const message_send = await Message.create({
        type: 'chat-reply',
        // mediaUrl: mediaUrl!,
        thread,
        user,
        content: content,
        from: 'USER',
      }).save();

      (await ioSocket).emit(`${thread.id}`, message_send);

      (await ioSocket).emit(`threads`, thread);

      res.status(200).json({ message: message_send.id });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: 'Erro interno ao buscar usuário, tente novamente.' });
    }
  } /**
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
  public async close(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;

      const { content } = req.body;

      const thread = await Thread.findOne(id, {
        relations: ['contact', 'session'],
      });

      if (!thread) {
        res.status(404).json({ message: 'Usuário não encontrado.' });
        return;
      }

      await Thread.update(thread.id, {
        status: 'CLOSED',
      });

      res.status(200).json({ message: 'Atendimento encerrado com sucesso!' });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: 'Erro interno ao buscar usuário, tente novamente.' });
    }
  }
}

export default new ThreadController();
