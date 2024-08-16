const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    patientName: {
        type: String,
        required: true
    },
    doctorName: {
        type: String,
        required: true
    },
   
    scheduledDateTime: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Scheduled', 'Completed', 'Cancelled', 'Rescheduled'],
        default: 'Scheduled'
    }
}, {
    timestamps: true
});



module.exports = mongoose.model('Appointment', appointmentSchema);;
