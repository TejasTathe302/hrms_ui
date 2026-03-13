// ── Employee ──────────────────────────────────────────────────
export interface Employee {
  id: number;
  employee_id: string;
  full_name: string;
  email: string;
  department: string;
}

export interface EmployeeFormData {
  employee_id: string;
  full_name: string;
  email: string;
  department: string;
}

// ── Attendance ────────────────────────────────────────────────
export type AttendanceStatus = 'Present' | 'Absent';

export interface AttendanceRecord {
  id: number;
  employee_id: number;
  date: string;
  status: AttendanceStatus;
  employee_name: string | null;
}

export interface AttendanceFormData {
  employee_id: number;
  date: string;
  status: AttendanceStatus;
}

// ── API Result ────────────────────────────────────────────────
export type ApiResult =
  | { success: true }
  | { success: false; message: string };

// ── Dashboard ─────────────────────────────────────────────────
export interface DashboardStats {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
}
