import mongoose from "mongoose";
import bcrypt from "bcrypt";
import user from "../models/userschema.js";
import account from "../models/accountschema.js";

export const registeruser = async (req, res) => {
    const {firstname, lastname, email, password, phonenumber, captchaToken} = req.body;

    if(!captchaToken) {
        return res.status(400).json({
            success : false,
            message : "CAPTCHA required"
        })
    }

    try {
        
        const googleVerifyUrl = "https://www.google.com/recaptcha/api/siteverify";

        const formData = new URLSearchParams();
        formData.append("secret", process.env.RECAPTCHA_SECRET_KEY);
        formData.append("response", captchaToken);

        const captchaResponse = await fetch(googleVerifyUrl, {
            method: "POST",
            body: formData 
        });

        const captchaData = await captchaResponse.json();

        if(!captchaData.success) {
            return res.status(400).json({
                success : false,
                message : "Captcha failed"
            })
        }
    } catch (error) {
        console.error("CAPTCHA Error : ", error);
        return res.status(500).json({ success : false, message : "Error"})
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try{
        
        const existuser = await user.findOne({ email }).session(session);

        if(existuser){
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                success : false,
                message : "Email already registered"
            })
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashpassword = await bcrypt.hash(password, salt);

        const newuserarray = await user.create([{
            firstname,
            lastname,
            email,
            password : hashpassword,
            phonenumber
        }], { session : session });

        const newuser = newuserarray[0];

        const generateaccountnumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();

        const newaccountarray = await account.create([{
            userid : newuser._id,
            accountnumber : generateaccountnumber,
            currency : 'INR',
            status : 'ACTIVE',
        }], { session : session });

        const newaccount = newaccountarray[0];

        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({
            success: true,
            message : "Bank Account Successfully created",
            user: {
                id: newuser._id,
                name: `${newuser.firstname} ${newuser.lastname}`,
                email: newuser.email,
            },
            account : {
                accountid : newaccount._id,
                accountnumber : newaccount.accountnumber
            }
        })
    } catch(error) {
        console.error("Registration Error: ", error);

        await session.abortTransaction();
        session.endSession();

        return res.status(500).json({
            success : false,
            message : "Internal Server Error during registration"
        })
    }
}