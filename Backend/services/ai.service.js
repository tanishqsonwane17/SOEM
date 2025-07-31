import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.GOOGLE_AI_KEY;

if (!API_KEY) {
  console.error(" GOOGLE_AI_KEY not found in .env file");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  systemInstruction: `
You are an expert MERN stack developer with 10+ years of experience.
Your responsibilities:
- Write clean, modular, and scalable code.
- Preserve previous features while adding new ones.
- Split large logic into separate functions/files.
- Always handle edge cases and errors.
- Comment your code clearly.
- Follow best architecture practices.
`
});

/**
 * Generates AI content using Google Gemini
 * @param {string} prompt - The input message for Gemini
 * @returns {Promise<string>} - AI-generated response or error message
 */
export const generateContent = async (prompt) => {
  console.log(`AI Prompt Received: ${prompt}`);

  try {
    const result = await model.generateContent(prompt);
    const text = await result.response.text();
    console.log(` AI Response: ${text}`);
    return text;

  } catch (error) {
    console.error(`AI Error: ${error.message || error}`);
    return " Something went wrong while generating the content. Please try again.";
  }
};
