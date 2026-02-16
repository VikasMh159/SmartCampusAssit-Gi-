
import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "./constants";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
};

let chatInstance: Chat | null = null;

export const startChat = () => {
  const ai = getAIClient();
  chatInstance = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
    },
  });
  return chatInstance;
};

export const sendMessageToAssistant = async (message: string): Promise<string> => {
  if (!chatInstance) {
    startChat();
  }
  
  try {
    const response = await chatInstance!.sendMessage({ message });
    return response.text || "Sorry, I couldn't process that. Kya aap fir se try karenge?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Something went wrong! Please check your connection. 😔";
  }
};
