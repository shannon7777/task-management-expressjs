const mongoose = require("mongoose");

const projectItemSchema = new mongoose.Schema(
  {
    item: {
      type: String,
    },
    deadline: {
      type: String,
    },
    progress: {
      type: String,
      enum: [
        "Not Started",
        "In Progress",
        "Stuck",
        "Awaiting Review",
        "Completed",
      ],
      default: "Not Started",
      required: true,
    },
    notes: [
      {
        note: {
          type: String,
        },
        user_id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "User",
        },
      },
    ],
    owners: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    project_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ProjectItem", projectItemSchema);
