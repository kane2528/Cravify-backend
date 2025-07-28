const express = require('express');
const router = express.Router();
const { generateRecipe, getAllChats, deleteChat } = require('../controllers/aiController');

router.post('/generate', generateRecipe);
router.get('/chats', getAllChats);
router.delete('/chat/:id', deleteChat);

module.exports = router;