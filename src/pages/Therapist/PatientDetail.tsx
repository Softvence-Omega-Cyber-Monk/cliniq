import React, { useState } from "react";
import {
  User,
  Mail,
  Briefcase,
  Calendar,
  FileText,
  BookOpen,
  ChevronLeft,
} from "lucide-react";
import { Patient, Therapist, SessionHistory } from "./TherapistType";

// --- DetailItem Component ---
interface DetailItemProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
}

const DetailItem: React.FC<DetailItemProps> = ({ icon: Icon, label, value }) => (
  <div className="flex items-start space-x-3">
    <Icon size={20} className="text-teal-500 mt-1 flex-shrink-0" />
    <div className="flex flex-col">
      <span className="text-sm font-medium text-gray-500">{label}</span>
      <p className="text-base text-gray-800 font-semibold">{value}</p>
    </div>
  </div>
);

// --- TreatmentGoal Component ---
interface GoalProps {
  title: string;
  progress: number;
}

const TreatmentGoal: React.FC<GoalProps> = ({ title, progress }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center text-gray-800">
      <span className="font-medium text-sm">{title}</span>
      <span className="font-bold text-sm text-teal-600">{progress}%</span>
    </div>
    <div className="relative h-2 rounded-full bg-gray-200">
      <div
        className="absolute h-2 rounded-full bg-teal-500 transition-all duration-500"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  </div>
);

// --- SessionHistoryCard Component ---
interface SessionHistoryProps {
  date: string;
  summary: string;
  duration: number;
  fullNote: string;
  onViewNote: (session: SessionHistory) => void;
}

const SessionHistoryCard: React.FC<SessionHistoryProps> = ({
  date,
  summary,
  duration,
  fullNote,
  onViewNote,
}) => {
  const session: SessionHistory = { date, summary, duration, fullNote };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition">
      <div className="flex justify-between items-start space-x-4 mb-3">
        <div className="flex items-start space-x-3">
          <FileText size={20} className="text-teal-500 flex-shrink-0 mt-1" />
          <div className="flex flex-col">
            <p className="text-sm font-semibold text-gray-800">{date}</p>
            <p className="text-sm text-gray-600 italic mt-1">{summary}</p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-600 flex-shrink-0">
          {duration} min
        </span>
      </div>

      <button
        onClick={() => onViewNote(session)}
        className="w-full py-2 mt-2 text-sm font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition duration-200 flex items-center justify-center space-x-2 border border-teal-200 hover:border-teal-300 shadow-sm"
      >
        <BookOpen size={14} />
        <span>View Session Note</span>
      </button>
    </div>
  );
};

// --- SessionNoteModal Component ---
interface SessionNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: SessionHistory | null;
}

const SessionNoteModal: React.FC<SessionNoteModalProps> = ({
  isOpen,
  onClose,
  session,
}) => {
  if (!isOpen || !session) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black bg-opacity-30 backdrop-blur-sm transition-opacity duration-300"
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto transform transition-transform duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 rounded-t-2xl p-6 pb-4 z-10">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold text-gray-900">
              Session Details
            </h1>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
              aria-label="Close"
            >
              <ChevronLeft size={24} />
            </button>
          </div>
          <p className="text-gray-500 text-sm">
            Detailed information about this therapy session
          </p>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
            <span className="font-semibold text-gray-800">{session.date}</span>
            <span className="text-sm font-semibold px-2 py-0.5 rounded bg-teal-100 text-teal-700">
              {session.duration} min
            </span>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-2">
              Session Notes
            </h3>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-inner max-h-80 overflow-y-auto">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {session.fullNote}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-2">
              Quick Summary
            </h3>
            <p className="text-gray-700 italic">{session.summary}</p>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 rounded-b-2xl p-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-white font-medium rounded-lg transition-all duration-200 bg-gray-800 hover:bg-gray-700 shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// --- PatientDetail Component ---
interface PatientDetailProps {
  patient: Patient;
  therapist: Therapist;
  onBackToTherapist: () => void;
}

const PatientDetail: React.FC<PatientDetailProps> = ({
  patient,
  therapist,
  onBackToTherapist,
}) => {
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<SessionHistory | null>(
    null
  );

  const handleViewNote = (session: SessionHistory) => {
    setSelectedSession(session);
    setIsNoteModalOpen(true);
  };

  const handleCloseNoteModal = () => {
    setSelectedSession(null);
    setIsNoteModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
        <button
          onClick={onBackToTherapist}
          className="text-teal-600 hover:text-teal-800 flex items-center space-x-1 font-medium"
        >
          <ChevronLeft size={16} />
          <span>{therapist.fullName}</span>
        </button>
        <span>/</span>
        <span className="font-semibold text-gray-800">{patient.name}</span>
      </div>

      {/* Patient Info */}
      <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-teal-500">
        <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-3">
          Patient Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
          <div className="space-y-3">
            <DetailItem icon={User} label="Full Name" value={patient.name} />
            <DetailItem icon={Mail} label="Email Address" value={patient.email} />
            <DetailItem
              icon={Briefcase}
              label="Health Issues"
              value={patient.healthIssues.join(", ")}
            />
            <DetailItem icon={Briefcase} label="Condition" value={patient.condition} />
            <DetailItem icon={Briefcase} label="Status" value={patient.status} />
          </div>
          <div className="space-y-3">
            <DetailItem icon={Calendar} label="Total Sessions" value={patient.totalSessions} />
            <DetailItem icon={BookOpen} label="Phone" value={patient.phone} />
            <DetailItem
              icon={BookOpen}
              label="Therapist"
              value={patient.therapist?.fullName || "-"}
            />
            <DetailItem icon={BookOpen} label="Treatment Goals" value={patient.treatmentGoals} />
          </div>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">Overall Treatment Progress</h3>
          <span className="text-2xl font-extrabold text-teal-600">
            {patient.overallProgress ?? 0}%
          </span>
        </div>
        <div className="relative h-3 rounded-full bg-gray-200">
          <div
            className="absolute h-3 rounded-full bg-teal-500 shadow-md transition-all duration-1000"
            style={{ width: `${patient.overallProgress ?? 0}%` }}
          ></div>
        </div>
      </div>

      {/* Treatment Goals */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-5">Treatment Goals</h3>
        <div className="space-y-5">
          {patient.treatmentGoals
            ? [{ title: patient.treatmentGoals, progress: patient.overallProgress ?? 0 }].map(
                (goal, idx) => (
                  <TreatmentGoal key={idx} title={goal.title} progress={goal.progress} />
                )
              )
            : <span className="text-gray-500">No treatment goals available.</span>}
        </div>
      </div>

      {/* Session History */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-5">Session History</h3>
        <div className="space-y-4">
          {patient.sessionHistory.length > 0 ? (
            patient.sessionHistory.map((session, idx) => (
              <SessionHistoryCard key={idx} {...session} onViewNote={handleViewNote} />
            ))
          ) : (
            <span className="text-gray-500">No session history available.</span>
          )}
        </div>
      </div>

      {/* Session Note Modal */}
      <SessionNoteModal
        isOpen={isNoteModalOpen}
        onClose={handleCloseNoteModal}
        session={selectedSession}
      />
    </div>
  );
};

export default PatientDetail;
