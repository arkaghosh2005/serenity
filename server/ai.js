console.log("HElllllo")
const { GoogleGenAI } = require ("@google/genai");
const dotenv = require ("dotenv");
dotenv.config(); //load the environment variables from .env!

const genAI = new GoogleGenAI({
    apiKey: process.env.API_KEY,
});

async function run() {
    const chat = genAI.chats.create({
        model: "gemini-2.5-flash",
        history: [
            {
                role: "user",
                parts: [{ text: "Hello" }],
            },
            {
                role: "model",
                parts: [{ text: "Great to meet you. What would you like to know?" }],
            },
        ],
    });

    const response1 = await chat.sendMessage({
        message: "I have 2 dogs in my house.",
    });
    console.log("Chat response 1:", response1.text);

    const response2 = await chat.sendMessage({
        message: "How many paws are in my house?",
    });
    console.log("Chat response 2:", response2.text);
}

run();