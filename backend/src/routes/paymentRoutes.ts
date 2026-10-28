import { Router } from "express";
import { startPayment, verifyPayment, getAllPayments } from "../controllers/paymentControllers";
import { protect } from "../middleware/authmiddleware";

const router = Router();

router.post("/bookings/:booking_id/pay", protect, startPayment);
router.get("/payments/verify/:reference", protect, verifyPayment);
router.get("/payments", protect, getAllPayments);

export default router;