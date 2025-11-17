import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', 'This Week': 190, 'Last Week': 260 },
  { name: 'Feb', 'This Week': 195, 'Last Week': 270 },
  { name: 'Mar', 'This Week': 190, 'Last Week': 260 },
  { name: 'Apr', 'This Week': 195, 'Last Week': 270 },
  { name: 'May', 'This Week': 195, 'Last Week': 260 },
  { name: 'June', 'This Week': 190, 'Last Week': 270 },
];

const ChartCard: React.FC<{ children: React.ReactNode, title: string }> = ({ children, title }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
        <div className="h-72">
            {children}
        </div>
    </div>
);

const TherapistActivityChart: React.FC = () => {
    
  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <div className="flex justify-center space-x-4 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center">
            <span className="w-3 h-3 rounded-sm mr-2" style={{ backgroundColor: entry.color }}></span>
            <span className="text-sm text-gray-600">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <ChartCard title="Therapist Activity">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }} barGap={8}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tickLine={false} axisLine={false} dy={10} tick={{ fill: '#6B7280' }}/>
          <YAxis tickLine={false} axisLine={false} tick={{ fill: '#6B7280' }}/>
          <Tooltip cursor={{fill: 'rgba(241, 245, 249, 0.5)'}} contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }} />
          <Legend content={renderLegend} verticalAlign="bottom" />
          <Bar dataKey="This Week" fill="#2DD4BF" radius={[4, 4, 0, 0]} barSize={12} />
          <Bar dataKey="Last Week" fill="#38BDF8" radius={[4, 4, 0, 0]} barSize={12} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default TherapistActivityChart;
