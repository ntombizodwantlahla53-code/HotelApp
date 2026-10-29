import { Router } from "express";
import { addReview, getReviews, removeReview } from "../controllers/reviewControllers";
import { protect } from "../middleware/authmiddleware";

const router = Router();

router.get("/hotels/:hotel_id/reviews", getReviews);
router.post("/hotels/:hotel_id/reviews", protect, addReview);
router.delete("/reviews/:review_id", protect, removeReview);

export default router;