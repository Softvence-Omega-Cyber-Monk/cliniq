import type React from 'react';
import type { StatCardType } from '../../types/dashboard';

const StatCard: React.FC<StatCardType> = ({ title, value, icon: Icon, percentage, trend, iconBgColor }) => {
  const isUp = trend === 'up';
  
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-lg ${iconBgColor}`}>
          <Icon className="h-6 w-6" />
        </div>
        {percentage && (
          <div className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full ${isUp ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
            {isUp ? '▲' : '▼'} {percentage}%
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;