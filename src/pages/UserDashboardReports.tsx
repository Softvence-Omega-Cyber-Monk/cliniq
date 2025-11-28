import React from "react";
import {
  StatCard,
  SessionTrendsChart,
  TopTherapistsChart,
  SessionTypeDistributionChart,
  CalendarIcon,
  ChartIcon,
  AlertIcon,
  UsersIcon,
  PlusIcon,
  ChevronDownIcon,
} from "../components/Reports";

const UserDashboardReportsPage: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen text-slate-800  p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            Reports & Analytics
          </h1>
        </header>

        <main>
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Sessions"
              value="556"
              icon={<CalendarIcon />}
              iconBgColor="bg-teal-100"
              iconTextColor="text-teal-500"
            />
            <StatCard
              title="Completed Sessions"
              value="518"
              icon={<ChartIcon />}
              iconBgColor="bg-green-100"
              iconTextColor="text-green-500"
            />
            <StatCard
              title="Crisis Alerts"
              value="14"
              icon={<AlertIcon />}
              iconBgColor="bg-red-100"
              iconTextColor="text-red-500"
            />
            <StatCard
              title="Avg Patient Progress"
              value="68%"
              icon={<UsersIcon />}
              iconBgColor="bg-sky-100"
              iconTextColor="text-sky-500"
            />
          </div>

          {/* Report Generation Filters */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-slate-700">
              Generate Reports
            </h2>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-grow sm:flex-grow-0 flex flex-wrap gap-4">
                <FilterDropdown label="This Month" />
                <FilterDropdown label="All Therapists" />
                <FilterDropdown label="All Status" />
                <FilterDropdown label="Therapist Performance" />
              </div>
              <button className="flex items-center gap-2 bg-teal-400 hover:bg-teal-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-300 ml-auto">
                <PlusIcon />
                Export Data
              </button>
            </div>
          </div>

          {/* Charts */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-8">
            <SessionTrendsChart />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <TopTherapistsChart />
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <SessionTypeDistributionChart />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

interface FilterDropdownProps {
  label: string;
}
const FilterDropdown: React.FC<FilterDropdownProps> = ({ label }) => {
  return (
    <div className="relative">
      <select className="appearance-none bg-white border border-slate-200 text-slate-600 font-medium py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300 cursor-pointer">
        <option>{label}</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
        <ChevronDownIcon />
      </div>
    </div>
  );
};

export default UserDashboardReportsPage;
