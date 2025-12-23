const express = require('express');
const router = express.Router();
const Feeding = require('../models/Feeding');

// Get all feedings (with optional date range)
router.get('/', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = {};
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    const feedings = await Feeding.find(query).sort({ date: -1, time: -1 });
    res.json(feedings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single feeding
router.get('/:id', async (req, res) => {
  try {
    const feeding = await Feeding.findById(req.params.id);
    if (!feeding) {
      return res.status(404).json({ message: 'Feeding not found' });
    }
    res.json(feeding);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new feeding
router.post('/', async (req, res) => {
  const feeding = new Feeding({
    date: req.body.date,
    time: req.body.time,
    description: req.body.description,
    categories: req.body.categories,
    amount: req.body.amount,
    notes: req.body.notes
  });

  try {
    const newFeeding = await feeding.save();
    res.status(201).json(newFeeding);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update feeding
router.put('/:id', async (req, res) => {
  try {
    const feeding = await Feeding.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!feeding) {
      return res.status(404).json({ message: 'Feeding not found' });
    }
    res.json(feeding);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete feeding
router.delete('/:id', async (req, res) => {
  try {
    const feeding = await Feeding.findByIdAndDelete(req.params.id);
    if (!feeding) {
      return res.status(404).json({ message: 'Feeding not found' });
    }
    res.json({ message: 'Feeding deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
