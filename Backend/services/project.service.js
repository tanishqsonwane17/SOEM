import ProjectModel from "../models/project.model.js";
import mongoose from "mongoose";
export const createProject = async ({
    name,userId
}) => {
    if(!name){
        throw new Error("Project name is required");
    }
    if(!userId){
        throw new Error("User ID is required");
    }

    const project = await ProjectModel.create({
        name,
        users: [userId]
    });
    return project
}
export const getAllProjects = async (userId) => {
    if(!userId){
        throw new Error("User ID is required");
    }
    const projects = await ProjectModel.find({
        users: userId
    })
    return projects
}


export const addUserToProject = async ({ projectId, users }) => {
    if (!projectId) {
        throw new Error("Project ID is required");
    }
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid Project ID");
    }
    if (!users || !Array.isArray(users) || users.length === 0) {
        throw new Error("Users are required and must be a non-empty array");
    }
    if (users.some(userId => !mongoose.Types.ObjectId.isValid(userId))) {
        throw new Error("Each user must be a valid User ID");
    }

    // ✅ Sirf project check karo
    const project = await ProjectModel.findById(projectId);
    if (!project) {
        throw new Error("Project not found");
    }

    // ✅ Ab naya user add karo (duplicate avoid using $addToSet)
    const updatedProject = await ProjectModel.findByIdAndUpdate(
        projectId,
        {
            $addToSet: {
                users: { $each: users }
            }
        },
        { new: true }
    );

    return updatedProject;
};



export const getProjectById = async (projectId) => {
    if(!projectId){
        throw new Error("Project ID is required");
    }
    if(!mongoose.Types.ObjectId.isValid(projectId)){
        throw new Error("Invalid Project ID");
    }
    const project = await ProjectModel.findOne({
        _id: projectId
        
    }).populate('users');
     return project
    }
   