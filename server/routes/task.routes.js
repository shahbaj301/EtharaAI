import express from "express";
import protect from "../middleware/auth.middleware.js";

import {
  createTask,
  getProjectTasks,
  updateTaskStatus,
  updateTask,
  deleteTask
} from "../controllers/task.controller.js";

const router = express.Router();

router.post("/", protect, createTask);

router.get("/project/:projectId", protect, getProjectTasks);

router.patch("/:taskId/status", protect, updateTaskStatus);

router.put("/:taskId", protect, updateTask);

router.delete("/:taskId", protect, deleteTask);

export default router;