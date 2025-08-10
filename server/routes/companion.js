// /api/companion.js
const express = require('express');
const router = express.Router();
const { GoogleGenAI } = require("@google/genai");
const dotenv = require("dotenv");
dotenv.config(); //load the environment variables from .env!

// TODO for developers: add a .env file containing gemini API key in server folder (variable: API_KEY) ! 
const genAI = new GoogleGenAI({
    apiKey: process.env.API_KEY,
});

//console.log("API Key from env:", process.env.API_KEY);
console.log("We working")

router.get('/', (req, res) => {
    console.log("companion got!")
})

router.post('/', async (req, res) => {
    console.log("Posted!")
    console.log(req.body.message)
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
    const msg = req.body.message
    const response1 = await chat.sendMessage({
        message: msg,
        config: {
            thinkingConfig: {
                thinkingBudget: 0, // Disables thinking
            },
        }
    });
    console.log("Chat response 1:", response1.text);
    const text = response1.text;
    res.send(text);
   
})

module.exports = router