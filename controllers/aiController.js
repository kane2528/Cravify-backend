const axios = require('axios');
const GeneratedRecipe = require('../models/GeneratedRecipe');
const admin = require('firebase-admin');

const FIREWORKS_API_KEY = process.env.FIREWORKS_API_KEY;

// 📦 Helper function to convert pounds to kg
function convertPoundsToKg(text) {
  return text.replace(/(\d+(\.\d+)?)\s*(pounds|pound|lbs|lb)/gi, (_, num) => {
    const kg = (parseFloat(num) * 0.453592).toFixed(2);
    return `${kg} kg`;
  });
}

const generateRecipe = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    const userId = decodedToken.uid;

    // Fireworks API Call
    const response = await axios.post(
      'https://api.fireworks.ai/inference/v1/completions',
      {
        model: 'accounts/fireworks/models/llama-v3p1-8b-instruct',
        prompt: `You are a professional chef. Based on the user's request below, provide the following:

1. Title of the dish
2. A list of ingredients (with quantity in metric units like grams or kilograms)
3. Step-by-step instructions to prepare the recipe

User's request: ${prompt}

Do not repeat any section. Avoid any introduction or conclusion. Format clearly.`,

        max_tokens: 1000,
        temperature: 0.7,
        stop: null
      },
      {
        headers: {
          Authorization: `Bearer ${FIREWORKS_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // ✨ Trim and convert pounds to kg
    let recipe = response.data.choices[0].text.trim();
    recipe = convertPoundsToKg(recipe); // ✅ add conversion here

    // Save to DB
    await GeneratedRecipe.create({
      userId,
      prompt,
      response: recipe
    });

    res.json({ recipe });
  } catch (err) {
    console.error('❗️ Fireworks AI error:', err?.response?.data || err.message);
    res.status(500).json({ error: 'Failed to generate recipe' });
  }
};


// ✅ Get all chat histories for a logged-in user
const getAllChats = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    const userId = decodedToken.uid;

    const chats = await GeneratedRecipe.find({ userId }).sort({ createdAt: -1 });

    res.json({ chats });
  } catch (err) {
    console.error("❗️Failed to fetch chats:", err);
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
};

const deleteChat = async (req, res) => {
  try {
    const { id } = req.params;
    await GeneratedRecipe.findByIdAndDelete(id);
    res.status(200).json({ message: 'Chat deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete chat' });
  }
};

module.exports = {
  generateRecipe,
  getAllChats,
  deleteChat, // <-- add this export
};

