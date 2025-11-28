/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Therapist {
  id: string;
  fullName: string;
  initials: string;
  specialty: string;
  status: "Active" | "Inactive";
  patients: number;
  qualification:string;
  _count: {
    clients: number;
    appointments: number;
  }
  email: string;
  phone: string;
  availabilityStartTime: string;
  availabilityEndTime: string;
  isCurrentUser?: boolean;
  qualifications: string;
  availability: string;
  speciality: string;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  overallProgress: number | null; // can be null
  treatmentGoals: string; // currently a string
  status: "active" | "inactive"; // match your backend
  condition: string;
  healthIssues: string[];
  crisisHistories: any[]; // optional if you want
  treatmentProgress: Record<string, any>; // keep flexible
  sessionHistory: SessionHistory[]; // assuming SessionHistory type exists
  totalSessions: number;
  therapist: {
    id: string;
    fullName: string;
    email: string;
    speciality: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Example SessionHistory type
export interface SessionHistory {
  date: string;
  summary: string;
  duration: number;
  fullNote: string;
}


// New interface for detailed session history
export interface SessionHistory {
  date: string;
  summary: string; // Short summary
  duration: number;
  fullNote: string; // Detailed note content
}

export  interface UserProfile {
  name: string;
  email: string;
  phoneNumber: string;
  speciality: string;
  qualifications: string;
  startTime: string;
  endTime: string;
}

export interface DetailItemProps {
  icon: React.FC<any>;
  label: string;
  value: string;
}

export interface SessionHistoryProps extends SessionHistory {
  onViewNote: (session: SessionHistory) => void;
}

export interface DetailPatientRowProps {
  patient: Patient;
  onViewPatientDetails: (patientId: number) => void;
}
