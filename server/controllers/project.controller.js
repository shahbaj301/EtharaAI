import Project from "../models/project.model.js";
import User from "../models/user.model.js";
import Task from "../models/task.model.js";

// CREATE PROJECT
export const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Project name is required"
      });
    }

    const project = await Project.create({
      name,
      description,
      admin: req.user._id,
      members: [req.user._id]
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET USER PROJECTS
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      members: req.user._id
    })
      .populate("admin", "name email")
      .populate("members", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ADD MEMBER
export const addMember = async (req, res) => {
  try {
    const { email } = req.body;
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    if (project.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only project admin can add members"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found with this email"
      });
    }

    if (project.members.includes(user._id)) {
      return res.status(400).json({
        success: false,
        message: "User already added in this project"
      });
    }

    project.members.push(user._id);
    await project.save();

    const updatedProject = await Project.findById(projectId)
      .populate("admin", "name email")
      .populate("members", "name email");

    res.status(200).json({
      success: true,
      message: "Member added successfully",
      project: updatedProject
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// REMOVE MEMBER
export const removeMember = async (req, res) => {
  try {
    const { projectId, userId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    if (project.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only project admin can remove members"
      });
    }

    if (project.admin.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: "Admin cannot be removed from project"
      });
    }

    project.members = project.members.filter(
      (member) => member.toString() !== userId
    );

    await project.save();

    await Task.deleteMany({
      project: projectId,
      assignedTo: userId
    });

    res.status(200).json({
      success: true,
      message: "Member removed successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};