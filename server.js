const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require("path");

dotenv.config();
const app = express();

// Middleware
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/healthcare', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Sample route
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

//frontend
app.use(express.static(path.join(__dirname, "frontend")));
const authRoutes = require('../routes/auth');
const patientRoutes = require('../routes/patientRoutes');
const analyticsRoutes = require('../routes/analytics');

app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/analytics', analyticsRoutes);

