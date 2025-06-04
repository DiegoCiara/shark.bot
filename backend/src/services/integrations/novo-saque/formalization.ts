import Contact from '@entities/Contact';
import axios from 'axios';

import dotenv from 'dotenv';
import { simulate } from './simulate';
import { formatPhone } from '@utils/formats';
dotenv.config();

const novoSaqueUrl = process.env.NOVOSAQUE_API_URL;

export async function formalization(
  contract_id: number,
  token?: string,
): Promise<string> {
  try {
    console.log(token);


    const response = await axios.get(
      `${novoSaqueUrl}/contracts/${contract_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
      },
    );

    console.log('Response FORMALIZATION from Novo Saque:', JSON.stringify(response.data));

    const { data } = response;

    const link = data.onboarding_link as string

    return link;

  } catch (error: any) {
    if(error.response?.data?.error){
      return error.response.data.error || 'Ocorreu um erro ao fazer a consulta, tente novamente';
    }

    console.error(`Error service:`, error.response?.data || error);
    throw new Error('Ocorreu um erro ao fazer a consulta, tente novamente');
  }
}
