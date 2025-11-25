import { BarChart } from "lucide-react";
import {
  Bar,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
const therapistActivityData = [
  { name: "Dr. Williams", "This Week": 15, "Last Week": 18 },
  { name: "Dr. Rodriguez", "This Week": 16, "Last Week": 20 },
  { name: "Dr. Chen", "This Week": 18, "Last Week": 22 },
  { name: "Dr. Johnson", "This Week": 16, "Last Week": 20 },
  { name: "Dr. Davis", "This Week": 14, "Last Week": 19 },
];
const TherapistActivityChart: React.FC = () => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">
      Therapist Activity
    </h3>
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={therapistActivityData}
          margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#f0f0f0"
          />
          <XAxis
            dataKey="name"
            stroke="#a0a0a0"
            tickLine={false}
            axisLine={false}
            angle={-30}
            textAnchor="end"
            height={50}
            interval={0}
            style={{ fontSize: "10px" }}
          />
          <YAxis
            stroke="#a0a0a0"
            tickLine={false}
            axisLine={false}
            domain={[0, 30]}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              fontSize: 12,
              border: "none",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
          />
          <Legend
            wrapperStyle={{ paddingTop: 20 }}
            iconType="square"
            layout="horizontal"
            align="center"
            verticalAlign="bottom"
          />
          <Bar dataKey="This Week" fill="#4a89dc" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Last Week" fill="#3bafda" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);
export default TherapistActivityChart;
