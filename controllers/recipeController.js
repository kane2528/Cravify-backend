const Recipe = require('../models/Recipe');

const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
      
    res.json(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('createdBy', 'name email');
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.json(recipe);
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createRecipe = async (req, res) => {
  try {
    const { title, description, imageUrl, ingredients, steps, tags, difficulty, cookTime } = req.body;
    
    const newRecipe = new Recipe({
      title,
      description,
      imageUrl,
      ingredients,
      steps,
      tags,
      difficulty,
      cookTime,
      createdBy: req.user._id,
    });

    await newRecipe.save();
    res.status(201).json(newRecipe);
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateRecipe = async (req, res) => {
  try {
    const { title, description, imageUrl, ingredients, steps, tags, difficulty, cookTime } = req.body;
    
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        imageUrl,
        ingredients,
        steps,
        tags,
        difficulty,
        cookTime,
      },
      { new: true }
    );

    if (!updatedRecipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.json(updatedRecipe);
  } catch (error) {
    console.error('Error updating recipe:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteRecipe = async (req, res) => {
  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);
    
    if (!deletedRecipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
};