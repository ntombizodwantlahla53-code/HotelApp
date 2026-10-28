import { Request, Response } from "express";
import * as hotelService from "./../services/hotelService";

export const addHotel = async (
    req: Request, 
    res: Response
) => {
  try {
    if (!req.user) {
            return res.status(401).json({message: "Not authorized"});
        }
        if (req.user.role.toLowerCase() !== "admin") {
            return res.status(403).json({message: "Only admins can add hotels"});
        }
    const newHotel = await hotelService.createHotel(req.body,req.user.id);
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
export const updateHotelById = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({message: "Not authorized"});
    }
    if (req.user.role.toLowerCase() !== "admin") {
      return res.status(403).json({message: "Only admins can update hotels"});
    }
    const hotel_id = parseInt(req.params.hotel_id as string, 10);
    const updatedHotel = await hotelService.updateHotel(hotel_id, req.body);

    if (!updatedHotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    res.status(200).json(updatedHotel);
  } catch (error) {
    res.status(500).json({ message: "Error updating hotel" });
  }
};

export const deleteHotelById = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
            return res.status(401).json({message: "Not authorized"});
        }
        if (req.user.role.toLowerCase() !== "admin") {
            return res.status(403).json({message: "Only admins can delete hotels"});
        }
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

export const getAvailableHotels = async (req: Request, res: Response) => {
  const check_in = String(req.query.check_in || "");
  const check_out = String(req.query.check_out || "");
  const hotel_name = String(req.query.hotel_name || "");
  const location = String(req.query.location || "");
  const min_price = req.query.min_price ? Number(req.query.min_price) : null;
  const max_price = req.query.max_price ? Number(req.query.max_price) : null;
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;

  if ((check_in || check_out) &&
     (!datePattern.test(check_in) || !datePattern.test(check_out) || check_out <= check_in)) {
    return res.status(400).json({ message: "Enter valid check-in and check-out dates" });
  }
  if ((min_price !== null && isNaN(min_price)) || (max_price !== null && isNaN(max_price))) {
    return res.status(400).json({ message: "Enter valid prices" });
  }

  try {
    const hotels = await hotelService.findAvailableHotels({
      check_in: check_in || null,
      check_out: check_out || null,
      hotel_name,
      location,
      min_price,
      max_price
    });
    res.status(200).json(hotels);
  } catch (error) {
    console.error("getAvailableHotels error:", error);
    res.status(500).json({ message: "Error searching hotels" });
  }
};