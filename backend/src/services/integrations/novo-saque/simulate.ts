import axios from 'axios';
import { authenticateNovoSaque } from './auth';
import { formatCurrency } from '@src/utils/formats';
import dotenv from 'dotenv';
dotenv.config();

const novoSaqueUrl = process.env.NOVOSAQUE_API_URL;

export async function simulate(cpf: string) {

  console.log('cpf', cpf);
  try {
    const token = await authenticateNovoSaque()

    console.log(token);

    const response = await axios.post(`${novoSaqueUrl}/simulations/balance_proposal_fgts`,
      {
        cpf: cpf,
        installments: 9, //Minimo 3 e maximo 10
        rate: 0.0179, // Sempre será esse valor para homologaçaõ em producao será 0.0179999999
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

    const message = `Simulação realizada com sucesso para o CPF ${cpf}. O valor liberado é de ${product.valorLiberado} e as parcelas são: ${product.parcelas.map((item: any) => `R$ ${item.valor} descontado em ${item.dataDaParcela}`).join(', ')}`;

    return message;
  } catch (error: any) {
    console.error('Error simulation:', error?.response?.data || error);
    return 'Ocorreu um erro ao fazer a simulação, tente novamente';
  }
}