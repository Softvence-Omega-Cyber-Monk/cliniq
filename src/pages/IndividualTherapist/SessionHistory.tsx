import { ChevronDown } from "lucide-react";

const SessionHistory = ({ sessionHistory }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold">Session History</h2>
        <span className="text-sm text-gray-500">
          {sessionHistory.length} sessions
        </span>
      </div>

      <div className="space-y-3">
        {sessionHistory.map((s, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-xl border ${
              s.crisis ? "bg-red-50 border-red-200" : "bg-gray-50"
            }`}
          >
            <div className="flex justify-between">
              <h3 className="font-semibold">{s.type}</h3>
              <ChevronDown size={18} />
            </div>

            <p className="text-xs text-gray-500">{s.date}</p>
            <p className="text-sm mt-2">{s.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SessionHistory;
