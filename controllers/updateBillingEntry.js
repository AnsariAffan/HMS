const billingModel = require("../models/billingModel");
const NewEntry = require("../models/NewEntry");

exports.updateBillingEntry = async (req, res) => {
    try {
        const { headerData, tableData } = req.body;
        console.log("Received header data:", headerData);
        console.log("Received table data:", tableData);

        // Ensure headerData and tableData are defined
        if (!headerData || !headerData._id) {
            return res.status(400).json({ message: "Invalid header data format" });
        }
        if (!tableData || !Array.isArray(tableData)) {
            return res.status(400).json({ message: "Invalid table data format" });
        }

        // Find the billing entry by its ID
        const existingEntry = await billingModel.findById(headerData._id);
        if (!existingEntry) {
            return res.status(404).json({ message: "Billing entry not found" });
        }

        // Check if patient exists if the patient_id is provided
        if (headerData.patient_id) {
            const patient = await NewEntry.findById(headerData.patient_id);
            if (!patient) {
                return res.status(404).json({ message: "Patient not found" });
            }
        }

        // Update the billing entry with the new header data and line items
        const updatedData = {
            ...headerData,
            lineItems: tableData,
            updatedAt: new Date().toISOString(), // Optionally track the update time
        };

        await billingModel.findByIdAndUpdate(headerData._id, updatedData, { new: true });

        res.json({ message: "Billing entry updated successfully" });
    } catch (error) {
        console.error("Error updating billing entry:", error);
        if (error.name === "MongoError" && error.code === 11000) {
            return res.status(400).json({ message: "Duplicate entry: This bill already exists" });
        }
        res.status(500).json({ message: "Something went wrong" });
    }
};
