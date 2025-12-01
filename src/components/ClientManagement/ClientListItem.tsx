import React from "react";
import { StatusBadge } from "./utilityComponents";
import { Link } from "react-router-dom";
import { User } from "lucide-react";

export interface Client {
  Client: Client;
  id: string;
  name: string;
  email: string;
  sessionCount: number;
  overallProgress: number | null;
  status: string;
  condition: string;
  lastSession: string;
  nextSession: string;
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

  return (
    <div
      className="bg-[#FAFAF7] p-5 rounded-xl transition duration-300 flex items-center justify-between space-x-4 mb-4"
      onClick={() => {
        console.log("Clicked client:", userType);
      }}
    >
      <div className="flex items-center space-x-4 min-w-[40%]">
        <div className="flex-shrink-0 w-10 h-10 bg-[#96C75E1A] rounded-full flex items-center justify-center">
          <User className="text-[#3FDCBF]" />
        </div>

        <div className="flex-grow">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg capitalize font-semibold text-gray-800">
              {client.name}
            </h3>
            <StatusBadge status={client.status} />
          </div>

          {client.condition && (
            <p className="text-sm text-gray-500 mt-1">
              <span className="font-medium text-gray-600">Condition:</span>{" "}
              {client.condition}
            </p>
          )}
        </div>
      </div>

      <div className="hidden sm:grid sm:grid-cols-4 sm:gap-4 flex-grow text-sm text-gray-600">
        {client.sessionCount !== undefined && (
          <div className="flex gap-2">
            <span className="font-medium text-gray-500">Total Sessions</span>
            <span className="font-bold text-gray-700">
              {client.sessionCount}
            </span>
          </div>
        )}

        {client.lastSession && (
          <div className="flex flex-col">
            <span className="font-medium text-gray-500">Last Session</span>
            <span className="text-gray-700">{client.lastSession}</span>
          </div>
        )}

        {client.nextSession && (
          <div className="flex flex-col">
            <span className="font-medium text-gray-500">Next Session</span>
            <span
              className={`font-medium ${
                client.nextSession === "N/A"
                  ? "text-gray-500"
                  : "text-emerald-600"
              }`}
            >
              {client.nextSession}
            </span>
          </div>
        )}
      </div>

      {/* 🔥 Now using the function instead of ternary */}
      <Link
        className="hidden md:inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition duration-150"
        to={getClientUrl()}
      >
        View Details
      </Link>

      <button
        onClick={(e) => {
          e.stopPropagation();
        }}
      ></button>
    </div>
  );
};

export default ClientListItem;
