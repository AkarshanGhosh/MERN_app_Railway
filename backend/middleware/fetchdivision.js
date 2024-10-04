const Division = require('../models/Division'); // Ensure the path is correct

const fetchDivision = async (req, res, next) => {
    const divisionId = req.params.id; // Get the division ID from the URL parameter

    if (!divisionId) {
        return res.status(400).json({ error: "Division ID is required." });
    }

    try {
        // Fetch the division using the provided ID
        const division = await Division.findById(divisionId);

        // If no division found, return a 404 error
        if (!division) {
            return res.status(404).json({ error: "Division not found." });
        }

        req.division = division; // Attach the fetched division to the request object
        next(); // Call the next middleware or route handler
    } catch (error) {
        console.error('Error fetching division:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = fetchDivision;
