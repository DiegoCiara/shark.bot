import { simulate } from '@src/services/integrations/novo-saque/simulate';
import OpenAI from 'openai';

export async function functions(
  openai: OpenAI,
  runStatus: any,
  thread_id: string,
  verify: () => void,
  resolve: (value: any) => void,
) {
  const toolCalls =
    runStatus.required_action?.submit_tool_outputs?.tool_calls || [];
  try {
    const toolOutputs = await Promise.all(
      toolCalls.map(async (tool: any) => {





        if (tool.function.name === 'simulate') {
          const args = tool.function?.arguments;
          try {
            const { cpf } = args;

            console.log(tool?.submit_tool_outputs?.tool_calls);

            const simulation = await simulate(cpf);

            return {
              tool_call_id: tool.id,
              output: simulation || 'Ocorreu um erro ao consultar as informações da negociação, tente novamente',
            };
          } catch (error) {
            console.error('errorSS', error);

            return {
              tool_call_id: tool.id,
              output:'Ocorreu um erro ao tentar executar a função, tente novamente',
            };
          }
        }












        
        return null;
      }),
    );
    if (toolOutputs.length > 0) {
      console.log('toolOutputs', toolOutputs);
      const run = await openai.beta.threads.runs.submitToolOutputsAndPoll(
        thread_id,
        runStatus.id,
        {
          tool_outputs: toolOutputs as any[],
        },
      );
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
}
