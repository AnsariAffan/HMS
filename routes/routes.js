const express = require('express');
const { createNewEntry } = require('../controllers/createDataEntry');
const { getAllPateints } = require('../controllers/getAllPateints');
const { updatePateint } = require('../controllers/updatePateint');
const { updateNewEntry } = require('../controllers/updateNewEntry');
const { login } = require('../controllers/login');
const { register } = require('../controllers/register');
const authMiddleware = require('../middleware/authMiddleware');
const { createBillingEntry } = require('../controllers/Billing');
const { getAllBills } = require('../controllers/getAllBills');
const { updateBillingEntry } = require('../controllers/updateBillingEntry');
const { getAllDoctors, deleteDoctor, updateDoctor, createDoctor, getDoctorById} = require("../controllers/doctorController");
const { createAppointment, getAllAppointments, deleteAppointment } = require('../controllers/Appointment');
const { createPayment, getPayments, deletePayment } = require('../controllers/paymentController');


const router = express.Router();

// Public routes
router.post("/login", login);
router.post("/register", register);

// Protected routes
router.post("/createNewEntry", authMiddleware, createNewEntry);
router.put("/updateNewEntry", authMiddleware, updateNewEntry);   
router.get("/getAllPateints", authMiddleware,getAllPateints);
router.put("/updatePateint/:id", authMiddleware, updatePateint);
router.post("/createNewBill",authMiddleware,createBillingEntry);
router.get("/getAllBills", authMiddleware,getAllBills);
router.put("/updateBill", authMiddleware,updateBillingEntry);


// Get all doctors
router.get('/getAlldoctors', getAllDoctors);

// Create a new doctor
router.post('/createDoctors', createDoctor);
// Update a doctor
router.put('/updateDoctors/:id', updateDoctor);
// Delete a doctor
router.delete('/deleteDoctor/:id', deleteDoctor);



//appointment
router.post('/createAppointment', createAppointment);
router.get('/getAllAppointments', getAllAppointments);
router.get('/deleteAppointment', deleteAppointment);

//payment

router.post('/createPayment', createPayment);
router.get('/getPayments', getPayments);
router.delete('/payments/:id',deletePayment);
module.exports = router;