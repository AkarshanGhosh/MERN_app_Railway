var jwt = require('jsonwebtoken');
const JWT_SECRET = 'OurWebAppIsWorking@100';

const fetchDivision = (req, res, next) => {
    const token = req.header('Token');

    if (!token) {
        return res.status(401).send({ error: "Token is required" });
    }

    try {
        const data = jwt.verify(token, JWT_SECRET);
        console.log('Decoded Token Data:', data); // Log the decoded token data for debugging

        // Removed the check for Division information
        req.division = data; // Attach the entire decoded data to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error("Error in token verification:", error);
        res.status(401).send({ error: "Invalid or expired token" });
    }
};

module.exports = fetchDivision;
