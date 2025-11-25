export interface Client {
  id: string;
  name: string;
  initials: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  healthIssues: string[];
}
export interface Therapist {
  id: string;
  fullName: string;
  email: string;
  speciality: string;
}
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Appointment {
  id: string;
  therapist: Therapist
  scheduledTime: string;
  status: string;
  scheduledDate: string;
  client: Client;
  type: 'Initial Assessment' | 'Follow-up Session';
  scheduleStatus: 'Scheduled' | 'Completed' | 'Canceled';
  date: string;
  time: string;
  duration: number; // in minutes
  sessionType: 'Virtual Session' | 'In-Person Session';
}

export interface Stats {
  totalAppointments: number;
  todaySessions: number;
  virtualSessions: number;
  inPersonSessions: number;
  totalAppointmentsDelta: number; // percentage change
  todaySessionsDelta: number;
  virtualSessionsDelta: number;
  inPersonSessionsDelta: number;
}
