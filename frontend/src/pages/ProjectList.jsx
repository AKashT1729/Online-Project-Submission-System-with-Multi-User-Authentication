import axios from "axios";
import React, { useEffect, useState } from "react";
import ProjectDetails from "../components/ProjectDetails";

const ProjectList = ({ user }) => {
  const [projects, setProjects] = useState([]); // State for holding multiple projects
  const [loading, setLoading] = useState(true); // State for loading indication
  const [error, setError] = useState(null); // State for handling errors
  const [selectedProject, setSelectedProject] = useState(null); // State for selected project

  const getAllProjects = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/v1/projects/projects",
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
        const projects = await getAllProjects(); // Fetch all projects
        setProjects(projects); // Set the projects
        setLoading(false); // Set loading state to false when data is fetched
      } catch (error) {
        setError(error.message); // Set error state if an error occurs
        setLoading(false); // Set loading state to false when data is fetched
      }
    };
    fetchProjects(); // Fetch projects when component mounts
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (projects.length === 0) {
    return <div>No project details found</div>;
  }

  if (selectedProject) {
    return (
      <ProjectDetails
        project={selectedProject}
        user={user}
        onBack={() => setSelectedProject(null)} // Back button to return to list
      />
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Projects List</h1>
      <div className="space-y-4 ml-3">
        {projects.map((project, index) => (
          <div
            key={index}
            className="bg-gray-200 p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-300 transition duration-200"
            onClick={() => setSelectedProject(project)} // Select project on click
          >
            <div className="flex justify-between space-x-28">
              <div className="text-sm font-semibold">
                Student Name (Leader):{" "}
                <span className="text-gray-700">{project.student.fullName}</span>
              </div>
              <div className="text-sm font-semibold">
                Project Name:{" "}
                <span className="text-gray-700">{project.projectName}</span>
              </div>
              <div className="text-sm font-semibold">
                Guide Status:{" "}
                <span className="text-gray-700">{project.guideStatus}</span>
              </div>
              <div className="text-sm font-semibold">
                HOD Status:{" "}
                <span className="text-gray-700">{project.hodStatus}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectList;
