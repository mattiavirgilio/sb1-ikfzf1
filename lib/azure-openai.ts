import { OpenAIClient, AzureKeyCredential } from "azure-openai";
import { DefaultAzureCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";

const keyVaultName = process.env.KEY_VAULT_NAME;
const keyVaultUrl = `https://${keyVaultName}.vault.azure.net`;

const credential = new DefaultAzureCredential();
const secretClient = new SecretClient(keyVaultUrl, credential);

async function getOpenAIKey() {
  const secretName = "OpenAIKey";
  const secret = await secretClient.getSecret(secretName);
  return secret.value;
}

export async function getOpenAIClient() {
  const openAIKey = await getOpenAIKey();
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  
  if (!openAIKey || !endpoint) {
    throw new Error("Azure OpenAI credentials are not properly configured.");
  }

  return new OpenAIClient(endpoint, new AzureKeyCredential(openAIKey));
}

export async function generateResponse(prompt: string) {
  const client = await getOpenAIClient();
  const deploymentId = process.env.AZURE_OPENAI_DEPLOYMENT_ID;

  if (!deploymentId) {
    throw new Error("Azure OpenAI deployment ID is not configured.");
  }

  const response = await client.getCompletions(deploymentId, prompt);
  return response.choices[0].text;
}