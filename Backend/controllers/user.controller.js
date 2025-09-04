import { validationResult } from "express-validator";
import * as userService from "../services/user.service.js";
import usermodel from "../models/user.model.js";
import redisClient from "../services/redis.service.js";
export const createUserController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await userService.createUser({
      email: req.body.email,
      password: req.body.password,
    });

    const token = user.generateAuthToken();
    delete user._doc.password;
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const loginUserController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { email, password } = req.body;
    const user = await usermodel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await user.isValidPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = user.generateAuthToken();
    delete user._doc.password;
    res.cookie("token", token);
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const getUserProfileController = async (req, res) => {
  res.status(200).json({
    user: req.user,
  });
};

export const logoutController = async (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization.split(" ")[1];
    await redisClient.set(token, "logout", "EX", 60 * 60 * 24); // Set token in Redis with 1 hour expiration
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error logging out" });
  }
};
export const getAllUsersController = async (req, res) => {
  try {
    const LoggedInUser = await usermodel.findOne({
      email: req.user.email,
    });
    const allUsers = await userService.getAllUsers({
      userid: LoggedInUser._id,
    });
    return res.status(200).json({
      users: allUsers,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err.message });
  }
};
