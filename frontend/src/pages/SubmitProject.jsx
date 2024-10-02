import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SubmitProject = ({ user }) => {
  const [projectData, setProjectData] = useState({
    projectName: '',
    projectDetails: '',
    teamMembers: [''],
    registrationNumbers: [''],
  });

  const [srsFile, setSrsFile] = useState(null); // For file upload
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData({
      ...projectData,
      [name]: value,
    });
  };

  // Handle team members and registration numbers input
  const handleTeamMembersChange = (index, value) => {
    const updatedMembers = [...projectData.teamMembers];
    updatedMembers[index] = value;
    setProjectData({
      ...projectData,
      teamMembers: updatedMembers,
    });
  };

  const handleRegistrationNumbersChange = (index, value) => {
    const updatedNumbers = [...projectData.registrationNumbers];
    updatedNumbers[index] = value;
    setProjectData({
      ...projectData,
      registrationNumbers: updatedNumbers,
    });
  };

  const handleFileChange = (e) => {
    setSrsFile(e.target.files[0]);
  };

  const addTeamMember = () => {
    setProjectData({
      ...projectData,
      teamMembers: [...projectData.teamMembers, ''],
    });
  };

  const addRegistrationNumber = () => {
    setProjectData({
      ...projectData,
      registrationNumbers: [...projectData.registrationNumbers, ''],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    
    // Append form data
    formData.append('projectName', projectData.projectName);
    formData.append('projectDetails', projectData.projectDetails);
    formData.append('teamMembers', JSON.stringify(projectData.teamMembers));
    formData.append('registrationNumbers', JSON.stringify(projectData.registrationNumbers));
    formData.append('srsFile', srsFile); // Append file

    try {
      // Make the API call
      const response = await axios.post(
        'http://localhost:8000/api/v1/projects/submit-project',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // Assuming token is in localStorage
          },
        }
      );

      setMessage('Project submitted successfully!');
      // console.log(response.data);
      navigate("/student-dashboard")
    } catch (error) {
      setMessage('Failed to submit project. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Submit Your Project</h2>
      {message && <p className="mb-4 text-center text-red-500">{message}</p>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-4">
          <label className="block text-gray-700">Project Name</label>
          <input
            type="text"
            name="projectName"
            value={projectData.projectName}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter project name"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Project Details</label>
          <textarea
            name="projectDetails"
            value={projectData.projectDetails}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter project details"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Team Members</label>
          {projectData.teamMembers.map((member, index) => (
            <input
              key={index}
              type="text"
              value={member}
              onChange={(e) => handleTeamMembersChange(index, e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md mb-2"
              placeholder={`Enter team member ${index + 1}`}
              required
            />
          ))}
          <button
            type="button"
            onClick={addTeamMember}
            className="mt-2 text-blue-500"
          >
            + Add Team Member
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Registration Numbers</label>
          {projectData.registrationNumbers.map((number, index) => (
            <input
              key={index}
              type="text"
              value={number}
              onChange={(e) =>
                handleRegistrationNumbersChange(index, e.target.value)
              }
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md mb-2"
              placeholder={`Enter registration number ${index + 1}`}
              required
            />
          ))}
          <button
            type="button"
            onClick={addRegistrationNumber}
            className="mt-2 text-blue-500"
          >
            + Add Registration Number
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">SRS File</label>
          <input
            type="file"
            name="srsFile"
            onChange={handleFileChange}
            className="mt-1 block w-full"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Submit Project
        </button>
      </form>
    </div>
  );
};

export default SubmitProject;
