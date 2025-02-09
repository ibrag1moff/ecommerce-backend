import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load enviroment variables
dotenv.config();

export async function sendVerificationEmail(
  email: string,
  verificationToken: string
) {
  try {
    // Construct the verification link
    const verificationLink = `${process.env.CLIENT_URL}/auth/verify-email?code=${verificationToken}`;

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Email content
    const mailOptions = {
      from: "Luca lombardi",
      to: email,
      subject: "Verify Your Email",
      text: `Click the link to verify your account: ${verificationLink}`,
      html: `<p>Click the link to verify your account:</p> 
         <a style="background: red" href="${verificationLink}">Verify your account</a>`,
    }; // Send the email
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
  } catch (e) {
    console.error("Error sending verification email:", e);
  }
}
