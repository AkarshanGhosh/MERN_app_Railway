const bcrypt = require('bcryptjs/dist/bcrypt');
const { type } = require('express/lib/response');
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema
const verificationTokenSchema = new Schema({
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        expires: 180,
        default: Date.now()
    }
});

verificationTokenSchema.pre("save", async function (next){
    if (this.isModified("token")){
        const hash = await bcrypt.hash(this.token, 8);
        this.token = hash;
    }

    next();
    
});

verificationTokenSchema.mrthod.compareToken = async function (token){
    const result = await bcrypt.compareSync(token, this.token);
    return result;
}

const VerificationToken  = mongoose.model('VerificationToken', verificationTokenSchema);
//User.createIndexes()
module.exports = VerificationToken 
