const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const verificationTokenSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 360, // TTL index for expiration (180 seconds)
    },
});

// Hash the token before saving
verificationTokenSchema.pre('save', async function (next) {
    if (this.isModified('token')) {
        const hash = await bcrypt.hash(this.token, 8);
        this.token = hash;
    }
    next();
});

// Compare a plain-text token with the hashed token
verificationTokenSchema.methods.compareToken = async function (candidateToken) {
    return bcrypt.compare(candidateToken, this.token);
};

const VerificationToken = mongoose.model('VerificationToken', verificationTokenSchema);
module.exports = VerificationToken;
