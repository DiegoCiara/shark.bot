import Contact from '@entities/Contact';
import Thread from '@entities/Thread';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

export async function checkThread(
  contact: Contact,
): Promise<Thread | undefined> {
  try {
    const thread = await Thread.findOne({
      where: { contact: contact, status: 'OPEN' },
    });

    if (!thread) {
      try {
        const newThread = await openai.beta.threads.create();

        const threadCreated = await Thread.create({
          thread_id: newThread.id,
          contact,
        }).save();

        return threadCreated;
      } catch (error) {
        console.log(error);
      }
    } else {
      if (thread.status === 'OPEN') {
        return thread;
      } else {
        try {
          const newThread = await openai.beta.threads.create();

          const threadCreated = await Thread.create({
            thread_id: newThread.id,
            contact,
          }).save();

          // console.console.log(newThread.id);
          return threadCreated;
        } catch (error) {
          console.log(error);
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
}
