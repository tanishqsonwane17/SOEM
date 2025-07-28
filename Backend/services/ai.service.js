import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const API_KEY = process.env.GOOGLE_AI_KEY;

// Check for API key existence
if (!API_KEY) {
  console.error("❌ GOOGLE_AI_KEY not found in .env file");
  process.exit(1);
}

// Initialize AI model
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  systemInstruction: `
You are an expert MERN stack developer with over 10 years of experience. You always:
- Write modular, clean, and scalable code.
- Break logic into separate files wherever needed.
- Include meaningful comments.
- Maintain previous functionalities while adding new features.
- Handle all edge cases and possible errors gracefully.
- Follow best practices in coding and architecture.
`
});

/**
 * Generate content using Google Gemini AI
 * @param {string} prompt - User prompt to send to AI
 * @returns {Promise<string>} - Generated content from Gemini
 */
export const generateContent = async (prompt) => {
  try {
    console.log(`📩 AI Prompt Received: ${prompt}`);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    console.log(`✅ AI Response: ${text}`);
    return text;
  } catch (error) {
    console.error("❌ Error while generating AI content:", error?.message || error);
    return "Something went wrong while generating the content. Please try again.";
  }
};
