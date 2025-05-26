import OpenAI from "openai";


export async function getAssistant(
  openai: OpenAI,
  assistantId: string,
): Promise<any> {
  try {
    const assistant = await openai.beta.assistants.retrieve(assistantId);
    return assistant;
  } catch (error) {
    console.error('Error retrieving assistant:', error);
    throw error;
  }
}