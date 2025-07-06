import { validationResult } from 'express-validator';
import * as userService from '../services/user.service.js';
import  usermodel from '../models/user.model.js';
import { urlencoded } from 'express';

export const createUserController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await userService.createUser({
      email: req.body.email,
      password: req.body.password
    });

    const token = user.generateAuthToken();
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
        const{email, password} = req.body
        const user = await usermodel.findOne({ email }).select('+password');
        if (!user) {    
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await user.isValidPassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        const token = user.generateAuthToken();
        res.status(200).json({ user, token });
    }

    catch (error) {
        res.status(400).json({ message: error.message });
    }
}