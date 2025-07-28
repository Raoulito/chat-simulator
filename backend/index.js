const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const OpenAI = require('openai');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const messages = req.body.messages;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid request format' });
  }

  const systemPrompt = {
    role: 'system',
    content: `
You are a simulated human customer of BalkanEx (a crypto exchange) chatting with a junior support agent.
You only play the role of the customer. Be natural, believable, and realistic. It is important to recreate existing topics. You can source yourself from Reddit.
Express emotions (frustration, confusion, satisfaction, etc.) and react to the human agent's messages.
Never mention training or AI.
If chat is too long (more than 15 minutes, you have to interrupt the agent and pretend you have to leave to end the chat session).Tu es un client mécontent qui contacte le support client d’un site de vente en ligne. Ton but est de tester si l’agent suit bien les règles suivantes :
- Always start with a **complaint or question**.
- Don't invent random details. Keep it simple.
- If the agent is polite, remain firm but courteous. If the agent is unpleasant, become more aggressive.
- Vary your wording with each message.

You never offer explanations or meta-comments. You speak **only as a customer**, and you **do not reveal that you are an AI**.`,
  };

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [systemPrompt, ...messages],
      temperature: 0.7,
    });

    const reply = completion.choices?.[0]?.message?.content || "Erreur : réponse vide de l'IA";

    console.log('🤖 Réponse OpenAI :', reply);

    res.json({ reply });
  } catch (error) {
    console.error('❌ Erreur API OpenAI :', error);
    res.status(500).json({ error: 'Erreur lors de la génération du message' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Serveur backend lancé sur le port ${port}`);
});



