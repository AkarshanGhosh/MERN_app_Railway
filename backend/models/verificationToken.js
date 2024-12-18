const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema
const verificationTokenSchema = new Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        expires: 180, // TTL for token expiration (180 seconds)
        default: Date.now, // Use Date.now without parentheses
    },
});

// Pre-save hook for hashing the token
verificationTokenSchema.pre("save", async function (next) {
    if (this.isModified("token")) {
        const hash = await bcrypt.hash(this.token, 8);
        this.token = hash;
    }
    next();
});

// Add method to compare tokens
verificationTokenSchema.methods.compareToken = async function (token) {
    return await bcrypt.compare(token, this.token); // Use bcrypt.compare (async)
};

// Create the model
const VerificationToken = mongoose.model('VerificationToken', verificationTokenSchema);
VerificationToken.createIndexes()
module.exports = VerificationToken;
