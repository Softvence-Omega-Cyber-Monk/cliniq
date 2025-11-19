import React, { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';

interface ScheduleModalProps {
  onClose: () => void;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({ onClose }) => {
    // Mock state for form inputs
    const [client, setClient] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [duration, setDuration] = useState('');
    const [sessionType, setSessionType] = useState('');
    const [appointmentType, setAppointmentType] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Scheduling appointment...');
        // In a real app, this would dispatch an action or call an API
        onClose();
    };

    const InputField: React.FC<{ label: string; placeholder: string; value: string; onChange: (v: string) => void; isSelect?: boolean }> = ({ label, placeholder, value, onChange, isSelect = false }) => (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <div className={`relative ${isSelect ? 'cursor-pointer' : ''}`}>
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-mint-500 focus:border-mint-500 transition duration-150 text-gray-800 bg-white shadow-inner"
                    readOnly={isSelect}
                />
                {isSelect && <ChevronDown size={20} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />}
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-white/50 bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">Schedule New Appointment</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                        <X size={24} />
                    </button>
                </div>

                <form className="p-6 space-y-4" onSubmit={handleSubmit}>
                    <InputField label="Client" placeholder="Select Client" value={client} onChange={setClient} isSelect={true} />
                    <div className="grid grid-cols-2 gap-4">
                        <InputField label="Date" placeholder="DD/MM/YY" value={date} onChange={setDate} />
                        <InputField label="Time" placeholder="--/--" value={time} onChange={setTime} />
                    </div>
                    <InputField label="Duration" placeholder="Select Duration" value={duration} onChange={setDuration} isSelect={true} />
                    <InputField label="Session Type" placeholder="Select Session Type" value={sessionType} onChange={setSessionType} isSelect={true} />
                    <InputField label="Appointment Type" placeholder="Select Appointment Type" value={appointmentType} onChange={setAppointmentType} isSelect={true} />

                    <div className="pt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 font-semibold rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-3 font-semibold rounded-full bg-mint-500 text-black hover:bg-mint-600 transition-colors shadow-lg shadow-mint-500/30"
                        >
                            Schedule Appointment
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ScheduleModal;
