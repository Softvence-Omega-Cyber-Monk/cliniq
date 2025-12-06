import React from "react";
import { StatusBadge } from "./utilityComponents";
import { Link } from "react-router-dom";
import { User } from "lucide-react";
import { useUserId } from "@/hooks/useUserId";

export interface Client {
  Client: Client;
  id: string;
  name: string;
  email: string;
  totalSessions: number;
  overallProgress: number | null;
  status: string;
  condition: string;
  lastSessionDate: string;
  nextSessionDate: string;
  providerName: string;
  providerId: string;
}

const ClientListItem: React.FC<{
  client: Partial<Client>;
  userType:
    | "THERAPIST"
    | "ADMIN"
    | "INDIVIDUAL_THERAPIST"
    | "CLINIC"
    | null
    | undefined;
  onClick: (client: Client) => void;
}> = ({ client, userType }) => {
  const getClientUrl = () => {
    if (userType === "THERAPIST") {
      return `/therapist/clients/${client.id}`;
    }
    if (userType === "INDIVIDUAL_THERAPIST") {
      return `/individual-therapist/clients/${client.id}`;
    }
    return `/private-practice-admin/clients/${client.id}`;
  };
  console.log(client);
  const userId = useUserId();
  function formatDate(dateString: string) {
    const date = new Date(dateString);

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    // Get something like: 12/01/2025, 06:00 AM
    const formatted = date.toLocaleString("en-US", options);

    // Convert to your desired format: YYYY-MM-DD HH:MM AM
    const [mdy, time] = formatted.split(", ");
    const [month, day, year] = mdy.split("/");

    return `${year}-${month}-${day} ${time}`;
  }

  return (
    <div className="bg-[#FAFAF7] p-5 rounded-xl transition duration-300 flex items-end justify-between space-x-4 mb-4">
      <div className="flex items-center space-x-4 min-w-[20%]">
        <div className="flex-shrink-0 w-10 h-10 bg-[#96C75E1A] rounded-full flex items-center justify-center">
          <User className="text-[#3FDCBF]" />
        </div>

        <div className="">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg capitalize font-semibold text-gray-800">
              {client.name}
            </h3>
            <StatusBadge status={client.status} />
          </div>
          <div className="">
            {client.providerName && (
              <div>
                <h4 className="text-[#7E8086]">Therapist</h4>
                <span>{client.providerName}</span>{" "}
                {userId === client.providerId && (
                  <span className="bg-[#298CDF1A] text-[#298CDF] px-3.5 py-1 text-xs rounded-full font-medium">
                    {"Me"}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="hidden sm:grid sm:grid-cols-4 sm:gap-4 flex-grow text-sm text-gray-600">
        {client.condition && (
          <p className="text-sm text-gray-500 mt-1">
            <span className="font-medium text-gray-600 flex">Condition:</span>{" "}
            <span>{client.condition}</span>
          </p>
        )}
        {client.totalSessions !== undefined && (
          <div className="flex  flex-col">
            <span className="font-medium text-gray-500">Total Sessions</span>
            <span className="font-bold text-gray-700">
              {client.totalSessions}
            </span>
          </div>
        )}

        {client.lastSessionDate && (
          <div className="flex flex-col">
            <span className="font-medium text-gray-500">Last Session</span>
            <span className="text-gray-700">
              {formatDate(client.lastSessionDate)}
            </span>
          </div>
        )}

        {client.nextSessionDate && (
          <div className="flex flex-col">
            <span className="font-medium text-gray-500">Next Session</span>
            <span className={` text-gray-500`}>
              {formatDate(client.nextSessionDate)}
            </span>
          </div>
        )}
      </div>

      <Link
        className="hidden md:inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition duration-150"
        to={getClientUrl()}
      >
        View Details
      </Link>
    </div>
  );
};

export default ClientListItem;
