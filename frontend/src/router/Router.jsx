import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import all the components for routing
import Login from '../pages/Login'
import Register from'../pages/Register'
import StudentDashboard from '../Dashboard/StudentDashboard'
import ProjectGuideDashboard from '../Dashboard/ProjectGuideDashboard'
import HoDDashboard from '../Dashboard/HoDDashboard'
import VerifyButton from '../components/VerifyButton'
import EmailVerification from'../components/EmailVerification'
import ForgotPassword from '../components/ForgotPassword'
import OtpForm from '../components/OtpForm'
import ResetPassword from '../components/ResetPassword'
import SubmitProject from '../pages/SubmitProject'

const AppRouter = () => {

  const [user, setUser] = useState(null);

  // Load user data from localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login setUser={setUser}/>} />
        <Route path='/register' element={<Register/>} />
        <Route path='/login' element={<Login setUser={setUser}/>} />
        <Route path='/student-dashboard' element={<StudentDashboard user={user}/>} />
        <Route path='/guide-dashboard' element={<ProjectGuideDashboard user = {user}/>} />
        <Route path='/hod-dashboard' element={<HoDDashboard user = {user}/>} />
        <Route path='/generate-otp' element={<VerifyButton />} />
        <Route path='/email-verification' element={<EmailVerification />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/otp-form' element={<OtpForm />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/submit-project' element={<SubmitProject/>} />

      </Routes>
    </Router>
  );
};

export default AppRouter;
