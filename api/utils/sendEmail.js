import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;

export const sendVerificationEmail = async (user) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: true,
      auth: {
        user: EMAIL,
        pass: PASSWORD,
      },
    });
    const mailOptions = {
      from: EMAIL,
      to: user.email,
      subject: "Verify your email",
      html: `<p>Your email token is ${user.emailToken}. You have 2 minutes to verify your email.</p>`,
    };
    await transporter.sendMail(mailOptions);
    console.log("Email was send");
  } catch (error) {
    console.log(error.message);
  }
};


