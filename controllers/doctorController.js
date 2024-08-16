const Doctor = require('../models/doctor');

// Get all doctors
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json({ data: doctors });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctors', error });
  }
};

// Get doctor by ID
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.status(200).json({ data: doctor });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctor', error });
  }
};

// Create a new doctor
exports.createDoctor = async (req, res) => {
  try {
    const { Email } = req.body;

    // Check for duplicate Email or License Number
    const existingDoctor = await Doctor.findOne({
      $or: [{ Email }]
    });

    if (existingDoctor) {
      return res.status(400).json({ 
        message: 'Doctor with the same Email already exists' 
      });
    }

    const newDoctor = new Doctor(req.body);
    const savedDoctor = await newDoctor.save();

    res.status(201).json({ message: 'Doctor created successfully', data: savedDoctor });
  } catch (error) {
    res.status(500).json({ message: 'Error creating doctor', error });
  }
};


//update doctor
exports.updateDoctor = async (req, res) => {
  try {
    const { id } = req.params; // Extract ID from URL parameters
    const { Email, License_Number } = req.body;

    // Check for duplicate Email or License Number, excluding the current record
    const existingDoctor = await Doctor.findOne({
      $or: [{ Email }, { License_Number }],
      _id: { $ne: id } // Exclude the current doctor's ID
    });

    if (existingDoctor) {
      return res.status(400).json({
        message: `Another doctor with the same ${existingDoctor.Email === Email ? 'Email' : 'License Number'} already exists`
      });
    }

    // Proceed with the update if no duplicates are found
    const updatedDoctor = await Doctor.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedDoctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.status(200).json({ message: 'Doctor updated successfully', data: updatedDoctor });
  } catch (error) {
    res.status(500).json({ message: 'Error updating doctor', error });
  }
};


// Delete a doctor
exports.deleteDoctor = async (req, res) => {
  try {
    const deletedDoctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!deletedDoctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.status(200).json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting doctor', error });
  }
};
