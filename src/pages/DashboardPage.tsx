import React, { useState, useEffect } from 'react';
import api from '../api';
import { Employee, AttendanceRecord, DashboardStats } from '../types';

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    presentToday: 0,
    absentToday: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchDashboard = async (): Promise<void> => {
      setLoading(true);
      setError('');
      try {
        const today = new Date().toISOString().split('T')[0];
        const [empRes, attRes] = await Promise.all([
          api.get<Employee[]>('/employees'),
          api.get<AttendanceRecord[]>('/attendance', { params: { date: today } }),
        ]);

        setStats({
          totalEmployees: empRes.data.length,
          presentToday: attRes.data.filter((a) => a.status === 'Present').length,
          absentToday: attRes.data.filter((a) => a.status === 'Absent').length,
        });
      } catch {
        setError('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <p className="loading">Loading dashboard...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="page">
      <h1>Dashboard</h1>
      <div className="dashboard-cards">
        <div className="dashboard-card card-blue">
          <h3>Total Employees</h3>
          <p className="card-number">{stats.totalEmployees}</p>
        </div>
        <div className="dashboard-card card-green">
          <h3>Present Today</h3>
          <p className="card-number">{stats.presentToday}</p>
        </div>
        <div className="dashboard-card card-red">
          <h3>Absent Today</h3>
          <p className="card-number">{stats.absentToday}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
