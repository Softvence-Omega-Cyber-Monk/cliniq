import { Patient } from "@/components/Therapists";
import { Link } from "react-router-dom";

export const DetailPatientRow: React.FC<{
  patient: Patient;
}> = ({ patient }) => {
  const statusClasses =
    patient.status === "active"
      ? "bg-[#6F8A48] text-white"
      : patient.status === "completed"
      ? "bg-blue-100 text-blue-700"
      : "bg-[#D45B53] text-white";

  const progressBarWidth = `${patient.overallProgress || 0}%`;

  return (
    <tr className="border-b border-[#E0E0E1] last:border-b-0 hover:bg-gray-50 transition duration-150">
      <td className="p-4 text-[#1A1A1A]  capitalize">{patient.name}</td>
      <td className="p-4 text-[#7E8086]">{patient.sessionCount}</td>
      <td className="p-4">
        <div className="flex items-center space-x-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-teal-500 h-2 rounded-full"
              style={{ width: progressBarWidth }}
            />
          </div>
          <span className="text-sm text-gray-600 w-10">
            {patient.overallProgress}%
          </span>
        </div>
      </td>
      <td className="p-4">
        <span
          className={`text-xs  capitalize px-5 py-3 rounded-[6px] ${statusClasses}`}
        >
          {patient.status}
        </span>
      </td>
      <td className="p-4 text-right">
        <Link
          to={`/private-practice-admin/therapists/b1527469-3d26-4a6f-aa3b-7143baff2128/patients/${patient.id}`}
          className="text-teal-500 hover:text-teal-700 text-sm font-medium px-4 py-[9px] border border-teal-300 rounded-lg hover:bg-teal-50 transition"
        >
          View Details
        </Link>
      </td>
    </tr>
  );
};
