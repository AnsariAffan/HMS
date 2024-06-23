const NewEntry = require("../models/NewEntry");

exports.updateNewEntry = async (req, res) => {
    try {
        const { data } = req.body;
        console.log("Received data:", data);

        // Ensure data is defined
        if (!data || !data.AdharCard_Number) {
            return res.status(400).json({ message: "Invalid data format" });
        }

        // Find the entry by AdharCard_Number
        const existingEntry = await NewEntry.findOne({ AdharCard_Number: data.AdharCard_Number });

        if (!existingEntry) {
            return res.status(404).json({ message: "Patient not found" });
        } else {
            // Update the entry with the new data
            const updatedData = {
                ...data,
                updatedAt: new Date().toISOString(), // Optionally track the update time
            };

            await NewEntry.updateOne({ AdharCard_Number: data.AdharCard_Number }, updatedData);

            res.json({ message: "Patient updated successfully" });
        }
    } catch (error) {
        console.error("Error updating entry:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};
