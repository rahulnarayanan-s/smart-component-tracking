import { NextApiRequest, NextApiResponse } from 'next';

export default async function webhookHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const webhookData = req.body;

    // Process the webhook data here
    console.log('Received webhook data:', webhookData);

    // Respond with a success status
    return res.status(200).json({ message: 'Webhook received successfully' });
  } else {
    // Handle any other HTTP method
    return res.status(405).json({ message: 'Method not allowed' });
  }
}