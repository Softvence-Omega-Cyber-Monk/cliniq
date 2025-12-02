import { Calendar, Eye, FileText } from "lucide-react";
import { format } from "date-fns";

interface SessionHistoryProps {
  key: string;
  date: string;
  duration: number;
  type: string;
  notes: string;
}

export const SessionHistoryCard: React.FC<SessionHistoryProps> = ({
  date,
  notes,
  duration,
}) => {
  return (
    <div className="bg-white p-4 rounded-xl  border border-[#EBEBEC] flex flex-col hover:shadow-md transition">
      <div className="flex justify-between items-start space-x-4 mb-3">
        <div className="flex items-start space-x-3">
          <div className="flex flex-col gap-2.5">
            <div className="flex gap-3.5">
              <Calendar className="text-[#3FDCBF]" size={20} />
              <p className="text-sm  text-[#32363F]">
                {" "}
                {format(new Date(date), "MMMM d, yyyy")}
              </p>
            </div>

            <div className="flex text-[#7E8086] gap-2">
              <FileText size={20} />
              <p className="text-sm text-[#7E8086]  line-clamp-1  mt-1">
                {notes}
              </p>
            </div>
          </div>
        </div>
        <span className="text-xs  border border-[#A7A9AC] px-2 py-[3px] rounded-[6px] bg-[#EBEBEC80] text-[#32363F] flex-shrink-0">
          {duration} min
        </span>
      </div>

      <button className="w-full cursor-pointer py-2 mt-2 text-sm font-medium text-[#3FDCBF] bg-[#3FDCBF1A] hover:bg-teal-100 rounded-lg transition duration-200 flex items-center justify-center space-x-2 border border-teal-200 hover:border-teal-300 ">
        <Eye size={16} />
        <span>View Session Note</span>
      </button>
    </div>
  );
};
