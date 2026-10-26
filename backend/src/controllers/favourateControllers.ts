import { Request, Response } from "express";
import * as favouriteService from "../services/favourateService"

export const getMyFavourites = async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: "Not authorized" });
    }
    try {
        const favourites = await favouriteService.findMyFavourates(req.user.id);
        return res.status(200).json(favourites);
    } catch {
        return res.status(500).json({ message: "Error retrieving favourites" });
    }
};

export const addFavourite = async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: "Not authorized" });
    }
    const hotel_id = Number(req.body.hotel_id);
    if (!hotel_id) {
        return res.status(400).json({ message: "hotel_id is required" });
    }
    try {
        const hotel = await favouriteService.createfavourate({ user_id: req.user.id, hotel_id });
        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }
        return res.status(201).json(hotel);
    } catch {
        return res.status(500).json({ message: "Error adding favourite" });
    }
};

export const deleteFavouriteById = async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: "Not authorized" });
    }
    try {
        const deleted = await favouriteService.deletefavourate(
            req.user.id,
            Number(req.params.hotel_id)
        );
        if (!deleted) {
            return res.status(404).json({ message: "Favourite not found" });
        }
        return res.status(200).json({ message: "Favourite removed" });
    } catch {
        return res.status(500).json({ message: "Error removing favourite" });
    }
};