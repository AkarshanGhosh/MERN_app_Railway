const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema
const UserSchema = new Schema({
    Username: {
        type: String, // Use 'String' with uppercase 'S'
        required: true
    },
    Email: {
        type: String,
        required: true,
        unique: true
    },
    Phone_Number: {
        type: String, // Better to store phone numbers as strings to preserve formatting
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});
const User = mongoose.model('User', UserSchema);
User.createIndexes()
module.exports = User
