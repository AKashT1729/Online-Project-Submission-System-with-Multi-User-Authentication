import { Project } from "../models/Project.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

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
    srsFile : srsFile,
    student: req.user._id,
  })

  if (!project) {
    throw new ApiError(500, "Failed to submit project");
  }

  // Respond with the created project details
  return res
    .status(201)
    .json(new ApiResponse(201, project, "Project submitted successfully"));
});

const projectStatus = asyncHandler(async(req, res) => {

})
const reviewSubmission = asyncHandler(async (req, res) => {});

export { reviewSubmission, submitProject,projectStatus };
