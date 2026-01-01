const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Vantage API Final Fix Live! ✅"));

app.post("/ai", async (req, res) => {
  try {
    const { prompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    // Sabse stable URL aur Model ka combination:
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

    const response = await axios.post(url, {
      contents: [{ parts: [{ text: prompt }] }]
    });

    // Google API response structure check
    if (response.data.candidates && response.data.candidates[0].content) {
        const aiResponse = response.data.candidates[0].content.parts[0].text;
        res.json({ success: true, response: aiResponse });
    } else {
        throw new Error("Invalid AI Response format");
    }

  } catch (error) {
    // Ye logs Render dashboard par asli wajah batayenge (Check logs carefully!)
    console.error("FULL ERROR DETAIL:", JSON.stringify(error.response ? error.response.data : error.message));
    
    res.status(500).json({ 
      success: false, 
      error: "AI Engine is syncing, please try again." 
    });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
