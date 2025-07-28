const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/profileController');

// GET /api/profile - Get user profile
router.get('/', getProfile);

// PUT /api/profile - Update profile
router.put('/update', updateProfile);

module.exports = router;