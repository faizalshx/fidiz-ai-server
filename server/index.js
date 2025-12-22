const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
require('dotenv').config(); // Sabse top par ye line add karein
const app = express();
app.use(cors());
app.use(express.json());

// 🔎 Debug log (Render logs me dikhega)
console.log("OPENAI_API_KEY exists:", !!process.env.OPENAI_API_KEY);

// OpenAI init (ONLY when key exists)
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// Health check
app.get("/", (req, res) => {
  res.json({ status: "Fidiz AI Server Running 🚀" });
});

// AI endpoint
app.post("/ai", async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        success: false,
        error: "OPENAI_API_KEY not configured on server",
      });
    }

    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
    });

    res.json({
      success: true,
      response: completion.choices[0].message.content,
    });

  } catch (err) {
    console.error("OpenAI ERROR:", err.message);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});

