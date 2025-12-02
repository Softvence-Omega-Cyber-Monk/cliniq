import { useState, useEffect } from "react";

export default function Toggle({ value = true }: { value?: boolean }) {
  const [enabled, setEnabled] = useState(value);
  useEffect(() => {
    setEnabled(value);
  }, [value]);

  return (
    <button
      onClick={() => setEnabled(!enabled)}
      className={`
        w-10 h-5 flex items-center rounded-full p-1 transition-all duration-300
        ${enabled ? "bg-[#6F8A48]" : "bg-gray-300"}
      `}
    >
      <div
        className={`
          w-4 h-4 bg-white rounded-full shadow transform transition-all duration-300
          ${enabled ? "translate-x-5" : "translate-x-0"}
        `}
      ></div>
    </button>
  );
}
