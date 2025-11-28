import React from "react";

interface ProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (note: string) => void;
}

const ProgressModal: React.FC<ProgressModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [note, setNote] = React.useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="w-full max-w-lg bg-[#E8F3EF] rounded-3xl p-8 relative shadow-xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-600 hover:text-gray-800 text-xl"
        >
          ✕
        </button>

        {/* Heading */}
        <h2 className="text-2xl font-semibold text-gray-800">
          Update Treatment Progress
        </h2>
        <p className="text-sm text-gray-600 mt-1 max-w-md leading-relaxed">
          Document the client's progress and any observations from recent
          sessions. This will help generate AI insights and recommendations.
        </p>

        {/* Label */}
        <label className="block mt-6 text-sm font-semibold text-gray-700">
          Progress Notes
        </label>

        {/* Textarea */}
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Enter your observations about the client’s progress, behavioral changes, goal achievements, or any concerns…"
          className="
            w-full h-40
            mt-2 p-4
            bg-white
            border border-gray-200
            rounded-2xl
            focus:outline-none
            focus:ring-2 focus:ring-teal-400
            text-sm text-gray-700
          "
        />

        {/* Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={() => onSubmit(note)}
            className="
              bg-teal-500 hover:bg-teal-600
              text-white text-sm font-semibold
              px-6 py-3 rounded-xl shadow-md
              transition
            "
          >
            Update Note
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProgressModal;
