import mongoose from "mongoose"
import crypto from "crypto"

const userSchema = new mongoose.Schema({
  firstname : {
    type : String,
    required : [true, "First Name is required"]
  },
  lastname : {
    type : String,
    required : [true, "Last Name"]
  },
  email : {
    type : String,
    required : [true, "Email"],
  },
  passwordhash : {
    type : String,
    required : [true , "Password is Required"]
  },
  phonenumber : {
    type: String,
    required : [true, "Phone Number is required"],
    unique : true,
    },
  isphonenumberverified : {
    type : Boolean,
    default : false 
    },
  kycstatus : {
    type : String,
    enum: ['PENDING', 'VERIFIED', 'REJECTED'],
    default : 'PENDING'
  }
}, 
{
    timestamps: true
})
const userModel = mongoose.model("User", userModel)
export default userModel