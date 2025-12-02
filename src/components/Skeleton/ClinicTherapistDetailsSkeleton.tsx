export default function ClinicTherapistDetailsSkeleton() {
  const renderCards = Array.from({ length: 6 }, (_, i) => (
    <div
      key={i}
      className="h-20 bg-gray-200 animate-pulse rounded-xl flex items-center justify-center"
    ></div>
  ));

  const renderStats = Array.from({ length: 3 }, (_, i) => (
    <div
      key={i}
      className="bg-gray-200 animate-pulse h-24 rounded-2xl p-6 flex justify-between items-center"
    >
      <div className="h-6 w-32 bg-gray-300 rounded-md"></div>
      <div className="h-10 w-10 bg-gray-300 rounded-lg"></div>
    </div>
  ));

  const renderRows = Array.from({ length: 5 }, (_, i) => (
    <tr key={i} className="animate-pulse">
      <td className="p-4">
        <div className="h-4 bg-gray-300 rounded w-24"></div>
      </td>
      <td className="p-4">
        <div className="h-4 bg-gray-300 rounded w-12"></div>
      </td>
      <td className="p-4">
        <div className="h-4 bg-gray-300 rounded w-20"></div>
      </td>
      <td className="p-4">
        <div className="h-4 bg-gray-300 rounded w-16"></div>
      </td>
      <td className="p-4">
        <div className="h-4 bg-gray-300 rounded w-12"></div>
      </td>
    </tr>
  ));

  return (
    <div className="space-y-8">
      {/* Breadcrumb Skeleton */}
      <div className="h-4 w-48 bg-gray-200 animate-pulse rounded"></div>

      {/* Therapist Info Skeleton */}
      <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {renderCards}
        </div>
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{renderStats}</div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-xl overflow-x-auto p-2">
        <table className="w-full text-left">
          <thead className="bg-gray-100 rounded-[8px]">
            <tr>
              {Array.from({ length: 5 }, (_, i) => (
                <th
                  key={i}
                  className="p-4 h-4 bg-gray-200 rounded animate-pulse"
                ></th>
              ))}
            </tr>
          </thead>
          <tbody>{renderRows}</tbody>
        </table>
      </div>
    </div>
  );
}
