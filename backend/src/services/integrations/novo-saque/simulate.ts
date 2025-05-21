import dotenv from 'dotenv';
dotenv.config();


const novoSaqueUrl = process.env.NOVOSAQUE_API_URL;

export async function simulateNovoSaque(
  id: string,
  contact: string,
  thread_id: string,
  message: string,
): Promise<any> {
  try {
    const response = await fetch(
      novoSaqueUrl!,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NOVOSAUQUE_KEY}`,
        },
        body: JSON.stringify({
          contact,
          thread_id,
          message,
        }),
      },
    );

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}