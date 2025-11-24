import { useGetSessionTrendsQuery } from "@/store/api/dashboardApi";
import { RootState } from "@/store/store";

import { getDateRangeParams } from "@/utils/getDateRangeParams";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// const data = [
//   { name: "Week-1", Completed: 120, Scheduled: 70, Cancelled: 30 },
//   { name: "Week-2", Completed: 280, Scheduled: 200, Cancelled: 90 },
//   { name: "Week-3", Completed: 120, Scheduled: 30, Cancelled: 10 },
//   { name: "Week-4", Completed: 230, Scheduled: 90, Cancelled: 45 },
// ];

const ChartCard: React.FC<{
  children: React.ReactNode;
  title: string;
  actions?: React.ReactNode;
}> = ({ children, title, actions }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-bold text-gray-800">{title}</h3>
      {actions}
    </div>
    <div className="h-72">{children}</div>
  </div>
);

const SessionsCompletionChart: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [activeTab, setActiveTab] = useState("Week");
  console.log(user);
  const { startDate, endDate } = getDateRangeParams(activeTab);
  const dateRange = activeTab === "Week" ? "last_7_days" : "last_30_days";

  const {
    data: chartData,
    isLoading,
    isError,
  } = useGetSessionTrendsQuery({
    dateRange,
    startDate,
    endDate,
    therapistId: user?.id ?? "",
    status: "completed",
  });

  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <div className="flex justify-center space-x-4 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center">
            <span
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: entry.color }}
            ></span>
            <span className="text-sm text-gray-600">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <ChartCard
      title="Sessions Completion"
      actions={
        <div className="flex bg-gray-100 p-1 rounded-lg text-sm">
          <button
            onClick={() => setActiveTab("Week")}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeTab === "Week" ? "bg-teal-500 text-white" : "text-gray-600"
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setActiveTab("Month")}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeTab === "Month" ? "bg-teal-500 text-white" : "text-gray-600"
            }`}
          >
            Month
          </button>
        </div>
      }
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData?.weeklyData}
          margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="week"
            tickLine={false}
            axisLine={false}
            dy={10}
            tick={{ fill: "#6B7280" }}
          />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: "#6B7280" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: "0.5rem",
            }}
          />
          <Legend content={renderLegend} verticalAlign="bottom" />
          <Line
            type="monotone"
            dataKey="completed"
            stroke="#34D399"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 7 }}
          />
          <Line
            type="monotone"
            dataKey="scheduled"
            stroke="#FBBF24"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 7 }}
          />
          <Line
            type="monotone"
            dataKey="cancelled"
            stroke="#F87171"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default SessionsCompletionChart;
