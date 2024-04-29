import express from "express";
import { signIn, signOut, signUp } from "../controllers/auth.controllers.js";
import { userValidator } from "../models/checkUser.model.js";

const router = express.Router();

router.post("/signup", userValidator, signUp);
router.post("/signin", signIn);
router.post("/signout", signOut);

export default router;
