import React from "react";

const StatCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm animate-pulse flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <div className="p-3 rounded-lg bg-gray-200 w-10 h-10"></div>
        <div className="flex items-center text-xs font-semibold px-2 py-1 rounded-full bg-gray-200 w-12 h-5"></div>
      </div>
      <div className="mt-4">
        <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-8 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  );
};

export default StatCardSkeleton;
