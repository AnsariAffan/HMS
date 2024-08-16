const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  Registration_Date: {
    type: Date,
    required: true,
  },
  First_Name: {
    type: String,
    required: true,
  },
  Last_Name: {
    type: String,
    required: false,
  },
  Date_of_Birth: {
    type: Date,
    required: true,
  },
  Specialization: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: false,
  },
  Contact_Number: {
    type: String,
    required: true,
  },
  Qualification: {
    type: String,
    required: false,
  },
  Experience: {
    type: String,
    required: false,
  },
  Address: {
    type: String,
    required: true,
  },
  License_Number: {
    type: String,
    required: false,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Doctor', DoctorSchema);
