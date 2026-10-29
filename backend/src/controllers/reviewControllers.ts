import { Request, Response } from "express";
import * as reviewService from "../services/reviewService";

export const addReview = async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: "Not authorized" });
    }
    if (req.user.role.toLowerCase() !== "customer") {
        return res.status(403).json({ message: "Only customers can leave reviews" });
    }
    const rating = Number(req.body.rating);
    const comment = String(req.body.comment || "").trim();
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Rating must be from 1 to 5" });
    }
    if (comment.length > 500) {
        return res.status(400).json({ message: "Comment can be 500 letters at most" });
    }
    try {
        const review = await reviewService.saveReview( Number(req.params.hotel_id), req.user.id, { rating, comment });
        return res.status(201).json(review);
    } catch {
        return res.status(500).json({ message: "Error saving review" });
    }
};

export const getReviews = async (req: Request, res: Response) => {
    try {
        const reviews = await reviewService.findHotelReviews(Number(req.params.hotel_id));
        return res.status(200).json(reviews);
    } catch {
        return res.status(500).json({ message: "Error retrieving reviews" });
    }
};

export const removeReview = async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: "Not authorized" });
    }
    try {
        const deleted = await reviewService.deleteReview(Number(req.params.review_id), req.user.id);
        if (!deleted) {
            return res.status(404).json({ message: "Review not found" });
        }
        return res.status(200).json({ message: "Review deleted" });
    } catch {
        return res.status(500).json({ message: "Error deleting review" });
    }
};