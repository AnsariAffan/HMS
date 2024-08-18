const NewEntry = require("../models/NewEntry");

const generateUniqueID = async () => {
  try {
    // Fetch the last entry based on createdAt field
    const lastEntry = await NewEntry.findOne().sort({ createdAt: -1 }).limit(1);

    let newIdNumber = 1;
    if (lastEntry && lastEntry.customId) {
      const lastIdNumber = parseInt(lastEntry.customId.replace('PID-', ''), 10);
      newIdNumber = lastIdNumber + 1;
    }

    // Format the new ID as PID-XXX
    const newId = `PID-${String(newIdNumber).padStart(3, '0')}`;

    // Ensure the ID does not already exist
    const existingEntry = await NewEntry.findOne({ customId: newId });
    if (existingEntry) {
      return generateUniqueID(); // Retry generating a unique ID if collision occurs
    }

    return newId;
  } catch (error) {
    console.error("Error generating unique ID:", error);
    throw new Error("Error generating unique ID");
  }
};

module.exports = generateUniqueID;
