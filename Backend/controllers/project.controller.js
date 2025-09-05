import ProjectModel from "../models/project.model.js";
import * as ProjectService from "../services/project.service.js";
import UserModel from "../models/user.model.js";
import { validationResult } from "express-validator";

export const createProject = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(500).json({ errors: errors.array() });
  }

  console.log(req.user);

  try {
    const { name } = req.body;
    const LoggedInUser = await UserModel.findOne({
      email: req.user.email,
    });
    console.log(LoggedInUser);
    const userId = LoggedInUser.id;
    const newProject = await ProjectService.createProject({
      name,
      userId,
    });
    res.status(201).json({
      message: "Project created successfully",
      project: newProject,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
export const getAllProjects = async (req, res) => {
  try {
    const loggdInUser = await UserModel.findOne({
      email: req.user.email,
    });

    const allUserProject = await ProjectService.getAllProjects(loggdInUser._id);

    return res.status(200).json({
      message: "All projects fetched successfully",
      projects: allUserProject,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
export const addUserToProject = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { projectId, users } = req.body;
    const loggdInUser = await UserModel.findOne({
      email: req.user.email,
    });
    const project = await ProjectService.addUserToProject({
      projectId,
      users,
      userId: loggdInUser._id,
    });
    return res.status(200).json({
      project,
    });
  } catch (err) {
    console.error("Error adding user to project:", err);
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};
export const getProjectById = async (req, res) => {
  const { projectId } = req.params;
  const project = await ProjectService.getProjectById(projectId);

  try {
    return res.status(200).json({
      project,
    });
  } catch (err) {
    console.error("Error fetching project by ID:", err);
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};
