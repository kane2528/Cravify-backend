const admin = require('firebase-admin');
const User = require('../models/User');

const validateToken = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    let user = await User.findOne({ firebaseUid: decodedToken.uid });
    
    if (!user) {
      // Create new user if doesn't exist
      user = new User({
        firebaseUid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name || decodedToken.email.split('@')[0],
      });
      await user.save();
    }

    res.json({
      uid: user.firebaseUid,
      email: user.email,
      name: user.name,
      _id: user._id,
    });
  } catch (error) {
    console.error('Token validation error:', error);
    res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = { validateToken };