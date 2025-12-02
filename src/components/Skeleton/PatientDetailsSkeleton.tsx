export default function PatientDetailsSkeleton() {
  const renderDetailItems = Array.from({ length: 3 }, (_, i) => (
    <div key={i} className="flex items-start space-x-3 animate-pulse">
      <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
      <div className="flex flex-col gap-1">
        <div className="h-3 bg-gray-300 rounded w-24"></div>
        <div className="h-4 bg-gray-300 rounded w-32"></div>
      </div>
    </div>
  ));

  const renderGoals = Array.from({ length: 3 }, (_, i) => (
    <div key={i} className="space-y-2 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="h-3 bg-gray-300 rounded w-40"></div>
        <div className="h-3 bg-gray-300 rounded w-10"></div>
      </div>
      <div className="h-2 bg-gray-200 rounded-full w-full"></div>
    </div>
  ));

  const renderSessions = Array.from({ length: 3 }, (_, i) => (
    <div
      key={i}
      className="bg-white p-4 rounded-xl border border-gray-200 animate-pulse flex flex-col space-y-3"
    >
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="h-3 w-32 bg-gray-300 rounded"></div>
          <div className="h-3 w-40 bg-gray-200 rounded"></div>
        </div>
        <div className="h-5 w-12 bg-gray-200 rounded"></div>
      </div>
      <div className="h-8 bg-gray-200 rounded w-full"></div>
    </div>
  ));

  return (
    <div className="space-y-4">
      {/* Breadcrumb Skeleton */}
      <div className="h-4 w-64 bg-gray-200 animate-pulse rounded mb-6"></div>

      {/* Patient Details Skeleton */}
      <div className="bg-white p-6 rounded-xl space-y-6">
        <div className="h-6 w-48 bg-gray-200 animate-pulse rounded mb-4"></div>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-4">{renderDetailItems}</div>
          <div className="flex-1 space-y-4">{renderDetailItems}</div>
        </div>
      </div>

      {/* Treatment Progress Skeleton */}
      <div className="bg-white p-6 rounded-xl space-y-4">
        <div className="flex justify-between items-center mb-2">
          <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-10 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="h-3 bg-gray-200 rounded-full">
          <div className="h-3 bg-gray-300 rounded-full w-1/4 animate-pulse"></div>
        </div>
      </div>

      {/* Treatment Goals Skeleton */}
      <div className="bg-white p-6 rounded-xl space-y-4">{renderGoals}</div>

      {/* Session History Skeleton */}
      <div className="bg-white p-6 rounded-xl space-y-4">{renderSessions}</div>
    </div>
  );
}
