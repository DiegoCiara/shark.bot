import OpenAI from 'openai';
import { functions } from './functions';

// Função para verificar se existe um run ativo
export async function getActiveRun(openai: OpenAI, threadId: string) {
  try {
    const runs = await openai.beta.threads.runs.list(threadId);
    return runs.data.find((run: any) => run.status === 'active');
  } catch (error) {
    console.error(error);
  }
}

export async function checkRun(openai: OpenAI, thread_id: string, runId: string): Promise<any> {
  return await new Promise((resolve, reject) => {
    let timeoutId: NodeJS.Timeout | null = null;

    const verify = async (): Promise<void> => {
      const runStatus = await openai.beta.threads.runs.retrieve(thread_id, runId);
      console.log('---------------------------------------------------------------------')
      if (runStatus.status === 'completed') {
        if (timeoutId) clearTimeout(timeoutId); // Limpa o timeout se o status for 'completed'
        const messages = await openai.beta.threads.messages.list(thread_id);
        resolve(messages);
      } else if (runStatus.status === 'failed') {
        console.log('Erro ao executar a função, (FAILED)', runStatus);
        resolve(null);
      } else if (runStatus.status === 'requires_action') {
        await functions(openai, runStatus, thread_id, verify, resolve);
      } else {
        console.log('Aguardando resposta da OpenAI... Status ==>', runStatus?.status);
        setTimeout(verify, 3000);
      }
    };

    // Define um temporizador de 10 segundos para rejeitar a promessa
    // timeoutId = setTimeout(() => {
    //   resolve(null);
    // }, 15000);

    verify();
  });
}

export async function checkRunStatus({ openai, threadId, runId }: { openai: OpenAI; threadId: string; runId: string }): Promise<any> {
  return await new Promise((resolve, reject) => {
    let timeoutId: NodeJS.Timeout;

    const verify = async (): Promise<void> => {
      const runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);
      console.log(runStatus.required_action);
      if (runStatus.status === 'completed') {
        clearTimeout(timeoutId); // Limpa o timeout se o status for 'completed'
        const messages = await openai.beta.threads.messages.list(threadId);
        resolve(messages);
      } else if (runStatus.status === 'failed') {
        resolve(null);
      } else {
        console.log('Aguardando resposta da OpenAI... Status ==>', runStatus?.status);
        setTimeout(verify, 3000);
      }
    };

    timeoutId = setTimeout(() => {
      resolve(null);
    }, 15000);

    verify();
  });
}
