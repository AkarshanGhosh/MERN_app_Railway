const express = require('express');
const { body, validationResult } = require('express-validator');
const Division = require('../models/division'); // Ensure this is the correct path
const Train = require('../models/train'); // Importing the Train model

const router = express.Router();
module.exports = router;

// ROUTE 1: Add train data using: POST '/api/train/create'
router.post('/create', [
    body('Train_number', 'Train number should not be empty').notEmpty(),
    body('coach', 'Enter a valid coach number or type').notEmpty(),
], async (req, res) => {
    try {
        const { 
            Train_number, 
            coach, 
            latitude, 
            longitude, 
            chain_status, 
            temperature, 
            Error, 
            Memory, 
            Humidity 
        } = req.body;

        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ errors: error.array() });
        }

        const existingDivision = await Division.findOne({ Train_Number: Train_number });

        if (!existingDivision) {
            return res.status(404).json({ message: `Train with number ${Train_number} not found in the Division collection.` });
        }

        const train = new Train({
            Train_number,
            coach,
            latitude,
            longitude,
            chain_status,
            temperature,
            Error,
            Memory,
            Humidity,
        });

        const savedTrain = await train.save();
        res.status(201).json({ message: "Train data added successfully", savedTrain });

    } catch (error) {
        console.error('Error adding train data:', error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});

// ROUTE 2: Fetch train data by train number using: GET '/api/train/fetch'
router.get('/fetch', async (req, res) => {
    const { trainNumber, coach } = req.query;

    if (!trainNumber || !coach) {
        return res.status(400).json({ error: "Both train number and coach are required." });
    }

    try {
        const trains = await Train.find({
            Train_number: trainNumber,
            coach: coach
        }).populate('Division', 'Train_Name');

        if (trains.length === 0) {
            return res.status(404).json({ message: `No train data found for train number: ${trainNumber} and coach: ${coach}` });
        }

        const responseTrains = trains.map(train => ({
            trainNumber: train.Train_number,
            coach: train.coach,
            latitude: train.latitude,
            longitude: train.longitude,
            chain_status: train.chain_status,
            temperature: train.temperature,
            error: train.Error,
            memory: train.Memory,
            humidity: train.Humidity,
            divisionName: train.Division ? train.Division.Train_Name : null
        }));

        res.json({ trainNumber: trainNumber, coach: coach, trains: responseTrains });
    } catch (error) {
        console.error('Error fetching train data:', error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});

// ROUTE 3: Fetch unique coaches by train number using: GET '/api/train/coaches'
router.get('/coaches', async (req, res) => {
    const { trainNumber } = req.query;

    if (!trainNumber) {
        return res.status(400).json({ error: "Train number is required." });
    }

    try {
        const coaches = await Train.find({ Train_number: trainNumber });

        if (coaches.length === 0) {
            return res.status(404).json({ message: `No coaches found for train number: ${trainNumber}` });
        }

        const uniqueCoaches = [...new Set(coaches.map(coach => coach.coach))];

        res.json({ trainNumber, coaches: uniqueCoaches });
    } catch (error) {
        console.error('Error fetching coaches:', error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});

module.exports = router;
