import dotenv from 'dotenv';
dotenv.config(); 
import express from 'express';
import cors from 'cors';
import cookieParser  from 'cookie-parser'
import morgan from 'morgan';
import userRoutes from './routes/user.routes.js';
import dbConnection from './db/db.js';
import projectRoutes from './routes/project.routes.js';
import airRoutes from './routes/ai.routes.js';
const app = express();

app.use(cookieParser());
dbConnection();

const allowedOrigins = [
  'https://soen-one.vercel.app/', 
  'http://localhost:3000'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/users', userRoutes);





app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use('/projects', projectRoutes);
app.use('/ai', airRoutes);

export default app;
