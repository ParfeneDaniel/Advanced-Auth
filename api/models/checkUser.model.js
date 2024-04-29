import { checkSchema } from "express-validator";

export const userValidator = checkSchema({
  firstName: {
    in: ["body"],
    isLength: {
      options: { min: 3, max: 15 },
      errorMessage: "First name must be between 3 and 20 characters",
    },
    matches: {
      options: "^[A-Z][a-zA-Z]+$",
      errorMessage:
        "First name must contain only letters and begin with a big letter",
    },
    trim: true,
    escape: true,
  },
  lastName: {
    in: ["body"],
    isLength: {
      options: { min: 3, max: 15 },
      errorMessage: "Last name must be between 3 and 20 characters",
    },
    matches: {
      options: "^[A-Z][a-zA-Z]+$",
      errorMessage:
        "Last name must contain only letters and begin with a big letter",
    },
    trim: true,
    escape: true,
  },
  username: {
    in: ["body"],
    trim: true,
    escape: true,
    isLength: {
      options: { min: 3, max: 20 },
      errorMessage: "Username must be between 3 and 20 characters",
    },
    matches: {
      options: "^(?=.*[a-zA-z])[a-zA-Z0-9_]+$",
      errorMessage:
        "Username must contain a letter and can only contain alphanumeric characters and underscors",
    },
  },
  email: {
    in: ["body"],
    isEmail: true,
    normalizeEmail: {
      options: { gmail_remove_subaddress: true },
    },
  },
  password: {
    in: ["body"],
    isLength: {
      options: { min: 8, max: 20 },
      errorMessage: "Password must be between 8 and 20 characters",
    },
    matches: {
      options: "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).+$",
      errorMessage:
        "Password must contain at least one alphanumeric and special character",
    },
    trim: true,
    escape: true,
  },
});
