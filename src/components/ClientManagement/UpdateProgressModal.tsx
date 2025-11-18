import React, { useState } from 'react';

interface UpdateProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (notes: string) => void;
}

const UpdateProgressModal: React.FC<UpdateProgressModalProps> = ({ isOpen, onClose, onUpdate }) => {
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    onUpdate(notes);
    setNotes('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-300">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Update Treatment Progress</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <p className="text-gray-500 text-sm mb-6">
            Document the client's progress and any observations from recent sessions. This will help generate AI insights and recommendations.
          </p>
          <div className="mb-6">
            <label htmlFor="progress-notes" className="block text-sm font-medium text-gray-700 mb-2">
              Progress Notes
            </label>
            <textarea
              id="progress-notes"
              rows={6}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 resize-none placeholder-gray-400"
              placeholder="Enter your observations about the client's progress, behavioral changes, goal achievements, or any concerns..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition shadow-lg shadow-emerald-500/30"
            >
              Update Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProgressModal;
