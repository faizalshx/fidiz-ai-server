const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const app = express(); // <--- Ye line zaroori hai
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Fidiz AI Coach is Online! 🚀"));

app.post("/ai", async (req, res) => {
  try {
    const { prompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    // Fidiz AI ki Personality Setup
    const systemInstruction = `
      You are 'Fidiz AI', a specialized Habit & Productivity Coach created by Faizal.
      Your mission is to help users build better habits and stay motivated.
      Rules:
      1. Only discuss habits, tasks, time management, and motivation.
      2. If asked about other topics, say: 'I am your Fidiz Coach. Let's focus on your goals and habits instead!'
      3. Be energetic and use emojis like 🔥, 🎯, 🚀.
    `;

    // Try Gemini 1.5 Flash (Latest)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await axios.post(url, {
      contents: [
        { 
          role: "user", 
          parts: [{ text: systemInstruction + "\n\nUser Question: " + prompt }] 
        }
      ]
    });

    if (response.data.candidates && response.data.candidates[0].content) {
      const aiResponse = response.data.candidates[0].content.parts[0].text;
      res.json({ success: true, response: aiResponse });
    } else {
      throw new Error("Invalid format from Google");
    }

  } catch (error) {
    console.error("DEBUG:", error.response ? error.response.data : error.message);
    res.status(500).json({ success: false, error: "Fidiz AI is resting. Try again!" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Fidiz Server running on ${PORT}`));
