import React, { useState } from 'react';
import StatCard from './StatCard';
import SessionsCompletionChart from './SessionsCompletionChart';
import TherapistActivityChart from './TherapistActivityChart';
import RecentSessions from './RecentSessions';
import SystemAlerts from './SystemAlerts';
import type { StatCardType } from '../../types/dashboard';
import { StatUserIcon, StatCalendarIcon, StatAlertIcon, StatCheckIcon } from '../icons';
import { FaPlus } from 'react-icons/fa';
import EditPersonalInfo from './EditPersonalInfo';

const statCards: StatCardType[] = [
  {
    title: 'Total Therapists',
    value: '47',
    icon: StatUserIcon,
    percentage: 12.3,
    trend: 'up',
    iconBgColor: 'bg-green-100 text-green-600',
  },
  {
    title: 'Upcoming Sessions',
    value: '134',
    icon: StatCalendarIcon,
    percentage: 12.3,
    trend: 'down',
    iconBgColor: 'bg-red-100 text-red-600',
  },
  {
    title: 'Crisis Alerts',
    value: '3',
    icon: StatAlertIcon,
    iconBgColor: 'bg-red-100 text-red-600',
    trend: 'up',
  },
  {
    title: 'Completed Sessions',
    value: '892',
    icon: StatCheckIcon,
    iconBgColor: 'bg-cyan-100 text-cyan-600',
    trend: 'up',
  },
];

const DashboardContent: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex-1">
      <div className='pl-289'>
        <div className='flex gap-[12px]'>
          <button onClick={handleOpenModal} className='py-[10px] px-[11px] bg-[#32363F] text-[#fff] flex items-center gap-2 rounded-[12px]'><FaPlus /> Add New Therapist</button>
          <button className='py-[10px] px-[11px] bg-[#3FDCBF] text-[#fff] flex items-center gap-2 rounded-[12px]'><FaPlus /> Add New Client</button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-6">
        {statCards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
        <SessionsCompletionChart />
        <TherapistActivityChart />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
        <RecentSessions />
        <SystemAlerts />
      </div>

      <EditPersonalInfo isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default DashboardContent;
