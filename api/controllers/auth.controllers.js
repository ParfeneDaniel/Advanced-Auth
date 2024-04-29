import { validationResult } from "express-validator";

export const signUp = (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    res.status(201).json({ message: "All data is good" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", errors: error.message });
  }
};

export const signIn = (req, res) => {
  res.status(201).json({ message: "Success" });
};

export const signOut = (req, res) => {
  res.status(201).json({ message: "Success" }); 
};
