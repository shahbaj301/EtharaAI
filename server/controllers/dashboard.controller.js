import Task from "../models/task.model.js";
import Project from "../models/project.model.js";

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const projects = await Project.find({
      members: userId
    });

    const projectIds = projects.map((project) => project._id);

    const taskFilter = {
      project: { $in: projectIds }
    };

    const totalTasks = await Task.countDocuments(taskFilter);

    const tasksByStatus = await Task.aggregate([
      {
        $match: taskFilter
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const tasksPerUser = await Task.aggregate([
      {
        $match: taskFilter
      },
      {
        $group: {
          _id: "$assignedTo",
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      },
      {
        $project: {
          _id: 1,
          count: 1,
          name: "$user.name",
          email: "$user.email"
        }
      }
    ]);

    const overdueTasks = await Task.find({
      ...taskFilter,
      dueDate: { $lt: new Date() },
      status: { $ne: "Done" }
    })
      .populate("assignedTo", "name email")
      .populate("project", "name");

    res.status(200).json({
      success: true,
      stats: {
        totalProjects: projects.length,
        totalTasks,
        tasksByStatus,
        tasksPerUser,
        overdueTasks
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};