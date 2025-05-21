import OpenAI from 'openai';
import dotenv from 'dotenv';

import Contact from '@entities/Contact';
import { checkRun, getActiveRun } from '../helpers/checkRun';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

// Buffer para armazenar mensagens por chatId, agora capaz de armazenar objetos de mensagem
const messageBuffer: { [chatId: string]: { messages: any; timeout: NodeJS.Timeout | any } } = {};

export async function openAI(
  contact: Contact,
  assistant_id: string,
  thread_id: string,
  message: any,
  // side: any
): Promise<any> {
  try {
    console.log('Thread Retornada', thread_id);

    if (!thread_id) return;

    const openAIAssistant = await openai.beta.assistants.retrieve(assistant_id!);


    let activeRun = await getActiveRun(openai, thread_id);

    if (activeRun) {
      const messages = await checkRun(openai, thread_id, activeRun.id);
      return {
        thread_id: thread_id,
        text: messages.data[0].content[0].text.value.replace(/【\d+:\d+†[^\]]+】/g, ''),
      };
    }

    if (!messageBuffer[thread_id]) {
      messageBuffer[thread_id] = { messages: [], timeout: null };
    }

    if (Array.isArray(message)) {
      message.forEach((msg) => {
        messageBuffer[thread_id].messages.push(msg);
      });
    } else {
      messageBuffer[thread_id].messages.push(message);
    }

    if (messageBuffer[thread_id].timeout) {
      clearTimeout(messageBuffer[thread_id].timeout);
    }

    const timeToRespnose = 20 * 1000; // 20 segundos
    return new Promise((resolve, reject) => {
      messageBuffer[thread_id].timeout = setTimeout(async () => {
        try {
          // Combina as mensagens em um único array
          const combinedMessages = messageBuffer[thread_id].messages;

          messageBuffer[thread_id] = { messages: [], timeout: null };

          console.log('combinedMessages', combinedMessages);
          // Envia as mensagens para o OpenAI

          await openai.beta.threads.messages.create(thread_id, {
            role: 'user',
            content: combinedMessages,
          });
          const run = await openai.beta.threads.runs.create(thread_id, {
            assistant_id: openAIAssistant.id,
            // instructions: instruction,
          });

          const messages = await checkRun(openai, thread_id, run.id);

          console.log('messages', messages);
          // const messages = await checkRun(openai, thread, run.id, workspace, assistant);
          if (!messages) {
            resolve({
              thread_id: thread_id,
              text: 'Tive um problema em processar sua mensagem, poderia tentar novamente mais tarde?',
            });
            return;
          }

          // const runStatus = await openai.beta.threads.runs.retrieve(thread_id, run.id);

          const message = messages.data[0].content[0].text.value.replace(/【\d+:\d+†[^\]]+】/g, '');

          console.log('message assistant =====>', message);

          // const response = await Message.create({
          //   workspace: workspace,
          //   assistant,
          //   thread: thread,
          //   contact: contact,
          //   type: 'text',
          //   content: workspaceMessage,
          //   viewed: true,
          //   from: 'ASSISTANT',
          // }).save();


          console.log('Aguardando mais mensagens...');
          resolve({
            text: message,
          });

        } catch (error) {
          reject(error);
        }
        console.log('Enviando mensagens...');
      }, timeToRespnose);
    });
  } catch (error) {
    console.error('Error processing user message:', error);
  }
}
