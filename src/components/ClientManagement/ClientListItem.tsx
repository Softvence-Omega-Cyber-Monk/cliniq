import React from "react";
import { Client } from "./types";
import { StatusBadge } from "./utilityComponents";
import { Link } from "react-router-dom";
import { User } from "lucide-react";

const ClientListItem: React.FC<{
  client: Client;
  userType: "THERAPIST" | "ADMIN" | "INDIVIDUAL_THERAPIST" | "CLINIC" | null | undefined
;
  onClick: (client: Client) => void;
}> = ({ client, onClick, userType }) => (
  <div
    className="bg-[#FAFAF7] p-5 rounded-xl  transition duration-300 cursor-pointer flex items-center justify-between space-x-4 mb-4"
    onClick={() => {
      console.log("Clicked client:", userType);
      onClick(client);
    }}
  >
    <div className="flex items-center space-x-4 min-w-[40%]">
      <div className="flex-shrink-0 w-10 h-10 bg-[#96C75E1A] rounded-full flex  items-center justify-center">
        <User className="text-[#3FDCBF]" />
      </div>

      <div className="flex-grow">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg capitalize font-semibold text-gray-800">
            {client.name}
          </h3>
          <StatusBadge status={client.status} />
        </div>

        {/* CONDITION — show only if exists */}
        {client.condition && (
          <p className="text-sm text-gray-500 mt-1">
            <span className="font-medium text-gray-600">Condition:</span>{" "}
            {client.condition}
          </p>
        )}
      </div>
    </div>

    <div className="hidden sm:grid sm:grid-cols-4 sm:gap-4 flex-grow text-sm text-gray-600">
      {/* Total Sessions */}
      {client.sessionCount !== undefined && (
        <div className="flex  gap-2">
          <span className="font-medium text-gray-500">Total Sessions</span>
          <span className="font-bold text-gray-700">{client.sessionCount}</span>
        </div>
      )}

      {/* Last Session */}
      {client.lastSession && (
        <div className="flex flex-col">
          <span className="font-medium text-gray-500">Last Session</span>
          <span className="text-gray-700">{client.lastSession}</span>
        </div>
      )}

      {/* Next Session */}
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
    
    <Link
     className="hidden md:inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition duration-150"
  to={
    userType === "THERAPIST"
      ? `/therapist/clients/${client.id}`
      : userType === "INDIVIDUAL_THERAPIST"
      ? `/individual-therapist/clients/${client.id}`
      : `/private-practice-admin/clients/${client.id}`
  }
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

export default ClientListItem;
