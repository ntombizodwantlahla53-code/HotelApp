import { Request, Response } from "express";
import * as bookingService from "../services/bookingService";
import { sendEmail } from "../services/emailService";

export const getRoomById = async (req: Request, res: Response) => {
    try {
        const room = await bookingService.findRoomById( Number(req.params.room_id)
        );
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }
        return res.status(200).json(room);
    } catch {
        return res.status(500).json({message: "Error retrieving room"});
    }
};

export const addBooking = async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({message: "Not authorized"});
    }
    if (req.user.role.toLowerCase() !== "customer") {
        return res.status(403).json({message: "Only customers can make bookings"});
    }
    const { room_id, check_in, check_out, guests, number_of_rooms = 1 } = req.body;
    if (!room_id || !check_in || !check_out || guests == null) {
        return res.status(400).json({message: "Room, dates and number of guests are required"});
    }
    if (!Number.isInteger(Number(guests)) || Number(guests) < 1) {
        return res.status(400).json({ message: "Enter a valid number of guests"});
    }
    if (!Number.isInteger(Number(number_of_rooms)) || Number(number_of_rooms) < 1) {
        return res.status(400).json({ message: "Enter a valid number of rooms"});
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(check_in) || !/^\d{4}-\d{2}-\d{2}$/.test(check_out) || check_out <= check_in) {
        return res.status(400).json({ message: "Check-out must be after check-in."});
    }
    try {
        const booking = await bookingService.createBooking({
            user_id: req.user.id,
            room_id: Number(room_id),
            check_in,
            check_out,
            guests: Number(guests),
            number_of_rooms: Number(number_of_rooms)
        });
        sendEmail(
            req.user.email,
            "We received your booking",
            `Hi ${req.user.name},\n\nYour booking number ${booking.booking_id} is saved.\nCheck-in: ${check_in}\nCheck-out: ${check_out}\nRooms: ${booking.number_of_rooms}\nGuests: ${booking.guests}\nTotal: R${booking.total_price}\n\nPlease pay to confirm it. You can pay any time from your profile.`
        );
        return res.status(201).json(booking);
    } catch (error) {
        const message = error instanceof Error ? error.message : "";
        if (message === "room not found") {
            return res.status(404).json({ message: "Room not found"});
        }
        if (message === "quest capacity") {
            return res.status(400).json({ message: "Number of guests is too many for the rooms you chose"});
        }
        if (message === "ROOM_FULL") {
            return res.status(409).json({ message: "Not enough rooms are available for those dates"});
        }
        if (message === "INVALID_DATES") {
            return res.status(400).json({ message: "Check-out must be after check-in"});
        }
        return res.status(500).json({ message: "Error creating booking"});
    }
};

export const getMyBookings = async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: "Not authorized"});
    }
    try {
        const bookings = await bookingService.findMyBookings(req.user.id);
        return res.status(200).json(bookings);
    } catch {
        return res.status(500).json({ message: "Error retrieving bookings"});
    }
};