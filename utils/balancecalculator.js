import mongoose from "mongoose";
import transaction from "../models/transactionschema.js"; 

/* @param {String} accountid
   @returns {Promise<Number>} */
export async function calculatetruebalance(accountid) {
    
    if (!accountid) {
        return 0;
    }

    const pipeline = [
        {
            $match: {
               
                accountid : new mongoose.Types.ObjectId(accountid.toString()),
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
                                $eq : ["$type", "CREDIT"] 
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
    ]; 

   
    const result = await transaction.aggregate(pipeline); 

    if(result.length === 0){
        return 0;
    }

    return result[0].truebalance;
}