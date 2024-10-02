const express = require('express');
const { body, validationResult } = require('express-validator');
const Division = require('../models/Division'); // Ensure this path is correct

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

        res.status(201).json({ message: "Division created successfully", newDivision });
    } catch (error) {
        console.error('Error creating division:', error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});

// ROUTE 2: Get train names and numbers by city using: GET '/api/division/city'. Doesn't require Auth
router.get('/city', async (req, res) => {
    const { city } = req.body; // Get city from request body

    if (!city) {
        return res.status(400).json({ error: "City name is required." });
    }

    try {
        // Convert input city to lowercase for case insensitive search
        const lowerCaseCity = city.toLowerCase();

        // Find divisions where the city matches, ignoring case
        const divisions = await Division.find({
            Cities: { $regex: new RegExp(lowerCaseCity, 'i') } // 'i' flag for case insensitive
        });

        // Check if any trains exist for the specified city
        if (divisions.length === 0) {
            return res.status(404).json({ error: `No trains found in ${city}` });
        }

        // Extract train details
        const trains = divisions.map(division => ({
            Train_Name: division.Train_Name,
            Train_Number: division.Train_Number
        }));

        res.json({ city: city, trains: trains });
    } catch (error) {
        console.error('Error fetching trains by city:', error);
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

module.exports = router;
