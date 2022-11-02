import express, { Express } from "express";
import { createServer } from "http";
import dotenv from 'dotenv'
import cors from 'cors'
import { Routes } from "./routes";

const port = process.env.PORT || 4000;

dotenv.config();

const app: Express = express();

app.use(express.json())
app.use(cors())

// Routes
app.use('/', Routes.AuthRoutes)

const httpServer = createServer(app);

httpServer.listen(4000, () => {
    console.log(`⚡️ [server]: Server is running at http://localhost:${port}`);
});