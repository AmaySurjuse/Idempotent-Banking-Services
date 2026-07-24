import mongoose from "mongoose";
import bcrypt from "bcrypt";
import user from "../models/userschema.js";
import jwt from "jsonwebtoken";
import account from "../models/accountschema.js";
import { calculatetruebalance } from "../utils/balancecalculator.js"; 

export const loginuser = async (req, res) => {
    const { email, password, captchaToken } = req.body;

    // CAPTCHA Check
   if (!captchaToken) {
        return res.status(400).json({
            success: false,
            message: "CAPTCHA required"
        });
    }

    try {
        const googleVerifyUrl = "https://www.google.com/recaptcha/api/siteverify";

        const formdata = new URLSearchParams();
        formdata.append("secret", process.env.RECAPTCHA_SECRET_KEY); 
        formdata.append("response", captchaToken);

        const captchaResponse = await fetch(googleVerifyUrl, {
            method: "POST",
            body: formdata
        });

        const captchaData = await captchaResponse.json();

        if (!captchaData.success) { 
            return res.status(400).json({
                success: false,
                message: "Captcha Failed"
            });
        }
    } catch (error) {
        console.log("Captcha Error : ", error);
        return res.status(500).json({ 
            success: false,
            message: "Error verifying CAPTCHA"
        });
    }

     // LOGIN Check 
    try {
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide the email and password"
            });
        }

        const existuser = await user.findOne({ email });
        if (!existuser) {
            return res.status(400).json({
                success: false,
                message: "Invalid Email"
            });
        }

       
        const correctpassword = await bcrypt.compare(password, existuser.password);
        if (!correctpassword) {
            return res.status(400).json({
                success: false,
                message: "Invalid Password"
            });
        }

        const useraccount = await account.findOne({ userid: existuser._id });
        
        
        if (!useraccount) {
            return res.status(404).json({
                success: false,
                message: "Bank account not found for this user"
            });
        }

        const currentBalance = await calculatetruebalance(useraccount._id);

        const token = jwt.sign(
            { userid: existuser._id },
            process.env.JWT_SECRET || "fallback secret key",
            { expiresIn: "15m" } 
        );

        return res.status(200).json({
            success: true,
            message: "Login Sucessfully",
            token: token,
            user: {
                id: existuser._id,
                name: `${existuser.firstname} ${existuser.lastname}`,
                email: existuser.email
            },
            account: {
                accountid: useraccount._id,
                accountnumber: useraccount.accountnumber,
                
                balance: currentBalance, 
            }
        });

    } catch (error) {
        console.log("Error Occured", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};