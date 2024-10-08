import * as sdk from "microsoft-cognitiveservices-speech-sdk";

const speechConfig = sdk.SpeechConfig.fromSubscription(
  process.env.AZURE_SPEECH_KEY!,
  process.env.AZURE_SPEECH_REGION!
);

export async function textToSpeech(text: string): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig);
    synthesizer.speakTextAsync(
      text,
      (result) => {
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          resolve(result.audioData);
        } else {
          reject(new Error(`Speech synthesis canceled, reason: ${result.reason}`));
        }
        synthesizer.close();
      },
      (error) => {
        reject(error);
        synthesizer.close();
      }
    );
  });
}

export async function speechToText(audioStream: sdk.AudioInputStream): Promise<string> {
  return new Promise((resolve, reject) => {
    const audioConfig = sdk.AudioConfig.fromStreamInput(audioStream);
    const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

    recognizer.recognizeOnceAsync(
      (result) => {
        if (result.reason === sdk.ResultReason.RecognizedSpeech) {
          resolve(result.text);
        } else {
          reject(new Error(`Speech recognition failed, reason: ${result.reason}`));
        }
        recognizer.close();
      },
      (error) => {
        reject(error);
        recognizer.close();
      }
    );
  });
}