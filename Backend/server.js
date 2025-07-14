import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';
import http from 'http';
import {Server} from 'socket.io'
const PORT = process.env.PORT;


const server  = http.createServer(app)
const io = new Server(server);
io.on('connection', client => {
  console.log('a user connected')
  client.on('event', data => { /* … */ });
  client.on('disconnect', () => { /* … */ });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
export default server;