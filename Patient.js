const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  patientId: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true, index: true },
  age: Number,
  gender: String,
  contactInfo: {
    phone: String,
    email: String,
    address: String,
  },
  allergies: [String],
  medicalHistory: [String], // e.g., diagnoses
  currentPrescriptions: [String],
  doctorNotes: String,
  visitDates: [Date]
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
