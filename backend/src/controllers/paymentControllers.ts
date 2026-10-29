import { Request, Response } from "express";
import * as paymentService from "../services/paymentService";
import { createPaystackPayment, checkPaystackPayment } from "../services/paystackService";
import { sendEmail, sendEmailToAdmin } from "../services/emailService";

export const startPayment = async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: "Not authorized" });
    }
    try {
        const booking = await paymentService.findBookingToPay(
            Number(req.params.booking_id), req.user.id
        );
        if (!booking) {
            return res.status(404).json({ message: "Booking not found or already paid" });
        }
        const payment = await createPaystackPayment(
            req.user.email, booking.total_price, booking.booking_id
        );
        return res.status(200).json({ payment_url: payment.authorization_url });
    } catch (error) {
        console.log("Paystack error:", error);
        return res.status(500).json({ message: "Error starting payment" });
    }
};

export const verifyPayment = async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: "Not authorized" });
    }
    try {
        const payment = await checkPaystackPayment(String(req.params.reference));
        if (payment.status !== "success") {
            return res.status(400).json({ message: "Payment was not successful" });
        }
        const booking = await paymentService.markBookingAsPaid(
            Number(payment.metadata.booking_id), req.user.id
        );
        if (!booking) {
            return res.status(200).json({ message: "Payment already recorded" });
        }
        sendEmailToAdmin(
            "New payment received",
            `${req.user.name} (${req.user.email}) paid R${booking.total_price} for booking number ${booking.booking_id}`
        ).catch((error) => console.log("Email failed to send:", error.message));
        sendEmail( req.user.email, "Payment received",
         `Hi ${req.user.name}, we received your payment of R${booking.total_price} for booking number ${booking.booking_id}. Thank U..`
        );
        return res.status(200).json(booking);
    } catch (error) {
        console.log("Paystack error:", error);
        return res.status(500).json({ message: "Error checking payment" });
    }
};

export const getAllPayments = async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: "Not authorized" });
    }
    if (req.user.role.toLowerCase() !== "admin") {
        return res.status(403).json({ message: "Only admins can view payments" });
    }
    try {
        const payments = await paymentService.findAllPayments();
        return res.status(200).json(payments);
    } catch {
        return res.status(500).json({ message: "Error retrieving payments" });
    }
};