import OpenAI from 'openai';

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
      console.log(runStatus.required_action);
      console.log(runStatus.required_action?.submit_tool_outputs)
      console.log(runStatus.required_action?.submit_tool_outputs.tool_calls)
      console.log('---------------------------------------------------------------------')
      if (runStatus.status === 'completed') {
        if (timeoutId) clearTimeout(timeoutId); // Limpa o timeout se o status for 'completed'
        const messages = await openai.beta.threads.messages.list(thread_id);
        resolve(messages);
      } else if (runStatus.status === 'failed') {
          console.log('Erro ao executar a função, (FAILED)', runStatus);
        resolve(null);
      } else if (runStatus.status === 'requires_action') {
        const toolCalls = runStatus.required_action?.submit_tool_outputs?.tool_calls || [];
        try {
          const toolOutputs = await Promise.all(
            toolCalls.map(async (tool: any) => {

              if (tool.function.name === 'getDeal') {
                const args = tool.function?.arguments;
                try {
                  // const action = await getDeal(thread.contact, workspace, args);
                  console.log(tool?.submit_tool_outputs?.tool_calls);
                  let message = '';

                  return {
                    tool_call_id: tool.id,
                    output: message || 'Ocorreu um erro ao consultar as informações da negociação, tente novamente',
                  };
                } catch (error) {
                  console.error('errorSS', error);

                  return {
                    tool_call_id: tool.id,
                    output: 'Ocorreu um erro ao tentar executar a função, tente novamente',
                  };
                }
              }
              return null;
            })
          );

          if (toolOutputs.length > 0) {
            console.log('toolOutputs', toolOutputs);
            const run = await openai.beta.threads.runs.submitToolOutputsAndPoll(thread_id, runStatus.id, {
              tool_outputs: toolOutputs as any[],
            });
            console.log('Tool outputs submitted successfully.');
            verify();
          } else {
            console.log('No tool outputs to submit.');
          }
        } catch (error) {
          console.error(error);

          console.log('Erro ao executar a função, (CATCH)', error);
          resolve(null);
        }
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
