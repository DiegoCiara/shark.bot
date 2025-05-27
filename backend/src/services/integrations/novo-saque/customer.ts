import Contact from '@entities/Contact';
import axios from 'axios';

import dotenv from 'dotenv';
import { simulate } from './simulate';
import { formatPhone } from '@utils/formats';
dotenv.config();

const novoSaqueUrl = process.env.NOVOSAQUE_API_URL;

export async function customer(
  args: any,
  contact: Contact,
  service_id: string,
  token?: string,
): Promise<number> {
  const { cpf, name, birth_date, gender_customer, bank_account } = args;

  const { number_bank, name_bank, agency, agency_digit, number_account } =
    bank_account;

  try {
    console.log(token);

    const mobile = formatPhone(contact.phone);

    const body = {
      customer: {
        birth_date: birth_date, // fixo
        email: 'email_do_cliente@gmail.com',
        mobile: mobile,
        gender_customer: gender_customer, //valor fixo
        rg: '123456789',
        marital_status: 'married', // valro fixo
        mother_name: 'Maria da Silva', // nome da mae
        father_name: 'João da Silva',
        entity_attributes: {
          name: name,
          cpf_cnpj: cpf,
          address_attributes: {
            zip_code: '64000-150',
            street: 'Rua do endereço',
            number: '0001',
            district: 'Bairro',
            city: 'Cidade',
            state: 'UF',
            complement: '',
          },
          bank_account_attributes: {
            number_bank: number_bank,
            name_bank: name_bank,
            agency_account: agency,
            agency_digit: agency_digit,
            number_account: number_account,
            account_digit: 0,
            kind: 0,
            kind_account: 'ted',
          },
        },
      },
      customer_service_id: service_id, // numero do atendimento
    };

    console.log('Body Customer:', JSON.stringify(body));
    const response = await axios.post(
      `${novoSaqueUrl}/simulations/create_proposal_fgts`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const { data } = response;

    const customer_service_id = data.customer.id;

    return customer_service_id;
  } catch (error: any) {
    console.error(`Error service Customer:`, error?.response);
    throw new Error('Ocorreu um erro ao fazer a consulta, tente novamente');
  }
}
