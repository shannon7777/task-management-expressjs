const mongoose = require("mongoose");

const projectItemSchema = new mongoose.Schema(
  {
    item: {
      type: String,
    },
    deadline: {
      type: String,
    //   required: true,
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
        type: String,
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ProjectItem", projectItemSchema);
