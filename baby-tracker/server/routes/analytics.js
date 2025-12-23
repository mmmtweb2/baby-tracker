const express = require('express');
const router = express.Router();
const Feeding = require('../models/Feeding');
const Vomit = require('../models/Vomit');

// Helper function to parse time string to minutes
const timeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

// Helper function to combine date and time for comparison
const combineDateTime = (date, time) => {
  const d = new Date(date);
  const [hours, minutes] = time.split(':').map(Number);
  d.setHours(hours, minutes, 0, 0);
  return d;
};

// Get correlation between food categories and vomiting
router.get('/category-correlation', async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const feedings = await Feeding.find({ date: { $gte: startDate } });
    const vomits = await Vomit.find({ date: { $gte: startDate } });

    // Count category occurrences before vomiting (within 4 hours)
    const categoryVomitCorrelation = {};
    const categoryTotalCount = {};

    // Initialize counters for all categories
    const allCategories = ['protein', 'carbs', 'vegetables', 'fruits', 'dairy', 'fats', 'other'];
    allCategories.forEach(cat => {
      categoryVomitCorrelation[cat] = 0;
      categoryTotalCount[cat] = 0;
    });

    // Count total occurrences of each category
    feedings.forEach(feeding => {
      feeding.categories.forEach(cat => {
        categoryTotalCount[cat] = (categoryTotalCount[cat] || 0) + 1;
      });
    });

    // For each vomit, find feedings within 4 hours before
    vomits.forEach(vomit => {
      const vomitDateTime = combineDateTime(vomit.date, vomit.time);
      
      feedings.forEach(feeding => {
        const feedingDateTime = combineDateTime(feeding.date, feeding.time);
        const hoursDiff = (vomitDateTime - feedingDateTime) / (1000 * 60 * 60);
        
        // If feeding was 0-4 hours before vomit
        if (hoursDiff >= 0 && hoursDiff <= 4) {
          feeding.categories.forEach(cat => {
            categoryVomitCorrelation[cat] = (categoryVomitCorrelation[cat] || 0) + 1;
          });
        }
      });
    });

    // Calculate correlation percentage
    const correlationData = allCategories.map(cat => ({
      category: cat,
      totalFeedings: categoryTotalCount[cat] || 0,
      feedingsBeforeVomit: categoryVomitCorrelation[cat] || 0,
      correlationPercent: categoryTotalCount[cat] > 0 
        ? Math.round((categoryVomitCorrelation[cat] / categoryTotalCount[cat]) * 100)
        : 0
    })).filter(item => item.totalFeedings > 0);

    res.json(correlationData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get average time between feeding and vomiting
router.get('/time-analysis', async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const feedings = await Feeding.find({ date: { $gte: startDate } });
    const vomits = await Vomit.find({ date: { $gte: startDate } });

    const timeGaps = [];

    // For each vomit, find the most recent feeding before it
    vomits.forEach(vomit => {
      const vomitDateTime = combineDateTime(vomit.date, vomit.time);
      let closestFeeding = null;
      let minGap = Infinity;

      feedings.forEach(feeding => {
        const feedingDateTime = combineDateTime(feeding.date, feeding.time);
        const gap = (vomitDateTime - feedingDateTime) / (1000 * 60); // in minutes
        
        if (gap > 0 && gap < minGap && gap <= 480) { // within 8 hours
          minGap = gap;
          closestFeeding = feeding;
        }
      });

      if (closestFeeding) {
        timeGaps.push({
          gap: minGap,
          categories: closestFeeding.categories,
          description: closestFeeding.description,
          severity: vomit.severity
        });
      }
    });

    // Calculate statistics
    const avgGap = timeGaps.length > 0 
      ? Math.round(timeGaps.reduce((sum, t) => sum + t.gap, 0) / timeGaps.length)
      : 0;

    // Group by time ranges
    const timeRanges = {
      '0-30 דקות': 0,
      '30-60 דקות': 0,
      '1-2 שעות': 0,
      '2-4 שעות': 0,
      '4+ שעות': 0
    };

    timeGaps.forEach(({ gap }) => {
      if (gap <= 30) timeRanges['0-30 דקות']++;
      else if (gap <= 60) timeRanges['30-60 דקות']++;
      else if (gap <= 120) timeRanges['1-2 שעות']++;
      else if (gap <= 240) timeRanges['2-4 שעות']++;
      else timeRanges['4+ שעות']++;
    });

    res.json({
      averageGapMinutes: avgGap,
      totalVomitsAnalyzed: timeGaps.length,
      timeRangeDistribution: Object.entries(timeRanges).map(([range, count]) => ({
        range,
        count
      })),
      details: timeGaps
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get hourly pattern analysis
router.get('/hourly-pattern', async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const feedings = await Feeding.find({ date: { $gte: startDate } });
    const vomits = await Vomit.find({ date: { $gte: startDate } });

    // Initialize hourly data
    const hourlyData = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      feedings: 0,
      vomits: 0
    }));

    // Count feedings per hour
    feedings.forEach(feeding => {
      const hour = parseInt(feeding.time.split(':')[0]);
      hourlyData[hour].feedings++;
    });

    // Count vomits per hour
    vomits.forEach(vomit => {
      const hour = parseInt(vomit.time.split(':')[0]);
      hourlyData[hour].vomits++;
    });

    res.json(hourlyData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get daily summary for timeline
router.get('/daily-summary', async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const feedings = await Feeding.find({ date: { $gte: startDate } }).sort({ date: 1, time: 1 });
    const vomits = await Vomit.find({ date: { $gte: startDate } }).sort({ date: 1, time: 1 });

    // Create timeline events
    const events = [
  ...feedings.map(f => ({
    type: 'feeding',
    _id: f._id,
    date: f.date,
    time: f.time,
    data: {
      description: f.description,
      categories: f.categories,
      amount: f.amount
    }
  })),
  ...vomits.map(v => ({
    type: 'vomit',
    _id: v._id,
    date: v.date,
    time: v.time,
    data: {
      severity: v.severity,
      notes: v.notes
    }
  }))
].sort((a, b) => {
      const dateA = combineDateTime(a.date, a.time);
      const dateB = combineDateTime(b.date, b.time);
      return dateB - dateA;
    });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get food description analysis - which specific foods appear most before vomiting
router.get('/food-analysis', async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const feedings = await Feeding.find({ date: { $gte: startDate } });
    const vomits = await Vomit.find({ date: { $gte: startDate } });

    const foodBeforeVomit = {};
    const foodTotalCount = {};

    // Count total occurrences of each food description
    feedings.forEach(feeding => {
      const desc = feeding.description.toLowerCase().trim();
      foodTotalCount[desc] = (foodTotalCount[desc] || 0) + 1;
    });

    // For each vomit, find feedings within 4 hours before
    vomits.forEach(vomit => {
      const vomitDateTime = combineDateTime(vomit.date, vomit.time);
      
      feedings.forEach(feeding => {
        const feedingDateTime = combineDateTime(feeding.date, feeding.time);
        const hoursDiff = (vomitDateTime - feedingDateTime) / (1000 * 60 * 60);
        
        if (hoursDiff >= 0 && hoursDiff <= 4) {
          const desc = feeding.description.toLowerCase().trim();
          foodBeforeVomit[desc] = (foodBeforeVomit[desc] || 0) + 1;
        }
      });
    });

    // Calculate and sort by correlation
    const foodAnalysis = Object.keys(foodTotalCount)
      .map(food => ({
        food,
        totalOccurrences: foodTotalCount[food],
        beforeVomit: foodBeforeVomit[food] || 0,
        correlationPercent: Math.round(((foodBeforeVomit[food] || 0) / foodTotalCount[food]) * 100)
      }))
      .filter(item => item.totalOccurrences >= 2) // Only show foods that appeared at least twice
      .sort((a, b) => b.correlationPercent - a.correlationPercent);

    res.json(foodAnalysis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
