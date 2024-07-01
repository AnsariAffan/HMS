const User = require("../models/userloginModel");


exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;
console.log(username, password );
        // Validate if username and password are provided
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        // Check if the user already exists
        let existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Create a new user
        const newUser = new User({ username, password });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Failed to register user' });
    }
};
