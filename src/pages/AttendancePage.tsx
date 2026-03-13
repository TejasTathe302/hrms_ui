import React, { useState, useEffect, useCallback } from 'react';
import api from '../api';
import {
  Employee,
  AttendanceRecord,
  AttendanceFormData,
  ApiResult,
} from '../types';
import AttendanceForm from '../components/AttendanceForm';
import { AxiosError } from 'axios';

const AttendancePage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchEmployees = async (): Promise<void> => {
      try {
        const response = await api.get<Employee[]>('/employees');
        setEmployees(response.data);
      } catch {
        setError('Failed to load employees.');
      }
    };
    fetchEmployees();
  }, []);

  const fetchAttendance = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError('');
    try {
      const url = selectedEmployee
        ? `/attendance/${selectedEmployee}`
        : '/attendance';
      const params: Record<string, string> = {};
      if (dateFilter) params.date = dateFilter;

      const response = await api.get<AttendanceRecord[]>(url, { params });
      setAttendance(response.data);
    } catch {
      setError('Failed to load attendance records.');
    } finally {
      setLoading(false);
    }
  }, [selectedEmployee, dateFilter]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const handleMarkAttendance = async (
    data: AttendanceFormData
  ): Promise<ApiResult> => {
    try {
      await api.post<AttendanceRecord>('/attendance', data);
      fetchAttendance();
      return { success: true };
    } catch (err) {
      const axiosErr = err as AxiosError<{ detail: string }>;
      const message =
        axiosErr.response?.data?.detail ?? 'Failed to mark attendance.';
      return { success: false, message };
    }
  };

  const totalPresent = attendance.filter((a) => a.status === 'Present').length;

  const selectedEmployeeName = selectedEmployee
    ? employees.find((e) => e.id === parseInt(selectedEmployee, 10))?.full_name
    : null;

  return (
    <div className="page">
      <h1>Attendance Management</h1>

      <AttendanceForm employees={employees} onSubmit={handleMarkAttendance} />

      <div className="filter-section">
        <h2>Attendance Records</h2>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="filter_employee">Filter by Employee</label>
            <select
              id="filter_employee"
              value={selectedEmployee}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setSelectedEmployee(e.target.value)
              }
            >
              <option value="">All Employees</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.full_name} ({emp.employee_id})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="filter_date">Filter by Date</label>
            <input
              id="filter_date"
              type="date"
              value={dateFilter}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setDateFilter(e.target.value)
              }
            />
          </div>
          {dateFilter && (
            <div className="form-group align-end">
              <button
                className="btn btn-secondary"
                onClick={() => setDateFilter('')}
              >
                Clear Date
              </button>
            </div>
          )}
        </div>
      </div>

      {selectedEmployee && (
        <p className="summary-text">
          <strong>{selectedEmployeeName}</strong> — Total Present Days:{' '}
          <strong>{totalPresent}</strong>
        </p>
      )}

      {loading && <p className="loading">Loading attendance records...</p>}
      {!loading && error && <p className="error">{error}</p>}
      {!loading && !error && (
        <>
          {attendance.length === 0 ? (
            <p className="empty-state">No attendance records found</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Employee Name</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((record) => (
                    <tr key={record.id}>
                      <td>{record.employee_name}</td>
                      <td>{record.date}</td>
                      <td>
                        <span
                          className={`status-badge ${
                            record.status === 'Present'
                              ? 'status-present'
                              : 'status-absent'
                          }`}
                        >
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AttendancePage;
