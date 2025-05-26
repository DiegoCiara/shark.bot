import { Server } from 'socket.io';
import { io } from 'socket.io-client';
import dotenv from 'dotenv';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import Session from '@entities/Session';
import { generateToken, startSession } from '@src/services/whatsapp/whatsapp';

dotenv.config();

const WPP_CONNECT_URL = process.env.WPP_CONNECT_URL as string;

interface MessageInterface {
  viewed: boolean;
}

export async function SocketEmitController(socketPlatform: Server) {
  const wppconnect = io(WPP_CONNECT_URL);
  // await startPeriodicProcessing();
  wppconnect.on('connect', () => {
    console.log('Socket WPP Conectado');
  });

  socketPlatform.on('connect', async (socket) => {
    console.log('Usuário conectado');

    const connectWhatsAppSocket = async (session_id: string) => {

      if (!session_id || !uuidValidate(session_id)) return;
      try {

        if (!session_id) {
          const session = await Session.create().save();

          const token = await generateToken(session.id);

          // await getConnectionClient(session, assistantId);
          await Session.update(session.id, { token });

          await startSession(token, session.id);
        }
      } catch (error) {
        console.error('Erro ao buscar detalhes do assistente:', error);

        socket.emit('error', 'Erro ao buscar detalhes do assistente');
      }
    }
    socket.off('connect-wpp', connectWhatsAppSocket);
    socket.on('connect-wpp', connectWhatsAppSocket);


    const qrCode = async (data: any) => {
      // console.log('WPP_SOCKET: qrCode', data);

      if(!data.session || !uuidValidate(data.session)) return;
      if (!data.qrCode) return;


      const session = await Session.findOne(data.session);
      if (!session) return;
      socket.emit(`qrCode:${session.id}`, data);
    }
    wppconnect.off('qrCode',qrCode);
    wppconnect.on('qrCode',qrCode);


    const sessionLogged = async (data: any) => {
      console.log('WPP_SOCKET: whatsapp-status', data);
      // const { session } = data
      // const session = await Session.findOne(data.session, { relations: ['assistant'] });

      // if (!session) return;
      // const dataEmit = { session: session, status: data.status ? 'Connected' : 'Disconnected'}
      // socket.emit(`whatsapp-status:${session.id}`, dataEmit);
    }
    wppconnect.off('whatsapp-status', sessionLogged);
    wppconnect.on('whatsapp-status', sessionLogged);




    const disconnect = () => {
      console.log('Usuário desconectado');
      socket.removeAllListeners('connectWhatsApp');
      wppconnect.removeAllListeners('qrCode');
      wppconnect.removeAllListeners('whatsapp-status');
    }
    socket.off('disconnect', disconnect);
    socket.on('disconnect', disconnect);
  });

  return socketPlatform;
}
