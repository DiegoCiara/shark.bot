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

    const card_limit = target.response.paymentScheduleItems.reduce(
      (total: any, item: any) => total + item.payment,
      0,
    );
    const value_installment = target.response.paymentScheduleItems[0].payment;
    const body = {
      simulation: {
        name: name,
        interest_rate: '1.79',
        email: 'naotem@gmail.com',
        cpf_cnpj: cpf,
        phone: '(86) 99562-5928',
        phone_store: '(86) 99562-5928',
        phone_seler: '(86) 99562-5928',
        simulation_fgts: products,
        simularion_json: target,
        has_secure: false,
        liquid_value: liquid_value,
        released_amount: liquid_value, // response -> LiquidValue
        value_client: liquid_value, // response -> LiquidValue
        value_establishment: liquid_value, // response -> LiquidValue
        card_limit,// response -> paymentScheduleItems.reduce
        value_installment, // primeiro item paymentScheduleItems
        installments: 3,
        birth_date: birth_date,
      },
    };

    console.log('Request body for Novo Saque:', body);

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

    const customer_service_id = data.simulation.id.toString();

    return { service_id: customer_service_id, liquid_value: liquid_value };
  } catch (error: any) {
    delete error.response?.data?.simulation
    console.error(`Error service SERVICE:`, error.response?.data || error);
    throw new Error('Ocorreu um erro ao fazer a consulta, tente novamente');
  }
}
