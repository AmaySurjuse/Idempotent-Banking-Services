import mongoose from "mongoose";
import crypto from "crypto";
import transaction from "../models/transactionschema.js";
import account from "../models/accountschema.js"; // 
import { calculatetruebalance } from "../utils/balancecalculator.js";
import outbox from "../models/outbox.js";

export const transferfunds = async (req, res) => {
    const { senderaccountid, receiveraccountid, amount, description } = req.body;
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            await account.findOneAndUpdate(
                { _id: senderaccountid }, 
                { $set: { updatedAt: new Date() } }, 
                { session: session }
            );

            const currentbalance = await calculatetruebalance(senderaccountid);

            if(currentbalance < amount){
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ success: false, message: "Insufficient Balance" });
            }

            const sharedtransactionid = `TXN-${crypto.randomUUID()}`;

            // Ledger Entries
            await transaction.create([{
                transactiongroupid: sharedtransactionid,
                accountid: senderaccountid,
                type: 'DEBIT',
                amount: amount,
                status: 'SUCCESS',
                description: description
            }], { session: session });

            await transaction.create([{
                transactiongroupid: sharedtransactionid,
                accountid: receiveraccountid,
                type: 'CREDIT',
                amount: amount,
                status: 'SUCCESS',
                description: description
            }], { session: session });

            // Outbox Entry
            await outbox.create([{
                eventtype: "transactionSuccess",
                paylod: {
                    txnid: sharedtransactionid,
                    amount: amount,
                    senderid: senderaccountid,
                    recipentid: receiveraccountid
                },
                status: 'PENDING'
            }], { session });

            await session.commitTransaction();
            session.endSession();
            
            return res.status(200).json({ success: true, message: "Transfer successful", transactionid: sharedtransactionid });

        } catch (error) {
            await session.abortTransaction();
            session.endSession();

            if (error.hasErrorLabel && error.hasErrorLabel('TransientTransactionError')) {
                attempts++;
                continue; // Retry the loop
            }

            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
    return res.status(500).json({ success: false, message: "Transfer failed after retries" });
}