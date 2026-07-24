import jwt from "jsonwebtoken";
// 1. FIXED: Import your secure config file instead of using process.env directly
import config from "../config/config.js"; 

export const verifyToken = (req, res, next) => {
    
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "Access Denied: Missing or malformed token" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const verified = jwt.verify(token, config.JWT_SECRET);
        
        req.user = verified; 
        
        next(); 
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ success: false, message: "Session expired. Please log in again." });
        }
        return res.status(403).json({ success: false, message: "Invalid Token" });
    }
};