import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const novoSaqueUrl = process.env.NOVOSAQUE_API_URL;


export async function authenticateNovoSaque(): Promise<any> {
  try {
    const response = await axios.post(`${novoSaqueUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: {
        email: process.env.NOVOSAQUE_EMAIL,
        password: process.env.NOVOSAQUE_PASSWORD,
      },
    });

    return response.data.token;
  } catch (error) {
    console.error('Error:', error);
  }
}