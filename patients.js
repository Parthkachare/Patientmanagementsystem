const express = require('express');
const router = express.Router();
const path = require('path');
const Patient = require('../models/Patient');
const authenticateToken = require('../middleware/auth');

// ✅ Protect all routes below this line
router.use(authenticateToken);

// ✅ Serve add patient form
router.get('/add', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/addPatient.html'));
});

// ✅ Pagination + sorting
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'patientId' } = req.query;

    const patients = await Patient.find()
      .sort({ [sort]: 1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Patient.countDocuments();

    res.json({
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      patients,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Combined search filters
router.get('/search', async (req, res) => {
  try {
    const { name, gender, condition, visitDate, ageFrom, ageTo } = req.query;
    const query = {};

    if (name) query.name = new RegExp(name, 'i');
    if (condition) query.condition = new RegExp(condition, 'i');
    if (gender) query.gender = gender;
    if (visitDate) {
      query.visitDates = {
        $gte: new Date(visitDate),
        $lte: new Date(visitDate + 'T23:59:59Z'),
      };
    }
    if (ageFrom || ageTo) {
      query.age = {};
      if (ageFrom) query.age.$gte = parseInt(ageFrom);
      if (ageTo) query.age.$lte = parseInt(ageTo);
    }

    const patients = await Patient.find(query).limit(100);
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: 'Search failed', details: err.message });
  }
});

// ✅ Add patient
router.post('/add', async (req, res) => {
  try {
    const {
      patientId,
      name,
      age,
      gender,
      contactInfo,
      allergies,
      medicalHistory,
      currentPrescriptions,
      doctorNotes,
      visitDates
    } = req.body;

    // Validation
    if (!patientId || !name) {
      return res.status(400).json({ message: 'patientId and name are required.' });
    }
    if (!/^[a-zA-Z0-9]+$/.test(patientId)) {
      return res.status(400).json({ message: 'Patient ID must be alphanumeric without spaces.' });
    }
    if (age !== undefined && (age < 0 || age > 120)) {
      return res.status(400).json({ message: 'Age must be between 0 and 120.' });
    }
    if (contactInfo?.phone && !/^\+?\d{7,15}$/.test(contactInfo.phone)) {
      return res.status(400).json({ message: 'Phone number is invalid.' });
    }

    const newPatient = new Patient({
      patientId,
      name,
      age,
      gender,
      contactInfo,
      allergies,
      medicalHistory,
      currentPrescriptions,
      doctorNotes,
      visitDates
    });

    await newPatient.save();

    res.status(201).json({ message: 'Patient added successfully', patient: newPatient });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Patient ID must be unique.' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Update patient
router.put('/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    const updateData = req.body;

    const updatedPatient = await Patient.findOneAndUpdate(
      { patientId },
      { $set: updateData },
      { new: true }
    );

    if (!updatedPatient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json({ message: 'Patient updated', patient: updatedPatient });
  } catch (error) {
    res.status(500).json({ message: 'Server error during update' });
  }
});

// ✅ Delete patient
router.delete('/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;

    const deletedPatient = await Patient.findOneAndDelete({ patientId });

    if (!deletedPatient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error during delete' });
  }
});

// ✅ Aggregation: Patients per condition
router.get('/analytics/conditions', async (req, res) => {
  try {
    const result = await Patient.aggregate([
      { $unwind: "$medicalHistory" },
      { $group: { _id: "$medicalHistory", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Aggregation failed' });
  }
});

// ✅ Aggregation: Most prescribed medications
router.get('/analytics/prescriptions', async (req, res) => {
  try {
    const result = await Patient.aggregate([
      { $unwind: "$currentPrescriptions" },
      { $group: { _id: "$currentPrescriptions", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Aggregation failed' });
  }
});

// ✅ Aggregation: Average age
router.get('/analytics/average-age', async (req, res) => {
  try {
    const result = await Patient.aggregate([
      { $match: { age: { $exists: true, $ne: null } } },
      { $group: { _id: null, averageAge: { $avg: "$age" } } }
    ]);
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: 'Aggregation failed' });
  }
});

module.exports = router;
