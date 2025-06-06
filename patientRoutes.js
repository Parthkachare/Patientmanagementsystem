exports.searchPatients = async (req, res) => {
  try {
    const q = req.query.q || '';
    const regex = new RegExp(q, 'i'); // case-insensitive
    const patients = await Patient.find({
      $or: [
        { name: regex },
        { patientId: regex },
        { condition: regex }
      ]
    });
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: 'Failed to search patients' });
  }
};
