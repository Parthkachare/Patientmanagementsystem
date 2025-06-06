const Patient = require('../models/patientModel');

// Add new patient
exports.addPatient = async (req, res) => {
  try {
    const newPatient = new Patient(req.body);
    const savedPatient = await newPatient.save();
    res.status(201).json(savedPatient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Search patients with pagination & sorting
exports.searchPatients = async (req, res) => {
  try {
    const { patientId, name, condition, visitDate, page = 1, limit = 20 } = req.query;

    const query = {};

    if (patientId) query.patientId = patientId;
    if (name) query.name = { $regex: name, $options: 'i' };
    if (condition) query['medicalHistory.condition'] = { $regex: condition, $options: 'i' };
    if (visitDate) query['appointments.date'] = new Date(visitDate);

    const patients = await Patient.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Patient.countDocuments(query);

    res.json({ total, page: Number(page), limit: Number(limit), patients });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update patient record
exports.updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedPatient = await Patient.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updatedPatient) return res.status(404).json({ error: 'Patient not found' });
    res.json(updatedPatient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete patient record
exports.deletePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Patient.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Patient not found' });
    res.json({ message: 'Patient deleted successfully', patient: deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
try {
  const result = await Patient.create(req.body);
  res.status(201).json(result);
} catch (err) {
  console.error(err.message);
  res.status(500).json({ message: 'Server Error. Please try again later.' });
}
