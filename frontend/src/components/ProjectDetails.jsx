import React, { useEffect, useState } from "react";
import axios from "axios";

const ProjectDetails = ({ user }) => {
  const [projects, setProjects] = useState([]); // Use plural to indicate multiple projects
  const [loading, setLoading] = useState(true); // State for loading indication
  const [error, setError] = useState(null); // State for handling errors

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
    const fetchProjects = async () => {
      try {
        const allProjects = await getAllProjects(); // Fetch all projects
        const userId = user._id;

        // Find projects where student._id matches the userId
        const matchingProjects = allProjects.filter(
          (project) => project.student._id === userId
        );

        if (matchingProjects.length > 0) {
          console.log(matchingProjects); // Output the matching project(s)
          setProjects(matchingProjects); // Set the project list in state
        } else {
          console.log("No matching projects found.");
        }

        setLoading(false);
      } catch (error) {
        setError(
          error.response?.data?.data?.message || "Failed to fetch projects"
        );
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!projects || projects.length === 0) {
    return <div>No project details found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Project Details</h1>

      {/* Loop through all projects */}
      {projects.map((project) => (
        <div key={project._id} className="bg-white p-6 rounded-lg shadow-md mb-4">
          {/* Project Information */}
          <h2 className="text-xl font-semibold mb-2">{project.projectName}</h2>
          <p className="text-gray-700 mb-2">{project.projectDetails}</p>

          {/* Guide Status and HoD Status */}
          <div className="mt-4">
            <p>
              <strong>Guide Status:</strong> {project.guideStatus}
            </p>
            <p>
              <strong>HoD Status:</strong> {project.hodStatus}
            </p>
          </div>

          {/* Download SRS File */}
          {project.srsFile && (
            <div className="mt-4">
              <a
                href={project.srsFile}
                download
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
              >
                Download SRS File
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProjectDetails;
