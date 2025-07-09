import { Router } from "express";
import { body } from "express-validator";
import * as userController from "../controllers/user.controller.js";
import * as authMiddleware from "../middleware/auth.middleware.js";
const router = Router();

router.post('/register',
  [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 3 }).withMessage('Password must be at least 3 characters long')
  ],
  userController.createUserController
);

router.post('/login',
  [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  userController.loginUserController
);
router.get('/profile',authMiddleware.authUser ,userController.getUserProfileController);

router.get('/logout', authMiddleware.authUser, userController.logoutController);

router.get('/all',authMiddleware.authUser, userController.getAllUsersController)
export default router;
