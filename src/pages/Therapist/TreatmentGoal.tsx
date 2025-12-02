interface GoalProps {
  title: string;
  progress: number;
}

export const TreatmentGoal: React.FC<GoalProps> = ({ title, progress }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center text-gray-800">
      <span className="font-medium text-sm">{title}</span>
      <span className="font-bold text-sm text-teal-600">{progress}%</span>
    </div>
    <div className="relative h-2 rounded-full bg-gray-200">
      <div
        className="absolute h-2 rounded-full bg-teal-500 transition-all duration-500"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  </div>
);
