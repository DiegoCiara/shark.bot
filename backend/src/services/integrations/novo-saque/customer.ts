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
        birth_date, // fixo
        mobile, // telefone fixo
        gender_customer, //valor fixo


        rg: 123456789,
        marital_status: 'married', // valro fixo
        mother_name: 'Maria da Silva', // nome da mae
        father_name: 'João da Silva',
        entity_attributes: {
          name,
          cpf_cnpj: cpf,
          address_attributes: {
            zip_code: '00000000', //cep
            street: 'Rua do endereço',
            number: '0001',
            district: 'Bairro',
            city: 'Cidade',
            state: 'UF',
            complement: 'complemento',
          },
          bank_account_attributes: {
            number_bank,
            name_bank,
            agency,
            agency_digit,
            number_account,
            account_digit: 0, //digito conta
            kind: 0, // 0 para ted
            kind_account: 'ted', // ted sempre
          },
        },
      },
      customer_service_id: service_id,
    };

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
  } catch (error) {
    console.error(`Error service:`, error);
    throw new Error('Ocorreu um erro ao fazer a consulta, tente novamente');
  }
}
