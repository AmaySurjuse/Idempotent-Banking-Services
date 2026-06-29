import express from "express";
import { registeruser } from "../controllers/usercontroller";
import { loginuser } from "../controllers/userlogin";

const router = express.Router();

router.post("/register" ,  registeruser);

router.get("/login", loginuser);

export default router;