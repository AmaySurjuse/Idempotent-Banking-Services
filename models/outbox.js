import mongoose from "mongoose";

const outboxschema = new mongoose.Schema({
    eventtype: { type: String, required: true },
    payload: { type: mongoose.Schema.Types.Mixed, required: true }, 
    status: {
        type: String,
        enum: ['PENDING', 'PROCESSING', 'PROCESSED', 'FAILED'],
        default: 'PENDING'
    },
    retries: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

const Outbox = mongoose.model("Outbox", outboxschema); 
export default Outbox;