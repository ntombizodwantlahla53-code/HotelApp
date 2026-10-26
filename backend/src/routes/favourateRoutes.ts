import { Router } from "express";
import { getMyFavourites, addFavourite, deleteFavouriteById } from "../controllers/favourateControllers"
import { protect } from "../middleware/authmiddleware";

const router = Router();

router.get("/favourites", protect, getMyFavourites);
router.post("/favourites", protect, addFavourite);
router.delete("/favourites/:hotel_id", protect, deleteFavouriteById);

export default router;