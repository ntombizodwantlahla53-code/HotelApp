import { Request, Response } from "express";
import * as roomService from "./../services/roomService";


export const addRoom = async (
    req: Request,
    res: Response
) => {
  try {
    if (!req.user) {
            return res.status(401).json({message: "Not authorized"});
        }
        if (req.user.role.toLowerCase() !== "admin") {
            return res.status(403).json({message: "Only admins can add rooms"});
        }
        const hotel_id = Number(req.body.hotel_id);
        if(!hotel_id || isNaN(hotel_id)){
          return res.status(400).json({ message: "hotel_id is required"})
        }
    const newRoom = await roomService.createRoom(req.body,hotel_id);

    res.status(201).json(newRoom);
  } catch (error) {
    res.status(500).json({ message: "Error in creating room" });
  }
};

export const getAllrooms = async (req: Request, res: Response) => {
  try {
    const hotel_id = parseInt(req.params.hotel_id as string, 10);
    if(!hotel_id || isNaN(hotel_id)){
          return res.status(400).json({ message: "hotel_id is required"})
        }
    const rooms = await roomService.findAllRooms(hotel_id);
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Error retreiving rooms" });
  }
};

export const deleteRoomById = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
            return res.status(401).json({message: "Not authorized"});
        }
        if (req.user.role.toLowerCase() !== "admin") {
            return res.status(403).json({message: "Only admins can delete rooms"});
        }
    const room_id = parseInt(req.params.room_id as string, 10);
    const deleteRoom = await roomService.deleteRoom(room_id);

    if (!deleteRoom) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.status(200).json({ message: "Room Deleted Succesfully" });
  } catch (error) {
    res.status(500).json({ message: "error deleting room" });
  }
};