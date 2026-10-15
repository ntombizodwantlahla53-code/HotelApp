import express from 'express';
import dotenv from "dotenv";
import {textDbConnection} from "./config/database"
import authRoutes from "./routes/authRoutes"
import cors from "cors"

dotenv.config();

const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
}));

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await textDbConnection();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.listen(PORT, () =>
{
    console.log(`server is running at http://localhost:${PORT}`);
})
}
startServer()
