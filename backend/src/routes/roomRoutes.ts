import { Router } from "express";
import { addRoom, getAllrooms, deleteRoomById } from "../controllers/roomControllers";
import { protect } from "../middleware/authmiddleware";

const router = Router();

router.get('/hotels/:hotel_id/rooms', getAllrooms);
router.post('/rooms', protect, addRoom);
router.delete('/rooms/:room_id', protect, deleteRoomById);

export default router;