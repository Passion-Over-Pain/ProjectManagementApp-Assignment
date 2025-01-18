// import './App.css';
// import React from 'react';
// import Login from './components/Login';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './App.css';

// const App = () => {
//     return (
//         <div>
//             <Login />
//             <ToastContainer />
//         </div>
//     );
// };

// export default App;
// src/App.js
// src/App.js
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Auth/Login"; // Your Login component
import AdminDashboard from "./components/Admin/AdminDashboard"; // Import AdminDashboard
import ProjectManagerDashboard from "./components/ProjectManager/ProjectManagerDashboard";
import TaskManagerDashboard from "./components/TaskManager/TaskManagerDashboard";
import { ToastContainer } from "react-toastify";
import "./App.css";
const App = () => {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Login />} />{" "}
        {/* Set the default route to Login */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />{" "}
        {/* Admin Dashboard route */}
        <Route
          path="/project-manager/dashboard"
          element={<ProjectManagerDashboard />}
        />
         <Route
          path="/task-manager/dashboard"
          element={<TaskManagerDashboard/>}
        />
      </Routes>
    </Router>
  );
};

export default App;
