const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String, 
      required: true,
    },
    completion_date: {
      type: String,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    comments: [
      {
        type: String,
        user_id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "User",
        },
      },
    ],
    priority: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
    },
    project_tasks: [
      {
        todo: {
          type: String,
        },
        date_to_complete: {
          type: String,
          required: true,
        },
        progress: {
          type: String,
          enum: ["Not Started", "In Progress", "Stuck", "Awaiting Review", "Completed"],
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
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", projectSchema);
