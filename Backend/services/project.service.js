import ProjectModel from "../models/project.model.js";

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