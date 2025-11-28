import React from "react";

const SaveButton: React.FC<{
  children: React.ReactNode;
  color?: string;
  className?: string;
}> = ({ children, color = "bg-[#3FDCBF]", className = "" }) => (
  <button
    className={`
      ${color} text-white font-semibold py-2 px-16 rounded-[12px] 
      hover:opacity-90 cursor-pointer transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 
      ${color.replace("bg-", "focus:ring-")} ${className}
    `}
  >
    {children}
  </button>
);

export default SaveButton;
