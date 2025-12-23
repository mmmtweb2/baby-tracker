const mongoose = require('mongoose');

const feedingSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  categories: [{
    type: String,
    enum: ['protein', 'carbs', 'vegetables', 'fruits', 'dairy', 'fats', 'formula', 'other']
  }],
  amount: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for efficient date-based queries
feedingSchema.index({ date: -1 });

module.exports = mongoose.model('Feeding', feedingSchema);
