import mongoose from "mongoose";

const idempotencySchema = new mongoose.Schema({
    key : {
        type : String, 
        required : [true, "Key is required"],
        unique : true 
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
        type : mongoose.Schema.Types.Mixed 
    },
    createdAt: { 
        type: Date, 
        default: Date.now, 
        expires: 86400 
    }
})

const idempotencyModel = mongoose.model("Idempotency", idempotencySchema)

export default idempotencyModel;