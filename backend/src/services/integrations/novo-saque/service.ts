import Contact from '@entities/Contact';
import axios from 'axios';

import dotenv from 'dotenv';
import { simulate } from './simulate';
dotenv.config();

const novoSaqueUrl = process.env.NOVOSAQUE_API_URL;

export async function service(args: any, token?: string): Promise<any> {
  const { cpf, name, birth_date } = args;

  try {
    const { target, products } = await simulate(args, token);

    console.log(token);

    const liquid_value = target.response.liquidValue;

    const body = {
      simulation: {
        name: name,
        interest_rate: '1.79',
        email: 'naotem@gmail.com',
        cpf_cnpj: cpf,
        phone: 'phone',
        phone_store: 'phone',
        phone_seler: 'phone',
        simulation_fgts: products,
        simularion_json: target,
        has_secure: false,
        liquid_value: liquid_value,
        released_amount: liquid_value, // response -> LiquidValue
        value_client: liquid_value, // response -> LiquidValue
        value_establishment: liquid_value, // response -> LiquidValue

        value_installment: 0, // primeiro item paymentScheduleItems
        installments: 3,
        birth_date: birth_date,
      },
    };

    console.log('Request body for Novo Saque:', body);

    const response = await axios.post(
      `${novoSaqueUrl}/simulations/create_proposal_fgts`, body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const { data } = response;

    const customer_service_id = data.simulation.id.toString()


    return { service_id: customer_service_id, liquid_value: liquid_value};

  } catch (error) {
    console.error(`Error service SERVICE:`, error);
    throw new Error('Ocorreu um erro ao fazer a consulta, tente novamente');
  }
}
