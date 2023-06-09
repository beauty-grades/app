import { Configuration, OpenAIApi } from "openai";

const openAIConfig = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const OpenAI = new OpenAIApi(openAIConfig);

export default OpenAI;
