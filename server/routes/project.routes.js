import express from "express";
import protect from "../middleware/auth.middleware.js";

import {
  createProject,
  getProjects,
  addMember,
  removeMember
} from "../controllers/project.controller.js";

const router = express.Router();

router.post("/", protect, createProject);
router.get("/", protect, getProjects);

router.post("/:projectId/members", protect, addMember);
router.delete("/:projectId/members/:userId", protect, removeMember);

export default router;