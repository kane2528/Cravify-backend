const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true,
    unique: true 
  },
  displayName: { 
    type: String 
  },
  bio: { 
    type: String,
    maxlength: 200 
  },
  profilePicture: { 
    type: String 
  },
  socialLinks: {
    website: String,
    twitter: String,
    instagram: String
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date 
  }
});

// Update timestamp before saving
ProfileSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Profile', ProfileSchema);