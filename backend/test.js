const mongoose = require('mongoose');
const VerificationToken = require('./models/verificationToken'); // Update the path as needed

const testVerificationToken = async () => {
    try {
        const dummyUserId = new mongoose.Types.ObjectId(); // Simulate a user ID
        const OTP = '123456'; // Example OTP

        const testToken = new VerificationToken({
            owner: dummyUserId,
            token: OTP,
        });

        const savedToken = await testToken.save();
        console.log('VerificationToken saved successfully:', savedToken);
    } catch (err) {
        console.error('Error saving VerificationToken:', err.message);
        console.error('Validation Errors:', err.errors);
    } finally {
        mongoose.disconnect();
    }
};

// MongoDB connection
mongoose
    .connect('mongodb+srv://akarshanghosh28:7UkufoU1nnadac9s@cluster0.1kxw1.mongodb.net/Data?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Connected to MongoDB');
        testVerificationToken(); // Test token creation
    })
    .catch((err) => console.error('MongoDB connection error:', err.message));
