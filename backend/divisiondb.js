const mongoose = require('mongoose');
const divisionDBURI = "mongodb://localhost:27017/division"; // Ensure this matches your division database name

let divisionDBConnection; // Store the connection

const connectToDivisionDB = async () => {
    if (!divisionDBConnection) { // Check if the connection already exists
        try {
            divisionDBConnection = mongoose.createConnection(divisionDBURI, {
                // Removed deprecated options
                socketTimeoutMS: 30000, // Increase socket timeout if needed
                connectTimeoutMS: 30000, // Increase connection timeout if needed
            });

            divisionDBConnection.on('connected', () => {
                console.log("Connected to Division MongoDB successfully");
            });

            divisionDBConnection.on('error', (err) => {
                console.error("Error connecting to Division MongoDB:", err);
            });

            // Optional: Add a listener for disconnection events
            divisionDBConnection.on('disconnected', () => {
                console.log("Disconnected from Division MongoDB");
            });
        } catch (err) {
            console.error("Error connecting to Division MongoDB:", err);
        }
    }
    return divisionDBConnection; // Return the connection for further use if needed
};

module.exports = connectToDivisionDB;




