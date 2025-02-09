import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load enviroment variables
dotenv.config();

export async function sendWelcomeEmail(email: string, name: string) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Welcome to Luca Lombardi",
      html: `<h1>Welcome, ${name}!</h1>
            <p>We're excited to have you on board. Let us know if you need any help!</p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${email}`);
  } catch (e) {
    console.error("Error sending welcome email:", e);
  }
}
