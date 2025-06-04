import axios from 'axios';
import { authenticateNovoSaque } from './auth';
import { formatCurrency } from '@src/utils/formats';
import dotenv from 'dotenv';
dotenv.config();

const novoSaqueUrl = process.env.NOVOSAQUE_API_URL;

export async function simulate(args: any, token?: string) {

  const { cpf } = args;

  console.log('Simulate Novo Saque:', args);
  try {

    console.log(token);

    const response = await axios.post(`${novoSaqueUrl}/simulations/balance_proposal_fgts`,
      {
        cpf: cpf,
        installments: 12, //Minimo 3 e maximo 10
        rate: 0.0179999999, // Sempre será esse valor para homologaçaõ em producao será 0.0179999999
      },
      {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      },
    );

    const { data } = response;


    const tableTarget = data.find((plan: any) => plan.table_name === "Tabela NS" || plan.table_name === "Diamante");


    const product = {
      valorLiberado: formatCurrency(tableTarget.response.liquidValue),
      parcelas: tableTarget.response.paymentScheduleItems.map((item: any) => {
        return {
          dataDaParcela: item.dueDate,
          valor: formatCurrency(item.interest),
        };
      }
      ),
    }

    console.log(`✅ Sucesso para CPF ${cpf}:`, product);

    console.log('Response from Novo Saque:', tableTarget.response.liquidValue);
    if (tableTarget.response.liquidValue < 4500) {

      throw new Error('Saldo abaixo do mínimo permitido".');
    }

    return {
      target: tableTarget,
      product: product,
      products: data,
      installments: tableTarget.response.paymentScheduleItems.lenth, // Minimo 3 e maximo 10
    };
  } catch (error: any) {
    console.error('Error simulation:', error?.response?.data || error);
    throw new Error('Erro ao realizar a simulação');
  }
}