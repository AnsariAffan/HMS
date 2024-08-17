// controllers/paymentController.js

const Payment = require("../models/payment");

// Create a new payment
exports.createPayment = async (req, res) => {
  try {
    const { paymentDate, paidAmount, billId } = req.body;

    // Find the latest payment for the given billId
    const lastPayment = await Payment.findOne({ billId })
      .sort({ paymentDate: -1 }) // Sort by paymentDate in descending order to get the latest
      .exec();

    let invoiceAmount;

    if (lastPayment) {
      // For the second and subsequent payments, use the previous openAmount as the new invoiceAmount
      invoiceAmount = lastPayment.openAmount;
    } else {
      // For the first payment, invoiceAmount should be provided
      invoiceAmount = req.body.invoiceAmount;
    }

    // Create a new payment instance
    const payment = new Payment({
      billId,
      paymentDate,
      invoiceAmount,
      paidAmount,
      openAmount: invoiceAmount - paidAmount,
    });

    // Save the payment to the database
    await payment.save();

    res.status(201).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all payments
exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find();
    res.status(200).json({
      success: true,
      data: payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete a payment by ID
exports.deletePayment = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the payment
    const payment = await Payment.findByIdAndDelete(id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Payment deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
