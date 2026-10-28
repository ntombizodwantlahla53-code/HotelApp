import { Router } from "express";
import { addHotel, getAllhotels, deleteHotelById, getAvailableHotels, updateHotelById } from "../controllers/hotelControllers";
import { protect } from "../middleware/authmiddleware";

const router = Router();

router.get('/hotels', getAllhotels);
router.get('/hotels/available', getAvailableHotels);
router.post('/hotels', protect, addHotel);
router.put('/hotels/:hotel_id', protect, updateHotelById);
router.delete('/hotels/:hotel_id', protect, deleteHotelById);

export default router;
