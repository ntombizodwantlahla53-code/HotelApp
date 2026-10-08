import express from 'express';
import dotenv from "dotenv";
import {textDbConnection} from "./config/database"


dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await textDbConnection();
app.use(express.json());
app.listen(PORT, () =>
{
    console.log(`server is running at http://localhost:${PORT}`);
})
}
startServer()
