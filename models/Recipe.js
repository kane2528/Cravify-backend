const mongoose = require('mongoose');
const { Schema } = mongoose;

const recipeSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Recipe title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  imageUrl: {
    type: String,
    default: '/images/default-recipe.jpg'
  },
  ingredients: {
    type: [{
      name: {
        type: String,
        required: true
      },
      quantity: String,
      notes: String
    }],
    required: true,
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: 'At least one ingredient is required'
    }
  },
  steps: {
    type: [{
      stepNumber: Number,
      instruction: {
        type: String,
        required: true
      },
      timer: {
        duration: Number,
        unit: {
          type: String,
          enum: ['seconds', 'minutes', 'hours']
        }
      }
    }],
    required: true
  },
  tags: {
  type: [String],
  enum: [
    'vegetarian', 'vegan', 'jain', 'gluten-free',
    'festival', 'street-food', 'royal', 'tiffin',
    'breakfast', 'lunch', 'dinner', 'snack', 'dessert',
    'curry', 'restaurant-style', 'non-veg', 'fermented',
    'slow-cooked', 'special-occasion', 'steamed'
  ]
},
  cuisine: {
    type: String,
    required: false,
    enum: [
      'North Indian', 'South Indian', 'Mughlai', 'Rajasthani',
      'Punjabi', 'Gujarati', 'Bengali', 'Kashmiri',
      'Goan', 'Kerala', 'Hyderabadi', 'Other'
    ]
  },
  dietaryPreference: {
    type: String,
    enum: ['vegetarian', 'non-vegetarian', 'eggetarian', 'jain', 'vegan'],
    default: 'vegetarian'
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  prepTime: {
    type: Number, // in minutes
    required: false
  },
  cookTime: {
    type: Number, // in minutes
    required: true
  },
  // REMOVED: totalTime (now handled as virtual only)
  spiceLevel: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  serves: {
    type: Number,
    min: 1,
    default: 4
  },
  specialTechniques: {
    type: [String],
    enum: [
      'dum-cooking', 'tandoor', 'fermentation',
      'tempering', 'slow-cooking', 'steaming'
    ]
  },
  utensilsRequired: {
    type: [String],
    enum: [
      'tawa', 'kadai', 'handi', 'appam-pan',
      'sil-batta', 'chakla-belan', 'pressure-cooker'
    ]
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastModified: {
    type: Date
  },
  ratings: {
    average: {
      type: Number,
      min: 1,
      max: 5,
      default: 4.5
    },
    count: {
      type: Number,
      default: 0
    }
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for total time (now the only place totalTime is defined)
recipeSchema.virtual('totalTime').get(function() {
  return this.prepTime + this.cookTime;
});

// Auto-update lastModified timestamp
recipeSchema.pre('save', function(next) {
  this.lastModified = Date.now();
  next();
});

// Text index for search
recipeSchema.index({
  title: 'text',
  description: 'text',
  'ingredients.name': 'text',
  tags: 'text'
}, {
  weights: {
    title: 10,
    'ingredients.name': 5,
    tags: 3,
    description: 1
  }
});

module.exports = mongoose.model('Recipe', recipeSchema);