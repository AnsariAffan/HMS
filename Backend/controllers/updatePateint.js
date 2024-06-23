const newEntry = require("../models/NewEntry");


exports.updatePateint = async (req, res) => {
  try {
    const {id} = req.body.params;
    const allPateints = await newEntry.findById({ _id: id });
console.log(allPateints)

return res.send(allPateints)

  } catch (error) {
    res.status(404).json({ message: "Something went wrong" });
  }
};
