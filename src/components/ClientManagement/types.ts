export type Status = any;
export type Severity = 'high' | 'medium' | 'low';

export interface CrisisEvent {
  id: number;
  date: string; // YYYY-MM-DD
  title: string;
  severity: Severity;
  actionsTaken: string;
  tags: string[];
}

export interface Session {
  id: number;
  date: string; // YYYY-MM-DD HH:MM AM/PM
  type: 'Therapy Session' | 'Crisis Intervention' | 'Follow-up Session' | 'Initial Assessment';
  summary: string;
  details?: string; // Collapsible details
}

export interface ProgressItem {
  label: string;
  value: number; // Percentage 0-100
}

export interface Client {
  id: number;
  name: string;
  status: Status;
  condition: string;
  email: string;
  sessionCount: number;
  phone: string;
  totalSessions: number;
  lastSession: string; // YYYY-MM-DD
  nextSession: string; // YYYY-MM-DD HH:MM AM/PM or 'N/A'
  treatmentTags: string[];
  crisisHistory: CrisisEvent[];
  progressItems: ProgressItem[];
  sessionHistory: Session[];

  overallProgress: number | null;

}
