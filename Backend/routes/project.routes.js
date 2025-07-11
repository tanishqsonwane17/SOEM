import { Router } from "express";
import * as ProjectController from "../controllers/project.controller.js";
import * as authMiddleware from "../middleware/auth.middleware.js";
import { body } from "express-validator";
import Project from "../models/project.model.js";
const router = Router();

router.post('/create',
    authMiddleware.authUser,
body('name').notEmpty().withMessage('Project name is required'),
ProjectController.createProject
)
router.get('/all',
    authMiddleware.authUser,
    ProjectController.getAllProjects
)
router.put('/add-user',
 authMiddleware.authUser,
 ProjectController.addUserToProject
, body('projectId')
    .isString().withMessage('Project ID must be a string')
, body('users')
    .isArray({ min: 1 }).withMessage('Users must be a non-empty array')
    .custom((arr) => arr.every(u => typeof u === 'string')).withMessage('Each user must be a string')
)
router.get('/get-project/:projectId',
    authMiddleware.authUser,
    ProjectController.getProjectById
)
export default router;