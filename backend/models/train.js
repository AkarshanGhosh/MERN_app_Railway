const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema for train data
const TrainSchema = new Schema({
    Train_number: { // Updated field name
        type: String,
        required: true // Ensure this field is required
    },
    coach: {
        type: String, // Store coach information (e.g., coach number or type)
        required: true // Optional: Set to true if coach is mandatory
    },
    date: {
        type: Date,
        default: Date.now
    },
    latitude: {
        type: String, // Storing as string to preserve formatting
    },
    longitude: {
        type: String, // Storing as string to preserve formatting
    },
    chain_status: {
        type: String, // Chain status (e.g., Pulled, Normal)
    },
    temperature: {
        type: String, // Store temperature as string
    },
    Division: { // Define Division as a reference to the Division model
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Division' // Referencing the Division model
    },
    Error: { 
        type: String, // Store error details (if any)
        default: "No errors" // Optional default value
    },
    Memory: {
        type: String, // Store memory usage information
        default: "Not available" // Optional default value
    },
    Temperature: {
        type: String, // Redundant with existing temperature? Specify clearly
    },
    Humidity: {
        type: String, // Store humidity levels
        default: "Not available" // Optional default value
    }
});

// Check if the model already exists to avoid overwriting
const Train = module.exports = mongoose.model('train', TrainSchema);
