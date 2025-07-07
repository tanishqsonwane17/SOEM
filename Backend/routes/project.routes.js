import { Router } from "express";
import * as ProjectController from "../controllers/project.controller.js";
import * as authMiddleware from "../middleware/auth.middleware.js";
import { body } from "express-validator";
const router = Router();

router.post('/create',
    authMiddleware.authUser,
body('name').notEmpty().withMessage('Project name is required'),
ProjectController.createProject
)

export default router;