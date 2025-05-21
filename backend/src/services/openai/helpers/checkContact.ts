import Contact from '@entities/Contact';
import { formatPhone } from '@utils/formats';

export async function checkContact(phone: any): Promise<any> {
  try {
    // Quando o usuário vim pelo WhatsApp, vamos procura-lo pelo número de telefone;
    const contact = await Contact.findOne({
      where: { phone: formatPhone(phone) },
    });
    if (!contact) {
      const contactCreated = await Contact.create({
        phone: formatPhone(phone),
      }).save();
      return contactCreated;
    } else {
      return contact;
    }
  } catch (error) {
    console.error(error);
  }
}
