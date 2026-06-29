import mongoose from "mongoose";

const idempotencySchema = new mongoose.Schema({
    key : {
        type : String, 
        required : [true, "Key is required"],
        unique : true // Fixed: Ensures we can instantly find the duplicate
    },
    requestmethod : {
        type : String
    },
    requestpath : {
        type : String
    },
    responsestatus : {
        type : Number
    },
    responsebody : {
        type : mongoose.Schema.Types.Mixed // Fixed: Allows saving full JSON objects
    },
    createdAt: { 
        type: Date, 
        default: Date.now, 
        expires: 86400 // Added: MongoDB will automatically delete this document after 86,400 seconds (24 hours)
    }
})

// Note: No need for { timestamps: true } because we manually defined createdAt for the TTL index.
const idempotencyModel = mongoose.model("Idempotency ", idempotencyModel)

export default idempotencyModel;