const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  patientId: { type: String, required: true, unique: true, index: true }, // already indexed
  name: { type: String, required: true, index: true }, // already indexed
  age: Number,
  gender: String,
  contactInfo: {
    phone: String,
    email: String,
    address: String,
  },
  allergies: [String],
  medicalHistory: [{
    condition: String,
    diagnosedDate: Date,
    notes: String,
  }],
  prescriptions: [{
    medication: String,
    dosage: String,
    frequency: String,
    prescribedDate: Date,
  }],
  doctorNotes: [{
    doctorId: String,
    note: String,
    date: Date,
  }],
  appointments: [{
    date: Date,
    doctorId: String,
    reason: String,
  }],
  department: String,
}, { timestamps: true });

// ✅ Indexes for search optimization
patientSchema.index({ name: 1, "appointments.date": -1 }); // compound index
patientSchema.index({ "medicalHistory.condition": 1 });    // search by condition
patientSchema.index({ "appointments.date": -1 });          // sort/filter by visit date

module.exports = mongoose.model('Patient', patientSchema);
