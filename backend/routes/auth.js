const express = require('express');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator'); // Import validationResult
const user = require('../models/User');

// Create a User using: POST '/api/auth/'. Doesn't require Auth
router.post('/createuser', [
    body('Username','Enter a valid Username').isLength({ min: 4 }),
    body('Email','Enter a valid Email').isEmail(),
    body('Phone_Number','Enter a valid Phone number').isLength({ min: 4 }),
    body('password','Password atleast 6 characters').isLength({ min: 6 }),
], (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Return a 400 status with the errors
        return res.status(400).json({ errors: errors.array() });
    }
    user.create({
        Username: req.body.Username,
        Email: req.body.Email,
        password: req.body.password,
        Phone_Number: req.body.Phone_Number,

    }).then(user => res.json(user))
    .catch(err => {console.log(err)
        res.json({error: 'Please Enter a Unique value', message: err.message})
    })

    // If no validation errors, proceed with sending the request body
    //res.send(req.body);
});

module.exports = router;
