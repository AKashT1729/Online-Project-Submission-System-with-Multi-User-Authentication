import React from 'react';
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
const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login/>} />
        <Route path='/register' element={<Register/>} />
        <Route path='/login' element={<Login />} />
        <Route path='/student-dashboard' element={<StudentDashboard />} />
        <Route path='/guide-dashboard' element={<ProjectGuideDashboard />} />
        <Route path='/hod-dashboard' element={<HoDDashboard/>} />
        <Route path='/generate-otp' element={<VerifyButton />} />
        <Route path='/email-verification' element={<EmailVerification />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/otp-form' element={<OtpForm />} />
        <Route path='/reset-password' element={<ResetPassword />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
