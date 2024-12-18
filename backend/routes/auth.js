const express = require('express');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const User = require('../models/User');
const VerificationToken = require('../models/verificationToken');
const router = express.Router();
const { body, validationResult } = require('express-validator'); // Import validationResult
const jwt = require('jsonwebtoken');
const { generateOTP } = require('../utils/mail');
const JWT_SECRET = 'OurWebAppIsWorking@100';

// ROUTE 1: Create a User using: POST '/api/auth/createuser'. Doesn't require Auth
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
        const { Username, Email, Phone_Number, password } = req.body;

        let existingUser = await User.findOne({
            $or: [
                { Email: Email.toLowerCase() }, // Normalize email to lowercase
                { Phone_Number: Phone_Number } // Ensure the casing matches
            ]
        });

        // If user exists, return an error message
        if (existingUser) {
            return res.status(400).json({ error: "Email or phone number already exists!" });
        }

        // Hash the password before saving it
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the new user
        const newUser = await User.create({
            Username,
            Email,
            password: hashedPassword, // Store the hashed password
            Phone_Number,
        });

        // Generate OTP
        const OTP = generateOTP();
        console.log('Generated OTP:', OTP); // For debugging purposes, remove in production

        // Create and save verification token
        const verificationToken = new VerificationToken({
            owner: newUser._id, // Link token to the new user
            token: OTP, // Store the generated OTP
        });

        await verificationToken.save(); // Save the token in the database

        // Send success response
        res.status(201).json({
            message: "User created successfully. Verification OTP generated.",
            user: {
                id: newUser._id,
                email: newUser.Email,
            },
            OTP, // Send OTP only for testing/debugging; remove in production
        });
    } catch (error) {
        console.error('Error during user creation:', error.message);
        res.status(500).send({ error: "Internal Server Error" });
    }
});

module.exports = router;


// ROUTE 2: authenticate a User using: POST '/api/auth/login'. Doesn't require login

router.post('/login', [
    
    // Custom validation to check if either Email or Phone_Number is provided
    body('Email').optional({ checkFalsy: true }).isEmail().withMessage('Enter a valid Email'),
    body('Phone_Number').optional({ checkFalsy: true }).isLength({ min: 10, max: 10 }).isNumeric().withMessage('Enter a valid Phone number'),
    body('password', 'Password cannot be blank').exists(),
], async (req, res) => {

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    //when correct email  and password is entered we will use destructuring to find email/phonenumber fom body 

    const {Email, Phone_Number, password} = req.body;
    // using try and promise to find the credential's entered user is exists or not 
    try {
        let user;

        // Check if the email or phone number is provided and search accordingly
        if (Email) {
            user = await User.findOne({ Email: Email.toLowerCase() });
            if(!user){
                return res.status(400).json({error: "Please try to login with correct credentials"})
            }
        } else if (Phone_Number) {
            user = await User.findOne({ Phone_Number });
            if(!user){
                return res.status(400).json({error: "Please try to login with correct credentials"})
            }
        }

        const passwordcompare = await bcrypt.compare(password, user.password);
        if(!passwordcompare){
            return res.status(400).json({error: "Please try to login with correct credentials"})
        }


        const data = {
            User: {
                id: user._id
            }
        }
        const authToken= jwt.sign(data, JWT_SECRET);
        //console.log(authToken);
        res.json({ authToken})


    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error")
    }





});



// ROUTE 3: Get logged in user details using: POST '/api/auth/getuser'. Login required
// ROUTE 3: Get logged in user details using: POST '/api/auth/getuser'. Login required
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id; // Access user ID from req.user
        console.log("User ID from req.user:", userId); // Log for debugging

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).send({ error: "User not found" });
        }

        res.json(user); // Send the user data as a response
    } catch (error) {
        console.error("Error fetching user:", error.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
