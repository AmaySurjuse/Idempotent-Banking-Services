import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";
import connectdb from "../config/database.js";
import userModel from "../models/userschema.js";
import accountModel from "../models/accountschema.js";
import transactionModel from "../models/transactionschema.js";

const seedData = async () => {
    await connectdb();
    
    console.log("🌱 Starting Database Seed...");

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const salt = await bcrypt.genSalt(10);
        const hashpassword = await bcrypt.hash("password123", salt);

        const users = await userModel.create([{
            firstname: "Alice", lastname: "Smith", email: "alice@example.com", 
            passwordhash: hashpassword, phonenumber: "1234567890", kycstatus: "VERIFIED"
        }, {
            firstname: "Bob", lastname: "Jones", email: "bob@example.com", 
            passwordhash: hashpassword, phonenumber: "0987654321", kycstatus: "VERIFIED"
        }], { session });

        console.log(`Created users: Alice (${users[0]._id}) and Bob (${users[1]._id})`);

        const accounts = await accountModel.create([{
            userid: users[0]._id, accountnumber: "1000000001", accounttype: "SAVINGS", currency: "INR", status: "ACTIVE"
        }, {
            userid: users[1]._id, accountnumber: "1000000002", accounttype: "SAVINGS", currency: "INR", status: "ACTIVE"
        }], { session });

        console.log(` Created accounts for Alice and Bob.`);

        // 3. Fund Accounts via Ledger (Dynamic Balance requires a CREDIT transaction)
        const systemTxnId1 = `TXN-SYS-${crypto.randomUUID()}`;
        const systemTxnId2 = `TXN-SYS-${crypto.randomUUID()}`;

        await transactionModel.create([{
            transactiongroupid: systemTxnId1,
            accountid: accounts[0]._id,
            type: 'CREDIT',
            amount: 5000, // Give Alice 5000
            status: 'SUCCESS',
            description: 'Initial System Deposit'
        }, {
            transactiongroupid: systemTxnId2,
            accountid: accounts[1]._id,
            type: 'CREDIT',
            amount: 5000, // Give Bob 5000
            status: 'SUCCESS',
            description: 'Initial System Deposit'
        }], { session });

        console.log(` Funded both accounts with 5000 INR via Ledger.`);

        await session.commitTransaction();
        session.endSession();
        console.log("🎉 Database seeding complete!");
        process.exit(0);

    } catch (error) {
        console.error(" Seeding failed:", error);
        await session.abortTransaction();
        session.endSession();
        process.exit(1);
    }
};

seedData();