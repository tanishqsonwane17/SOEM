// Load environment variables
import dotenv from 'dotenv';
dotenv.config();
import dbConnection from './db/db.js'
dbConnection();
import app from './app.js';
import http from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import projectModel from './models/project.model.js';
import { generateContent } from './services/ai.service.js';

const PORT = process.env.PORT;

// Create HTTP server and Socket.io instance
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});
// Middleware for authentication and project validation
io.use(async (socket, next) => {
  try {
    const authHeader = socket.handshake.headers.authorization;
    const token = socket.handshake.auth?.token || (authHeader && authHeader.split(' ')[1]);
    const projectId = socket.handshake.query.projectId;

    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
      return next(new Error('Invalid or missing projectId'));
    }

    const project = await projectModel.findById(projectId);
    if (!project) {
      return next(new Error('Project not found'));
    }

    if (!token) {
      return next(new Error('Authentication token missing'));
    }

    let user;
    try {
      user = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return next(new Error('Invalid token'));
    }

    socket.user = user;
    socket.project = project;
    next();
  } catch (err) {
    console.error("Middleware error:", err.message || err);
    next(err);
  }
});

// Socket event handling
io.on('connection', (socket) => {
  socket.roomId = socket.project._id.toString();
  socket.join(socket.roomId);

  console.log(` User connected to room: ${socket.roomId}, user: ${socket.user?.email}`);

  socket.on('project-message', async (data) => {
    try {
      const message = data.message;
      const aiPresenting = message.includes('@ai');
      socket.broadcast.to(socket.roomId).emit('project-message', data);

      if (aiPresenting) {
        const prompt = message.replace('@ai', '').trim();
        console.log(" AI Prompt Received:", prompt);

        const result = await generateContent(prompt);

        if (!result || typeof result !== 'string' || result.trim() === '') {
          console.error(" Invalid AI response:", result);
          return io.to(socket.roomId).emit('project-message', {
            message: ' AI returned an invalid or empty response.',
            sender: {
              id: 'ai',
              email: 'AI',
            },
          });
        }

        console.log(" AI Response:", result);

        return io.to(socket.roomId).emit('project-message', {
          message: result,
          sender: {
            id: 'ai',
            email:'AI',
          },
        });
      }

      // Broadcast normal user message
      

    } catch (error) {
      console.error(" Error in project-message handler:", error.message || error);

      io.to(socket.roomId).emit('project-message', {
        message: ' Something went wrong while processing your message.',
        sender: {
          id: 'system',
          email: 'Server',
        },
      });
    }
  });

  socket.on('disconnect', () => {
    console.log(`🔌 User disconnected from room: ${socket.roomId}`);
    socket.leave(socket.roomId);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default server;
