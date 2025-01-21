const TrainSchema = new Schema({
    Train_number: {
        type: String,
        required: true
    },
    coach: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    latitude: {
        type: String,
    },
    longitude: {
        type: String,
    },
    chain_status: {
        type: String,
    },
    temperature: {
        type: String,
    },
    Division: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Division'
    },
    Error: { 
        type: String, 
        default: "000"
    },
    Memory: {
        type: String, 
        default: "Not available"
    },
    Humidity: {
        type: String,
        default: "Not available"
    }
});
