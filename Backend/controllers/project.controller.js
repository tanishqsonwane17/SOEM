import ProjectModel from "../models/project.model.js";
import * as ProjectService from "../services/project.service.js";
import UserModel from "../models/user.model.js";
import { validationResult } from "express-validator";

export const createProject = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try{

    const { name } = req.body;
    const LoggedInUser = await UserModel.findOne({
        email:req.user.email
    })
    const userId = LoggedInUser._id;
    const newProject = await ProjectService.createProject({
        name,
        userId
    });
    res.status(201).json({
        message: "Project created successfully",
        project: newProject
    });
 }
 catch (error) {
        console.error("Error creating project:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }

}
export const getAllProjects = async (req, res) => {
    try {
        const loggdInUser = await UserModel.findOne({
            email: req.user.email                       
        });

        const allUserProject = await ProjectService.getAllProjects(loggdInUser._id);

        return res.status(200).json({
            message: "All projects fetched successfully",
            projects: allUserProject
        });
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}
