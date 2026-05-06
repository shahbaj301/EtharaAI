import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true
    },

    description: {
      type: String,
      default: ""
    },

    dueDate: {
      type: Date,
      required: [true, "Due date is required"]
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium"
    },

    status: {
      type: String,
      enum: ["To Do", "In Progress", "Done"],
      default: "To Do"
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

taskSchema.index({
  project: 1,
  assignedTo: 1,
  status: 1,
  dueDate: 1
});

const Task = mongoose.model("Task", taskSchema);

export default Task;