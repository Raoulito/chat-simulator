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
Tu es un client humain simulé, qui discute avec un agent de support débutant.
Tu joues uniquement le rôle du client. Sois naturel, crédible et réaliste.
Exprime des émotions (frustration, confusion, satisfaction…) et réagis aux messages de l’agent humain.
Ne mentionne jamais l’entrainement ou l’IA.
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
    res.status(500).json({ error: 'Erreur OpenAI' });
  }
});

app.use(express.static('frontend'));

app.listen(port, () =>
  console.log(`Serveur en écoute sur le port ${port}`)
);
