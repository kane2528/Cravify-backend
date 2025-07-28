const admin = require('firebase-admin');
const User = require('../models/User');

const createUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const decoded = await admin.auth().verifyIdToken(token);
    const firebaseUid = decoded.uid;

    const { name, email, photoUrl } = req.body;

    // Check if user already exists
    let user = await User.findOne({ firebaseUid });

    if (!user) {
      user = new User({
        firebaseUid,
        name,
        email,
        photoUrl,
      });

      await user.save();
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Create User Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = createUser;
