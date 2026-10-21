import { Router } from "express";
import { addRoom ,getAllrooms, deleteRoomById,} from "../controllers/roomControllers";
import { protect } from "../middleware/authmiddleware";

const router = Router();

router.get('/hotels/:hotel_id/rooms', getAllrooms)
router.use(protect)

router.post('/rooms', addRoom);
router.delete('/rooms/:room_id', deleteRoomById)


export default router;