import jwt from "jsonwebtoken";
import redisClient from "../services/redis.service.js";
export const authUser = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    console.log("Received token:", token);
    const isTokenBlacklisted = await redisClient.get(token);
    if (isTokenBlacklisted) {
      res.cookie("token", " ");
      return res.status(401).json({ message: "Token is blacklisted" });
    }
    if (!token) {
      return res.status(401).json({ message: "unAuthorized user" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

  
    next();
  } catch (error) {
    res.status(400).json({ message: error });
  }
};
