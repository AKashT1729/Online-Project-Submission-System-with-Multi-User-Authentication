import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import Register from './pages/Register';
import Login from './pages/Login';
import StudentDashboard from './Dashboard/StudentDashboard';
import ProjectGuideDashboard from './Dashboard/ProjectGuideDashboard';
import HoDDashboard from './Dashboard/HoDDashboard';


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
      </Routes>
    </Router>
    </>
  )
}

export default App
