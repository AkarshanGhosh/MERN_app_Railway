const express = require('express');
const { body, validationResult } = require('express-validator');
const Division = require('../models/division'); // Ensure this path is correct
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'OurWebAppIsWorking@100';

const router = express.Router();

// ROUTE 1: Create a new division using: POST '/api/division/create'. Doesn't require Auth
router.post('/create', [
    body('Division', 'Enter a valid Division name').notEmpty(),
    body('States', 'Enter a valid State').notEmpty(),
    body('Cities', 'Enter a valid City name').notEmpty(),
    body('Train_Name', 'Enter a valid Train Name').notEmpty(),
    body('Train_Number', 'Enter a valid Train Number').notEmpty(),
], async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Check if train name or train number already exists
        let existingTrain = await Division.findOne({
            $or: [
                { Train_Name: req.body.Train_Name },
                { Train_Number: req.body.Train_Number }
            ]
        });

        // If train name or train number exists, return respective messages
        if (existingTrain) {
            if (existingTrain.Train_Name === req.body.Train_Name) {
                return res.status(400).json({ error: "Train name already exists!" });
            }
            if (existingTrain.Train_Number === req.body.Train_Number) {
                return res.status(400).json({ error: "Train number already exists!" });
            }
        }

        // Create a new division if no duplicates are found
        const newDivision = await Division.create({
            Division: req.body.Division,
            States: req.body.States,
            Cities: req.body.Cities, // Expecting a single city name as a string
            Train_Name: req.body.Train_Name,
            Train_Number: req.body.Train_Number,
        });

        // Prepare data for the token
        const data = {
            Division: {
                id: newDivision._id // Use the newly created Division Object ID
            }
        };

        // Generate the JWT token
        const Token = jwt.sign(data, JWT_SECRET);
        console.log(Token);

        // Respond with the token and the newly created division
        res.status(201).json({ message: "Division created successfully", newDivision, Token });
    } catch (error) {
        console.error('Error creating division:', error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});






// ROUTE 2: Get train names and numbers by division and city using: GET '/api/division/city'. Doesn't require Auth
router.get('/city', async (req, res) => {
    const { division, city } = req.query; // Get division and city from query parameters

    if (!division || !city) {
        return res.status(400).json({ error: "Both division and city names are required." });
    }

    try {
        // Convert input city to lowercase for case insensitive search
        const lowerCaseCity = city.toLowerCase();

        // Find divisions where the division matches and the city matches, ignoring case
        const divisions = await Division.find({
            Division: division, // Match the division exactly
            Cities: { $regex: new RegExp(lowerCaseCity, 'i') } // 'i' flag for case insensitive
        });

        // Check if any trains exist for the specified division and city
        if (divisions.length === 0) {
            return res.status(404).json({ error: `No trains found in ${city} under ${division}` });
        }

        // Extract train details and generate tokens for each train
        const trainsWithTokens = divisions.map(division => {
            const trainData = {
                Train_Name: division.Train_Name,
                Train_Number: division.Train_Number
            };

            // Prepare data for the token
            const data = {
                Train: {
                    Train_Name: trainData.Train_Name,
                    Train_Number: trainData.Train_Number
                }
            };

            // Generate the JWT token
            const Token = jwt.sign(data, JWT_SECRET);

            return {
                ...trainData,
                Token // Add the token to the train details
            };
        });

        res.json({ division, city, trains: trainsWithTokens });
    } catch (error) {
        console.error('Error fetching trains by division and city:', error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});



// ROUTE 3: Update a division using: PUT '/api/division/update/:id'. Requires Auth
router.put('/update/:id', [
    body('Division').optional().notEmpty().withMessage('Enter a valid Division name'),
    body('States').optional().notEmpty().withMessage('Enter a valid State'),
    body('Cities').optional().notEmpty().withMessage('Enter a valid City name'),
    body('Train_Name').optional().notEmpty().withMessage('Enter a valid Train Name'),
    body('Train_Number').optional().notEmpty().withMessage('Enter a valid Train Number'),
], async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const updatedDivision = await Division.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!updatedDivision) {
            return res.status(404).json({ error: "Division not found" });
        }

        res.json({ message: "Division updated successfully", updatedDivision });
    } catch (error) {
        console.error('Error updating division:', error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});

// ROUTE 4: Delete a division using: DELETE '/api/division/delete/:id'. Requires Auth
router.delete('/delete/:id', async (req, res) => {
    try {
        const deletedDivision = await Division.findByIdAndDelete(req.params.id);

        if (!deletedDivision) {
            return res.status(404).json({ error: "Division not found" });
        }

        res.json({ message: "Division deleted successfully" });
    } catch (error) {
        console.error('Error deleting division:', error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});
// Existing routes...


// ROUTE 5: Check if train number exists using: POST '/api/division/check-train'. Doesn't require Auth

router.post('/check-train', [
    body('trainNumber', 'Train number cannot be blank').exists().isLength({ min: 1 }).withMessage('Train number is required.'),
], async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { trainNumber } = req.body; // Get trainNumber from the request body

    try {
        // Check if the train exists in the database
        const train = await Division.findOne({ Train_Number: trainNumber });

        // Respond based on whether the train exists
        if (train) {
            return res.json({ message: `Entered train number ${trainNumber} exists.` }); // Train exists
        } else {
            return res.status(404).json({ message: `No train exists with the number ${trainNumber}.` }); // Train does not exist
        }
    } catch (error) {
        console.error('Error fetching train:', error);
        return res.status(500).json({ message: 'Internal Server Error' }); // Handle server errors
    }
});

  
// Existing routes...

module.exports = router;