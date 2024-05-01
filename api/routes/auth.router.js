import express from "express";
import { deleteAccounts, refresh, signIn, signOut, signUp, test, verifyEmail } from "../controllers/auth.controllers.js";
import { userValidator } from "../models/checkUser.model.js";
import { authorization } from "../middleware/authorization.js";

const router = express.Router();

router.post("/signup", userValidator, signUp);
router.post("/signin", signIn);
router.post("/signout", signOut);
router.post("/verifyEmail/:emailToken", verifyEmail);
router.post("/refresh", refresh);
router.delete("/deleteAccounts", deleteAccounts);
router.get("/test", authorization, test);

export default router;
