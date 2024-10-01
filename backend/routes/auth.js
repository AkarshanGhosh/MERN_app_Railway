const express = require('express');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator'); // Import validationResult
var jwt = require('jsonwebtoken');

const JWT_SECRET = 'OurWebAppIsWorking@100'



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
        const salt = await bcrypt.genSalt(10); // we await cause it return promise 
        const hashedPassword = await bcrypt.hash(req.body.password, salt); // we await cause it return promise 
        
        // Create the new user
        const newUser = await User.create({
            Username: req.body.Username,
            Email: req.body.Email,
            password: hashedPassword, // Store the hashed password
            Phone_Number: req.body.Phone_Number,
        });

        // Return the success message along with the new user data
        // Returning message using Json Token 
        const data = {
            User: {
                id: User.id
            }
        }
        const authToken= jwt.sign(data, JWT_SECRET);
        console.log(authToken);
        res.json({ authToken})
        //res.json({ message: "User created successfully", newUser });
    } catch (error) {
        console.error('Error:', error); // Log any error that occurs
        res.status(500).send({ error: "Internal Server Error" });
    }
});

// authenticate a User using: POST '/api/auth/'. Doesn't require login

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
                id: User.id
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



module.exports = router;
