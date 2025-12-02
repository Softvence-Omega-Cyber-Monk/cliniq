export default function TherapistCardSkeleton() {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-100 flex flex-col animate-pulse">
      {/* Name and Specialty */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-gray-200"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>

      {/* Status and Patients */}
      <div className="flex justify-between items-center mb-5 border-t border-gray-300 pt-4">
        <div className="flex flex-col space-y-1">
          <div className="h-3 bg-gray-200 rounded w-16"></div>
          <div className="h-4 bg-gray-200 rounded w-12"></div>
        </div>
        <div className="flex flex-col items-end space-y-1">
          <div className="h-3 bg-gray-200 rounded w-16"></div>
          <div className="h-6 bg-gray-200 rounded w-12"></div>
        </div>
      </div>

      {/* Button */}
      <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
    </div>
  );
}
