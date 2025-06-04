import Contact from '@entities/Contact';
import Session from '@entities/Session';
import Thread from '@entities/Thread';
import { checkContact } from '@src/services/openai/helpers/checkContact';
import { checkThread } from '@src/services/openai/helpers/checkThread';
import { sendMessage } from '@src/services/whatsapp/whatsapp';

const numberHuman = '5581997052688';

export async function notificationHuman(contact: Contact, session: Session, args: any): Promise<string> {

  const { message } = args;

  try {
    const contactChecked = await checkContact(contact.phone);

    if (!contactChecked) {
      return 'Ocorreu um erro ao verificar o contato, tente novamente.';
    }

    const threadChecked = await checkThread(contactChecked);

    await Thread.update(threadChecked!.id, {
      responsible: 'USER',
    });

    await sendMessage(
      session.id,
      session.token,
      numberHuman,
      `${message}\n\nLink para o chat com o cliente:\nhttps://wa.me/55${contact.phone}`,
    );

    return 'Atendimento transferido com sucesso';
  } catch (error) {
    return `Ocorreu um erro ao transferir para o atenidmento humano, favor falar com o atendimento humano em ${numberHuman} ou pelo link https://wa.me/${numberHuman}`;
  }
}
