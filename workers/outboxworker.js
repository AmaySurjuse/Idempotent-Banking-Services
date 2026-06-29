import Outbox from "../models/outbox.js";

export const processoutbox = async () => {
    // 1. Find pending tasks
    const pendingEvents = await Outbox.find({ status: 'PENDING' }).limit(10);

    // Fixed variable name from 'pendingevents' to 'pendingEvents'
    for (const event of pendingEvents) { 
        try {
            await Outbox.findByIdAndUpdate(event._id, { status: 'PROCESSING' });

            if (event.eventtype === 'transactionSuccess') {
                // Fixed backticks (`) for template literals
                console.log(`Sending notification for txn : ${event.paylod.txnid}`);
            }

            await Outbox.findByIdAndUpdate(event._id, { status: 'PROCESSED' });
        } catch (error) {
            console.error(`Failed event ${event._id}: `, error);
            // Fixed syntax: added ':' after $inc
            await Outbox.findByIdAndUpdate(event._id, { status: 'FAILED', $inc: { retries: 1 } });
        }
    }
}