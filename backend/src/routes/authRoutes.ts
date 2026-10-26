import { Router } from "express";
import { register, login,  getAllusers, deleteUserById, getProfile, updateProfile} from "../controllers/authControllers"
import { protect } from "../middleware/authmiddleware";

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.get('/profile', protect, getProfile)
router.put('/profile', protect, updateProfile)
router.get('/users', protect, getAllusers)
router.delete('/users/:id', protect, deleteUserById)

export default router;