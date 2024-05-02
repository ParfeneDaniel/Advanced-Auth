import bcrypt from "bcryptjs";
import crypto from "crypto";
import { validationResult } from "express-validator";
import User from "../models/user.model.js";
import { client } from "../server.js";
import {
  sendSecurityEmail,
  sendVerificationEmail,
} from "../utils/sendEmail.js";
import { generateTokenAndSetCookies } from "../utils/generateTokenAndSetCookies.js";
import { renewAccessToken } from "../utils/renewAccessToken.js";

export const signUp = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const { firstName, lastName, username, email, password } = req.body;
    const userInUse = await User.findOne({ $or: [{ username }, { email }] });
    if (userInUse) {
      return res
        .status(400)
        .json({ errors: "Username or email already in use" });
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const emailToken = crypto.randomBytes(64).toString("hex");
    const newUser = User({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      emailToken,
      isVerify: false,
      previousPasswords: hashedPassword,
    });
    await Promise.all([
      newUser.save(),
      client.setEx(emailToken, 3 * 60, "value"),
      sendVerificationEmail(newUser),
    ]);
    res.status(201).json({ message: "Your account was created" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", errors: error.message });
  }
};

export const signIn = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(403).json({ errors: "User or password not found" });
    }
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(403).json({ errors: "User or password not found" });
    }
    const isVerified = user.isVerify;
    if (!isVerified) {
      return res.status(403).json({ errors: "Account is not verified" });
    }
    const { password: hashedPassword, previousPasswords, ...rest } = user._doc;
    generateTokenAndSetCookies(res, rest);
    res.status(201);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", errors: error.message });
  }
};

export const signOut = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    await client.setEx(refreshToken, 1, "value");
    res
      .clearCookie("refreshToken")
      .status(201)
      .json({ message: "You signout successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", errors: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const emailToken = req.params.emailToken;
    const isTokenValid = await client.get(emailToken);
    if (!isTokenValid) {
      return res.status(401).json({
        errors: "Your account verification time expired. Please register again",
      });
    }
    const user = await User.findOne({ emailToken });
    user.emailToken = null;
    user.isVerify = true;
    await Promise.all([user.save(), client.setEx(emailToken, 1, "value")]);
    res.status(201).json({ message: "Your email was verify" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", errors: error.message });
  }
};

export const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(403).json({ errors: "You are not authentificated" });
    }
    const isValidToken = await client.get(refreshToken);
    if (!isValidToken) {
      return res.status(403).json({ errors: "Token is not valid" });
    }
    renewAccessToken(res, refreshToken);
    res.status(201);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", errors: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ errors: "User does not exist" });
    }
    const secureToken = crypto.randomBytes(64).toString("hex");
    await Promise.all([
      sendSecurityEmail(user, secureToken),
      client.setEx(secureToken, 3 * 60, "value"),
    ]);
    res.status(201).json({
      message: "Now you can reset your password",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", errors: error.message });
  }
};

export const reset = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const { username, secureToken, newPassword } = req.body;
    const isTokenValid = await client.get(secureToken);
    if (!isTokenValid) {
      return res.status(403).json({ errors: "Your secure token is not valid" });
    }
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ errors: "User does not exist" });
    }
    const previousPasswords = user.previousPasswords;
    for (const password of previousPasswords) {
      const isAlreadyUsed = bcrypt.compareSync(newPassword, password);
      if (isAlreadyUsed) {
        return res
          .status(403)
          .json({ errors: "This password was already used" });
      }
    }
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    user.previousPasswords.push(hashedPassword);
    user.password = hashedPassword;
    await Promise.all([user.save(), client.setEx(secureToken, 1, "value")]);
    res.status(201).json({ message: "Your password was reset" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", errors: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const { password, newPassword } = req.body;
    const id = req.user.id;
    const user = await User.findOne({ _id: id });
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(403).json({ errors: "Password is not correct" });
    }
    const previousPasswords = user.previousPasswords;
    for (const password of previousPasswords) {
      const isAlreadyUsed = bcrypt.compareSync(newPassword, password);
      if (isAlreadyUsed) {
        return res
          .status(403)
          .json({ errors: "This password was already used" });
      }
    }
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    user.previousPasswords.push(hashedPassword);
    user.password = hashedPassword;
    await user.save();
    res.status(201).json({ message: "Your password has been changed" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", errors: error.message });
  }
};

export const deleteAccounts = async (req, res) => {
  try {
    const unverifiedAccounts = await User.find({ isVerify: false });
    const deleteAccounts = unverifiedAccounts.map(async (account) => {
      const isTokenValid = await client.get(account.emailToken);
      if (!isTokenValid) {
        return User.findByIdAndDelete(account._id);
      }
      return null;
    });
    await Promise.all(deleteAccounts);
    res.status(201).json({ message: "Unverified accounts were deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", errors: error.message });
  }
};

export const test = (req, res) => {
  try {
    const id = req.user.id;
    res.status(201).json({ message: "Protected route", id });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", errors: error.message });
  }
};
