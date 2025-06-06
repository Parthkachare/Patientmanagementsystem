const { body } = require('express-validator');

exports.validatePatient = [
  body('patientID').notEmpty().withMessage('Patient ID is required'),
  body('name').notEmpty().withMessage('Name is required'),
  body('age').isInt({ min: 0 }).withMessage('Age must be a non-negative number'),
  body('gender').isIn(['Male', 'Female', 'Other']).withMessage('Invalid gender'),
  body('contact').isMobilePhone().withMessage('Invalid phone number'),
  // Add more validations as needed
];
