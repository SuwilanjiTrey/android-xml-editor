require('dotenv').config(); // Add this line at the top of your file

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key from the environment variable
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function run() {
    const prompt = "Write a story about an AI and magic";
  
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();  // Ensure the response is awaited properly
    console.log(text);
}

run();
