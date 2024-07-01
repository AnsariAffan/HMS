const NewEntry = require("../models/NewEntry");

exports.createNewEntry = async (req, res) => {
    try {
      // console.log(req.body)
        const { data } = req.body;
        console.log("Received data:", data);

        // Ensure data is defined
        if (!data || !data.AdharCard_Number) {
            return res.status(400).json({ message: "Invalid data format" });
        }

        // Check if there's already an existing entry with the same AdharCard_Number
        const existingEntry = await NewEntry.findOne({ AdharCard_Number: data.AdharCard_Number });

        if (existingEntry) {
            return res.json({ message: "Patient is already added" });
        } else {
            // Create a new entry
            const newDataEntry = new NewEntry({
                ...data,
                createdAt: new Date().toISOString(),
            });

            await newDataEntry.save();
            res.json({ message: "Patient added successfully" });
        }
    } catch (error) {
        console.error("Error creating new entry:", error);
        if (error.name === "MongoError" && error.code === 11000) {
            return res.status(400).json({ message: "Duplicate entry: This patient already exists" });
        }
        res.status(401).json({ message: "Something went wrong" });
    }
};
