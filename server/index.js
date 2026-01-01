const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const app = express(); // <--- Yeh line miss ho gayi thi!
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Isme humne version fix kar diya hai
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash-latest" 
});

app.get("/", (req, res) => {
  res.send("Vantage AI Global Server is Live! 🚀");
});

app.post("/ai", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, error: "Prompt is required" });
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ success: true, response: text });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ success: false, error: "AI sync error. Please try again." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

