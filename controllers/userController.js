const admin = require('../lib/firebaseAdmin');
const Recipe = require('../models/Recipe');

const getUserRecipes = async (req, res) => {
  try {
    // Verify Firebase token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    const userId = decodedToken.uid;

    // Fetch recipes from MongoDB
    const recipes = await Recipe.find({ authorId: userId })
      .sort({ createdAt: -1 })
      .lean();

    res.json(recipes);
  } catch (error) {
    console.error('Error fetching user recipes:', error);
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({ error: 'Token expired' });
    }
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
};






module.exports = {
  getUserRecipes
  
};