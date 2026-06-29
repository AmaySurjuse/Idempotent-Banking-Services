import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    transactiongroupid : {
        type : String,
        required : [true, "Transaction Group ID is required"], // Fixed: Typo in 'Group'
        index: true // Added: We will query this field often, so indexing it speeds up the database
    },
    accountid : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Account', // Fixed: Mongoose model references are traditionally singular
        required : [true, "Account ID is required"]
    },
    type : {
        type: String, // Added: Mongoose requires the base data type for enums
        enum : ['CREDIT', 'DEBIT'],
        required : [true, "Transaction type is required"] // Added: We absolutely must know if money is going in or out
    },
    amount :{
        type : Number,
        required : [true, "Amount is required"],
        min : [0, "Amount cannot be negative"] // Added: A negative debit creates a math nightmare
    },
    status : {
        type: String, // Added: Base data type
        enum : ['PENDING', 'FAILED', 'SUCCESS'],
        required : [true, "Status is required"]
    },
    description : {
        type : String
    }
},{
    timestamps : true,
    immutable: true // Added: Enterprise ledgers are append-only. This prevents accidental updates to existing transactions.
})
const transactionModel = mongoose.model("Transaction ", transactionModel)
export default transactionModel;