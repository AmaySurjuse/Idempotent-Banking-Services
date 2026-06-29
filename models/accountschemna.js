import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
    userid : {
        type : mongoose.Schema.Types.ObjectId, // Fixed: Correct Mongoose ObjectId syntax
        ref: 'User',                           // Added: Tells Mongoose this links to the User collection
        required : [true, "User ID is required"]
    },
    accountnumber : {
        type : String,
        required : [true, "Account Number is Required"],
        unique : true                          // Fixed: 'unique: true' automatically creates an index, so 'indexed: true' is redundant
    },
    accounttype : {                            // Fixed typo from 'accountype'
        type : String,                         // Added: Mongoose requires the base data type for enums
        enum : ['SAVINGS', 'CURRENT']          // Fixed: Added missing quotes around 'CURRENT'
    },
    currency : {
        type : String,
        default : 'INR'                        // Fixed: Removed React 'useDebugValue' autocomplete error
    },
    status : {
        type : String,                         // Added: Mongoose requires the base data type 
        enum : ['ACTIVE', 'FROZEN', 'CLOSED'], // Fixed: Added missing quotes around 'CLOSED'
        default : 'ACTIVE'
    }
}, {
    timestamps: true                           // Added: Highly recommended for tracking when an account is opened
});

const accountModel = mongoose.model("Account ", accountSchema)

export default accountModel;