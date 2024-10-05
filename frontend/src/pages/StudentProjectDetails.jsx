import React, { useEffect, useState } from "react";
import axios from "axios";

const StudentProjectDetails = ({ user }) => {
  const [project, setProject] = useState(null); // State for holding a single project object
  const [loading, setLoading] = useState(true); // State for loading indication
  const [error, setError] = useState(null); // State for handling errors
  const [teamMembers, setTeamMembers] = useState([]); // State for team members
  const [registrationNumbers, setRegistrationNumbers] = useState([]); // State for registration numbers

  const getStatusStyles = (status) => {
    switch (status) {
      case "Approved":
        return {
          bgColor: "bg-green-500", // Green for Approved
          borderColor: "border-green-200", // Darker green for border
          hoverBgColor: "hover:bg-green-200", // Darker green on hover
          hoverBorderColor: "hover:border-green-500", // Lighter green on hover
        };
      case "Rejected":
        return {
          bgColor: "bg-red-500", // Red for Rejected
          borderColor: "border-red-200", // Darker red for border
          hoverBgColor: "hover:bg-red-200", // Darker red on hover
          hoverBorderColor: "hover:border-red-500", // Lighter red on hover
        };
      case "Pending":
        return {
          bgColor: "bg-orange-500", // Orange for Pending
          borderColor: "border-orange-200", // Darker orange for border
          hoverBgColor: "hover:bg-orange-200", // Darker orange on hover
          hoverBorderColor: "hover:border-orange-500", // Lighter orange on hover
        };
      default:
        return {
          bgColor: "bg-gray-200", // Default background if none matches
          borderColor: "border-gray-400", // Default border color
          hoverBgColor: "hover:bg-gray-200", // Darker gray on hover
          hoverBorderColor: "hover:border-gray-400", // Lighter gray on hover
        };
    }
  };

  const getAllProjects = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/v1/projects/project",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      return response.data.data; // Return the projects array from the response
    } catch (error) {
      console.error("Error fetching projects:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const allProjects = await getAllProjects(); // Fetch all projects
        const userId = user._id;

        // Find the first project where student._id matches the userId
        const matchingProject = allProjects.find(
          (project) => project.student._id === userId
        );

        if (matchingProject) {
          setProject(matchingProject); // Set the single project object in state

          // Convert teamMembers[0] string to an array without brackets
          const teamMembersString = matchingProject.teamMembers[0];
          const cleanString = teamMembersString.replace(/[\[\]"]+/g, "");
          const teamMembersArray = cleanString
            .split(",")
            .map((member) => member.trim());

          const registrationNumbersString =
            matchingProject.registrationNumbers[0];
          const registrationNumbersCleanString =
            registrationNumbersString.replace(/[\[\]"]+/g, "");
          const registrationNumbersArray = registrationNumbersCleanString
            .split(",")
            .map((member) => member.trim());

          setTeamMembers(teamMembersArray); // Set the converted array
          setRegistrationNumbers(registrationNumbersArray); // Assuming registrationNumbers is already an array
        } else {
          console.log("No matching project found.");
        }

        setLoading(false);
      } catch (error) {
        setError(
          error.response?.data?.data?.message || "Failed to fetch project"
        );
        setLoading(false);
      }
    };

    fetchProject();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!project) {
    return <div>No project details found</div>;
  }
//   console.log(project);
  // console.log(registrationNumbers);
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Project Details</h1>

      {/* Project Information */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-4 w-full">
        <div>
          <h2 className="text-xl font-semibold mb-0">{project.projectName}</h2>
          <p className="text-sm font-semibold text-gray-500 mb-3 pt-0">
            (Project Name)
          </p>
          <h3 className="font-semibold">Project Description</h3>
          <p className="text-gray-600 font-semibold mb-2 w-full">
            {project.projectDetails}
          </p>
        </div>

        <div className="flex space-x-20">
          <div>
            {/* Team Members and Registration Numbers */}
            <h3 className="text-lg font-semibold mt-4">
              Team Members & Registration Numbers
            </h3>
            <ul
              className="text-gray-600 ml-1 flex space-x-16"
              style={{ listStyleType: "none", paddingLeft: "0" }}
            >
              {" "}
              {/* Added list-none class here */}
              {teamMembers.map((member, index) => (
                <li key={index}>
                  <strong>{member}</strong> <br />(
                  {registrationNumbers[index] || "N/A"})
                </li>
              ))}
            </ul>
          </div>

          {/* Guide Status and HoD Status */}
          <div className="mt-6 flex space-x-10 text-center text-gray-800">
            <p
              className={`my-auto rounded-sm border-4 cursor-pointer ${
                getStatusStyles(project.guideStatus).borderColor
              } px-5 py-2 ${getStatusStyles(project.guideStatus).bgColor} ${
                getStatusStyles(project.guideStatus).hoverBgColor
              } ${getStatusStyles(project.guideStatus).hoverBorderColor}`}
            >
              <strong>Guide Status:</strong> <br />
              {project.guideStatus}
            </p>
            <p
              className={`my-auto rounded-sm border-4 cursor-pointer ${
                getStatusStyles(project.hodStatus).borderColor
              } px-5 py-2 ${getStatusStyles(project.hodStatus).bgColor} ${
                getStatusStyles(project.hodStatus).hoverBgColor
              } ${getStatusStyles(project.hodStatus).hoverBorderColor}`}
            >
              <strong>HoD Status:</strong> <br />
              {project.hodStatus}
            </p>
            <p
              className={`my-auto rounded-sm border-4 cursor-pointer ${
                getStatusStyles(project.status).borderColor
              } px-5 py-2 ${getStatusStyles(project.status).bgColor} ${
                getStatusStyles(project.status).hoverBgColor
              } ${getStatusStyles(project.status).hoverBorderColor}`}
            >
              <strong>Rejected Status:</strong> <br />
              {project.status}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProjectDetails;
