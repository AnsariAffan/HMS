const billingModel = require("../models/billingModel");



exports.getAllBills = async (req, res) => {
  try {

    const allBills = await billingModel.find();
console.log(allBills)

return res.send(allBills)

  } catch (error) {

    res.status(404).json({ message: "Something went wrong" });
    console.error("Error fetching patients:", error); // Log the actual error
    res.status(500).json({ message: "Something went wrong", error: error.message });

  }
};
