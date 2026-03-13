import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import EmployeePage from './pages/EmployeePage';
import AttendancePage from './pages/AttendancePage';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="navbar-brand">HRMS Lite</div>
          <div className="navbar-links">
            <NavLink to="/" end>
              Dashboard
            </NavLink>
            <NavLink to="/employees">Employees</NavLink>
            <NavLink to="/attendance">Attendance</NavLink>
          </div>
        </nav>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/employees" element={<EmployeePage />} />
            <Route path="/attendance" element={<AttendancePage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
