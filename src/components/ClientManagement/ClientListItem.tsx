import React from 'react';
import { Client } from './types';
import { IconUser, StatusBadge } from './utilityComponents';

const ClientListItem: React.FC<{ client: Client, onClick: (client: Client) => void }> = ({ client, onClick }) => (
  <div
    className="bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition duration-300 cursor-pointer flex items-center justify-between space-x-4 mb-4"
    onClick={() => onClick(client)}
  >
    <div className="flex items-center space-x-4 min-w-[40%]">
      <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
        <IconUser />
      </div>
      <div className="flex-grow">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold text-gray-800">{client.name}</h3>
          <StatusBadge status={client.status} />
        </div>
        <p className="text-sm text-gray-500 mt-1">
          <span className="font-medium text-gray-600">Condition:</span> {client.condition}
        </p>
      </div>
    </div>

    <div className="hidden sm:grid sm:grid-cols-4 sm:gap-4 flex-grow text-sm text-gray-600">
      <div className="flex flex-col">
        <span className="font-medium text-gray-500">Total Sessions</span>
        <span className="font-bold text-gray-700">{client.totalSessions}</span>
      </div>
      <div className="flex flex-col">
        <span className="font-medium text-gray-500">Last Session</span>
        <span className="text-gray-700">{client.lastSession}</span>
      </div>
      <div className="flex flex-col">
        <span className="font-medium text-gray-500">Next Session</span>
        <span className={`font-medium ${client.nextSession === 'N/A' ? 'text-gray-500' : 'text-emerald-600'}`}>
          {client.nextSession}
        </span>
      </div>
    </div>

    <button
      onClick={(e) => { e.stopPropagation(); onClick(client); }}
      className="hidden md:inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition duration-150"
    >
      View Details
    </button>
  </div>
);

export default ClientListItem;
