const billingModel = require("../models/billingModel");
const NewEntry = require("../models/NewEntry");

exports.createBillingEntry = async (req, res) => {
    try {
        const { headerData, tableData } = req.body;
        console.log("Received header data:", headerData);
        console.log("Received table data:", tableData);

        // Ensure headerData and tableData are defined
        if (!headerData || !headerData.patient_id) {
            return res.status(400).json({ message: "Invalid header data format" });
        }
        if (!tableData || !Array.isArray(tableData) || tableData.length === 0) {
            return res.status(400).json({ message: "Invalid table data format" });
        }

        // Check if patient exists
        const patient = await NewEntry.findById(headerData.patient_id);
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        // Check if there's already an existing entry with the same Bill_ID
        const existingEntry = await billingModel.findOne();
        if (existingEntry) {
            return res.json({ message: "Bill is already added" });
        } else {
            // Create a new billing entry
            const newBillingEntry = new billingModel({
                ...headerData,
                lineItems: tableData,
                createdAt: new Date().toISOString(),
            });

            await newBillingEntry.save();
            res.json({ message: "Bill added successfully" });
        }
    } catch (error) {
        console.error("Error creating billing entry:", error);
        if (error.name === "MongoError" && error.code === 11000) {
            return res.status(400).json({ message: "Duplicate entry: This bill already exists" });
        }
        res.status(401).json({ message: "Something went wrong" });
    }
};