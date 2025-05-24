import Contact from '@entities/Contact';
import { simulate } from './simulate';
import { authenticateNovoSaque } from './auth';
import { customer } from './customer';
import { service } from './service';
import { contract } from './contract';

export async function requiresMessage(
  type: string,
  contact: Contact,
  args: any,
): Promise<string> {
  let message = 'Ocorreu um erro ao fazer a consulta, tente novamente';
  try {
    const token = await authenticateNovoSaque();

    if (type === 'simulation') {
      const { product } = await simulate(args, token);

      message = `Simulação realizada com sucesso para o CPF ${args?.cpf}. O valor liberado é de ${product.valorLiberado} e as parcelas são: ${product.parcelas.map((item: any) => `R$ ${item.valor} descontado em ${item.dataDaParcela}`).join(', ')}`;

      return message;
    } else if (type === 'contract') {
      // cpf, name, birth_date, gender_customer , bank_account

      // {number_bank , name_bank, agency, agency_digit, number_account } = bank_account

      const { service_id, liquid_value } = await service(type, args);


      const customer_id = await customer(args, contact, service_id, token);

      const contact_created = await contract(args, customer_id, service_id, liquid_value, token);

      if (contact_created) {
        message = `Cadastro realizado com sucesso para o CPF ${args.cpf}`;
      } else {
        message = 'Ocorreu um erro ao fazer o cadastro, tente novamente';
      }
    }

    return message;
  } catch (error) {
    console.error(`Error requiresMessage ${type}:`, error);
    return message;
  }
}
