const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the line item schema
const LineItemSchema = new Schema({
  key: { type: Number, required: false },
  srNo: { type: Number, required: false },
  qty: { type: String, required: false },
  amount: { type: String, required: false },
  discount: { type: String, required: false },
  netAmount: { type: String, required: false },
  itemName:{type:[], required: false }
  // Add other necessary fields for line items
});

// Define the main bill schema
const BillSchema = new Schema({

  FIRST_NAME: { type: String, required: false },
  PaymentDueDate: { type: Date, required: false },
  Tax: { type: String, required: false },
  billDate: { type: Date, required: false },
  totalBillAmount: { type: String, default: undefined },
  lineItems: [LineItemSchema],
  Contact_Number:{
    type:String
  },
  patient_id: { type: Schema.Types.ObjectId, ref: 'Patient', required: false }
}, { timestamps: true });

module.exports = mongoose.model('Bill', BillSchema);
