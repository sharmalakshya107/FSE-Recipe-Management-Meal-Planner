import nodemailer from "nodemailer";
import { config } from "../../config/index.js";
import { verificationEmailTemplate } from "./templates/verificationEmail.js";
import { passwordResetEmailTemplate } from "./templates/passwordResetEmail.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASS,
  },
});

export const emailService = {
  sendVerificationEmail: async (email: string, token: string) => {
    const verificationLink = `${config.FRONTEND_URL}/verify-email?token=${token}`;

    const mailOptions = {
      from: `"Recipe Planner" <${config.EMAIL_USER}>`,
      to: email,
      subject: "Verify your email - Recipe Planner",
      html: verificationEmailTemplate(verificationLink),
    };

    await transporter.sendMail(mailOptions);
  },

  sendPasswordResetEmail: async (email: string, token: string) => {
    const resetLink = `${config.FRONTEND_URL}/reset-password?token=${token}`;

    const mailOptions = {
      from: `"Recipe Planner" <${config.EMAIL_USER}>`,
      to: email,
      subject: "Reset your password - Recipe Planner",
      html: passwordResetEmailTemplate(resetLink),
    };

    await transporter.sendMail(mailOptions);
  },
};
