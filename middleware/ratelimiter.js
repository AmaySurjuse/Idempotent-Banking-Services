import rateLimit from "express-rate-limit";

export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: { 
        success: false, 
        message: "Too many requests from this IP, please try again after 15 minutes." 
    },
    standardHeaders: true, 
    legacyHeaders: false, 
});

export const strictLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, 
    max: 10, 
    message: { 
        success: false, 
        message: "Too many attempts. Please try again in 5 minutes." 
    }
});