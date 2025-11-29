import { Mail, Phone, User, FileText, ClipboardList, TrendingUp } from 'lucide-react';
import { ContactDetail, FaqItem, ResourceItem } from './types';

export const contactData: ContactDetail[] = [

  {
    icon: Mail,
    title: "Email Support",
    description: "Send us an email and we'll respond within 24 hours.",
    actionText: "Email Us",
    detail: "support@example.com",
  },
  {
    icon: Phone,
    title: "Phone Support",
    description: "Send us an email and we'll respond within 24 hours.", // Matching the placeholder text
    actionText: "(555) 987-6543",
    detail: "tel:5559876543",
  },
];

export const faqData: FaqItem[] = [
  { id: 1, question: "How do I schedule a new appointment?", answer: "To schedule a new appointment, navigate to the 'Calendar' tab and click on the 'New Appointment' button. Select the client, date, and time, and click save. You can also drag and drop appointments directly on the calendar interface." },
  { id: 2, question: "How do I start a session?", answer: "You can start a session directly from your schedule by clicking the 'Start Session' button next to the appointment or by finding the client profile and initiating the session from their chart." },
  { id: 3, question: "What happens when I mark a session as a crisis alert?", answer: "Marking a session as a crisis alert will immediately notify your assigned administrative contact and log the event with a high priority tag in the incident reports. This ensures rapid response and documentation." },
  { id: 4, question: "How do I export client reports?", answer: "Client reports can be exported from the 'Reports' section. Select the date range, required data fields, and file format (PDF, CSV), then click 'Generate and Export'." },
  { id: 5, question: "Can I customize my session duration?", answer: "Yes, default session durations are configurable under 'Settings' > 'Billing & Sessions'. You can set different defaults for various service codes." },
  { id: 6, question: "How do I manage inactive clients?", answer: "Inactive clients can be archived in the 'Clients' tab. Select the client, click 'More Actions', and choose 'Archive Client'. This removes them from active lists but retains all their historical data." },
];

export const resourceData: ResourceItem[] = [
  { title: "User Guide", description: "Complete guide to using the TherapyHub platform.", icon: User },
  { title: "Video Tutorials", description: "Step-by-step video guides for common tasks.", icon: FileText },
  { title: "Best Practices", description: "Tips for maximizing your practice efficiency.", icon: ClipboardList },
  { title: "Release Notes", description: "Stay updated with the latest features and improvements.", icon: TrendingUp },
];
