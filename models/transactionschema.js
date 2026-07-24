import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    transactiongroupid : {
        type : String,
        required : [true, "Transaction Group ID is required"], 
        index: true 
    },
    accountid : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Account', 
        required : [true, "Account ID is required"]
    },
    type : {
        type: String,
        enum : ['CREDIT', 'DEBIT'],
        required : [true, "Transaction type is required"] 
    },
    amount :{
        type : Number,
        required : [true, "Amount is required"],
        min : [0, "Amount cannot be negative"]
    },
    status : {
        type: String,
        enum : ['PENDING', 'FAILED', 'SUCCESS'],
        required : [true, "Status is required"]
    },
    description : {
        type : String
    }
},{
    timestamps : true,
    immutable: true 
})


const transactionModel = mongoose.model("Transaction", transactionSchema)

export default transactionModel;