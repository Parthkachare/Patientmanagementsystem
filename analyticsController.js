const Patient = require('../models/patientModel');

// Patients per condition
exports.patientsPerCondition = async (req, res) => {
  try {
    const result = await Patient.aggregate([
      { $unwind: '$medicalHistory' },
      { $group: { _id: '$medicalHistory.condition', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Most prescribed medications
exports.mostPrescribedMedications = async (req, res) => {
  try {
    const result = await Patient.aggregate([
      { $unwind: '$prescriptions' },
      { $group: { _id: '$prescriptions.medication', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Average age per department
exports.averageAgePerDepartment = async (req, res) => {
  try {
    const result = await Patient.aggregate([
      { $group: { _id: '$department', averageAge: { $avg: '$age' } } },
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Visits frequency per month
exports.visitsPerMonth = async (req, res) => {
  try {
    const result = await Patient.aggregate([
      { $unwind: '$appointments' },
      {
        $group: {
          _id: {
            year: { $year: '$appointments.date' },
            month: { $month: '$appointments.date' },
          },
          totalVisits: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
