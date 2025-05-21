import { Request, Response } from 'express';
import { sendMessage, typeWppMessage } from '@src/services/whatsapp/whatsapp';
import Session from '@entities/Session';
import { checkContact } from '@src/services/openai/helpers/checkContact';
import { checkThread } from '@src/services/openai/helpers/checkThread';
import Message from '@entities/Message';
import { v4 as uuidv4 } from 'uuid'; // Importa o método para gerar UUID versão 4
import { openAI } from '@src/services/openai/functions/main';
import { audioS3, convertDataImage } from '@utils/aws/s3';
import whisper from '@src/services/openai/functions/whisper';

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

class UserController {
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
        // name,
        type,
        chatId,
        mimeType,
        caption,
        fromMe,
      } = req.body;

      console.log('messageBody', req.body);

      const number = from
      const messageBody = body


      if (fromMe) return;
      let messageReceived = message;
      let mediaUrl: any = '';
      const id = uuidv4();
      const captionMessage = caption ? caption : '';
      const isImage = type === 'image';
      const isAudio = type === 'ptt';
      const usage = 'wpp';
      const typeMessage = await typeWppMessage(req.body);
      const sessionFinded = await Session.findOne(session);

      console.log(chatId);

      if (!sessionFinded) {
        return res.status(200).json('ok');
      }

      const contact = await checkContact(number);

      // console.log(contact)

      if (!contact) {
        return res.status(200).json('ok');
      }

      const thread = await checkThread(contact);

      await Message.create({
        // type: typeMessage,
        // mediaUrl: mediaUrl!,
        thread,
        // content: !isImage ? messageReceived : captionMessage,
        from: 'CONTACT',
      }).save();

      if (!thread) return res.status(200).json('ok');

      //Parte de mídia
      if (isAudio) {
        mediaUrl = await audioS3(messageBody, id, thread);
        messageReceived = await whisper(id);
      } else if (isImage) {
        mediaUrl = await convertDataImage(messageBody, id, thread);
      }

      // (await ioSocket).emit(thread.id, messageCreated);

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
          return [{ type: 'text', text: body }];
        }
      }

      const msg = await openaiMessage();

      const answer = await openAI(
        contact,
        sessionFinded.assistant_id,
        thread.thread_id!,
        msg,
      );

      await sendMessage(
        sessionFinded.id,
        sessionFinded.token,
        chatId,
        answer.text,
      );
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

export default new UserController();
