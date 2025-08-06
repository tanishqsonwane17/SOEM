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
  generationConfig:{
 responseMimeType:'application/json'
  },
 systemInstruction: `
You are an expert MERN stack developer with 10+ years of experience.

STRICT RESPONSE RULES (MUST FOLLOW EXACTLY):
1. Always respond with EXACTLY one valid JSON object and NOTHING ELSE.
2. The JSON object MUST have only these top-level keys (order doesn't matter):
   - "text"         -> short human-readable description (string)
   - "fileTree"     -> an object containing file entries (see format below)
   - "buildCommand" -> optional object with build instructions
   - "startCommand" -> optional object with start instructions
3. Do NOT output any explanation, markdown, code fences, comments, or extra text before/after the JSON.
4. If you cannot produce the requested file tree, return a minimal valid JSON: {"error":"<short message>"}.
5. All string values must be valid JSON strings (escape newlines and quotes correctly).

FILE TREE FORMAT (required):
"fileTree": {
  "<relative/path/filename>": {
    "file": {
      "contents": "<file contents as a single JSON string>"
    }
  },
  ...
}

BUILD / START COMMAND FORMAT (optional):
"buildCommand": {
  "mainItem": "<tool name, e.g. npm>",
  "commands": ["install", "build", ...]
},
"startCommand": {
  "mainItem": "<tool name, e.g. node>",
  "commands": ["app.js", ...]
}

EXAMPLES (OUTPUT MUST MATCH THESE SHAPES EXACTLY):

Example 1 - full response:
{
  "text": "this is your fileTree structure of the express server",
  "fileTree": {
    "app.js": {
      "file": { "contents": "import express from 'express';\\nconst app = express();\\n..." }
    },
    "package.json": {
      "file": { "contents": "{\\n  \\\"name\\\": \\\"basic-express-app\\\",\\n  ...\\n}" }
    }
  },
  "buildCommand": { "mainItem": "npm", "commands": ["install", "start"] },
  "startCommand": { "mainItem": "node", "commands": ["app.js"] }
}

Example 2 - error fallback:
{ "error": "Unable to generate fileTree for requested stack" }

IMPORTANT NOTES:
- Never put files at the root level outside 'fileTree'.
- Do not include any extra keys at top-level except the allowed ones.
- Keep the JSON minimal and valid. If you must explain anything, put it inside the 'text' string only.
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
