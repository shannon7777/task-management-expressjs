const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, `Please add a text`],
    },
    description: {
      type: String,
    },
    dateToComplete: {
      type: String,
    },
    completedDate: {
      type: String,
      default: "",
    },
    progress: {
      type: String,
      enum: ["New Task", "In progress", "Stuck", "Completed"],
      required: true,
      default: "New Task",
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", taskSchema);
