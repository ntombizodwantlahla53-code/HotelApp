import { Router } from "express";
import { addRoom } from "../controllers/roomControllers";
import { protect } from "../middleware/authmiddleware";

const router = Router();

router.use(protect)

router.post('/rooms', addRoom);


export default router;