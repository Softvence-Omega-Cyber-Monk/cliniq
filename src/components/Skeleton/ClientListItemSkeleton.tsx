import React from "react";

const ClientListItemSkeleton: React.FC = () => {
  return (
    <div className="bg-white p-5 rounded-xl animate-pulse flex items-center justify-between space-x-4 mb-4">
      {/* Left side — avatar + text */}
      <div className="flex items-center space-x-4 min-w-[40%]">
        {/* Avatar */}
        <div className="w-10 h-10 bg-gray-200 rounded-full" />

        {/* Name + status + condition */}
        <div className="space-y-2 w-full">
          {/* Name */}
          <div className="h-4 bg-gray-200 rounded w-32" />

          {/* Condition */}
          <div className="h-3 bg-gray-200 rounded w-48" />
        </div>
      </div>

      {/* Grid section (hidden on small) */}
      <div className="hidden sm:grid sm:grid-cols-4 sm:gap-4 flex-grow text-sm">
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-20" />
          <div className="h-3 bg-gray-200 rounded w-10" />
        </div>

        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-20" />
          <div className="h-3 bg-gray-200 rounded w-16" />
        </div>

        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-20" />
          <div className="h-3 bg-gray-200 rounded w-14" />
        </div>

        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-20" />
          <div className="h-3 bg-gray-200 rounded w-12" />
        </div>
      </div>

      {/* Details button */}
      <div className="hidden md:block">
        <div className="h-8 w-24 bg-gray-200 rounded-lg" />
      </div>
    </div>
  );
};

export default ClientListItemSkeleton;
