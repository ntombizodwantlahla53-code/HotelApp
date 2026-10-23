import { Router } from "express";
import {addBooking,getMyBookings,getRoomById} from "../controllers/bookingControllers";
import { protect } from "../middleware/authmiddleware";

const router = Router();

router.get("/rooms/:room_id", getRoomById);
router.post("/bookings", protect, addBooking);
router.get("/bookings/my", protect, getMyBookings);

export default router;