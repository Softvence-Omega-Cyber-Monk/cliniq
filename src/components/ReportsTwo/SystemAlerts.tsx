import React from 'react';
import type { SystemAlertType } from '../../types/dashboard';
import { AlertTriangleIcon, CheckmarkIcon } from '../icons';

const alerts: SystemAlertType[] = [
  { title: 'Crisis Alert', description: 'Patient flagged for immediate attention', time: '2 min ago', type: 'alert' },
  { title: 'Backup Complete', description: 'Daily backup completed successfully', time: '2 min ago', type: 'success' },
  { title: 'Medication Reminder', description: 'Patient due for medication administration', time: '5 min ago', type: 'alert' },
  { title: 'Backup Complete', description: 'New patient admitted to the ward', time: '10 min ago', type: 'success' },
  { title: 'Discharge Processed', description: 'Patient discharge paperwork completed', time: '15 min ago', type: 'alert' },
];

const AlertItem: React.FC<{ alert: SystemAlertType }> = ({ alert }) => {
  const isAlert = alert.type === 'alert';
  const iconBg = isAlert ? 'bg-red-100' : 'bg-green-100';
  const iconColor = isAlert ? 'text-red-500' : 'text-green-500';

  return (
    <li className="flex items-start py-4 border-b border-gray-100 last:border-b-0">
      <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${iconBg}`}>
        {isAlert ? <AlertTriangleIcon className={`w-5 h-5 ${iconColor}`} /> : <CheckmarkIcon className={`w-5 h-5 ${iconColor}`} />} 
      </div>
      <div className="ml-4 flex-grow">
        <p className="font-semibold text-gray-700">{alert.title}</p>
        <p className="text-sm text-gray-500">{alert.description}</p>
      </div>
      <p className="text-sm text-gray-400 flex-shrink-0">{alert.time}</p>
    </li>
  );
};

const SystemAlerts: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-bold text-gray-800 mb-2">System Alerts</h3>
      <ul>
        {alerts.map((alert, index) => (
          <AlertItem key={index} alert={alert} />
        ))}
      </ul>
    </div>
  );
};

export default SystemAlerts;
