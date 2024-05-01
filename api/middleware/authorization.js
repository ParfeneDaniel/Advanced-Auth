import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

export const authorization = (req, res, next) => {
  try {
    const header = req.header("Authorization");
    if (header) {
      const accessToken = header.split(" ")[1];
      jwt.verify(accessToken, ACCESS_TOKEN_SECRET, (error, user) => {
        if (error) {
          return res.status(403).json({ message: "Token is not valid" });
        }
        req.user = user;
        next();
      });
    } else {
      return res.status(401).json({ errors: "You are not authentificated" });
    }
  } catch (error) {
    console.log(error.message);
  }
};
