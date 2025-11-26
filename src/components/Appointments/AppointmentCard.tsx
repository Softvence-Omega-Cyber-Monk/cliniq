import React from "react";
import {
  Phone,
  Mail,
  Video,
  User,
  Calendar,
  Clock,
  Play,
  ClipboardPlus,
} from "lucide-react";
import { Appointment } from "./types";
import { Link } from "react-router-dom";

interface AppointmentCardProps {
  appointment: Appointment;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment }) => {
  const {
    client,
    scheduledTime,
    duration,
    sessionType,
    status,
    scheduledDate,
    therapist,
  } = appointment;
  const sessionIcon =
    sessionType === "Virtual Session" ? (
      <Video size={16} className="text-gray-500" />
    ) : (
      <User size={16} className="text-gray-500" />
    );
  return (
    <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-100 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:border-mint-200">
      <div>
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-mint-100 text-mint-700 flex items-center justify-center text-sm font-bold text-[#96C75E] bg-[#96C75E1A] mr-3">
              <User />
            </div>
            <div>
              <p className="font-semibold text-gray-800">{client.name}</p>
              {/* <p className="text-sm text-gray-600">{appointment.type}</p> */}
            </div>
          </div>
          <span className="text-xs font-medium capitalize text-white bg-[#298CDF] px-3 py-1 rounded-[6px]">
            {status}
          </span>
        </div>

        <div className="space-y-2 text-sm text-gray-600 border-t border-gray-100 pt-3">
          <div className="flex items-center">
            <ClipboardPlus size={16} className="mr-3 text-mint-500" />
            <span>{therapist?.fullName}</span>
          </div>
          <div className="flex items-center">
            <Calendar size={16} className="mr-3 text-mint-500" />
            <span>
              {(() => {
                const d = new Date(scheduledDate);
                const month = String(d.getMonth() + 1).padStart(2, "0");
                const day = String(d.getDate()).padStart(2, "0");
                const year = d.getFullYear();
                return `${month}/${day}/${year}`;
              })()}
            </span>
          </div>
          <div className="flex items-center">
            <Clock size={16} className="mr-3 text-mint-500" />{" "}
            <span>
              {scheduledTime} ({duration} min)
            </span>
          </div>
          <div className="flex items-center">
            {" "}
            {sessionIcon} <span className="ml-3">{sessionType}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
        <div className="flex space-x-3 text-gray-500">
          <a href={`tel:${client.phone}`}>
            <Phone
              size={18}
              className="cursor-pointer hover:text-mint-600 transition"
              aria-label="Call"
            />
          </a>

          <a href={`mailto:${client.email}`}>
            <Mail
              size={18}
              className="cursor-pointer hover:text-mint-600 transition"
              aria-label="Email"
            />
          </a>
        </div>
        <Link
          to={`/clients/${client.id}`}
          className="flex items-center px-4 py-2 text-sm font-semibold rounded-[12px] border border-mint-500 text-mint-600  hover:bg-mint-50 text-white transition-colors bg-[#3FDCBF]"
        >
          <Play size={16} className="mr-2" /> Start Session
        </Link>
      </div>
    </div>
  );
};

export default AppointmentCard;
