import React from 'react';
import type { RecentSessionType } from '../../types/dashboard';

const sessions: RecentSessionType[] = [
  { name: 'Dr. Sarah Johnson', avatarUrl: 'https://picsum.photos/id/1027/50/50', description: 'Started session with Patient #1248' },
  { name: 'Arlene McCoy', avatarUrl: 'https://picsum.photos/id/1011/50/50', description: 'Started session with Patient #1248' },
  { name: 'Wade Warren', avatarUrl: 'https://picsum.photos/id/1012/50/50', description: 'Started session with Patient #1248' },
  { name: 'Bessie Cooper', avatarUrl: 'https://picsum.photos/id/1005/50/50', description: 'Started session with Patient #1248' },
  { name: 'Kristin Watson', avatarUrl: 'https://picsum.photos/id/1006/50/50', description: 'Started session with Patient #1248' },
];

const RecentSessions: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Sessions</h3>
      <ul>
        {sessions.map((session, index) => (
          <li key={index} className="flex items-center py-3 border-b border-gray-100 last:border-b-0">
            <img src={session.avatarUrl} alt={session.name} className="w-10 h-10 rounded-full object-cover" />
            <div className="ml-4">
              <p className="font-semibold text-gray-700">{session.name}</p>
              <p className="text-sm text-gray-500">{session.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentSessions;
