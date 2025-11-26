const SessionAlertSkeleton: React.FC = () => {
  return (
    <div className="p-4 rounded-xl bg-gray-200 flex items-start space-x-4 animate-pulse">
      {/* Icon placeholder */}
      <div className="w-6 h-6 rounded-full bg-gray-300 " />

      {/* Text placeholder */}
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-300  rounded w-1/3" />
        <div className="h-3 bg-gray-300  rounded w-2/3" />
        <div className="h-3 bg-gray-300  rounded w-1/4" />
      </div>
    </div>
  );
};

export default SessionAlertSkeleton;
