import jwt from "jsonwebtoken";
import { client } from "../server.js";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

export const generateTokenAndSetCookies = async (res, user) => {
  try {
    const accesToken = jwt.sign({ id: user._id }, ACCESS_TOKEN_SECRET, {
      expiresIn: "10m",
    });
    const refreshToken = jwt.sign({ id: user._id }, REFRESH_TOKEN_SECRET, {
      expiresIn: "15d",
    });
    await client.setEx(refreshToken, 15 * 24 * 60 * 60, "value");
    res
      .cookie("refreshToken", refreshToken, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: true,
      })
      .json({ message: "You signin successfully", user, accesToken });
  } catch (error) {
    console.log(error.message);
  }
};
