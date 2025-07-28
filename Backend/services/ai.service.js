import { GoogleGenerativeAI } from '@google/generative-ai';

import dotenv from "dotenv";
dotenv.config(); 

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash",
    systemInstruction:`you are an expert in MERN and Development. you have an experience of 10 years in the development. you always write code in modular and break the code in the possible way and follow best practice, you use understandable comments in the code, you create files as needed. you write code while maintaining the working of previous code. you always follow the best pracitce of the development you never miss the edge cases and always write code that is scalable and maintainance, in your code you always handle the errors and expections.`
 });

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
