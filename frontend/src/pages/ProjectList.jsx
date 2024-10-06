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
        "https://online-project-submission-system-with.onrender.com/api/v1/projects/projects",
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
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (projects.length === 0) {
    return <div className="text-center">No project details found</div>;
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
      <div className="space-y-4">
        {projects.map((project, index) => (
          <div
            key={index}
            className="bg-gray-200 p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-300 transition duration-200"
            onClick={() => setSelectedProject(project)} // Select project on click
          >
            <div className="flex flex-col md:flex-row justify-between">
              <div className="mb-2 md:mb-0">
                <span className="text-sm font-semibold">Student Name (Leader): </span>
                <span className="text-gray-700">{project.student.fullName}</span>
              </div>
              <div className="mb-2 md:mb-0">
                <span className="text-sm font-semibold">Project Name: </span>
                <span className="text-gray-700">{project.projectName}</span>
              </div>
              <div className="mb-2 md:mb-0">
                <span className="text-sm font-semibold">Guide Status: </span>
                <span className="text-gray-700">{project.guideStatus}</span>
              </div>
              <div className="mb-2 md:mb-0">
                <span className="text-sm font-semibold">HOD Status: </span>
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
