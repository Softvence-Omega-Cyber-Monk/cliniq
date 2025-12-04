export type Status = 'active' | 'inactive' | "completed";

export interface Therapist {
  id: string;
  name: string;
  specialty: string;
  status: Status;
  patientCount: number;
  email: string;
  phone: string;
  qualifications: string;
  availability: string;
  totalSessionsLast30Days: number;
  avatar: string;
}

export interface Patient {
  patient: Patient;
  id: string;
  therapistId: string;
  name: string;
  sessionCount: number;
  treatmentProgress: number;
  status?: Status;
  email: string;
  healthIssue: string;
  age: number;
  emergencyContact: {
    name: string;
    phone: string;
  };

  overallProgress: number;
  treatmentGoals: TreatmentGoal[];
  sessionHistory: Session[];
}

export interface TreatmentGoal {
  id: string;
  goal: string;
  progress: number;
}

export interface Session {
  id: string;
  date: string;
  duration: number; // in minutes
  summary: string;
  notes: string;
}
export interface Goal {
  score: number;
  goalName: string;
}