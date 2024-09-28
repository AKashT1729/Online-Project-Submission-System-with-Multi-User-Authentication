import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import Register from './pages/Register';
import Login from './pages/Login';
import StudentDashboard from './Dashboard/StudentDashboard';
import ProjectGuideDashboard from './Dashboard/ProjectGuideDashboard';
import HoDDashboard from './Dashboard/HoDDashboard';
import EmailVerification from './components/EmailVerification';
import VerifyButton from './components/VerifyButton';
import ForgotPassword from './components/ForgotPassword';
import OtpForm from './components/OtpForm';
import ResetPassword from './components/ResetPassword';


function App() {
 

  return (
    <>
     <Router>
      <Routes>
      <Route path='/' element={<Login/>} />
        <Route path="/register" element={<Register />} />
        <Route path='/login' element={<Login/>} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/guide-dashboard" element={<ProjectGuideDashboard />} />
        <Route path="/hod-dashboard" element={<HoDDashboard />} />
        <Route path="/generate-otp" element={<VerifyButton/>} />
        <Route path="/email-verification" element={<EmailVerification/>} />
        <Route path="/forgot-password" element={<ForgotPassword/>} />
        <Route path="/otp-form" element={<OtpForm/>} />
        <Route path='/reset-password' element={<ResetPassword/>}/>
      </Routes>
    </Router>
    </>
  )
}

export default App
