import React from "react";

const AppointmentItemSkeleton: React.FC = () => {
  return (
    <div className="flex justify-between items-center p-4 bg-[#FAFAF7] rounded-xl shadow-[0px_4px_33.1px_0px_rgba(0,0,0,0.04)] animate-pulse">
      <div className="flex items-center space-x-3">
        {/* Icon placeholder */}
        <div className="p-2.5 bg-[#96C75E1A] rounded-full w-12 h-12"></div>

        {/* Details placeholder */}
        <div className="space-y-2">
          <div className="h-5 w-32 bg-gray-300 rounded"></div>
          <div className="h-3 w-20 bg-gray-200 rounded"></div>
        </div>
      </div>

      <div className="flex flex-col items-end space-y-2">
        <div className="h-5 w-12 bg-gray-300 rounded"></div>
        <div className="h-4 w-16 bg-gray-200 rounded-full"></div>
      </div>
    </div>
  );
};

export default AppointmentItemSkeleton;
