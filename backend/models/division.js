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
}, { timestamps: true });

// Check if the model already exists to avoid overwriting
const Division = mongoose.models.Division || mongoose.model('Divisions', DivisionSchema);

module.exports = Division;
