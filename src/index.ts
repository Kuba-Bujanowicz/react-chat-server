import express, { Express } from "express";
import { createServer } from "http";
import dotenv from 'dotenv'
import { Routes } from "./routes";

const port = process.env.PORT || 4000;

dotenv.config();

const app: Express = express();

// Routes
app.use(Routes.UserRoutes)

const httpServer = createServer(app);

httpServer.listen(4000, () => {
    console.log(`⚡️ [server]: Server is running at https://localhost:${port}`);
});