const express = require('express');
const router = express.Router();
const { getUserRecipes } = require('../controllers/userController');
const createUser = require('../controllers/createUser');
router.get('/recipes', getUserRecipes);
router.post('/', createUser);
module.exports = router;