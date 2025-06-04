import Contact from '@entities/Contact';
import { simulate } from './simulate';
import { authenticateNovoSaque } from './auth';
import { customer } from './customer';
import { service } from './service';
import { contract } from './contract';
import Session from '@entities/Session';
import { checkContact } from '@src/services/openai/helpers/checkContact';
import { sendMessage } from '@src/services/whatsapp/whatsapp';
import Thread from '@entities/Thread';
import { checkThread } from '@src/services/openai/helpers/checkThread';
import { notificationHuman } from './notification-human';

export async function requiresMessage(
  type: string,
  contact: Contact,
  session: Session,
  args: any,
): Promise<string> {

  try {
    const token = await authenticateNovoSaque();

    if (type === 'simulation') {

      const { message } = await simulate(args, token);

      return message;

    } else if (type === 'contract') {

      const { service_id, installments, released_amount, card_limit } = await service(args, token);

      const customer_id = await customer(args, contact, service_id, token);

      const contact_created = await contract(customer_id, service_id, installments, released_amount, card_limit, token);

      return contact_created;
    } else if (type === 'redirect_to_human_support'){
      return await notificationHuman(contact, session, args)
    }

    return 'Tipo de requisição inválido.';
  } catch (error) {
    console.error(`Error requiresMessage ${type}:`, error);
    return 'Ocorreu um erro ao processar sua solicitação, tente novamente mais tarde.';
  }
}
