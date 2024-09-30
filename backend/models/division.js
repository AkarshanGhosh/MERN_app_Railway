const mongoose = require('mongoose');
const { Schema } = mongoose;

//we have to make schema
const UserSchema = new Schema({
    Division:{
        type: string,
        required: true,
            

    },
    States:{
        type: string,
        required: true,
        
    },
    Cities:{
        type: integer,
        required: true,
        unique: true 
    },
    Train_Name:{
        type: string,
        required: true
    },
    Train_Number:{
        type: string,
        required: true,
        unique: true
    },
    
  });
  module.exports = mongoose.model('division', DivisionSchema);