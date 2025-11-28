import { FC } from "react";
import StatCard from "@/components/Reports/StatCard";
import ReportCard from "@/components/Reports/ReportCard";
import LineChartMock from "@/components/Reports/LineChartMock";
import BarChartMock from "@/components/Reports/BarChartMock";
import { statsData, reportsData } from "@/components/Reports/mockData";

const Reports: FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 ">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Therapy Dashboard
        </h1>
        <p className="text-gray-500">
          Welcome back, here is an overview of your practice.
        </p>
      </header>

      {/* 1. Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsData.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* 2. Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        {/* Session Trend Chart */}
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
          <LineChartMock />
        </div>

        {/* Client Progress Overview Chart */}
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
          <BarChartMock />
        </div>
      </div>

      {/* 3. Available Reports Section */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 pt-4 border-t border-gray-200">
        Available Reports
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reportsData.map((report, index) => (
          <ReportCard key={index} {...report} />
        ))}
      </div>
    </div>
  );
};

export default Reports;
