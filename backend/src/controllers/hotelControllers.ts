import { Request, Response } from "express";
import * as hotelService from "./../services/hotelService";

export const addHotel = async (req: Request, res: Response) => {
  try {
    const newHotel = await hotelService.createHotel(req.body);
    res.status(201).json(newHotel);
  } catch (error) {
    res.status(500).json({ message: "Error in creating hotel" });
  }
};

export const getAllhotels = async (req: Request, res: Response) => {
  try {
    const hotels = await hotelService.findAllHotels();
    res.status(200).json(hotels);
  } catch (error) {
    res.status(500).json({ message: "Error retreiving hotels" });
  }
};

export const deleteHotelById = async (req: Request, res: Response) => {
  try {
    const hotel_id = parseInt(req.params.hotel_id as string, 10);
    const deleteHotel = await hotelService.deleteHotel(hotel_id);
    if (!deleteHotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    res.status(200).json({ message: "Hotel Deleted Succesfully" });
  } catch (error) {
    res.status(500).json({ message: "error deleting hotel" });
  }
};