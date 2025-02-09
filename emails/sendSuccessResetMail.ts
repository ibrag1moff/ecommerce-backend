import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export async function sendSuccessResetEmail(email: string, name: string) {
  try {
    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Email content
    const mailOptions = {
      from: "Luca Lombardi",
      to: email,
      subject: "Your password was successfully changed",
      html: `<h1>Hi ${name}, Your password was changed blublbubhgiudbfuidufi</h1>`,
    };

    // Send the mail
    await transporter.sendMail(mailOptions);
    console.log(`Reset password email sent to ${email}`);
  } catch (e) {
    console.error(e);
  }
}
