//To do now we have to make token for each assigned train so that our data of coach will be unique to that token only  


const express = require('express');
const { body, validationResult } = require('express-validator');
const Train = require('../models/Train'); // Importing the Train model

const router = express.Router();

// ROUTE 1: Add train data using: POST '/api/train/create'
router.post('/create', [
    body('coach', 'Enter a valid coach number or type').notEmpty(),
    body('latitude', 'Enter a valid latitude').notEmpty(),
    body('longitude', 'Enter a valid longitude').notEmpty(),
    body('chain_status', 'Enter a valid chain status').notEmpty(),
    body('temperature', 'Enter a valid temperature').notEmpty(),
], async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Create a new train entry with the provided data
        const newTrain = await Train.create({
            coach: req.body.coach,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            chain_status: req.body.chain_status,
            temperature: req.body.temperature,
        });

        // Send response with success message and the created train data
        res.status(201).json({ message: "Train data added successfully", newTrain });
    } catch (error) {
        console.error('Error adding train data:', error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});

// ROUTE 2: Fetch train data by coach name using: POST '/api/train/fetch'
router.get('/fetch', async (req, res) => {
    const { coach } = req.body; // Get coach name from request body

    if (!coach) {
        return res.status(400).json({ error: "Coach name is required." });
    }

    try {
        // Convert input coach to lowercase for case insensitive search
        const lowerCaseCoach = coach.toLowerCase();

        // Fetch train data from the Train collection, filtering by coach and populating the Division reference
        const trains = await Train.find({
            coach: { $regex: new RegExp(lowerCaseCoach, 'i') } // 'i' flag for case insensitive
        })
        .populate('Division', 'Train_Name'); // Populate Division field to get Train_Name

        // If no train data is found, return a 404 error
        if (trains.length === 0) {
            return res.status(404).json({ message: `No train data found for coach: ${coach}` });
        }

        // Map the trains to include the train name along with other details
        const responseTrains = trains.map(train => ({
            trainName: train.Division ? train.Division.Train_Name : "Unknown Train", // Check if Division is defined
            coach: train.coach,
            latitude: train.latitude,
            longitude: train.longitude,
            chain_status: train.chain_status,
            temperature: train.temperature
        }));

        // Return the train data in the response
        res.json({ coach: coach, trains: responseTrains });
    } catch (error) {
        console.error('Error fetching train data by coach:', error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});




module.exports = router
