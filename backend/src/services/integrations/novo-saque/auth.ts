import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const novoSaqueUrl = process.env.NOVOSAQUE_API_URL;


export async function authenticateNovoSaque(): Promise<any> {
  try {
    const response = await axios.post(`${novoSaqueUrl}login`, {
      body: {
        email: process.env.NOVOSAQUE_EMAIL,
        password: process.env.NOVOSAQUE_PASSWORD,
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