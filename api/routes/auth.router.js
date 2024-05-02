import express from "express";
import {
  changePassword,
  deleteAccounts,
  forgotPassword,
  refresh,
  reset,
  signIn,
  signOut,
  signUp,
  test,
  verifyEmail,
} from "../controllers/auth.controllers.js";
import { userValidator } from "../models/checkUser.model.js";
import { authorization } from "../middleware/authorization.js";
import { passwordValidator } from "../models/checkPassword.model.js";

const router = express.Router();

router.post("/signup", userValidator, signUp);
router.post("/signin", signIn);
router.post("/signout", signOut);
router.post("/verifyEmail/:emailToken", verifyEmail);
router.post("/refresh", refresh);
router.post("/forgotPassword", forgotPassword);
router.post("/reset", passwordValidator, reset);
router.post(
  "/changePassword",
  authorization,
  passwordValidator,
  changePassword
);
router.delete("/deleteAccounts", deleteAccounts);
router.get("/test", authorization, test);

export default router;
