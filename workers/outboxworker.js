import Outbox from "../models/outbox.js";

export const processoutbox = async () => {

    const pendingEvents = await Outbox.find({ status: 'PENDING' }).limit(10);

    for (const event of pendingEvents) { 
        try {
            await Outbox.findByIdAndUpdate(event._id, { status: 'PROCESSING' });

            if (event.eventtype === 'transactionSuccess') {
                
                console.log(`Sending notification for txn : ${event.payload.txnid}`);
            }

            await Outbox.findByIdAndUpdate(event._id, { status: 'PROCESSED' });
        } catch (error) {
            console.error(`Failed event ${event._id}: `, error);

            if (event.retries < 3) {
                await Outbox.findByIdAndUpdate(event._id, { status: 'PENDING', $inc: { retries: 1 } });
            } else {
                await Outbox.findByIdAndUpdate(event._id, { status: 'FAILED', $inc: { retries: 1 } });
            }
        }
    }
}