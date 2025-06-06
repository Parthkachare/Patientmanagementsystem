const express = require('express');
const router = express.Router();
const Patient = require('../models/patient');

// Number of patients per condition
router.get('/patients-per-condition', async (req, res) => {
  try {
    const result = await Patient.aggregate([
      { $unwind: "$medicalHistory" },
      { $group: { _id: "$medicalHistory.condition", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.send(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

module.exports = router;
router.get('/searchExplain', async (req, res) => {
  try {
    const query = { name: { $regex: req.query.name || '', $options: 'i' } };
    const explanation = await Patient.find(query).explain('executionStats');
    res.json(explanation);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Error explaining the query' });
  }
});
