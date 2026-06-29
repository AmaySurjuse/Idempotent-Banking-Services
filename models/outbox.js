import mongoose from "mongoose";

const outboxschema = new mongoose.Schema({
    eventtype: { type: String, required: true },
    paylod: { type: mongoose.Schema.Types.Mixed, required: true }, // Keeping 'paylod' as per your schema
    status: {
        type: String,
        enum: ['PENDING', 'PROCESSING', 'PROCESSED', 'FAILED'],
        default: 'PENDING'
    },
    retries: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

const Outbox = mongoose.model("Outbox", outboxschema); // Fixed comma to semicolon
export default Outbox;