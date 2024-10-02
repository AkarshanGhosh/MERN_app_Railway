const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema for train divisions
const DivisionSchema = new Schema({
    Division: {
        type: String, // Should be capital 'S'
        required: true,
    },
    States: {
        type: String, // Should be capital 'S'
        required: true,
    },
    Cities: {
        type: String, 
        required: true,
        unique: true 
    },
    Train_Name: {
        type: String, // Should be capital 'S'
        required: true
    },
    Train_Number: {
        type: String, // Should be capital 'S'
        required: true,
        unique: true
    },
});

// Export the model
module.exports = mongoose.model('Division', DivisionSchema); // Changed 'division' to 'Division' for better convention
