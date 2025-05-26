import Thread from '@entities/Thread';
import fs from 'fs';
import AWS from 'aws-sdk';
import axios from 'axios';

const bucketName = process.env.AWS_BUCKET_NAME;

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-2',
});

const s3 = new AWS.S3();

export async function audioS3(data: any, id: string, thread: Thread) {
  try {
    const fileData = await Buffer.from(data, 'base64');

    await fs.promises.writeFile(`src/temp/messages/${id}.m4a`, fileData);

    // await fs.writeFile(`src/temp/messages/${id}.m4a`, fileData, (err) => {
    //   if (err) {
    //     console.error('Erro ao salvar o arquivo:', err);
    //   } else {
    //     console.log('Arquivo salvo com sucesso!');
    //   }
    // });
    
    const params = {
      Bucket: bucketName!,
      Key: `threads/thread:${thread.id}/${id}`, // Nome do arquivo no bucket
      Body: fileData,
      ContentType: 'audio/mpeg',
    };
    const s3Response = await s3.upload(params).promise();

    return s3Response.Location;
  } catch (error) {
    console.error(error);
  }
}

export async function getAudioBase64s3(id: string, thread: Thread) {
  const url = await s3.getSignedUrl('getObject', {
    Bucket: bucketName,
    Key: `threads/thread:${thread.id}/${id}`,
    Expires: 60 * 5, // URL expira em 5 minutos
  });

  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'arraybuffer', // Importante para lidar com dados binários
    });

    let base64 = Buffer.from(response.data, 'binary').toString('base64');

    const filePath = `src/audios/${id}.mp3`;

    return {
      base64: base64,
      filePath: filePath,
    };
  } catch (error) {
    console.error('Erro ao baixar ou converter o arquivo:', error);
  }
}


export async function convertDataImage(data: string, id: string, thread: Thread) {
  try {
    // Converte a string base64 para um buffer
    const imageData = Buffer.from(data, 'base64');

    // Salva o arquivo de imagem localmente

    // Configurar parâmetros para o upload do S3
    const params = {
      Bucket: bucketName!,
      Key: `threads/thread:${thread.id}/${id}.jpg`, // Nome do arquivo no bucket
      Body: imageData,
      ContentType: 'image/jpeg', // Tipo de conteúdo para a imagem
    };

    // Fazer o upload do arquivo para o bucket S3
    const s3Response = await s3.upload(params).promise();

    return s3Response.Location;
  } catch (error) {
    console.error('Erro ao processar a imagem:', error);
    throw error;
  }
}

export async function saveDataImage(base64: string, id: string, thread: Thread) {
  try {
    // Verificar o tipo de imagem a partir do prefixo base64
    let extension = '';
    let contentType = '';

    if (base64.startsWith('data:image/png')) {
      extension = 'png';
      contentType = 'image/png';
    } else if (base64.startsWith('data:image/jpeg') || base64.startsWith('data:image/jpg')) {
      extension = 'jpg';
      contentType = 'image/jpeg';
    } else if (base64.startsWith('data:image/svg+xml')) {
      extension = 'svg';
      contentType = 'image/svg+xml';
    } else if (base64.startsWith('data:audio/ogg; codecs=opus')) {
      extension = 'ogg';
      contentType = 'audio/ogg; codecs=opus';
    } else {
      throw new Error('Formato de imagem não suportado.');
    }

    // Remover o prefixo base64
    const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');

    // Converter a string base64 para um buffer
    const buffer = Buffer.from(base64Data, 'base64');

    // Definir o caminho do arquivo com a extensão correta

    // Configurar parâmetros para o upload do S3
    const params = {
      Bucket: bucketName!,
      Key: `threads/thread:${thread.id}/${id}.${extension}`, // Nome do arquivo no bucket
      Body: buffer,
      ContentType: contentType, // Tipo de conteúdo dinâmico
    };

    // Fazer o upload do arquivo para o bucket S3
    const s3Response = await s3.upload(params).promise();

    return s3Response.Location;
  } catch (error) {
    console.error('Erro ao processar a imagem:', error);
    throw error;
  }
}

