import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
    userid : {
        type : mongoose.Schema.Types.ObjectId, 
        ref: 'User',                                  
        required : [true, "User ID is required"]
    },
    accountnumber : {
        type : String,
        required : [true, "Account Number is Required"],
        unique : true                                
    },
    accounttype : {                                    
        type : String,                                 
        enum : ['SAVINGS', 'CURRENT'],
        default: 'SAVINGS' 
    },
    currency : {
        type : String,
        default : 'INR'                                
    },
    status : {
        type : String,                                 
        enum : ['ACTIVE', 'FROZEN', 'CLOSED'], 
        default : 'ACTIVE'
    }
}, {
    timestamps: true
});

const accountModel = mongoose.model("Account", accountSchema) 

export default accountModel;