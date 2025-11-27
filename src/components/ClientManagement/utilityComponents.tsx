import React from "react";
import { Status, Severity, ProgressItem } from "./types";

export const IconUser: React.FC = () => (
  <svg
    className="w-6 h-6 text-gray-400"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

export const IconTime: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export const IconChevronDown: React.FC<React.SVGProps<SVGSVGElement>> = (
  props
) => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

export const StatusBadge: React.FC<{ status: Status }> = ({ status }) => {
  const baseClasses =
    "px-3 py-1.5 text-xs font-semibold rounded-[6px]  tracking-wider";
  const colorClasses =
    status === "active"
      ? "bg-[#3FDCBF] text-white"
      : "bg-gray-200 text-gray-600";

  return <span className={`${baseClasses} ${colorClasses}`}>{status}</span>;
};

export const SeverityBadge: React.FC<{ severity: Severity }> = ({
  severity,
}) => {
  const baseClasses =
    "px-3 py-1 text-xs font-medium rounded-full  tracking-wider min-w-[60px] text-center";
  let colorClasses = "";

  if (severity === "high") colorClasses = "bg-red-200 text-red-800";
  else if (severity === "medium") colorClasses = "bg-amber-200 text-amber-800";
  else colorClasses = "bg-blue-200 text-blue-800";

  return <span className={`${baseClasses} ${colorClasses}`}>{severity}</span>;
};

export const ProgressBar: React.FC<ProgressItem> = ({ label, value }) => (
  <div className="mb-4">
    <div className="flex justify-between items-center text-sm mb-1 text-gray-700">
      <span>{label}</span>
      <span className="font-semibold text-emerald-600">{value}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div
        className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${value}%` }}
      ></div>
    </div>
  </div>
);
