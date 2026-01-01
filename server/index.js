const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios"); // Axios install karna padega: npm install axios

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Vantage Direct API Server is Live! ✅"));

app.post("/ai", async (req, res) => {
  try {
    const { prompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    // Seedha Google API ko hit kar rahe hain (Latest Version v1)
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await axios.post(url, {
      contents: [{ parts: [{ text: prompt }] }]
    });

    const aiResponse = response.data.candidates[0].content.parts[0].text;
    res.json({ success: true, response: aiResponse });

  } catch (error) {
    console.error("DEBUG ERROR:", error.response ? error.response.data : error.message);
    res.status(500).json({ 
      success: false, 
      error: "Google API Connection Failed" 
    });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
