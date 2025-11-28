import React from "react";
import { TrendingUp } from "lucide-react";

interface ProgressMetric {
  label: string;
  progress: number;
}

interface TreatmentProgressCardProps {
  aiInsight: string;
  metrics: ProgressMetric[];
}

const TreatmentProgressCard: React.FC<TreatmentProgressCardProps> = ({
  aiInsight,
  metrics,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="text-teal-600" size={20} />
          <h2 className="text-lg font-bold text-gray-900">
            Treatment Progress
          </h2>
        </div>
        <span className="px-3 py-1 bg-teal-50 text-teal-700 text-xs font-semibold rounded-lg">
          AI-Generated Insights
        </span>
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl p-5 mb-6 border border-teal-100">
        <p className="text-sm text-gray-700 leading-relaxed">
          <span className="font-semibold text-gray-900">
            AI Analysis & Recommendations:
          </span>
          <br />
          {aiInsight}
        </p>
      </div>

      {/* Progress Metrics */}
      <div className="space-y-4">
        {metrics.map((metric, idx) => (
          <div key={idx}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                {metric.label}
              </span>
              <span className="text-sm font-bold text-teal-600">
                {metric.progress}%
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-teal-400 rounded-full transition-all duration-500"
                style={{ width: `${metric.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TreatmentProgressCard;
