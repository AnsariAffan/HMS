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

module.exports = router;