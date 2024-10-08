import { NextApiRequest, NextApiResponse } from 'next';
import { generateResponse } from '@/lib/azure-openai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { message } = req.body;
      const response = await generateResponse(message);
      res.status(200).json({ response });
    } catch (error) {
      console.error('Error in chat handler:', error);
      res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}