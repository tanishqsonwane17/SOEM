import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';
import http from 'http';
import {Server} from 'socket.io'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose';
const PORT = process.env.PORT;
import projectModel from './models/project.model.js'

const server  = http.createServer(app)
const io = new Server(server,{
  cors:{
    origin:'*'
  }
})

io.use(async (socket, next) => {
  try {
    const authHeader = socket.handshake.headers.authorization;
    const token = socket.handshake.auth?.token || (authHeader && authHeader.split(' ')[1]);
    const projectId = socket.handshake.query.projectId;

    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
      return next(new Error('Invalid or missing projectId'));
    }

    socket.project = await projectModel.findById(projectId); 

    if (!token) {
      return next(new Error('Authentication token missing'));
    }

    const user = jwt.verify(token, process.env.JWT_SECRET);
    if (!user) {
      return next(new Error('Authentication Error'));
    }

    socket.user = user;
    next();
  } catch (err) {
    next(err);
  }
});

io.on('connection', socket => {
   socket.roomId =  socket.project._id.toString()
  socket.join(socket.roomId)
  socket.on('project-message',data=>{
    socket.broadcast.to(socket.roomId).emit('project-message',data)
  })
  socket.on('event', data => { 
  
  });
  socket.on('disconnect', () => {
    socket.leave(socket.roomId);
   });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
export default server;