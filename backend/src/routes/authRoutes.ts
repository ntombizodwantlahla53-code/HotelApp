import { Router } from "express";
import { register, login,  getAllusers, deleteUserById} from "../controllers/authControllers"

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.get('/users', getAllusers)
router.delete('/users/:id', deleteUserById)

export default router;