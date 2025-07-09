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
export const addUserToProject = async ({
    projectId,
    users,
    userId
}) => {
    if(!projectId){
        throw new Error("Project ID is required");
    }
    if(!mongoose.Types.ObjectId.isValid(projectId)){
        throw new Error("Invalid Project ID");
    }
    if(!users){
        throw new Error("Users are required and must be a non-empty array");
    }
    if(!Array.isArray(users) || users.some(userId => !mongoose.Types.ObjectId.isValid(userId))) {
        throw new Error("Each user must be a valid User ID");
    }

    const project = await ProjectModel.findOne({
        _id: projectId,
        users:userId
    });
    if(!project){
        throw new Error('User not belong to this project')
    }
    const updatedProject = await ProjectModel.findOneAndUpdate({
        _id:projectId,
    },{
        $addToSet:{
            users:{
                $each:users
            }
        }
    },{
        new:true
    })
 return updatedProject
}