import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';
import http from 'http';
const server  = http.createServer(app)
const PORT = process.env.PORT;


server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
export default server;