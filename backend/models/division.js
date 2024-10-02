const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema for Division
const DivisionSchema = new Schema({
    Division: {
        type: String,
        required: true
    },
    States: {
        type: String,
        required: true
    },
    Cities: {
        type: String, // Single city name as a string
        required: true
    },
    Train_Name: {
        type: String,
        required: true
    },
    Train_Number: {
        type: String,
        required: true
    }
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps automatically

// Create the Division model
const Division = mongoose.model('divisions', DivisionSchema);
Division.createIndexes()
module.exports = Division
