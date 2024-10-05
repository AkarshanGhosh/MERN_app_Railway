const express = require('express');
const Division = require('../models/Division'); // Ensure this is the correct path
const { body, validationResult } = require('express-validator');
const Train = require('../models/train'); // Importing the Train model

const router = express.Router();

// ROUTE 1: Add train data using: POST '/api/train/create'
router.post('/create', [
    body('Train_name', 'Train name should not be empty').notEmpty(),
    body('coach', 'Enter a valid coach number or type').notEmpty(),
    body('chain_status', 'Enter a valid chain status').notEmpty(),
], async (req, res) => {
    try {
        // Destructure the required data from the request body
        const { coach, latitude, longitude, chain_status, temperature, Train_name } = req.body;

        // Validate the request body for errors
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ errors: error.array() });
        }

        // Check if the train name exists in the Division collection
        const existingDivision = await Division.findOne({ Train_Name: Train_name }); // Ensure correct field name

        if (!existingDivision) {
            return res.status(404).json({ message: `Train with name ${Train_name} not found in the Division collection.` });
        }

        // Create a new train entry
        const train = new Train({
            coach,
            latitude,
            longitude,
            chain_status,
            temperature,
            Train_name // Store the train name in the Train_name field
        });

        // Save the train data to the database
        const savedTrain = await train.save();

        // Send success response with the created train data
        res.status(201).json({ message: "Train data added successfully", savedTrain });

    } catch (error) {
        console.error('Error adding train data:', error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});

/// ROUTE 2: Fetch train data by Train_name and coach name using: GET '/api/train/fetch'// ROUTE 2: Fetch train data by Train_name and coach name using: GET '/api/train/fetch'
router.get('/fetch', async (req, res) => {
    const { Train_name, coach } = req.body; // Get Train_name and coach from request body

    // Check if both Train_name and coach are provided
    if (!Train_name || !coach) {
        return res.status(400).json({ error: "Both Train_name and coach are required." });
    }

    try {
        // Convert input coach and Train_name to lowercase for case-insensitive search
        const lowerCaseCoach = coach.toLowerCase();
        const lowerCaseTrainName = Train_name.toLowerCase();

        // Fetch train data from the Train collection, filtering by both Train_name and coach
        const trains = await Train.find({
            Train_name: { $regex: new RegExp(lowerCaseTrainName, 'i') }, // Case-insensitive match for Train_name
            coach: { $regex: new RegExp(lowerCaseCoach, 'i') } // Case-insensitive match for coach
        })
        .populate('Division', 'Train_Name'); // Populate Division field to get Train_Name if necessary

        // If no train data is found, return a 404 error
        if (trains.length === 0) {
            return res.status(404).json({ message: `No train data found for Train_name: ${Train_name} and coach: ${coach}` });
        }

        // Map the fetched trains to the desired response format
        const responseTrains = trains.map(train => {
            return {
                trainName: train.Train_name, // Use Train_name from the document
                coach: train.coach,
                latitude: train.latitude,
                longitude: train.longitude,
                chain_status: train.chain_status,
                temperature: train.temperature,
                divisionName: train.Division ? train.Division.Train_Name : null // Access Train_Name from the Division reference
            };
        });

        // Return the train data in the response
        res.json({ Train_name: Train_name, coach: coach, trains: responseTrains });
    } catch (error) {
        console.error('Error fetching train data:', error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});



module.exports = router;