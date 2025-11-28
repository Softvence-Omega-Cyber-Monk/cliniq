import React from "react";
import { InputFieldProps } from "./types";

const InputField: React.FC<InputFieldProps> = ({
  label,
  id,
  type = "text",
  placeholder = "",
  value,
  className = "",
  readOnly = false,
  onChange, // <- add this
}) => (
  <div className={`flex flex-col mb-4 w-full ${className}`}>
    <label htmlFor={id} className="text-xs font-medium text-gray-500 mb-1">
      {label}
    </label>
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value} // controlled input
      onChange={onChange} // controlled
      readOnly={readOnly}
      className={`
        px-3 py-2 border border-[#EAE9DD] rounded-lg bg-[#F3F3EC] text-gray-700 
        focus:outline-none focus:ring-2 transition duration-150
        ${readOnly ? "opacity-70 cursor-not-allowed" : ""}
      `}
    />
  </div>
);

export default InputField;
