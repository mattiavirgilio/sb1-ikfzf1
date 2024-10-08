import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

if (!accountSid || !authToken) {
  throw new Error('Twilio credentials are not properly configured.');
}

const client = twilio(accountSid, authToken);

export async function sendSMS(to: string, body: string) {
  try {
    const message = await client.messages.create({
      body,
      to,
      from: process.env.TWILIO_PHONE_NUMBER,
    });
    console.log(`Message sent successfully. SID: ${message.sid}`);
    return message;
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
}

export async function makeCall(to: string, url: string) {
  try {
    const call = await client.calls.create({
      url,
      to,
      from: process.env.TWILIO_PHONE_NUMBER,
    });
    console.log(`Call initiated successfully. SID: ${call.sid}`);
    return call;
  } catch (error) {
    console.error('Error making call:', error);
    throw error;
  }
}