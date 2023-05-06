const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  title: {
    type: String,
  },
  projectItem_ids: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProjectItem",
    },
  ],
  project_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
});

module.exports = mongoose.model("Category", CategorySchema);
