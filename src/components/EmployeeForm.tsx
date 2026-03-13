import React, { useState } from 'react';
import { EmployeeFormData, ApiResult } from '../types';

interface EmployeeFormProps {
  onSubmit: (data: EmployeeFormData) => Promise<ApiResult>;
}

const initialFormState: EmployeeFormData = {
  employee_id: '',
  full_name: '',
  email: '',
  department: '',
};

const EmployeeForm: React.FC<EmployeeFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<EmployeeFormData>(initialFormState);
  const [error, setError] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const result = await onSubmit(formData);
    setSubmitting(false);

    if (result.success) {
      setFormData(initialFormState);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="form-card">
      <h2>Add Employee</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="employee_id">Employee ID</label>
            <input
              id="employee_id"
              type="text"
              name="employee_id"
              value={formData.employee_id}
              onChange={handleChange}
              placeholder="e.g. EMP001"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="full_name">Full Name</label>
            <input
              id="full_name"
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="e.g. Tejas Tathe"
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. tejas@test.com"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="department">Department</label>
            <input
              id="department"
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="e.g. IT"
              required
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Adding...' : 'Add Employee'}
        </button>
      </form>
    </div>
  );
};

export default EmployeeForm;
