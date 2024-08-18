const NewEntry = require("../models/NewEntry");


const generateUniqueID = async () => {
  // Fetch the last used ID from the database
  const lastEntry = await NewEntry.findOne().sort({ createdAt: -1 }).limit(1);
  
  // Extract the last ID number and increment it
  let newIdNumber = 1;
  if (lastEntry && lastEntry.customId) {
    const lastIdNumber = parseInt(lastEntry.customId.replace('PID-', ''), 10);
    newIdNumber = lastIdNumber + 1;
  }

  // Format the new ID as PID-XXX
  const newId = `PID-${String(newIdNumber).padStart(3, '0')}`;
  return newId;
};

module.exports = generateUniqueID;
