import account from "../models/accountschema.js";
import transaction from "../models/transactionschema.js";
import { calculatetruebalance } from "../utils/balancecalculator.js";

export const getdashboarddata = async (req, res) => {
    try {
        if (!req.user || !req.user.userid) {
            return res.status(401).json({ success: false, message: "Unauthorized access" });
        }

        const user_id = req.user.userid;

        const useraccount = await account.findOne({ userid: user_id });
        if (!useraccount) {
            return res.status(404).json({ success: false, message: "Account not found" });
        }

        const currentBalance = await calculatetruebalance(useraccount._id);

        const recenttransactions = await transaction.find({ accountid: useraccount._id })
            .sort({ createdAt: -1 }) 
            .limit(10);

        return res.status(200).json({
            success: true,
            data: {
                accountId: useraccount._id,
                accountNumber: useraccount.accountnumber,
                currency: useraccount.currency,
                status: useraccount.status,
                balance: currentBalance,
                recenttransactions: recenttransactions
            }
        });

    } catch (error) {
        console.error("Dashboard Fetch Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error loading dashboard" });
    }
};