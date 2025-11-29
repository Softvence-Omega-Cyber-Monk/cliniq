import React from "react";
import { Users, Calendar, Clock, BarChart } from "lucide-react";

// 1. Summary Card Data
export const summaryCardsData = [
  {
    title: "Total Clients",
    value: 1,
    percent: 12.3,
    icon: Users,
    iconColor: "text-purple-500",
    bgColor: "bg-purple-100",
  },
  {
    title: "Upcoming Appointments",
    value: 2,
    percent: 12.3,
    icon: Calendar,
    iconColor: "text-green-500",
    bgColor: "bg-green-100",
  },
  {
    title: "Sessions Completed",
    value: 9,
    percent: 12.3,
    icon: Clock,
    iconColor: "text-orange-500",
    bgColor: "bg-orange-100",
  },
  {
    title: "Treatment Progress",
    value: 6,
    percent: 12.3,
    icon: BarChart,
    iconColor: "text-sky-500",
    bgColor: "bg-sky-100",
  },
];

/**
 * SummaryCard Component
 */
interface SummaryCardProps {
  data: (typeof summaryCardsData)[0];
}

const SummaryCard: React.FC<SummaryCardProps> = ({ data }) => {
  const Icon = data.icon;
  return (
    <div className="bg-white p-5 rounded-2xl shadow-md transition hover:shadow-lg">
      <div className="flex justify-between items-start mb-3">
        {/* Icon Container */}
        <div className={`p-2 rounded-full ${data.bgColor}`}>
          <Icon className={`w-5 h-5 ${data.iconColor}`} />
        </div>
        {/* Percentage */}
        <div className="text-xs font-semibold text-green-500 bg-green-100 dark:bg-green-900 dark:text-green-300 px-2 py-0.5 rounded-full">
          {data.percent}%
        </div>
      </div>

      <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
        {data.title}
      </p>
      <p className="text-3xl font-bold text-gray-900">{data.value}</p>
    </div>
  );
};

export default SummaryCard;
