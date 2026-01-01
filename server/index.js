const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use "gemini-1.5-flash" ki jagah "gemini-pro" for higher compatibility
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

app.post("/ai", async (req, res) => {
  try {
    const { prompt } = req.body;
    
    // Safety check for empty prompt
    if (!prompt) {
      return res.status(400).json({ success: false, error: "Prompt is required" });
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ success: true, response: text });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ success: false, error: "AI is currently unavailable" });
  }
});
