const AppointmentModel = require("../models/AppointmentModel");

// Create a new appointment
exports.createAppointment = async (req, res) => {
    try {
        const { doctorName, patientName, scheduledDateTime, status } = req.body;
        const appointment = new AppointmentModel({
            doctorName,
            patientName,
            scheduledDateTime,
            status
        });
        await appointment.save();
        res.status(201).json(appointment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all appointments
exports.getAllAppointments = async (req, res) => {
    try {
        const appointments = await AppointmentModel.find();
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single appointment by ID
exports.getAppointmentById = async (req, res) => {
    try {
        const appointment = await AppointmentModel.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        res.status(200).json(appointment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update an appointment by ID
exports.updateAppointment = async (req, res) => {
    try {
        const { doctorName, patientName, scheduledDateTime, status } = req.body;
        const appointment = await AppointmentModel.findByIdAndUpdate(
            req.params.id,
            { doctorName, patientName, scheduledDateTime, status },
            { new: true }
        );
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        res.status(200).json(appointment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete an appointment by ID
exports.deleteAppointment = async (req, res) => {
    try {
        const appointment = await AppointmentModel.findByIdAndDelete(req.params.id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        res.status(200).json({ message: 'Appointment deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
