import { Router } from "express";
import { getAllReservations, setReservationStatus, updateReservation } from "../controllers/reservationControllers";
import { protect } from "../middleware/authmiddleware";

const router = Router();

router.get("/reservations", protect, getAllReservations);
router.put("/reservations/:booking_id", protect, updateReservation);
router.patch("/reservations/:booking_id/status", protect, setReservationStatus);

export default router;