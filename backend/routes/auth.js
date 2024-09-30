const express = require('express');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator'); // Import validationResult

// Create a User using: POST '/api/auth/'. Doesn't require Auth
router.post('/createuser', [
    body('Username', 'Enter a valid Username').isLength({ min: 4 }),
    body('Email', 'Enter a valid Email').isEmail(),
    body('Phone_Number', 'Enter a valid Phone number').isLength({ min: 10, max: 10 }).isNumeric(),
    body('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
], async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Check whether the user exists already
        let existingUser = await User.findOne({
            $or: [
                { Email: req.body.Email.toLowerCase() }, // Normalize email to lowercase
                { Phone_Number: req.body.Phone_Number } // Ensure the casing matches
            ]
        });

        // If user exists, return an error message
        if (existingUser) {
            return res.status(400).json({ error: "Email or phone number already exists!" });
        }

        // Hash the password before saving it
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Create the new user
        const newUser = await User.create({
            Username: req.body.Username,
            Email: req.body.Email,
            password: hashedPassword, // Store the hashed password
            Phone_Number: req.body.Phone_Number,
        });

        // Return the success message along with the new user data
        res.json({ message: "User created successfully", newUser });
    } catch (error) {
        console.error('Error:', error); // Log any error that occurs
        res.status(500).send({ error: "Internal Server Error" });
    }
});

module.exports = router;
