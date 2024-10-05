import React, { useEffect, useState } from "react";

const ProjectDetails = ({ project, user, onBack }) => {
  const [teamMembers, setTeamMembers] = useState([]); // State for team members
  const [registrationNumbers, setRegistrationNumbers] = useState([]); // State for registration numbers

  const getStatusStyles = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-500 border-green-200 hover:bg-green-200";
      case "Rejected":
        return "bg-red-500 border-red-200 hover:bg-red-200";
      case "Pending":
        return "bg-orange-500 border-orange-200 hover:bg-orange-200";
      default:
        return "bg-gray-200 border-gray-400 hover:bg-gray-200";
    }
  };

  useEffect(() => {
    if (project) {
      // Convert teamMembers[0] string to an array if it's in string format
      const teamMembersString = project.teamMembers[0];
      const cleanString = teamMembersString.replace(/[\[\]"]+/g, "");
      const teamMembersArray = cleanString
        .split(",")
        .map((member) => member.trim());

      // Process registration numbers
      const registrationNumbersString = project.registrationNumbers[0];
      const registrationNumbersCleanString = registrationNumbersString.replace(
        /[\[\]"]+/g,
        ""
      );
      const registrationNumbersArray = registrationNumbersCleanString
        .split(",")
        .map((member) => member.trim());

      setTeamMembers(teamMembersArray); // Set the processed team members
      setRegistrationNumbers(registrationNumbersArray); // Set the processed registration numbers
    }
  }, [project]);

  if (!project) {
    return <div>No project details found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <button
        onClick={onBack}
        className="bg-blue-500 text-white py-2 px-4 rounded mb-4 hover:bg-blue-600 transition duration-300"
      >
        Back to Project List
      </button>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold">{project.projectName}</h2>
        <p className="text-gray-600 mt-2 mb-4">{project.projectDetails}</p>

        {/* Team Members */}
        <h3 className="text-lg font-semibold">Team Members:</h3>
        <ul className="list-disc ml-4">
          {teamMembers.map((member, index) => (
            <li key={index} className="text-gray-800">
              {member} (Reg. No: {registrationNumbers[index] || "N/A"})
            </li>
          ))}
        </ul>

        {/* Statuses */}
        <div className="mt-4 flex space-x-4">
          <div
            className={`rounded-md border-4 px-4 py-2 ${getStatusStyles(
              project.guideStatus
            )}`}
          >
            <strong>Guide Status:</strong> {project.guideStatus}
          </div>
          <div
            className={`rounded-md border-4 px-4 py-2 ${getStatusStyles(
              project.hodStatus
            )}`}
          >
            <strong>HOD Status:</strong> {project.hodStatus}
          </div>
          <div
            className={`rounded-md border-4 px-4 py-2 ${getStatusStyles(
              project.status
            )}`}
          >
            <strong>Project Status:</strong> {project.status}
          </div>
        </div>

        {/* Download SRS File */}
        {["HoD", "ProjectGuide"].includes(user.role) && project.srsFile && (
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
    </div>
  );
};

export default ProjectDetails;
