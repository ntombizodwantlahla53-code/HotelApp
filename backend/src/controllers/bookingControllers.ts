import { Request, Response } from "express";
import * as bookingService from "../services/bookingService";

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
    const { room_id, check_in, check_out, guests } = req.body;
    if (!room_id || !check_in || !check_out || guests == null) {
        return res.status(400).json({message: "Room, dates and number of guests are required"});
    }
    if (!Number.isInteger(Number(guests)) || Number(guests) < 1) {
        return res.status(400).json({ message: "Enter a valid number of guests"});
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(check_in) || !/^\d{4}-\d{2}-\d{2}$/.test(check_out) || check_out <= check_in) {
        return res.status(400).json({ message: "Enter valid dates bcs Check-out must be after check-in."});
    }
    try {
        const booking = await bookingService.createBooking({
            user_id: req.user.id,
            room_id: Number(room_id),
            check_in,
            check_out,
            guests: Number(guests)
        });
        return res.status(201).json(booking);
    } catch (error) {
        const message = error instanceof Error ? error.message : "";
        if (message === "room not found") {
            return res.status(404).json({ message: "Room not found"});
        }
        if (message === "quest capacity") {
            return res.status(400).json({ message: "Number of guests exceeds this room's capacity"});
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