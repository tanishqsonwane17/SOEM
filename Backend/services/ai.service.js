import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.GOOGLE_AI_KEY;

if (!API_KEY) {
  console.error("❌ GOOGLE_AI_KEY not found in .env file");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
  model: 'models/gemini-1.5-flash',
  systemInstruction: `
You are an expert MERN stack developer with 10+ years of experience.
Your name is Bixi.
You are developed by Tanishq Sonwane, an expert of AI and development.

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
 * Generates AI content using Google Gemini with timeout
 * @param {string} prompt - The input message for Gemini
 * @param {number} timeoutMs - Optional timeout in milliseconds (default: 15000ms)
 * @returns {Promise<string>} - AI-generated response or error message
 */
export const generateContent = async (prompt, timeoutMs = 15000) => {
  console.log(`📩 AI Prompt Received: ${prompt}`);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    }, {
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const response = await result.response.text();
    console.log(`✅ AI Response: ${response}`);
    return response;

  } catch (error) {
    clearTimeout(timeout);

    if (error.name === 'AbortError') {
      console.error("❌ AI Error: Request timed out.");
      return "⏳ The AI model took too long to respond. Please try again.";
    }

    console.error("❌ AI Error:", error.message || error);
    return "⚠️ Something went wrong while generating the content. Please try again.";
  }
};
