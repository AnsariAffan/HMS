const newEntry = require("../models/NewEntry");


exports.getAllPateints = async (req, res) => {
  try {
    
    console.log("test")
    const allPateints = await newEntry.find();
console.log(allPateints)

return res.send(allPateints)

  } catch (error) {
    res.status(404).json({ message: "Something went wrong" });
  }
};
