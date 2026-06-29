import mongoose from "mongoose";
import transaction from "../models/transactionschema.js"; // Added .js extension which is required in Node ES Modules

/* @param {String} accountid
   @returns {Promise<Number>} */
export async function calculatetruebalance(accountid) {
    const pipeline = [
        {
            $match: {
                accountid : new mongoose.Types.ObjectId(accountid),
                status : 'SUCCESS'
            }
        },
        {
            $group: {
                _id: "$accountid",
                truebalance: {
                    $sum : {
                        $cond : [
                            {
                                $eq : ["$type", "CREDIT"] // Fixed: $eq instead of $ep, and added $ to type
                            },
                            "$amount",
                            {
                                $multiply: ["$amount", -1]
                            }
                        ]
                    }
                }
            }
        }
    ]; // Fixed: Changed comma to semicolon

    // Fixed: Corrected spelling of aggregate
    const result = await transaction.aggregate(pipeline); 

    if(result.length === 0){
        return 0;
    }

    return result[0].truebalance;
}