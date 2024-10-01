var jwt = require('jsonwebtoken');
const JWT_SECRET = 'OurWebAppIsWorking@100';

const fetchuser = (req, res, next) => {
    // Get the user from the JWT token in the header
    const token = req.header('auth-token');
    
    if (!token) {
        return res.status(401).send({ error: "Please authenticate using a valid Token" });
    }

    // Verify the token and extract user data
    try {
        const data = jwt.verify(token, JWT_SECRET); // Corrected this part
        req.user = data.User; // Extract user data from the token
        next();
    } catch (error) {
        res.status(401).send({ error: "Please authenticate using a valid Token" });
    }
};

module.exports = fetchuser;
