import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";



const getRoleBasedData = asyncHandler(async (req, res) => {
    const userRole = req.user.role;
  
    if (userRole === "Student") {
      // Do something specific for students
    } else if (userRole === "ProjectGuide") {
      // Do something specific for project guides
    } else if (userRole === "HoD") {
      // Do something specific for HoDs
    }
  
    return res.status(200).json(new ApiResponse(200, {}, `Role: ${userRole}`));
  });

  const reviewSubmission = asyncHandler(async (req, res) => {

  })

  export {
    reviewSubmission
  }