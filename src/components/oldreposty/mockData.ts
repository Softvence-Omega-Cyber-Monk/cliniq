import { StatCardProps, ReportCardProps } from './types';

export const statsData: StatCardProps[] = [
  { title: "Total Sessions", value: 1, percentage: 12.3, icon: 'clock' },
  { title: "Active Clients", value: 2, percentage: 12.3, icon: 'users' },
  { title: "Avg. Progress", value: "70%", percentage: 12.3, icon: 'chart' },
  { title: "Session Hours", value: 50, percentage: 12.3, icon: 'hourglass' },
];

export const reportsData: ReportCardProps[] = [
  { title: "Client Progress Summary", description: "Comprehensive overview of all active client treatment progress" },
  { title: "Session Logs", description: "Detailed logs of all therapy sessions with notes" },
  { title: "Monthly Analytics", description: "Monthly breakdown of sessions, clients, and trends" },
  { title: "Crisis Interventions", description: "Report of all crisis alerts and interventions" },
];

// Mock data for charts (simplified)
export const sessionTrendLabels = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
export const clientProgressData = [85, 70, 68, 92, 75];
export const clientProgressLabels = ['Sarah J.', 'Michael C.', 'Emma D.', 'James W.', 'Lisa A.'];