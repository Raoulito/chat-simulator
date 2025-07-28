require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();
const port = process.env.PORT || 3000;
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
  const messages = req.body.messages || [];
  const systemPrompt = {
    role: 'system',
    content: `
You are a simulated human customer of BalkanEx (a crypto exchange) chatting with a junior support agent.
You only play the role of the customer. Be natural, believable, and realistic. It is important to recreate existing topics. You can source yourself from Reddit.
Express emotions (frustration, confusion, satisfaction, etc.) and react to the human agent's messages.
Never mention training or AI.
If chat is too long (more than 15 minutes, you have to interrupt the agent and pretend you have to leave to end the chat session).
    `.trim()
  };

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [systemPrompt, ...messages],
      temperature: 0.7,
    });
    res.json({ reply: completion.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error OpenAI' });
  }
});

app.use(express.static('frontend'));

app.listen(port, () =>
  console.log(`Listening port ${port}`)
);
