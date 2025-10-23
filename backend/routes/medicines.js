const express = require('express');
const Medicine = require('../models/Medicine');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all medicines for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const medicines = await Medicine.find({ user: req.user._id }).sort({ time: 1 });
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add new medicine
router.post('/', auth, async (req, res) => {
  try {
    const { name, dosage, time, duration } = req.body;

    const medicine = new Medicine({
      user: req.user._id,
      name,
      dosage,
      time,
      duration
    });

    await medicine.save();
    res.status(201).json(medicine);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update medicine status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const medicine = await Medicine.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    medicine.status = status;
    if (status === 'taken') {
      medicine.takenAt = new Date();
    } else if (status === 'missed') {
      medicine.missedAt = new Date();
    }

    medicine.history.push({
      date: new Date(),
      status: status,
      actionTime: new Date()
    });

    await medicine.save();
    res.json(medicine);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get medication history
router.get('/history', auth, async (req, res) => {
  try {
    const medicines = await Medicine.find({ 
      user: req.user._id,
      $or: [
        { status: 'taken' },
        { status: 'missed' }
      ]
    }).sort({ updatedAt: -1 });

    const history = medicines.map(med => ({
      id: med._id,
      name: med.name,
      dosage: med.dosage,
      status: med.status,
      time: med.time,
      actionTime: med.status === 'taken' ? med.takenAt : med.missedAt,
      date: med.updatedAt
    }));

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete medicine
router.delete('/:id', auth, async (req, res) => {
  try {
    const medicine = await Medicine.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    res.json({ message: 'Medicine deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;