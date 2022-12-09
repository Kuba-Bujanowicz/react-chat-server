require('dotenv').config();
import express, { Express } from 'express';
import { createServer } from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { Routes } from './routes';
import './database/index';

const port = process.env.PORT || 4000;
const app: Express = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

// Routes
app.use('/api/', Routes.AuthRoutes);
app.use('/api/', Routes.UserRoutes);
app.use('/api/', Routes.EmailRoutes);

const httpServer = createServer(app);

httpServer.listen(4000, () => {
  console.log(`⚡️ [server]: Server is running at http://localhost:${port}`);
});
