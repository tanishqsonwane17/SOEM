import dotenv from 'dotenv';
dotenv.config(); 
import express from 'express';
import cors from 'cors';
import cookieParser  from 'cookie-parser'
import morgan from 'morgan';
import userRoutes from './routes/user.routes.js';
;
import projectRoutes from './routes/project.routes.js';
import airRoutes from './routes/ai.routes.js';
const app = express();

app.use(cookieParser());


app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Hello SOEN!');
});
app.use('/projects', projectRoutes);
app.use('/ai', airRoutes);

export default app;
