const TrainSchema = new Schema({
    Train_number: {
        type: String,
        required: true // Required field
    },
    coach: {
        type: String,
        required: true // Required field
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
        required: true,  // Make this field required
        default: "000" // Default value if not provided
    },
    Memory: {
        type: String, 
        required: true,  // Make this field required
        default: "Not available" // Default value if not provided
    },
    Humidity: {
        type: String,
        required: true,  // Make this field required
        default: "Not available" // Default value if not provided
    }
});
const Train = module.exports =  mongoose.model('Train', TrainSchema);