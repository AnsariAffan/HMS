const newEntry = require("../models/NewEntry");


exports.getAllPateints = async (req, res) => {
  try {
    

    const allPateints = await newEntry.find();
console.log(allPateints)

return res.send(allPateints)

  } catch (error) {

    res.status(404).json({ message: "Something went wrong" });

    console.error("Error fetching patients:", error); // Log the actual error
    res.status(500).json({ message: "Something went wrong", error: error.message });

  }
};
