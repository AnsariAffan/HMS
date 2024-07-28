const billingModel = require("../models/billingModel");
const NewEntry = require("../models/NewEntry");



exports.updateBillingEntry = async (req, res) => {
    try {
        const { billingId, headerData, tableData } = req.body;

        console.log("Received billing ID:", billingId);
        console.log("Received header data:", headerData);
        console.log("Received table data:", tableData);

        // Ensure billingId, headerData, and tableData are defined
        if (!billingId) {
            return res.status(400).json({ message: "Billing ID is required" });
        }
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

        // Find and update the billing entry
        const updatedBillingEntry = await billingModel.findByIdAndUpdate(
            billingId,
            {
                ...headerData,
                lineItems: tableData,
                updatedAt: new Date().toISOString(),
            },
            { new: true }
        );

        if (!updatedBillingEntry) {
            return res.status(404).json({ message: "Billing entry not found" });
        }

        res.json({ message: "Bill updated successfully", data: updatedBillingEntry });
    } catch (error) {
        console.error("Error updating billing entry:", error);
        if (error.name === "MongoError" && error.code === 11000) {
            return res.status(400).json({ message: "Duplicate entry: This bill already exists" });
        }
        res.status(401).json({ message: "Something went wrong" });
    }
};
