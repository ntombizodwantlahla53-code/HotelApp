import { Router } from "express";
import { addHotel, getAllhotels, deleteHotelById } from "../controllers/hotelControllers";

const router = Router();

router.post('/hotels', addHotel);
router.get('/hotels', getAllhotels)
router.delete('/hotels/:hotel_id', deleteHotelById)

export default router;