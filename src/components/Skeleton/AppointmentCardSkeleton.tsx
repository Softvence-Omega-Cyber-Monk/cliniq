const AppointmentCardSkeleton = () => {
  return (
    <div className="bg-[#FAFAF7] p-5 rounded-xl  border border-gray-100 animate-pulse">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gray-200"></div>
          <div>
            <div className="w-32 h-4 bg-gray-200 rounded mb-2"></div>
            <div className="w-20 h-3 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="w-16 h-5 bg-gray-200 rounded"></div>
      </div>

      <div className="space-y-3 border-t border-gray-100 pt-3">
        <div className="w-40 h-3 bg-gray-200 rounded"></div>
        <div className="w-32 h-3 bg-gray-200 rounded"></div>
        <div className="w-36 h-3 bg-gray-200 rounded"></div>
        <div className="w-28 h-3 bg-gray-200 rounded"></div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
        <div className="flex space-x-3">
          <div className="w-5 h-5 bg-gray-200 rounded"></div>
          <div className="w-5 h-5 bg-gray-200 rounded"></div>
        </div>
        <div className="w-24 h-8 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  );
};

export default AppointmentCardSkeleton;
