const express = require('express');
const router = express.Router();
const Vomit = require('../models/Vomit');

// Get all vomits (with optional date range)
router.get('/', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = {};
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    const vomits = await Vomit.find(query).sort({ date: -1, time: -1 });
    res.json(vomits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single vomit
router.get('/:id', async (req, res) => {
  try {
    const vomit = await Vomit.findById(req.params.id);
    if (!vomit) {
      return res.status(404).json({ message: 'Vomit record not found' });
    }
    res.json(vomit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new vomit record
router.post('/', async (req, res) => {
  const vomit = new Vomit({
    date: req.body.date,
    time: req.body.time,
    severity: req.body.severity,
    notes: req.body.notes
  });

  try {
    const newVomit = await vomit.save();
    res.status(201).json(newVomit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update vomit record
router.put('/:id', async (req, res) => {
  try {
    const vomit = await Vomit.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!vomit) {
      return res.status(404).json({ message: 'Vomit record not found' });
    }
    res.json(vomit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete vomit record
router.delete('/:id', async (req, res) => {
  try {
    const vomit = await Vomit.findByIdAndDelete(req.params.id);
    if (!vomit) {
      return res.status(404).json({ message: 'Vomit record not found' });
    }
    res.json({ message: 'Vomit record deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
