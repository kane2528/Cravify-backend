const mongoose = require('mongoose');

const GeneratedRecipeSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  prompt: { type: String, required: true },
  response: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GeneratedRecipe', GeneratedRecipeSchema);