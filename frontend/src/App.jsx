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
        <Route path="/register" element={<Register />} />
        <Route path='/login' element={<Login/>} />
        <Route path="/dashboard/student" element={<StudentDashboard/>} />
        <Route path="/dashboard/project-guide" element={<ProjectGuideDashboard/>} />
        <Route path="/dashboard/hod" element={<HoDDashboard/>} />
      </Routes>
    </Router>
    </>
  )
}

export default App
