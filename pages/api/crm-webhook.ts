import { NextApiRequest, NextApiResponse } from 'next';
import { isAuthenticated } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!(await isAuthenticated(req, res))) return;

  if (req.method === 'POST') {
    // Process the webhook data from Azure Logic Apps
    const { patientId, crmData } = req.body;

    // Update local database with CRM data
    // This is a placeholder for the actual implementation
    console.log(`Updating patient ${patientId} with CRM data:`, crmData);

    res.status(200).json({ message: 'CRM data processed successfully' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}