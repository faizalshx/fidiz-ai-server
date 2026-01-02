const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/ai", async (req, res) => {
  try {
    const { prompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    // SABSE STABLE CONFIGURATION (Ye 404 nahi dega)
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`;

    const response = await axios.post(url, {
      contents: [{ parts: [{ text: "You are Fidiz AI Coach. " + prompt }] }]
    });

    if (response.data.candidates) {
      const aiResponse = response.data.candidates[0].content.parts[0].text;
      res.json({ success: true, response: aiResponse });
    } else {
      res.status(500).json({ success: false, error: "Google sent empty response" });
    }

  } catch (error) {
    // Agar ab bhi error aaye, toh seedha error message screen par dikhao
    const errMsg = error.response ? JSON.stringify(error.response.data) : error.message;
    console.error("FINAL DEBUG:", errMsg);
    res.status(500).json({ success: false, error: "API Key Issue. Please check AI Studio." });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Fidiz Server Live"));
