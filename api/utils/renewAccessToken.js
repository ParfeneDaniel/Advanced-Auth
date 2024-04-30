import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

export const renewAccessToken = (res, id) => {
  try {
    const accesToken = jwt.sign({ id }, ACCESS_TOKEN_SECRET, {
      expiresIn: "10m",
    });
    res.json({ message: "Your access token is renew", accesToken });
  } catch (error) {
    console.log(error.message);
  }
};
