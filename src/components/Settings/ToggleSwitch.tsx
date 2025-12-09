import React from "react";
import { ToggleSwitchProps } from "./types";

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  label,
  subText,
  id,
  checked,
  onChange,
}) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
    <div className="flex flex-col">
      <label htmlFor={id} className="text-base font-medium text-gray-700">
        {label}
      </label>
      <p className="text-sm text-gray-500">{subText}</p>
    </div>
    <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
      <input
        type="checkbox"
        name={id}
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
        style={{
          boxShadow:
            "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        }}
      />
      <label
        htmlFor={id}
        className={`
          toggle-label block overflow-hidden h-6 rounded-full cursor-pointer 
          ${checked ? "bg-emerald-500" : "bg-gray-300"}
        `}
      ></label>
    </div>
    <style styled-tsx>{`
      .toggle-checkbox {
        top: 0;
        left: 0;
        transform: translateX(0);
        transition: transform 0.2s ease-in-out;
      }
      .toggle-checkbox:checked {
        transform: translateX(1.5rem); /* w-6 (1.5rem) - w-10 (2.5rem) */
      }
      .toggle-checkbox:checked + .toggle-label {
        background-color: #10b981; /* emerald-500 */
      }
      .toggle-checkbox {
        transition: right 0.2s ease-in-out;
        right: 1.5rem;
      }
      .toggle-checkbox:checked {
        right: 0.2rem;
      }
      .toggle-label {
        transition: background-color 0.2s ease-in-out;
      }
    `}</style>
  </div>
);

export default ToggleSwitch;
