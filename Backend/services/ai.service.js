import { GoogleGenerativeAI } from '@google/generative-ai';

import dotenv from "dotenv";
dotenv.config(); 

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateContent = async (prompt) => {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    return text;
  } catch (error) {
    console.error(" Error generating content:", error);
  }
};
