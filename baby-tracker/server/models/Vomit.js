const mongoose = require('mongoose');

const vomitSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  severity: {
    type: String,
    enum: ['mild', 'moderate', 'severe'],
    default: 'moderate'
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for efficient date-based queries
vomitSchema.index({ date: -1 });

module.exports = mongoose.model('Vomit', vomitSchema);
