import { Project } from "../models/Project.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { sendStatusEmail } from "../utils/sendEmail.js";

const submitProject = asyncHandler(async (req, res) => {
  const { projectName, projectDetails, teamMembers, registrationNumbers } =
    req.body;

  // Check if all required fields are provided
  if (!projectName || !projectDetails || !teamMembers || !registrationNumbers) {
    throw new ApiError(400, "All fields are required");
  }
  // console.log(req.file);

  const localSrsFile = req.file.path;
  // console.log(`in controller ${localSrsFile}`);

  if (!localSrsFile) {
    throw new ApiError(400, "Project file is required");
  }
  // Upload SRS file to a cloud storage service
  const srsFile = await uploadOnCloudinary(localSrsFile);
  // console.log("srs File in controlller",srsFile);

  if (!srsFile) {
    throw new ApiError(400, "Project file is required");
  }
  // Save project details to the database
  const project = await Project.create({
    projectName,
    projectDetails,
    teamMembers,
    registrationNumbers,
    srsFile: srsFile,
    student: req.user._id,
  });

  if (!project) {
    throw new ApiError(500, "Failed to submit project");
  }

  // Respond with the created project details
  return res
    .status(201)
    .json(new ApiResponse(201, project, "Project submitted successfully"));
});

// Controller for updating the project status
const updateProjectStatus = asyncHandler(async (req, res) => {
  const { projectId } = req.body; // Get the project ID from the request params
  const { role } = req.user; // Get the role of the logged-in user (Student, ProjectGuide, HoD)
  const { guideStatus, hodStatus } = req.body; // Status provided in the request body

  // console.log(req.body.projectId);

  // Find the project in the database
  const project = await Project.findById(projectId).populate(
    "student",
    "email"
  );
  // console.log(project);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // Only ProjectGuide can update guideStatus
  if (role === "ProjectGuide" && guideStatus) {
    project.guideStatus = guideStatus;

    // Automatically update overall project status based on the guide's decision
    if (guideStatus === "Rejected") {
      project.status = "Rejected";
    } else if (guideStatus === "Approved") {
      project.status = "Pending HoD Approval";
    }
  }

  // Only HoD can update hodStatus
  if (role === "HoD" && hodStatus) {
    project.hodStatus = hodStatus;

    // Update overall project status based on HoD's decision
    if (hodStatus === "Rejected") {
      project.status = "Rejected";
    } else if (hodStatus === "Approved") {
      project.status = "Approved";
    }
  }

  // Save the updated project
  await project.save();

  // Send status email to the student
  await sendStatusEmail(
    project.student.email,
    project.guideStatus,
    project.hodStatus
  );

  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project status updated successfully"));
});

// Controller for retrieving project status
const getProjectStatus = asyncHandler(async (req, res) => {
  const { projectId } = req.body;

  // Find the project in the database
  const project = await Project.findById(projectId).populate(
    "student",
    "fullName email"
  );
  // console.log(project);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // Respond with the project's current status
  return res
    .status(200)
    .json(
      new ApiResponse(200, project, "Project status retrieved successfully")
    );
});

export { submitProject, getProjectStatus, updateProjectStatus };
