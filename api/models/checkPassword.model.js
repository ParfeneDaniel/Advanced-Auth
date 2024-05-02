import { checkSchema } from "express-validator";

export const passwordValidator = checkSchema({
  newPassword: {
    in: ["body"],
    isLength: {
      options: { min: 8, max: 20 },
      errorMessage: "Password must be between 8 and 20 characters",
    },
    matches: {
      options: "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).+$",
      errorMessage:
        "New password must contain at least one alphanumeric and special character",
    },
    trim: true,
    escape: true,
  },
});
