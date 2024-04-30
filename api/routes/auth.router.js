import express from "express";
import { deleteAccounts, signIn, signOut, signUp, verifyEmail } from "../controllers/auth.controllers.js";
import { userValidator } from "../models/checkUser.model.js";

const router = express.Router();

router.post("/signup", userValidator, signUp);
router.post("/signin", signIn);
router.post("/signout", signOut);
router.post("/verifyEmail/:emailToken", verifyEmail);
router.delete("/deleteAccounts", deleteAccounts);

export default router;
