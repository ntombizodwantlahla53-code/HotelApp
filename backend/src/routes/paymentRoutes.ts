import { Router } from "express";
import { payBooking, getAllPayments } from "../controllers/paymentControllers";
import { protect } from "../middleware/authmiddleware";

const router = Router();

router.post("/bookings/:booking_id/pay", protect, payBooking);
router.get("/payments", protect, getAllPayments);

export default router;