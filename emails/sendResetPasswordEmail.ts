import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load enviroment variables
dotenv.config();

export async function sendResetPasswordEmail(email: string, otpCode: string) {
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
      subject: "Reset Your Password",
      text: `Here is your otp  ${otpCode}`,
      html: `<p>Here is your otpcode:</p> 
               <h1>${otpCode}</h1>`,
    };

    // Send the mail
    await transporter.sendMail(mailOptions);
    console.log(`Reset password email sent to ${email}`);
  } catch (e) {
    console.error(e);
  }
}
