const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('../routes/auth');

dotenv.config();

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/patientDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected')).catch(err => console.error(err));

// Use Auth Routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => res.send('API Running'));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
const patientRoutes = require('../routes/patientRoutes'); // make sure the path is correct

// Middleware
app.use(express.json());

// Use patient routes
app.use('/api', patientRoutes); // <- This mounts the /api/searchExplain route

// Start server
app.listen(5000, () => {
  console.log('Server started on port 5000');
});
