const billingModel = require("../models/billingModel");

exports.updateBillingEntry = async (req, res) => {
    try {
        const { data } = req.body;
        console.log("Received data:", data);

        // Ensure data is defined and has a valid ID
        if (!data || !data._id) {
            return res.status(400).json({ message: "Invalid data format" });
        }

        // Find the billing entry by its ID
        const existingEntry = await billingModel.findById(data._id);

        if (!existingEntry) {
            return res.status(404).json({ message: "Billing entry not found" });
        } else {
            // Update the entry with the new data
            const updatedData = {
                ...data,
                updatedAt: new Date().toISOString(), // Optionally track the update time
            };

            await billingModel.findByIdAndUpdate(data._id, updatedData, { new: true });

            res.json({ message: "Billing entry updated successfully" });
        }
    } catch (error) {
        console.error("Error updating billing entry:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};
