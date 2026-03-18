import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function runChat(prompt, fileData = null) {
  if (fileData) {
    const parts = [
      {
        inlineData: {
          mimeType: fileData.mimeType,
          data: fileData.base64,
        },
      },
      { text: prompt || "Please analyze this file and describe its contents in detail." },
    ];
    const result = await model.generateContent(parts);
    return result.response.text();
  }

  const chatSession = model.startChat({ generationConfig, history: [] });
  const result = await chatSession.sendMessage(prompt);
  return result.response.text();
}

export default runChat;