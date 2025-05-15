import fs from 'fs';
import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid'; // Importa o método para gerar UUID versão 4
import dotenv from 'dotenv';
dotenv.config();


const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});


export default async function whisper(id: string) {
  try {

    const filePath = `src/temp/messages/${id}.m4a`;

    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: 'whisper-1',
    });

    console.log(transcription.text);

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Erro ao apagar o arquivo local:', err);
      } else {
        console.log('Arquivo local apagado com sucesso!');
      }
    });
    return transcription.text;
  } catch (error) {
    console.log(error);
  }
}

