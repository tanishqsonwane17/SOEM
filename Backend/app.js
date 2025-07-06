import dotenv from 'dotenv';
dotenv.config(); 
import express from 'express';
import cors from 'cors';
import cookieParser  from 'cookie-parser'
import morgan from 'morgan';
import userRoutes from './routes/user.routes.js';
import dbConnection from './db/db.js';

const app = express();

app.use(cookieParser());
dbConnection();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

export default app;
