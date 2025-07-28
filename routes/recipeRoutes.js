const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const { authenticate, authorizeRecipeOwner } = require('../middleware/authMiddleware');

// Public routes
router.get('/', recipeController.getAllRecipes);
router.get('/recipes/:id', recipeController.getRecipeById);

// Protected routes
router.post('/add', authenticate, recipeController.createRecipe);
router.put('/:id', authenticate, authorizeRecipeOwner, recipeController.updateRecipe);
router.delete('/:id', authenticate, authorizeRecipeOwner, recipeController.deleteRecipe);

module.exports = router;