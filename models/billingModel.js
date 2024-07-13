const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the line item schema
const LineItemSchema = new Schema({
  key: { type: Number, required: true },
  srNo: { type: Number, required: true },
  qty: { type: String, required: true },
  amount: { type: String, required: true },
  discount: { type: String, required: true },
  // Add other necessary fields for line items
});

// Define the main bill schema
const BillSchema = new Schema({

  FIRST_NAME: { type: String, required: true },
  PaymentDueDate: { type: Date, required: true },
  Tax: { type: String, required: true },
  billDate: { type: Date, required: true },
  totalBillAmount: { type: String, default: undefined },
  lineItems: [LineItemSchema],
  patient_id: { type: Schema.Types.ObjectId, ref: 'Patient', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Bill', BillSchema);
