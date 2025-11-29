export interface StatCardProps {
  title: string;
  value: number | string;
  percentage: number;
  icon: 'clock' | 'users' | 'chart' | 'hourglass';
}

export interface ReportCardProps {
  title: string;
  description: string;
}
export interface AssessmentAlert {
  id: string;
  title: string;
  clientId: string;
  clientName: string;
  severity: "high" | "medium" | "low";
  timeAgo: string;
  createdAt: string;
  message: string
}
