import Contact from '@entities/Contact';
import axios from 'axios';

import dotenv from 'dotenv';
import { simulate } from './simulate';
import { formatPhone } from '@utils/formats';
import { formalization } from './formalization';
dotenv.config();

const novoSaqueUrl = process.env.NOVOSAQUE_API_URL;

export async function contract(
  customer_id: number,
  service_id: string,
  installments: string,
  released_amount: string,
  card_limit: string,
  token?: string,
): Promise<string> {
  try {
    console.log(token);

    const body = {
      contract: {
        contract_value: released_amount, // released_amount do atendimento
        amount_charged: card_limit, // campo card_limit do atendimento
        kind_integrator: 0, //valor fixo
        installments: installments, //mesmo valor informado na simulacao
        customer_id: customer_id, // id do cliente criado
      },
      simulation_id: service_id, //id do atendimento registrado - passo 4
    };

    console.log('Request body for CONTRACT Novo Saque:', body);
    const response = await axios.post(
      `${novoSaqueUrl}/contracts/create_proposal`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
      },
    );

    console.log('Response from Novo Saque:', response);

    const { data } = response;

    const contract_id = data.id;

    let link = '';
    setTimeout(async () => {
       link = await formalization(contract_id)
    }, 10000);


    return  contract_id ? `Proposta cadastrada com sucesso, contrato: ${contract_id}, valor liberado: ${released_amount}, link para formalização: ${link}` : 'Ocorreu um erro ao fazer a consulta, tente novamente';

  } catch (error: any) {
    if(error.response?.data?.error){
      return error.response.data.error || 'Ocorreu um erro ao fazer a consulta, tente novamente';
    }

    console.error(`Error service:`, error.response?.data || error);
    throw new Error('Ocorreu um erro ao fazer a consulta, tente novamente');
  }
}
