// models/Payment.js

const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  billId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bill', // Assuming you have a Bill model
    required: true,
  },
  paymentDate: {
    type: Date,
    required: true,
  },
  invoiceAmount: {
    type: Number,
    required: true,
  },
  paidAmount: {
    type: Number,
    required: true,
  },
  openAmount: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['fullyPaid', 'partiallyPaid'],
    required: true,
  },
});

paymentSchema.pre('validate', function(next) {
  // Automatically update the paymentStatus based on the openAmount
  this.openAmount = this.invoiceAmount - this.paidAmount;
  this.paymentStatus = this.openAmount === 0 ? 'fullyPaid' : 'partiallyPaid';
  next();
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
