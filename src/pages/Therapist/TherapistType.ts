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
  isCurrentUser?: boolean;
}

export interface Patient {
  id: string;
  name: string;
  sessionCount: number;
  progressPercent: number;
  status: "Active" | "Inactive";
  therapistId: number;
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
