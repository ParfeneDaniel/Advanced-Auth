import { checkSchema } from "express-validator";

export const userValidator = checkSchema({
  firstName: {
    in: "body",
    isString: true,
    notEmpty: true,
    trim: true,
    escape: true,
  },
  lastName: {
    in: "body",
    isString: true,
    notEmpty: true,
    trim: true,
    escape: true,
  },
  username: {
    in: "body",
    isString: true,
    notEmpty: true,
    trim: true,
    escape: true,
  },
  email: {
    in: "body",
    isEmail: true,
    normalizeEmail: {
      options: { gmail_remove_subaddress: true },
    },
  },
  password: {
    in: "body",
    isString: true,
    notEmpty: true,
    trim: true,
    escape: true,
  },
});
