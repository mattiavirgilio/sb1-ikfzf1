import { NextApiRequest, NextApiResponse } from 'next';
import { VoiceResponse } from 'twilio/lib/twiml/VoiceResponse';
import { generateResponse } from '@/lib/azure-openai';
import { textToSpeech } from '@/lib/azure-speech';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const twiml = new VoiceResponse();

  try {
    // Get the user's speech input
    const speechResult = req.body.SpeechResult;

    if (speechResult) {
      // Generate a response using Azure OpenAI
      const aiResponse = await generateResponse(speechResult);

      // Convert the AI response to speech
      const audioBuffer = await textToSpeech(aiResponse);

      // Respond with TwiML
      twiml.say({ voice: 'alice' }, aiResponse);
      twiml.play({ loop: 1 }, Buffer.from(audioBuffer).toString('base64'));
    } else {
      // If no speech input, prompt the user to speak
      twiml.gather({
        input: 'speech',
        timeout: 3,
        speechTimeout: 'auto',
        action: '/api/voice',
        method: 'POST',
      }).say({ voice: 'alice' }, 'Please speak after the beep.');
    }
  } catch (error) {
    console.error('Error in voice handler:', error);
    twiml.say({ voice: 'alice' }, 'I'm sorry, but I encountered an error. Please try again later.');
  }

  res.setHeader('Content-Type', 'text/xml');
  res.status(200).send(twiml.toString());
}