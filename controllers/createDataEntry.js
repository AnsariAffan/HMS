const NewEntry = require("../models/NewEntry");
const generateUniqueID = require("../utils/idGenerator");

exports.createNewEntry = async (req, res) => {
  try {
    const { data } = req.body;
    console.log("Received data:", data);

    if (!data || !data.AdharCard_Number) {
      return res.status(400).json({ message: "Invalid data format or missing AdharCard_Number" });
    }

    // Check if a patient with the same `AdharCard_Number` already exists
    const existingEntry = await NewEntry.findOne({ AdharCard_Number: data.AdharCard_Number });

    if (existingEntry) {
      return res.json({ message: "Patient is already added" });
    } else {
      // Generate a new custom ID
      const newCustomId = await generateUniqueID();

      // Create a new entry with the received data and the generated custom ID
      const newDataEntry = new NewEntry({
        ...data,
        customId: newCustomId,
        createdAt: new Date().toISOString(),
      });

      await newDataEntry.save();
      return res.json({ message: "Patient added successfully" });
    }
  } catch (error) {
    console.error("Error creating new entry:", error);
    if (error.name === "MongoError" && error.code === 11000) {
      return res.status(400).json({ message: "Duplicate entry: This patient already exists" });
    }
    return res.status(500).json({ message: "Something went wrong" });
  }
};
