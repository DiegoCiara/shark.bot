import { Request, Response } from 'express';
import { sendMessage, typeWppMessage } from '@src/services/whatsapp/whatsapp';
import Session from '@entities/Session';
import { checkContact } from '@src/services/openai/helpers/checkContact';
import { checkThread } from '@src/services/openai/helpers/checkThread';
import Message from '@entities/Message';
import { v4 as uuidv4 } from 'uuid'; // Importa o método para gerar UUID versão 4
import { openAI } from '@src/services/openai/functions/main';
import { audioS3, convertDataImage } from '@src/services/aws/s3';
import whisper from '@src/services/openai/functions/whisper';
import Thread from '@entities/Thread';
import { authenticateNovoSaque } from '@src/services/integrations/novo-saque/auth';
import OpenAI from 'openai';
import { ioSocket } from '@src/socket';

interface UserInterface {
  id?: string;
  name: string;
  role: string;
  email: string;
  token: string;
  password: string;
  secret?: string;
}

/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: Operações relativas aos usuários
 */

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

class ThreadController {
  /**
   * @swagger
   * /user:
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

  public async runThread(req: Request, res: Response): Promise<any> {
    try {
      const {
        body,
        message,
        session,
        from,
        to,
        // name,
        type,
        chatId,
        mimeType,
        caption,
        fromMe,
      } = req.body;

      console.log('messageBody', req.body);

      const number = from;
      const messageBody = body;

      let messageReceived = messageBody;
      let mediaUrl: any = '';
      const id = uuidv4();
      const captionMessage = caption ? caption : '';
      const isImage = type === 'image';
      const isAudio = type === 'ptt';
      const isText = type === 'chat';
      // const usage = 'wpp';
      // const typeMessage = await typeWppMessage(req.body);
      const sessionFinded = await Session.findOne({ where: { session_id: session }});

      if (!isImage && !isAudio && !isText) {
        res.status(200).json('ok');
        return;
      }

      if (!sessionFinded) {
        res.status(200).json('ok');
        return;
      }

      if (fromMe && messageBody === sessionFinded.stop_trigger) {
        console.log('ping');

        const contactChecked = await checkContact(to);

        // console.log(contact)

        if (!contactChecked) {
          res.status(200).json('ok');
          return;
        }

        const threadChecked = await checkThread(contactChecked, session);

        await Thread.update(threadChecked!.id, {
          responsible: 'USER',
        });

        // const token = await authenticateNovoSaque()

        await sendMessage(
          sessionFinded.session_id,
          sessionFinded.token,
          chatId,
          'Seu atendimento foi transferido para um atendente humano, por favor, aguarde alguns instantes.',
        );
        res.status(200).json('Atendimento transferido com sucesso');
        return;
      } else if (fromMe && messageBody === sessionFinded.close_trigger) {
        const contactChecked = await checkContact(to);

        // console.log(contact)

        if (!contactChecked) {
          res.status(200).json('ok');
          return;
        }

        const threadChecked = await checkThread(contactChecked, session);

        if (!contactChecked) {
          res.status(200).json('ok');
          return;
        }

        await Thread.update(threadChecked!.id, {
          responsible: 'USER',
          status: 'CLOSED',
        });

        // const token = await authenticateNovoSaque()

        await sendMessage(
          sessionFinded.session_id,
          sessionFinded.token,
          chatId,
          'Seu atendimento foi encerrado, muito obrigado.',
        );
        res.status(200).json('Atendimento transferido com sucesso');
        return;
      } else if (fromMe) return;

      const contact = await checkContact(number);

      // console.log(contact)

      if (!contact) {
        res.status(200).json('ok');
        return;
      }

      const thread = await checkThread(contact, session);

      if (!thread) return res.status(200).json('ok');

      // Começa o processamento da mensagem com todos os dados necessários

      //Parte de mídia
      if (isAudio) {
        mediaUrl = await audioS3(messageBody, id, thread);
        messageReceived = await whisper(openai, id);
      } else if (isImage) {
        mediaUrl = await convertDataImage(messageBody, id, thread);
      }

      const message_received = await Message.create({
        type: type,
        media: mediaUrl!,
        thread,
        content: !isImage ? isAudio ? '' : messageReceived : captionMessage,
        from: 'CONTACT',
      }).save();

      (await ioSocket).emit(`${thread.id}`, message_received);

      (await ioSocket).emit(`threads`, thread);

      if (
        thread &&
        (thread.status === 'CLOSE' || thread!.responsible === 'USER')
      ) {
        console.log(
          'Este chat está inativo ou não está atribuído à assistente',
          thread.id,
        );
        // eventEmitter.emit(`threads`, workspace);
        // eventEmitter.emit(`newMessage`, thread, messageCreated);
        res.status(200).json('ok');
        return;
      }

      function openaiMessage() {
        if (isImage) {
          return caption
            ? [
                { type: 'text', text: captionMessage },
                { type: 'image_url', image_url: { url: mediaUrl } },
              ]
            : [{ type: 'image_url', image_url: { url: mediaUrl } }];
        } else {
          return [{ type: 'text', text: messageReceived }];
        }
      }

      const msg = await openaiMessage();

      const answer = await openAI(
        openai,
        sessionFinded,
        contact,
        sessionFinded.assistant_id,
        thread.thread_id!,
        msg,
      );

      await sendMessage(
        sessionFinded.session_id,
        sessionFinded.token,
        chatId,
        answer.text,
      );

      await Message.create({
        type: 'chat-reply',
        // mediaUrl: mediaUrl!,
        thread,
        content: answer.text,
        from: 'ASSISTANT',
      }).save();
      // Adaptar para novos canais de comunicações

      // if (threadFinded && thread) {
      //   await Thread.update(threadFinded!.id, { name: `${new Date()}` });
      // }

      // eventEmitter.emit(`threads`, workspace);
      // eventEmitter.emit(`newMessage`, thread, answer.text);
      // eventEmitter.emit(`thread`, thread, workspace);

      // Validações para os dados da assinatura
      //
      res.status(200).json('ok');
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Error processing message' });
    }
  }
}

export default new ThreadController();
