import { Request, Response } from "express";
import * as paymentService from "../services/paymentService";
import { sendEmailToAdmin } from "../services/emailService";

export const payBooking = async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: "Not authorized" });
    }
    try {
        const booking = await paymentService.markBookingAsPaid(
            Number(req.params.booking_id), req.user.id
        );
        if (!booking) {
            return res.status(404).json({ message: "Booking not found or already paid" });
        }
        sendEmailToAdmin(
            "New payment received",
            `${req.user.name} (${req.user.email}) paid R${booking.total_price} for booking number ${booking.booking_id}`
        ).catch(() => console.log("Email failed to send"));
        return res.status(200).json(booking);
    } catch {
        return res.status(500).json({ message: "Error making payment" });
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