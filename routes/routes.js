import express from "express";
import { registeruser } from "../controllers/usercontroller.js";
import { loginuser } from "../controllers/userlogin.js";
import { transferfunds } from "../controllers/controllers.js";
import { getdashboarddata } from "../controllers/dashboardcontroller.js"; 
import { validateRequest } from "../middleware/validaterequest.js";
import { transferSchema } from "../validations/transferschema.js";
import { verifyToken } from "../middleware/auth.js"; 
import { idempotencycheck } from "../middleware/idempotency.js"; 
import { strictLimiter } from "../middleware/ratelimiter.js"; 

const router = express.Router();

router.post("/register", registeruser);

router.post("/login", strictLimiter, loginuser);

router.get("/dashboard", verifyToken, getdashboarddata);

router.post("/transfer", strictLimiter, verifyToken, idempotencycheck, validateRequest(transferSchema), transferfunds);

export default router;