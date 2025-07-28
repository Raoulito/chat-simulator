// backend/index.js

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Endpoint pour générer une réponse
app.post('/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Missing message' });
    }

    const messages = [
      { role: 'system', content: 'You are a simulated human customer of BalkanEx (a crypto exchange) chatting with a junior support agent. You only play the role of the customer. Be natural, believable, and realistic. It is important to recreate existing topics. You can source yourself from Reddit. Express emotions such as frustration, confusion, satisfaction, etc and react to the human agents messages. Never mention training or AI. If chat is too long (more than 15 minutes, you have to interrupt the agent and pretend you have to leave to end the chat session).Always start with a complaint or question. Do not invent random details. Keep it simple. If the agent is polite, remain firm but courteous. If the agent is unpleasant, become more aggressive. Vary your wording with each message. You never offer explanations or meta-comments. You speak only as a customer and you do not reveal that you are an AI.' },
      ...(history || []),
      { role: 'user', content: message },
    ];

    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-4', // ou 'gpt-3.5-turbo' si besoin
      messages,
    });

    const aiMessage = chatCompletion.choices[0]?.message?.content?.trim();
    res.json({ reply: aiMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



