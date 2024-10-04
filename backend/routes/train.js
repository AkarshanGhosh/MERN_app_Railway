const express = require('express');

const { body, validationResult } = require('express-validator');
const Train = require('../models/train'); // Importing the Train model
const fetchDivision = require('../middleware/fetchdivision'); // fetch data from the respective token 
//const { get } = require('mongoose');



const router = express.Router();

// ROUTE 1: Add train data using: POST '/api/train/create'
router.post('/create', fetchDivision, [
    body('coach', 'Enter a valid coach number or type').notEmpty(),
    body('chain_status', 'Enter a valid chain status').notEmpty(),
], async (req, res) => {

    try {
        // Destructure the required data from the request body
        const { coach, latitude, longitude, chain_status, temperature} = req.body;

        // Validate the request body for errors
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ errors: error.array() });
        }

        // Create a new train entry
        const train = new Train({
            coach,
            latitude,
            longitude,
            chain_status,
            temperature,
            division: req.division.id // Assuming req.division.id contains the division ID
            //trainName: req.Division.Train_Name, // Access train name from the token
            //trainNumber: req.Division.Train_Number // Access train number from the token
        })

        // Save the train data to the database
        const savedTrain = await train.save();

        // Send success response with the created train data
        res.status(201).json({ message: "Train data added successfully", savedTrain });

    } catch (error) {
        console.error('Error adding train data:', error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});

// ROUTE 2: Fetch train data by coach name using: GET '/api/train/fetch'
router.get('/fetch', fetchDivision, async (req, res) => {
    const { coach } = req.body; // Get coach name from request body

    // Check if coach name is provided
    if (!coach) {
        return res.status(400).json({ error: "Coach name is required." });
    }

    try {
        // Convert input coach to lowercase for case-insensitive search
        const lowerCaseCoach = coach.toLowerCase();

        // Fetch train data from the Train collection, filtering by coach and populating the Division reference
        const trains = await Train.find({
            division: req.division.id, // Ensure we're filtering by division
            coach: { $regex: new RegExp(lowerCaseCoach, 'i') } // 'i' flag for case-insensitive match
        })
        .populate('Division', 'Train_Name'); // Populate Division field to get Train_Name

        // If no train data is found, return a 404 error
        if (trains.length === 0) {
            return res.status(404).json({ message: `No train data found for coach: ${coach}` });
        }

        // Map the fetched trains to the desired response format
        const responseTrains = trains.map(train => {
            // Access the train name from the populated Division
            
            
            return {
                trainName: train.trainName, // Use the accessed train name
                coach: train.coach,
                latitude: train.latitude,
                longitude: train.longitude,
                chain_status: train.chain_status,
                temperature: train.temperature
            };
        });

        // Return the train data in the response
        res.json({ coach: coach, trains: responseTrains });
    } catch (error) {
        console.error('Error fetching train data by coach:', error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});



module.exports = router;