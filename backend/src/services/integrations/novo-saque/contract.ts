import Contact from '@entities/Contact';
import axios from 'axios';

import dotenv from 'dotenv';
import { simulate } from './simulate';
import { formatPhone } from '@utils/formats';
dotenv.config();

const novoSaqueUrl = process.env.NOVOSAQUE_API_URL;

export async function contract(
  args: any,
  customer_id: number,
  service_id: string,
  liquid_value: number,
  token?: string,
): Promise<string> {
  const { cpf, name, birth_date, gender_customer, bank_account } = args;

  try {
    console.log(token);

    const body = {
      contract: {
        contract_value: liquid_value, // released_amount do atendimento
        amount_charged: liquid_value, // campo card_limit do atendimento
        kind_integrator: 0, //valor fixo
        installments: 9, //mesmo valor informado na simulacao
        customer_id: customer_id, // id do cliente criado
      },
      simulation_id: service_id, //id do atendimento registrado - passo 4
    };
    const response = await axios.post(
      `${novoSaqueUrl}/contracts/create_proposal`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const { data } = response;

    const customer_service_id = data.id;

    return customer_service_id;
  } catch (error) {
    console.error(`Error service:`, error);
    throw new Error('Ocorreu um erro ao fazer a consulta, tente novamente');
  }
}
