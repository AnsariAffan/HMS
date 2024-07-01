const express = require('express')
const { createNewEntry } = require('../controllers/createDataEntry')
const { getAllPateints } = require('../controllers/getAllPateints')
const { updatePateint } = require('../controllers/updatePateint')
const { updateNewEntry } = require('../controllers/updateNewEntry')
const { login } = require('../controllers/login')
const router = express.Router()

router.post("/createNewEntry",createNewEntry)
router.put("/updateNewEntry",updateNewEntry)
router.get("/getAllPateints",getAllPateints)
router.put("/updatePateint/:id",updatePateint)
router.post("/login",login)
module.exports = router