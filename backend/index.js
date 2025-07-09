import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';

import { createClient } from 'redis';
import { RedisStore } from 'connect-redis';

const redisClient = createClient();
await redisClient.connect();


import connectDB from './config/db.js';
import "./config/passport.js";
import authRouter from './routes/authRouter.js';
import studentRouter from './routes/studentRoute.js';
import campaignRouter from './routes/campaignRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 2 * 24 * 60 * 60 * 1000 // 2 days
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRouter);
app.use('/students', studentRouter);
app.use('/campaigns', campaignRouter);

app.get('/', (req, res) => {
  res.send('Welcome to the Minicrm API'); 
});


connectDB();
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});