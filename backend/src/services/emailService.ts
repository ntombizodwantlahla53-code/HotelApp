import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD }
});

export const sendEmail = async (to: string, subject: string, text: string) => {
    try {
        await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, text });
    } catch (error) {
        console.log("Email failed to send:", error);
    }
};

export const sendEmailToAdmin = async (subject: string, text: string) => {
    await sendEmail(process.env.ADMIN_EMAIL as string, subject, text);
};