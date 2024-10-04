const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema for train data
const TrainSchema = new Schema({
    Division: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'divisions'
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
    }
});

// Check if the model already exists to avoid overwriting
const Train = mongoose.models.Train || mongoose.model('Train', TrainSchema);


module.exports = Train;
