import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

export const renewAccessToken = (res, refreshToken) => {
  try {
    const decode = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    const accesToken = jwt.sign({ id: decode.id }, ACCESS_TOKEN_SECRET, {
      //expiresIn: "30s",
      expiresIn: "10m",
    });
    res.json({ message: "Your access token is renew", accesToken });
  } catch (error) {
    console.log(error.message);
  }
};
