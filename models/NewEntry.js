// models/NewEntry.js

const mongoose = require('mongoose');

const NewEntrySchema = new mongoose.Schema({
  Ragistration_Date: { type: String },
  First_Name: { type: String },
  Middle_Name: { type: String },
  Last_Name: { type: String },
  Date_of_Birth: { type: String },
  Material_Status: { type: String },
  Age: { type: String },
  Year: { type: String },
  Gender: { type: String },
  Nationality: { type: String },
  Religion: { type: String },
  Contact_Number: { type: String },
  Permanent_address: { type: String },
  Occopation: { type: String },
  AdharCard_Number: { type: String, unique: true },
  PadCard_Number: { type: String },
  Self_Annual_Income: { type: String },
  Familty_Annual_Income: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('pateintDB', NewEntrySchema);
