import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const novoSaqueUrl = process.env.NOVOSAQUE_API_URL;
const email = process.env.NOVOSAQUE_EMAIL;
const password = process.env.NOVOSAQUE_PASSWORD;

export async function authenticateNovoSaque(): Promise<any> {

  console.log('Novo Saque:', novoSaqueUrl, email, password);

  try {
    const response = await axios.post(`${novoSaqueUrl}/login`, {
      body: {
        email: email,
        password: password,
      },
    }, {
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
    });

    return response;
  } catch (error) {
    console.error('Error:', error);
  }
}