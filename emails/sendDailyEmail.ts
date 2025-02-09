import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load enviroment variables
dotenv.config();

export async function sendDailyEmail(email: string) {
  try {
    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: "Luca Lombardi",
      to: email,
      subject: "Daily reminder",
      text: "Hello this is your daily reminder",
      html: `<h1>Hello this is your daily reminder<h1/>`,
    });
  } catch (e) {
    console.error(e);
  }
}
