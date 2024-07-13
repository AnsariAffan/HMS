// models/NewEntry.js

const mongoose = require('mongoose');

const NewEntrySchema = new mongoose.Schema({
  Ragistration_Date: { type: String },
  First_Name: { type: String },
  Middle_Name: { type: String },
  Last_Name: { type: String },
  Date_of_Birth: { type: String },
  Material_Status: { type: String },
  Emergency_Contact_Name: { type: String },
  Emergency_Contact_Number: { type: String },
  Gender: { type: String },
  Email: { type: String },
  Religion: { type: String },
  Contact_Number: { type: String },
  Permanent_address: { type: String },
  Occopation: { type: String },
  AdharCard_Number: { type: String, unique: true },
  PadCard_Number: { type: String },
  Insurance_Provider: { type: String },
  Insurance_Policy_Number: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('pateintDB', NewEntrySchema);
