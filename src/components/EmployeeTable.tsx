import React from 'react';
import { Employee } from '../types';

interface EmployeeTableProps {
  employees: Employee[];
  onDelete: (id: number) => void;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({ employees, onDelete }) => {
  if (employees.length === 0) {
    return <p className="empty-state">No employees found</p>;
  }

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.employee_id}</td>
              <td>{emp.full_name}</td>
              <td>{emp.email}</td>
              <td>{emp.department}</td>
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => onDelete(emp.id)}
                  aria-label={`Delete ${emp.full_name}`}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;
