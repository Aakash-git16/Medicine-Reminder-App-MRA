const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  dosage: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['upcoming', 'taken', 'missed'],
    default: 'upcoming'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  takenAt: {
    type: Date
  },
  missedAt: {
    type: Date
  },
  history: [{
    date: Date,
    status: String,
    actionTime: Date
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Medicine', medicineSchema);