const mongoose = require('mongoose');
const Patient = require('./models/Patient');
require('dotenv').config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log('✅ Connected to MongoDB. Deleting existing patients...');
    await Patient.deleteMany({});  // <-- Delete all existing patients

    console.log('Inserting patients...');
    const patients = [
      {
        patientId: 'IND001',
        name: 'Ravi Kumar',
        age: 34,
        gender: 'Male',
        contactInfo: { phone: '9876543210' },
        allergies: ['Pollen'],
        medicalHistory: ['Diabetes'],
        currentPrescriptions: ['Metformin'],
        doctorNotes: 'Regular checkup needed',
        visitDates: [new Date('2023-01-15')],
      },
      {
        patientId: 'IND002',
        name: 'Anita Singh',
        age: 28,
        gender: 'Female',
        contactInfo: { phone: '9123456789' },
        allergies: [],
        medicalHistory: ['Asthma'],
        currentPrescriptions: ['Inhaler'],
        doctorNotes: 'Monitor breathing',
        visitDates: [new Date('2023-03-20')],
      },
      // Add more patients here...
    ];

    const inserted = await Patient.insertMany(patients);
    console.log('✅ Patients inserted:', inserted.length);

    mongoose.connection.close();
  } catch (err) {
    console.error('❌ Error inserting patients:', err);
  }
}

seed();
