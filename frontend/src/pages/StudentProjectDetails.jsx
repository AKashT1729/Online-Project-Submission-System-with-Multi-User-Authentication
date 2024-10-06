import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Modal from "react-modal"; // Importing Modal from react-modal

const StudentProjectDetails = ({ user }) => {
  const [project, setProject] = useState(null); // State for holding a single project object
  const [loading, setLoading] = useState(true); // State for loading indication
  const [error, setError] = useState(null); // State for handling errors
  const [teamMembers, setTeamMembers] = useState([]); // State for team members
  const [registrationNumbers, setRegistrationNumbers] = useState([]); // State for registration numbers
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Modal state
  const [editForm, setEditForm] = useState({}); // Form state for editing project

  const getStatusStyles = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 border-green-300 text-green-600";
      case "Rejected":
        return "bg-red-100 border-red-300 text-red-600";
      case "Pending":
        return "bg-orange-100 border-orange-300 text-orange-600";
      default:
        return "bg-gray-100 border-gray-300 text-gray-600";
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

  const handleDeleteProject = async () => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await axios.delete(
          `http://localhost:8000/api/v1/projects/deleteProject`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
            data: { _id: project._id }, // Use `data` to send the body in a DELETE request
          }
        );
        alert("Project deleted successfully!");
        setProject(null); // Clear the project after deletion
      } catch (error) {
        console.error("Error deleting project:", error);
        alert("Failed to delete the project.");
      }
    }
  };

  const handleEditProject = () => {
    // Populate the form with the current project data
    setEditForm({
      projectName: project.projectName,
      projectDetails: project.projectDetails,
      teamMembers: teamMembers.join(", "), // Convert array to comma-separated string
      registrationNumbers: registrationNumbers.join(", "), // Convert array to string
    });
    setIsEditModalOpen(true); // Open modal
  };

  const handleEditFormChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:8000/api/v1/projects/updateProject`,
        {
          _id: project._id,
          projectName: editForm.projectName,
          projectDetails: editForm.projectDetails,
          teamMembers: editForm.teamMembers.split(",").map((member) => member.trim()), // Convert back to array
          registrationNumbers: editForm.registrationNumbers
            .split(",")
            .map((num) => num.trim()), // Convert back to array
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      alert("Project updated successfully!");
      setProject(response.data.data); // Update project state
      setIsEditModalOpen(false); // Close modal
    } catch (error) {
      console.error("Error updating project:", error);
      alert("Failed to update the project.");
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
          setRegistrationNumbers(registrationNumbersArray); // Set registration numbers array
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

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Project Details</h1>

      {/* Project Information */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-semibold">{project.projectName}</h2>
            <p className="text-gray-500">(Project Name)</p>
          </div>
          <div className="flex space-x-4">
            {/* Edit Button */}
            <button
              className="text-blue-500 hover:text-blue-700"
              onClick={handleEditProject}
            >
              <FaEdit size={24} />
            </button>

            {/* Delete Button */}
            <button
              className="text-red-500 hover:text-red-700"
              onClick={handleDeleteProject}
            >
              <FaTrashAlt size={24} />
            </button>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="font-semibold text-lg">Project Description</h3>
          <p className="text-gray-700">{project.projectDetails}</p>
        </div>

        <div className="flex flex-col lg:flex-row lg:space-x-12 mt-6">
          {/* Team Members and Registration Numbers */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold">Team Members & Registration Numbers</h3>
            <ul className="text-gray-700 space-y-2 mt-2">
              {teamMembers.map((member, index) => (
                <li key={index}>
                  <span className="font-medium">{member}</span> <br />( {registrationNumbers[index] || "N/A"} )
                </li>
              ))}
            </ul>
          </div>

          {/* Guide Status and HoD Status */}
          <div className="flex flex-col lg:flex-row lg:space-x-4 mt-6 lg:mt-0">
            <div
              className={`rounded-md border-2 p-3 ${getStatusStyles(
                project.guideStatus
              )}`}
            >
              <strong>Guide Status:</strong> {project.guideStatus}
            </div>
            <div
              className={`rounded-md border-2 p-3 ${getStatusStyles(
                project.hodStatus
              )}`}
            >
              <strong>HOD Status:</strong> {project.hodStatus}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Project Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={() => setIsEditModalOpen(false)}
        contentLabel="Edit Project"
        className="modal bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto"
      >
        <h2 className="text-xl font-bold mb-4">Edit Project</h2>
        <form onSubmit={handleSubmitEdit}>
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="projectName">
              Project Name
            </label>
            <input
              type="text"
              id="projectName"
              name="projectName"
              value={editForm.projectName || ""}
              onChange={handleEditFormChange}
              required
              className="border rounded-md p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="projectDetails">
              Project Details
            </label>
            <textarea
              id="projectDetails"
              name="projectDetails"
              value={editForm.projectDetails || ""}
              onChange={handleEditFormChange}
              required
              className="border rounded-md p-2 w-full h-32"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="teamMembers">
              Team Members (comma-separated)
            </label>
            <input
              type="text"
              id="teamMembers"
              name="teamMembers"
              value={editForm.teamMembers || ""}
              onChange={handleEditFormChange}
              required
              className="border rounded-md p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="registrationNumbers">
              Registration Numbers (comma-separated)
            </label>
            <input
              type="text"
              id="registrationNumbers"
              name="registrationNumbers"
              value={editForm.registrationNumbers || ""}
              onChange={handleEditFormChange}
              required
              className="border rounded-md p-2 w-full"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Save Changes
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default StudentProjectDetails;