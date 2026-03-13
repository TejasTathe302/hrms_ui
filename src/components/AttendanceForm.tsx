import React, { useState } from 'react';
import { Employee, AttendanceFormData, AttendanceStatus, ApiResult } from '../types';

interface AttendanceFormProps {
  employees: Employee[];
  onSubmit: (data: AttendanceFormData) => Promise<ApiResult>;
}

interface AttendanceFormState {
  employee_id: string;
  date: string;
  status: AttendanceStatus;
}

const initialFormState: AttendanceFormState = {
  employee_id: '',
  date: '',
  status: 'Present',
};

const AttendanceForm: React.FC<AttendanceFormProps> = ({ employees, onSubmit }) => {
  const [formData, setFormData] = useState<AttendanceFormState>(initialFormState);
  const [error, setError] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');

    if (!formData.employee_id) {
      setError('Please select an employee.');
      return;
    }
    if (!formData.date) {
      setError('Please select a date.');
      return;
    }

    setSubmitting(true);
    const result = await onSubmit({
      employee_id: parseInt(formData.employee_id, 10),
      date: formData.date,
      status: formData.status,
    });
    setSubmitting(false);

    if (result.success) {
      setFormData(initialFormState);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="form-card">
      <h2>Mark Attendance</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="att_employee_id">Employee</label>
            <select
              id="att_employee_id"
              name="employee_id"
              value={formData.employee_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.full_name} ({emp.employee_id})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="att_date">Date</label>
            <input
              id="att_date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="att_status">Status</label>
            <select
              id="att_status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
          </div>
        </div>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Marking...' : 'Mark Attendance'}
        </button>
      </form>
    </div>
  );
};

export default AttendanceForm;
