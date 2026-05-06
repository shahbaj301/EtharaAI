import Task from "../models/task.model.js";
import Project from "../models/project.model.js";

const isAdmin = (project, userId) => {
  return project.admin.toString() === userId.toString();
};

const isMember = (project, userId) => {
  return project.members.some(
    (member) => member.toString() === userId.toString()
  );
};

// CREATE TASK - only admin
export const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      dueDate,
      priority,
      project,
      assignedTo
    } = req.body;

    if (!title || !dueDate || !project || !assignedTo) {
      return res.status(400).json({
        success: false,
        message: "Title, due date, project and assigned user are required"
      });
    }

    const projectData = await Project.findById(project);

    if (!projectData) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    if (!isAdmin(projectData, req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "Only project admin can create tasks"
      });
    }

    if (!isMember(projectData, assignedTo)) {
      return res.status(400).json({
        success: false,
        message: "Assigned user must be a project member"
      });
    }

    const task = await Task.create({
      title,
      description,
      dueDate,
      priority,
      project,
      assignedTo,
      createdBy: req.user._id
    });

    const populatedTask = await Task.findById(task._id)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .populate("project", "name");

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task: populatedTask
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET TASKS OF A PROJECT
export const getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    if (!isMember(project, req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this project"
      });
    }

    let filter = { project: projectId };

    // member can see only assigned tasks
    if (!isAdmin(project, req.user._id)) {
      filter.assignedTo = req.user._id;
    }

    const tasks = await Task.find(filter)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .populate("project", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      tasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// UPDATE TASK STATUS - admin or assigned member
export const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    if (!["To Do", "In Progress", "Done"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task status"
      });
    }

    const task = await Task.findById(taskId).populate("project");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    const admin = isAdmin(task.project, req.user._id);
    const assignedUser =
      task.assignedTo.toString() === req.user._id.toString();

    if (!admin && !assignedUser) {
      return res.status(403).json({
        success: false,
        message: "You can update only your assigned task"
      });
    }

    task.status = status;
    await task.save();

    const updatedTask = await Task.findById(taskId)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .populate("project", "name");

    res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      task: updatedTask
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// UPDATE FULL TASK - only admin
export const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId).populate("project");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    if (!isAdmin(task.project, req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "Only admin can update task"
      });
    }

    const allowedFields = [
      "title",
      "description",
      "dueDate",
      "priority",
      "status",
      "assignedTo"
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        task[field] = req.body[field];
      }
    });

    await task.save();

    const updatedTask = await Task.findById(taskId)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .populate("project", "name");

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task: updatedTask
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE TASK - only admin
export const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId).populate("project");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    if (!isAdmin(task.project, req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "Only admin can delete task"
      });
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      message: "Task deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};