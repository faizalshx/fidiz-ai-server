const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Debug log (Render logs me dikhega)
console.log(
  "OPENAI_API_KEY loaded:",
  process.env.OPENAI_API_KEY ? "YES" : "NO"
);

// OpenAI init (only if key exists)
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// Health check
app.get("/", (req, res) => {
  res.json({
    status: "fidiz AI Server Running 🚀",
    openaiKeyLoaded: !!process.env.OPENAI_API_KEY,
  });
});

// AI endpoint
app.post("/ai", async (req, res) => {
  try {
    if (!openai) {
      return res.status(500).json({
        success: false,
        error: "OPENAI_API_KEY not configured on server",
      });
    }

    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: "Prompt is required",
      });
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

  } catch (error) {
    console.error("OpenAI Error:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
