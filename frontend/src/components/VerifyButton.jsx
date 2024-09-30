import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function VerifyButton() {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [user ,setUser] = useState(null)
  const navigate = useNavigate();
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser); // Set the user state
    }
  }, []);

  // Ensure user is not null before trying to access the email property
  const email = user?.email;

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await axios.post(
        "http://localhost:8000/api/v1/users/generate-otp",
        {
          email,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setSuccessMessage("Verification email sent successfully.");
      navigate("/email-verification");
    } catch (error) {
      setErrorMessage(
        "Failed to send verification email. Please try again later."
      );
    }
  };
  return (
    <>
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">OTP</h2>

          {errorMessage && (
            <div className="mb-4 text-red-500 text-center">{errorMessage}</div>
          )}
          {successMessage && (
            <div className="mb-4 text-green-500 text-center">
              {successMessage}
            </div>
          )}
          <form onSubmit={handleVerifySubmit}>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300"
            >
              Send OTP
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default VerifyButton;
