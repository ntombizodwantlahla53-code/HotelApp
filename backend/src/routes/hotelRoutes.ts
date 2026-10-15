import { Router } from "express";
import { addHotel, getAllhotels, deleteHotelById } from "../controllers/hotelControllers";
import { protect } from "../middleware/authmiddleware";

const router = Router();
router.use(protect)

router.post('/hotels', addHotel);
router.get('/hotels', getAllhotels)
router.delete('/hotels/:hotel_id', deleteHotelById)

export default router;
