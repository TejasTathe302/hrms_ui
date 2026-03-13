import React, { useState, useEffect, useCallback } from 'react';
import api from '../api';
import { Employee, EmployeeFormData, ApiResult } from '../types';
import EmployeeForm from '../components/EmployeeForm';
import EmployeeTable from '../components/EmployeeTable';
import { AxiosError } from 'axios';

const EmployeePage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetchEmployees = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get<Employee[]>('/employees');
      setEmployees(response.data);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleAddEmployee = async (
    employeeData: EmployeeFormData
  ): Promise<ApiResult> => {
    try {
      await api.post<Employee>('/employees', employeeData);
      fetchEmployees();
      return { success: true };
    } catch (err) {
      const axiosErr = err as AxiosError<{ detail: string }>;
      const message =
        axiosErr.response?.data?.detail ?? 'Failed to add employee. Please try again.';
      return { success: false, message };
    }
  };

  const handleDeleteEmployee = async (id: number): Promise<void> => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      await api.delete(`/employees/${id}`);
      fetchEmployees();
    } catch {
      setError('Failed to delete employee. Please try again.');
    }
  };

  return (
    <div className="page">
      <h1>Employee Management</h1>
      <EmployeeForm onSubmit={handleAddEmployee} />
      {loading && <p className="loading">Loading employees...</p>}
      {!loading && error && <p className="error">{error}</p>}
      {!loading && !error && (
        <EmployeeTable employees={employees} onDelete={handleDeleteEmployee} />
      )}
    </div>
  );
};

export default EmployeePage;
