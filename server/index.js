const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get("/", (req, res) => res.send("Vantage Global Server is Live! ✅"));

app.post("/ai", async (req, res) => {
  try {
    const { prompt } = req.body;
    
    // Yahan humne "gemini-pro" use kiya hai kyunki ye v1beta aur v1 dono mein 100% chalta hai
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ success: true, response: text });
  } catch (error) {
    console.error("DEBUG ERROR:", error.message);
    
    // Agar gemini-pro bhi na chale toh hum error detail bhejenge
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

const PORT = process.env.PORT || 10000; // Render uses 10000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
