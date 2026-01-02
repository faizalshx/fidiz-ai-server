const axios = require("axios");
// ... baki imports same rahenge

app.post("/ai", async (req, res) => {
  try {
    const { prompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    // YE HAI AAPKE AI KA DNA (System Instruction)
    const systemInstruction = `
      You are 'Fidiz AI', a world-class Habit & Productivity Coach. 
      Your creator is Faizal.
      Rules:
      1. ONLY talk about habits, routines, tasks, and motivation.
      2. Be direct, professional, and highly motivating.
      3. If a user asks about anything else, politely say: 'I am Fidiz AI, focused only on your peak performance. Let's talk about your habits instead.'
      4. Use emojis like 🚀, 🎯, 🔥 to keep it engaging.
    `;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await axios.post(url, {
      contents: [
        { role: "user", parts: [{ text: systemInstruction + "\n\nUser Question: " + prompt }] }
      ]
    });

    const aiResponse = response.data.candidates[0].content.parts[0].text;
    res.json({ success: true, response: aiResponse });

  } catch (error) {
    res.status(500).json({ success: false, error: "Fidiz AI is sleeping. Wake it up soon!" });
  }
});
