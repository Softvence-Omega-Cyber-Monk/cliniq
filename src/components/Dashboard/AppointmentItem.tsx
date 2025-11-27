import React from "react";
import { Clock } from "lucide-react";
import { Appointment } from "../Appointments/types";
interface Appointments {
  appointment: Appointment;
}
const AppointmentItem: React.FC<Appointments> = ({ appointment: data }) => {
  //   const statusColor =
  //     data.status === "confirmed"
  //       ? "bg-green-100 text-green-700"
  //       : "bg-yellow-100 text-yellow-700";

  return (
    <div className="flex justify-between items-center p-4 bg-[#FAFAF7] rounded-xl shadow-[0px_4px_33.1px_0px_rgba(0,0,0,0.04)] hover:ring-1 ring-gray-200 dark:ring-gray-700 transition">
      <div className="flex items-center space-x-3">
        {/* Icon */}
        <div className="p-2.5 bg-[#96C75E1A] rounded-full flex items-center justify-center">
          <Clock className="  text-3xl  text-[#3FDCBF]" />
        </div>
        {/* Details */}
        <div>
          <p className="font-semibold  capitalize text-[#575A62]">
            {data?.client.name}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {data.sessionType}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-end">
        <p className="font-semibold text-gray-900 ">{data.scheduledTime}</p>
        <span
          className={`text-xs font-medium px-2 py-0.5 mt-1 rounded-[6px] capitalize text-white bg-[#3FDCBF]`}
        >
          {data.status}
        </span>
      </div>
    </div>
  );
};

export default AppointmentItem;
