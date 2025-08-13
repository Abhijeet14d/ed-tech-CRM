import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import session from 'express-session';
import { RedisStore } from 'connect-redis';
import passport from 'passport';
import cors from 'cors';

import connectDB from './config/db.js';
import "./config/passport.js";
import authRouter from './routes/authRouter.js';
import studentRouter from './routes/studentRoute.js';
import campaignRouter from './routes/campaignRoutes.js';
import { client, connectRedis } from './config/redisClient.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:5173','https://ed-tech-crm.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

// Connect to databases
try {
  await connectRedis();
  await connectDB();
} catch (error) {
  console.error('Database connection failed:', error);
  process.exit(1);
}

app.use(express.json());

const redisStore = new RedisStore({
  client: client,
  prefix: "minicrm:sess:",
});

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1); // enable secure cookies behind proxy
}

app.use(session({
  store: redisStore,
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // only send cookie over HTTPS
    httpOnly: true,
    maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});