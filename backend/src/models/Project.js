const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      required: true,
    },
    projectDetails: {
      type: String,
      required: true,
    },
    teamMembers: [
      {
        type: String,
        required: true,
      },
    ],
    registrationNumbers: [
      {
        type: String,
        required: true,
      },
    ],
    srsFile: {
      type: String,
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    guideStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    hodStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    status: {
      type: String,
      enum: ["Pending", "Pending HoD Approval", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
