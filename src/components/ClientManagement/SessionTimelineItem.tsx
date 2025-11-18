import React, { useState } from 'react';
import { Session } from './types';
import { IconTime, IconChevronDown } from './utilityComponents';

const SessionTimelineItem: React.FC<{ session: Session }> = ({ session }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const iconClasses = 'text-white w-4 h-4';
  let iconBgClass = 'bg-emerald-500';
  if (session.type === 'Crisis Intervention') iconBgClass = 'bg-red-500';
  else if (session.type === 'Initial Assessment') iconBgClass = 'bg-blue-500';

  return (
    <div className="relative pl-8 pb-8">
      {/* Timeline Connector Line */}
      <div className="absolute top-0 left-[18px] w-px h-full bg-gray-200"></div>

      {/* Icon Circle */}
      <div className="absolute left-1 top-0 flex items-center justify-center w-8 h-8 rounded-full z-10">
        <div className={`flex items-center justify-center w-7 h-7 rounded-full ${iconBgClass} shadow-md`}>
          <IconTime className={iconClasses} />
        </div>
      </div>

      {/* Content Card */}
      <div className="ml-6 flex flex-col w-full">
        <div className="flex justify-between items-start w-full cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
          <div>
            <h4 className="text-base font-semibold text-gray-800">{session.type}</h4>
            <p className="text-xs text-gray-500 mt-0.5">{session.date}</p>
          </div>
          <button className="text-gray-400 hover:text-gray-600 transition p-1">
            <IconChevronDown className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <p className="text-sm text-gray-600 mt-2">{session.summary}</p>

        {isExpanded && session.details && (
          <div className="mt-3 p-4 bg-gray-50 border-l-4 border-emerald-400 rounded-r-lg text-sm text-gray-700 transition-all duration-300">
            {session.details}
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionTimelineItem;
