import { Request, Response } from "express";
import * as reservationService from "../services/reservationService";

const checkAdmin = (req: Request, res: Response) => {
    if (!req.user) {
        res.status(401).json({ message: "Not authorized" });
        return false;
    }
    if (req.user.role.toLowerCase() !== "admin") {
        res.status(403).json({ message: "Only admins can manage reservations" });
        return false;
    }
    return true;
};

export const getAllReservations = async (req: Request, res: Response) => {
    if (!checkAdmin(req, res)) return;
    try {
        const reservations = await reservationService.findAllReservations();
        return res.status(200).json(reservations);
    } catch {
        return res.status(500).json({ message: "Error retrieving reservations" });
    }
};

export const setReservationStatus = async (req: Request, res: Response) => {
    if (!checkAdmin(req, res)) return;
    const { booking_status } = req.body;
    if (booking_status !== "Approved" && booking_status !== "Cancelled") {
        return res.status(400).json({ message: "Status must be Approved or Cancelled" });
    }
    try {
        const reservation = await reservationService.changeReservationStatus(
            Number(req.params.booking_id), booking_status
        );
        if (!reservation) {
            return res.status(404).json({ message: "Reservation not found" });
        }
        return res.status(200).json(reservation);
    } catch {
        return res.status(500).json({ message: "Error updating status" });
    }
};

export const updateReservation = async (req: Request, res: Response) => {
    if (!checkAdmin(req, res)) return;
    const { check_in, check_out, guests } = req.body;
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(check_in) || !datePattern.test(check_out) || check_out <= check_in) {
        return res.status(400).json({ message: "Check-out must be after check-in" });
    }
    if (!Number.isInteger(Number(guests)) || Number(guests) < 1) {
        return res.status(400).json({ message: "Enter a valid number of guests" });
    }
    try {
        const reservation = await reservationService.changeReservationDetails(
            Number(req.params.booking_id), check_in, check_out, Number(guests)
        );
        if (!reservation) {
            return res.status(404).json({ message: "Reservation not found" });
        }
        return res.status(200).json(reservation);
    } catch (error) {
        const message = error instanceof Error ? error.message : "";
        if (message === "TOO_MANY_GUESTS") {
            return res.status(400).json({ message: "Guests exceed this room's capacity" });
        }
        if (message === "ROOM_FULL") {
            return res.status(409).json({ message: "This room is fully booked for those dates" });
        }
        return res.status(500).json({ message: "Error updating reservation" });
    }
};