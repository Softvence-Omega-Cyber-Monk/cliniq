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

  scheduleStatus: string;
  type: string;
  id: string;
  time: string
  date: string;
  clientId: string;
  therapistId: string;
  scheduledDate: string; // ISO date string
  scheduledTime: string; // "HH:mm"
  duration: number;
  sessionType: "virtual" | "in-person" | string;
  phone: string;
  email: string;
  status: "scheduled" | "completed" | "cancelled" | string;
  notes: string | null;
  completionNotes: string | null;
  createdAt: string;
  updatedAt: string;
  client: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  therapist: {
    id: string;
    fullName: string;
    email: string;
    speciality: string;
  };

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
