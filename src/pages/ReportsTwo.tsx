import React from 'react';
import { Download, ChevronDown, CalendarCheck, Users, User, AlertTriangle, ArrowUp, ArrowDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

// --- Interfaces ---

interface Stat {
  label: string;
  value: string | number;
  icon: React.ElementType;
  change: string;
  isPositive: boolean;
  color: 'emerald' | 'red';
}

interface TherapistData {
  name: string;
  sessions: number;
  duration: string;
  completionRate: string;
  status: 'Active' | 'High Risk' | 'Scheduled';
  avatarInitials: string;
}

// --- Mock Data ---

const statsData: Stat[] = [
  {
    label: 'Total Sessions',
    value: 1247,
    icon: CalendarCheck,
    change: '9.3%',
    isPositive: true,
    color: 'emerald',
  },
  {
    label: 'Active Therapists',
    value: 24,
    icon: Users,
    change: '12.3%',
    isPositive: true,
    color: 'emerald',
  },
  {
    label: 'Active Clients',
    value: 342,
    icon: User,
    change: '1.2%',
    isPositive: false,
    color: 'red',
  },
  {
    label: 'Crisis Alerts',
    value: 7,
    icon: AlertTriangle,
    change: '1.2%',
    isPositive: false,
    color: 'red',
  },
];

const sessionTrendsData = [
  { name: 'Week-1', Completed: 80, Scheduled: 40, Cancelled: 10 },
  { name: 'Week-2', Completed: 110, Scheduled: 50, Cancelled: 15 },
  { name: 'Week-3', Completed: 50, Scheduled: 20, Cancelled: 5 },
  { name: 'Week-4', Completed: 160, Scheduled: 80, Cancelled: 25 },
];

const therapistActivityData = [
  { name: 'Dr. Williams', 'This Week': 15, 'Last Week': 18 },
  { name: 'Dr. Rodriguez', 'This Week': 16, 'Last Week': 20 },
  { name: 'Dr. Chen', 'This Week': 18, 'Last Week': 22 },
  { name: 'Dr. Johnson', 'This Week': 16, 'Last Week': 20 },
  { name: 'Dr. Davis', 'This Week': 14, 'Last Week': 19 },
];

const therapistReportData: TherapistData[] = [
  { name: 'Brooklyn Simmons', sessions: 53, duration: '50 min', completionRate: '95%', status: 'Active', avatarInitials: 'BS' },
  { name: 'Annette Black', sessions: 23, duration: '45 min', completionRate: '99%', status: 'Active', avatarInitials: 'AB' },
  { name: 'Esther Howard', sessions: 9, duration: '54 min', completionRate: '94%', status: 'Active', avatarInitials: 'EH' },
  { name: 'Wade Warren', sessions: 37, duration: '35 min', completionRate: '93%', status: 'High Risk', avatarInitials: 'WW' },
  { name: 'Savannah Nguyen', sessions: 47, duration: '48 min', completionRate: '98%', status: 'Active', avatarInitials: 'SN' },
];

// --- Components ---

const StatCard: React.FC<Stat> = ({ label, value, icon: Icon, change, isPositive, color }) => {
  const ChangeIcon = isPositive ? ArrowUp : ArrowDown;
  const colorClass = color === 'emerald' ? 'text-emerald-500' : 'text-red-500';
  const bgColorClass = color === 'emerald' ? 'bg-emerald-100' : 'bg-red-100';

  return (
    <div className="flex flex-col bg-white p-4 rounded-xl shadow-sm border border-gray-100 min-h-[120px] justify-between">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-1.5 rounded-full ${bgColorClass} ${colorClass}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className={`flex items-center text-xs font-semibold ${colorClass}`}>
          <ChangeIcon className="w-3 h-3 mr-0.5" />
          {change}
        </div>
      </div>
      <div className="text-3xl font-bold text-gray-800 leading-none">{value.toLocaleString()}</div>
      <div className="text-sm text-gray-500 mt-1">{label}</div>
    </div>
  );
};

const FilterBar: React.FC = () => {
  const dropdowns = [
    { label: 'Date Range', options: ['Last 30 days', 'Last 7 days', 'Last 90 days'] },
    { label: 'Therapist', options: ['All Therapists', 'Dr. Williams', 'Dr. Chen'] },
    { label: 'Session Status', options: ['All Statuses', 'Completed', 'Scheduled', 'Cancelled'] },
    { label: 'Report Type', options: ['Performance Overview', 'Financial Report', 'Client Report'] },
  ];

  const Dropdown: React.FC<{ label: string; options: string[] }> = ({ options }) => (
    <div className="relative w-full">
      <select 
        className="appearance-none bg-white border border-gray-300 text-gray-700 text-sm py-2 px-4 pr-8 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 transition duration-150 w-full"
        defaultValue={options[0]}
      >
        {options.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
      <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400" />
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-end justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 mt-6 gap-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4 flex-grow">
        {dropdowns.map((d) => (
          <Dropdown key={d.label} label={d.label} options={d.options} />
        ))}
      </div>
      <button className="flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200 text-sm h-10 w-full lg:w-auto min-w-[140px]">
        Generate Report
      </button>
    </div>
  );
};

const SessionTrendsChart: React.FC = () => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Session Trends</h3>
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={sessionTrendsData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis dataKey="name" stroke="#a0a0a0" tickLine={false} axisLine={{ stroke: '#e0e0e0' }} />
          <YAxis stroke="#a0a0a0" tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12, border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }} />
          <Legend wrapperStyle={{ paddingTop: 20 }} iconType="circle" layout="horizontal" align="center" verticalAlign="bottom" />
          <Line type="monotone" dataKey="Completed" stroke="#6bcf8a" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          <Line type="monotone" dataKey="Scheduled" stroke="#f6bb42" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          <Line type="monotone" dataKey="Cancelled" stroke="#e9573f" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const TherapistActivityChart: React.FC = () => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Therapist Activity</h3>
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={therapistActivityData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis dataKey="name" stroke="#a0a0a0" tickLine={false} axisLine={false} angle={-30} textAnchor="end" height={50} interval={0} style={{ fontSize: '10px' }} />
          <YAxis stroke="#a0a0a0" tickLine={false} axisLine={false} domain={[0, 30]} />
          <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12, border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }} />
          <Legend wrapperStyle={{ paddingTop: 20 }} iconType="square" layout="horizontal" align="center" verticalAlign="bottom" />
          <Bar dataKey="This Week" fill="#4a89dc" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Last Week" fill="#3bafda" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const SessionReportTable: React.FC = () => {
  const getStatusClasses = (status: TherapistData['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-100 text-emerald-700';
      case 'High Risk':
        return 'bg-red-100 text-red-700';
      case 'Scheduled':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const Avatar: React.FC<{ initials: string }> = ({ initials }) => (
    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-700 border border-gray-300">
      {initials}
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Session Data Report</h3>
        <button className="flex items-center text-sm font-medium text-gray-700 bg-white border border-gray-300 py-1.5 px-3 rounded-lg hover:bg-gray-50 transition duration-150">
          <Download className="w-4 h-4 mr-2" />
          Download Report
        </button>
      </div>

      {/* Table Structure */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="text-left text-xs font-semibold uppercase text-gray-500">
              <th className="py-3 px-4">Therapist</th>
              <th className="py-3 px-4">Sessions</th>
              <th className="py-3 px-4">AVG. Duration</th>
              <th className="py-3 px-4">Completion Rate</th>
              <th className="py-3 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-gray-700">
            {therapistReportData.map((data, index) => (
              <tr key={index} className="hover:bg-gray-50 transition duration-100">
                <td className="py-3 px-4 flex items-center space-x-3">
                  <Avatar initials={data.avatarInitials} />
                  <span className="font-medium text-gray-800">{data.name}</span>
                </td>
                <td className="py-3 px-4 text-sm">{data.sessions}</td>
                <td className="py-3 px-4 text-sm">{data.duration}</td>
                <td className="py-3 px-4 text-sm">{data.completionRate}</td>
                <td className="py-3 px-4 text-right">
                  <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${getStatusClasses(data.status)}`}>
                    {data.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const CrisisAlerts: React.FC = () => {
  const alerts = [1, 2, 3, 4].map(i => ({ id: `#284${i}`, time: `${i}h ago` }));

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Crisis Alerts</h3>
      <div className="divide-y divide-gray-100">
        {alerts.map((alert, index) => (
          <div key={index} className="flex items-center justify-between py-3 hover:bg-red-50/50 transition duration-100 rounded-lg -mx-2 px-2">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm font-medium text-gray-800">High Risk Assessment</p>
                <p className="text-xs text-gray-500">Client ID: {alert.id}</p>
              </div>
            </div>
            <span className="text-xs text-gray-400">{alert.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 font-inter">
      {/* Load Inter font and Tailwind for a pixel-perfect match */}
      <script src="https://cdn.tailwindcss.com"></script>
      <style>{`
        .font-inter { font-family: 'Inter', sans-serif; }
      `}</style>
      
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">REPORTS & ANALYTICS</h1>
          <p className="text-sm text-gray-500 mt-1">Generate and view detailed practice performance reports</p>
        </div>
        <button className="flex items-center bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition duration-200 mt-4 sm:mt-0 min-w-[170px] justify-center">
          <Download className="w-4 h-4 mr-2" />
          Download Report
        </button>
      </header>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statsData.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Filters */}
      <FilterBar />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <SessionTrendsChart />
        <TherapistActivityChart />
      </div>

      {/* Session Data Report (Now Full Width) */}
      <SessionReportTable />

      {/* Recent Crisis Alerts (Now Full Width) */}
      <CrisisAlerts />
      
    </div>
  );
};

export default App;