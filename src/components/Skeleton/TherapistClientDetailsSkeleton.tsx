const TherapistClientDetailsSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen px-6 py-8 space-y-6">
      {/* Back Button Skeleton */}
      <div className="h-5 w-40 bg-gray-200 rounded animate-pulse mb-5"></div>

      {/* Client Header Card Skeleton */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col lg:flex-row justify-between gap-8 animate-pulse">
        <div className="flex gap-6 flex-1">
          {/* Avatar */}
          <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0"></div>
          <div className="flex-1 space-y-4">
            <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
            <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
            <div className="flex gap-2 flex-wrap">
              <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
              <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
              <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Session Status Skeleton */}
        <div className="flex flex-col items-center gap-4 lg:min-w-[280px] w-full">
          <div className="w-full h-32 bg-gray-200 rounded-xl"></div>
          <div className="flex flex-col gap-3 w-full">
            <div className="h-10 bg-gray-200 rounded-xl w-full"></div>
            <div className="h-10 bg-gray-200 rounded-xl w-full"></div>
          </div>
        </div>
      </div>

      {/* Main Content Grid Skeleton */}
      <div className="space-y-6">
        {/* Treatment Progress Card Skeleton */}
        <div className="h-48 bg-gray-200 rounded-xl animate-pulse"></div>

        {/* Crisis History Skeleton */}
        <div className="h-32 bg-gray-200 rounded-xl animate-pulse"></div>

        {/* Session History Skeleton */}
        <div className="h-48 bg-gray-200 rounded-xl animate-pulse"></div>
      </div>
    </div>
  );
};

export default TherapistClientDetailsSkeleton;
