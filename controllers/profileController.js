const admin = require('../lib/firebaseAdmin');
const Profile = require('../models/Profile');
const User = require('../models/User'); // If you have additional user data

const getProfile = async (req, res) => {
  try {
    // 1. Get token from Authorization header
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    // 2. Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);
    const userId = decodedToken.uid;

    // 3. Fetch user from MongoDB using firebaseUid
    const profile = await User.findOne({ firebaseUid: userId });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // 4. Merge with Firebase auth data (optional)
    const firebaseUser = await admin.auth().getUser(userId);
    const response = {
      ...profile.toObject(),
      emailVerified: firebaseUser.emailVerified
    };

    res.json(response);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};


const updateProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const decodedToken = await admin.auth().verifyIdToken(token);
    const userId = decodedToken.uid;

    // Validate input
    const { displayName, bio, profilePicture, socialLinks } = req.body;
    if (!displayName) {
      return res.status(400).json({ error: 'Display name is required' });
    }

    // Update or create profile
    const profile = await User.findOneAndUpdate(
      { userId },
      { 
        displayName, 
        bio, 
        profilePicture, 
        socialLinks,
        updatedAt: Date.now()
      },
      { new: true, upsert: true }
    );

    res.json(profile);
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

module.exports = { getProfile, updateProfile };