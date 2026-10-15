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
    const newRoom = await roomService.createRoom(req.body,req.user.id);
      await roomService.createRoom(req.body,req.user.id);

    res.status(201).json(newRoom);
  } catch (error) {
    res.status(500).json({ message: "Error in creating room" });
  }
};