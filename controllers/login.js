const User = require("../models/userloginModel");

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log("Received login request:", username);

        // Ensure username and password are provided
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        // Check if the user exists
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        // Check if the password is correct
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        // If credentials are correct, send a success response
        res.json({ message: "Login successful" });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};
