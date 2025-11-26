import React, { useState, useMemo, useCallback, useRef } from "react";
import {
  Search,
  ChevronDown,
  Plus,
  User,
  Mail,
  Phone,
  BookOpen,
  Clock,
  Briefcase,
  ChevronLeft,
  Calendar,
  FileText,
  X,
} from "lucide-react";

// --- Global Type Definitions ---
type Day = "Sat" | "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri";

interface Therapist {
  id: number;
  name: string;
  initials: string;
  specialty: string;
  status: "Active" | "Inactive";
  patients: number;
  isCurrentUser?: boolean;
}

interface UserProfile {
  name: string;
  email: string;
  phoneNumber: string;
  speciality: string;
  qualifications: string;
  startTime: string;
  endTime: string;
}

interface Patient {
  id: number;
  name: string;
  sessionCount: number;
  progressPercent: number;
  status: "Active" | "Inactive";
  therapistId: number;
}

// New interface for detailed session history
interface SessionHistory {
  date: string;
  summary: string; // Short summary
  duration: number;
  fullNote: string; // Detailed note content
}

// --- Global Constants ---
const ALL_DAYS: Day[] = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

const INITIAL_PROFILE_DATA: UserProfile = {
  name: "",
  email: "",
  phoneNumber: "",
  speciality: "",
  qualifications: "",
  startTime: "",
  endTime: "",
};

const MOCK_THERAPISTS: Therapist[] = [
  {
    id: 1,
    name: "Dr. Michael Chen",
    initials: "MC",
    specialty: "Cognitive Behavioral Therapy",
    status: "Inactive",
    patients: 12,
    isCurrentUser: true,
  },
  {
    id: 2,
    name: "Dr. Sarah Johnson",
    initials: "SJ",
    specialty: "Mindfulness Therapy",
    status: "Inactive",
    patients: 8,
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    initials: "ER",
    specialty: "Psychodynamic Therapy",
    status: "Inactive",
    patients: 15,
  },
  {
    id: 4,
    name: "Dr. Liam Davis",
    initials: "LD",
    specialty: "Cognitive Behavioral Therapy",
    status: "Inactive",
    patients: 12,
  },
  {
    id: 5,
    name: "Dr. John Doe",
    initials: "JD",
    specialty: "Family Therapy",
    status: "Active",
    patients: 25,
  },
  {
    id: 6,
    name: "Dr. Olivia Wilson",
    initials: "OW",
    specialty: "Cognitive Behavioral Therapy",
    status: "Inactive",
    patients: 12,
  },
  {
    id: 7,
    name: "Dr. Alice Brown",
    initials: "AB",
    specialty: "Exposure Therapy",
    status: "Active",
    patients: 18,
  },
];

const MOCK_PATIENTS: Patient[] = [
  {
    id: 1,
    name: "Alex Johnson",
    sessionCount: 4,
    progressPercent: 50,
    status: "Active",
    therapistId: 1,
  },
  {
    id: 2,
    name: "Emily Carter",
    sessionCount: 15,
    progressPercent: 50,
    status: "Active",
    therapistId: 1,
  },
  {
    id: 3,
    name: "Michael Smith",
    sessionCount: 7,
    progressPercent: 50,
    status: "Active",
    therapistId: 1,
  },
  {
    id: 4,
    name: "Sophia Brown",
    sessionCount: 3,
    progressPercent: 50,
    status: "Inactive",
    therapistId: 1,
  },
  {
    id: 5,
    name: "Liam Davis",
    sessionCount: 6,
    progressPercent: 50,
    status: "Active",
    therapistId: 2,
  },
  {
    id: 6,
    name: "Olivia Wilson",
    sessionCount: 3,
    progressPercent: 50,
    status: "Active",
    therapistId: 2,
  },
  {
    id: 7,
    name: "James Taylor",
    sessionCount: 8,
    progressPercent: 50,
    status: "Inactive",
    therapistId: 3,
  },
  {
    id: 8,
    name: "Isabella Martinez",
    sessionCount: 6,
    progressPercent: 50,
    status: "Active",
    therapistId: 3,
  },
  {
    id: 9,
    name: "Ethan Anderson",
    sessionCount: 11,
    progressPercent: 50,
    status: "Inactive",
    therapistId: 4,
  },
  {
    id: 10,
    name: "Ava Thomas",
    sessionCount: 9,
    progressPercent: 50,
    status: "Active",
    therapistId: 5,
  },
];

// --- Reusable Form Component (Modal Dependency) ---

interface FormInputProps {
  label: string;
  name: keyof UserProfile;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  inputType?: "text" | "email" | "tel" | "time";
  isTextarea?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  value,
  onChange,
  inputType = "text",
  isTextarea = false,
}) => (
  <div className="flex flex-col space-y-2">
    <label htmlFor={name} className="text-sm font-medium text-gray-700">
      {label}
    </label>
    {isTextarea ? (
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={
          onChange as (e: React.ChangeEvent<HTMLTextAreaElement>) => void
        }
        rows={3}
        className="p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-teal-500 transition-all duration-200 resize-none shadow-sm"
        placeholder={`Enter ${label.toLowerCase()}...`}
      />
    ) : (
      <input
        type={inputType}
        id={name}
        name={name}
        value={value}
        onChange={onChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
        className="p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-teal-500 transition-all duration-200 shadow-sm"
        placeholder={`Enter ${label.toLowerCase()}...`}
      />
    )}
  </div>
);

// --- Add Therapist Modal Component ---

interface AddTherapistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profile: UserProfile) => void;
  isEditMode?: boolean;
}

const AddTherapistModal: React.FC<AddTherapistModalProps> = ({
  isOpen,
  onClose,
  onSave,
  isEditMode = false,
}) => {
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE_DATA);
  const [daysAvailable, setDaysAvailable] = useState<Day[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [profileImage, setProfileImage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setProfile((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    []
  );

  const handleDayToggle = useCallback((day: Day) => {
    setDaysAvailable((prev) => {
      if (prev.includes(day)) {
        return prev.filter((d) => d !== day);
      } else {
        return [...prev, day].sort(
          (a, b) => ALL_DAYS.indexOf(a) - ALL_DAYS.indexOf(b)
        );
      }
    });
  }, []);

  const handleSave = async () => {
    if (!profile.name || !profile.speciality || !profile.email) {
      setSaveMessage({
        type: "error",
        message: "Please fill in required fields (Name, Speciality, Email).",
      });
      setTimeout(() => setSaveMessage(null), 3000);
      return;
    }

    setIsSaving(true);
    setSaveMessage(null);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    onSave(profile);

    if (!isEditMode) {
      setProfile(INITIAL_PROFILE_DATA);
      setDaysAvailable([]);
      setProfileImage("");
    }

    setIsSaving(false);
    setSaveMessage({
      type: "success",
      message: isEditMode
        ? "Profile updated successfully!"
        : "Therapist added successfully!",
    });

    setTimeout(() => {
      setSaveMessage(null);
      onClose();
    }, 1500);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleEditPictureClick = () => {
    fileInputRef.current?.click();
  };

  const DayChip: React.FC<{ day: Day }> = ({ day }) => {
    const isSelected = daysAvailable.includes(day);
    return (
      <button
        onClick={() => handleDayToggle(day)}
        className={`flex items-center space-x-2 px-4 py-2 font-medium rounded-full transition-all duration-200 transform hover:scale-105 active:scale-95 text-sm border ${
          isSelected
            ? "bg-teal-500 text-white border-teal-500 shadow-md"
            : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
        }`}
        aria-label={isSelected ? `Remove ${day}` : `Add ${day}`}
      >
        <span>{day}</span>
        {isSelected && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        )}
      </button>
    );
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black/10 backdrop-blur-sm transition-opacity duration-300"
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-transform duration-300 scale-100">
        <div className="sticky top-0 bg-white border-b border-gray-200 rounded-t-2xl p-6 pb-4 z-10">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditMode ? "Edit Personal Info" : "Add New Therapist"}
            </h1>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <p className="text-gray-500 text-sm">
            {isEditMode
              ? "Update your professional information and availability"
              : "Enter the professional information and availability for the new therapist."}
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Profile Picture Section */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
                accept="image/*"
              />
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-teal-400 to-teal-600 shadow-md flex items-center justify-center text-xl font-bold text-white">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="object-cover w-full h-full"
                  />
                ) : profile.name ? (
                  profile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white opacity-80"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                )}
              </div>
              <button
                onClick={handleEditPictureClick}
                className="absolute -bottom-1 -right-1 p-1.5 bg-white border border-gray-300 rounded-full shadow-lg text-teal-600 hover:text-teal-700 transition-colors duration-200"
                aria-label="Upload profile picture"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zm-1.88 1.88l-6.107 6.107v3.182h3.182l6.107-6.107-3.182-3.182z" />
                </svg>
              </button>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {profile.name || "Therapist Name"}
              </h3>
              <p className="text-sm text-gray-500">
                {profile.speciality || "Speciality"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Full Name"
              name="name"
              value={profile.name}
              onChange={handleChange}
            />
            <FormInput
              label="Email Address"
              name="email"
              value={profile.email}
              onChange={handleChange}
              inputType="email"
            />
            <FormInput
              label="Phone Number"
              name="phoneNumber"
              value={profile.phoneNumber}
              onChange={handleChange}
              inputType="tel"
            />
            <FormInput
              label="Speciality"
              name="speciality"
              value={profile.speciality}
              onChange={handleChange}
            />
          </div>

          <FormInput
            label="Qualifications & Certifications"
            name="qualifications"
            value={profile.qualifications}
            onChange={handleChange}
            isTextarea
          />

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">
                Available Days
              </p>
              <div className="flex flex-wrap gap-2">
                {ALL_DAYS.map((day) => (
                  <DayChip key={day} day={day} />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Start Time"
                name="startTime"
                value={profile.startTime}
                onChange={handleChange}
                inputType="time"
              />
              <FormInput
                label="End Time"
                name="endTime"
                value={profile.endTime}
                onChange={handleChange}
                inputType="time"
              />
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 rounded-b-2xl p-6">
          <div className="flex justify-between items-center min-h-[40px]">
            {saveMessage && (
              <div
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  saveMessage.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {saveMessage.message}
              </div>
            )}

            <div className="flex space-x-3 ml-auto">
              <button
                onClick={onClose}
                className="px-6 py-2.5 text-gray-700 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`px-6 py-2.5 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[150px] ${
                  isSaving
                    ? "bg-teal-400 cursor-not-allowed"
                    : "bg-teal-500 hover:bg-teal-600 shadow-md hover:shadow-lg"
                }`}
              >
                {isSaving ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>{isEditMode ? "Save Changes" : "Save Therapist"}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Detail Sub-Components ---

interface DetailItemProps {
  icon: React.FC<any>;
  label: string;
  value: string;
}

const DetailItem: React.FC<DetailItemProps> = ({
  icon: Icon,
  label,
  value,
}) => (
  <div className="flex items-start space-x-3">
    <Icon size={20} className="text-teal-500 mt-1 flex-shrink-0" />
    <div className="flex flex-col">
      <span className="text-sm font-medium text-gray-500">{label}</span>
      <p className="text-base text-gray-800 font-semibold">{value}</p>
    </div>
  </div>
);

interface DetailPatientRowProps {
  patient: Patient;
  onViewPatientDetails: (patientId: number) => void;
}

const DetailPatientRow: React.FC<DetailPatientRowProps> = ({
  patient,
  onViewPatientDetails,
}) => {
  const statusClasses =
    patient.status === "Active"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";

  // Width for progress bar (fixed at 50% for mock data)
  const progressBarWidth = `${patient.progressPercent}%`;

  return (
    <tr className="border-b hover:bg-gray-50 transition duration-150">
      <td className="p-4 text-gray-700 font-medium">{patient.name}</td>
      <td className="p-4 text-gray-600">{patient.sessionCount}</td>
      <td className="p-4">
        <div className="flex items-center space-x-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-teal-500 h-2 rounded-full"
              style={{ width: progressBarWidth }}
            ></div>
          </div>
          <span className="text-sm text-gray-600 w-10">
            {patient.progressPercent}%
          </span>
        </div>
      </td>
      <td className="p-4">
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ${statusClasses}`}
        >
          {patient.status}
        </span>
      </td>
      <td className="p-4 text-right">
        <button
          onClick={() => onViewPatientDetails(patient.id)}
          className="text-teal-500 hover:text-teal-700 text-sm font-medium px-3 py-1 border border-teal-300 rounded-lg hover:bg-teal-50 transition"
        >
          View Details
        </button>
      </td>
    </tr>
  );
};

// --- Therapist Detail View Component ---

interface TherapistDetailProps {
  therapist: Therapist;
  onBack: () => void;
  setIsEditModalOpen: (isOpen: boolean) => void;
  onViewPatientDetails: (patientId: number) => void; // New prop
}

const TherapistDetail: React.FC<TherapistDetailProps> = ({
  therapist,
  onBack,
  setIsEditModalOpen,
  onViewPatientDetails,
}) => {
  // Filter patients specific to this therapist (mock)
  const therapistPatients = useMemo(
    () => MOCK_PATIENTS.filter((p) => p.therapistId === therapist.id),
    [therapist.id]
  );

  const mockDetail = {
    qualifications: "PhD in Psychology, Certified CBT Therapist",
    speciality: "Cognitive Behavioral Therapy",
    email: "michaelchen@cliniq.com",
    phoneNumber: "+1 (555) 123-4567",
    availability: "Available on weekdays from 9 AM to 5 PM",
    isCurrentUser: therapist.isCurrentUser || false,
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumbs & Back Button */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
        <button
          onClick={onBack}
          className="text-teal-600 hover:text-teal-800 flex items-center space-x-1 font-medium"
        >
          <ChevronLeft size={16} />
          <span>Therapists</span>
        </button>
        <span>/</span>
        <span className="font-semibold text-gray-800">
          {therapist.name} ({therapist.initials})
        </span>
      </div>

      {/* Profile Header and Info Grid */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-start border-b pb-5 mb-5">
          {/* Profile Summary */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-teal-400 to-teal-600 shadow-md flex items-center justify-center text-2xl font-bold text-white">
              {therapist.initials}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {therapist.name}
              </h2>
              {mockDetail.isCurrentUser && (
                <span className="text-sm font-normal text-gray-500">(Me)</span>
              )}
            </div>
          </div>

          {/* Edit Button */}
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center bg-teal-500 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:bg-teal-600 transition"
          >
            <BookOpen size={16} className="mr-2" />
            Edit Personal Info
          </button>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DetailItem icon={User} label="Full Name" value={therapist.name} />
          <DetailItem
            icon={Mail}
            label="Email Address"
            value={mockDetail.email}
          />
          <DetailItem
            icon={Phone}
            label="Phone Number"
            value={mockDetail.phoneNumber}
          />
          <DetailItem
            icon={BookOpen}
            label="Qualifications"
            value={mockDetail.qualifications}
          />
          <DetailItem
            icon={Briefcase}
            label="Specialty"
            value={mockDetail.speciality}
          />
          <DetailItem
            icon={Clock}
            label="Availability"
            value={mockDetail.availability}
          />
        </div>
      </div>

      {/* Stats and Status Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Patients Card */}
        <div className="bg-white p-5 rounded-xl shadow-lg flex items-center justify-between border-l-4 border-teal-500">
          <div>
            <p className="text-sm text-gray-500">Total Patients</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              {therapist.patients}
            </p>
          </div>
          <User size={32} className="text-teal-400 opacity-50" />
        </div>

        {/* Total Sessions Card */}
        <div className="bg-white p-5 rounded-xl shadow-lg flex items-center justify-between border-l-4 border-purple-500">
          <div>
            <p className="text-sm text-gray-500">Total Sessions (L30 Days)</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">24</p>
          </div>
          <Clock size={32} className="text-purple-400 opacity-50" />
        </div>

        {/* Account Status Card */}
        <div className="bg-white p-5 rounded-xl shadow-lg flex items-center justify-between border-l-4 border-gray-500">
          <div>
            <p className="text-sm text-gray-500">Account Status</p>
            <p className="text-xl font-bold text-gray-900 mt-1">
              {therapist.status}
            </p>
          </div>
          {/* Mock Toggle Switch */}
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              value=""
              className="sr-only peer"
              defaultChecked={therapist.status === "Active"}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
          </label>
        </div>
      </div>

      {/* Patient Table */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Patient List</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <th className="p-4">Patient Name</th>
                <th className="p-4">Session Count</th>
                <th className="p-4">Treatment Progress</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {therapistPatients.map((patient) => (
                <DetailPatientRow
                  key={patient.id}
                  patient={patient}
                  onViewPatientDetails={onViewPatientDetails} // Pass navigation handler
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- Session Note Modal Component (NEW) ---

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

  // Backdrop click handler to close modal
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
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
        {/* Header */}
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
              <X size={24} />
            </button>
          </div>
          <p className="text-gray-500 text-sm">
            Detailed information about this therapy session
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Session Date and Duration */}
          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div className="flex items-center space-x-2">
              <Calendar size={18} className="text-teal-600" />
              <span className="font-semibold text-gray-800">
                {session.date}
              </span>
            </div>
            <span className="text-sm font-semibold px-2 py-0.5 rounded bg-teal-100 text-teal-700">
              {session.duration} min
            </span>
          </div>

          {/* Session Notes */}
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

          {/* Quick Summary */}
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-2">
              Quick Summary
            </h3>
            <p className="text-gray-700 italic">{session.summary}</p>
          </div>
        </div>

        {/* Footer action - Close button */}
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

// --- Patient Detail View Component (UPDATED) ---

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

interface SessionHistoryProps extends SessionHistory {
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
      {/* Session Info (Text & Duration) */}
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

      {/* View Details Button (Full Width) */}
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
  // NEW STATE for Session Note Modal
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<SessionHistory | null>(
    null
  );

  const handleViewNote = (session: SessionHistory) => {
    setSelectedSession(session);
    setIsNoteModalOpen(true);
  };

  const handleCloseNoteModal = () => {
    setIsNoteModalOpen(false);
    setSelectedSession(null);
  };

  // Mock data for the selected patient (UPDATED with fullNote)
  const mockPatientData = {
    age: 30,
    email: "alexjohnson@patient.com",
    phone: "+1 (555) 123-4567",
    healthIssue: "Anxiety and Stress",
    emergencyContactName: "Emily Smith",
    emergencyContactPhone: "+1 (555) 987-6543",
    overallProgress: 70,
    treatmentGoals: [
      { title: "Reduce anxiety attacks", progress: 75 },
      { title: "Improve sleep quality", progress: 80 },
      { title: "Develop healthy coping mechanisms", progress: 90 },
      { title: "Manage work-related stress", progress: 60 },
    ],
    sessionHistory: [
      {
        date: "March 15, 2024",
        summary:
          "Discussed coping mechanisms for stress. Patient showed good engagement.",
        duration: 50,
        fullNote:
          "The patient reported feeling significantly better about their recent work-related stress, attributing the improvement to the newly implemented time management and boundary-setting strategies discussed last session. We dedicated the session to reviewing cognitive reframing techniques to address persistent negative self-talk patterns. Patient successfully identified three common distorted thought patterns. Homework: practice challenging these thoughts using the provided worksheet. Goal progress: Maintain reduced anxiety levels.",
      },
      {
        date: "March 8, 2024",
        summary:
          "Reviewed anxiety triggers and practiced breathing techniques.",
        duration: 50,
        fullNote:
          "We explored various anxiety triggers and engaged in effective breathing exercises. Understanding what causes anxiety can empower us to manage it better. We practiced deep breathing techniques to help calm our minds. These methods can be beneficial in stressful situations. Remember, taking a moment to breathe can make a significant difference. The patient showed good engagement and reported a noticeable drop in perceived anxiety (from 7/10 to 3/10) during the session. Homework: use the 4-7-8 breathing technique three times daily.",
      },
      {
        date: "March 1, 2024",
        summary:
          "Initial assessment and goal setting. Established treatment plan.",
        duration: 50,
        fullNote:
          "Initial assessment completed. The patient presents with Generalized Anxiety Disorder (GAD) and mild symptoms of social anxiety. Primary goals were established: 1) Reduce frequency of panic attacks, 2) Improve sleep quality, and 3) Develop healthy coping mechanisms. Treatment plan is primarily CBT-focused with elements of mindfulness. Patient consented to the plan. Homework: Start journaling daily mood and sleep patterns.",
      },
      {
        date: "February 22, 2024",
        summary:
          "Patient reported reduced anxiety levels. Continued CBT exercises.",
        duration: 50,
        fullNote:
          "Patient reported reduced anxiety levels. Continued CBT exercises. We focused on identifying automatic negative thoughts (ANTs) and replacing them with balanced perspectives. The patient brought up some challenges related to a recent family interaction, which we processed using the Socratic method. Progress is steady. Homework: continue journaling and bring in one completed thought record.",
      },
      {
        date: "February 15, 2024",
        summary:
          "Discussed work-related stress and time management strategies.",
        duration: 50,
        fullNote:
          "Focused session on occupational stress. Identified procrastination and poor boundary setting as key contributors. Introduced basic time management strategies (Pomodoro technique) and assertiveness training. The patient seemed receptive. Homework: implement the Pomodoro technique for work tasks and write down two instances where they successfully set a boundary.",
      },
    ] as SessionHistory[],
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumbs & Back Button */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
        <button
          onClick={onBackToTherapist}
          className="text-teal-600 hover:text-teal-800 flex items-center space-x-1 font-medium"
        >
          <ChevronLeft size={16} />
          <span>{therapist.name}</span>
        </button>
        <span>/</span>
        <span className="font-semibold text-gray-800">{patient.name}</span>
      </div>

      {/* Patient Information Section */}
      <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-teal-500">
        <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-3">
          Patient Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
          {/* Left Column */}
          <div className="space-y-3">
            <DetailItem icon={User} label="Full Name" value={patient.name} />
            <DetailItem
              icon={Mail}
              label="Email Address"
              value={mockPatientData.email}
            />
            <DetailItem
              icon={Briefcase}
              label="Health Issue"
              value={mockPatientData.healthIssue}
            />
          </div>
          {/* Right Column */}
          <div className="space-y-3">
            <DetailItem
              icon={Calendar}
              label="Age"
              value={`${mockPatientData.age} years old`}
            />
            <DetailItem
              icon={Phone}
              label="Phone Number"
              value={mockPatientData.phone}
            />
            <DetailItem
              icon={Phone}
              label="Emergency Contact"
              value={`${mockPatientData.emergencyContactName}, ${mockPatientData.emergencyContactPhone}`}
            />
          </div>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">
            Overall Treatment Progress
          </h3>
          <span className="text-2xl font-extrabold text-teal-600">
            {mockPatientData.overallProgress}%
          </span>
        </div>
        <div className="relative h-3 rounded-full bg-gray-200">
          <div
            className="absolute h-3 rounded-full bg-teal-500 shadow-md transition-all duration-1000"
            style={{ width: `${mockPatientData.overallProgress}%` }}
          ></div>
        </div>
      </div>

      {/* Treatment Goals */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-5">
          Treatment Goals
        </h3>
        <div className="space-y-5">
          {mockPatientData.treatmentGoals.map((goal, index) => (
            <TreatmentGoal
              key={index}
              title={goal.title}
              progress={goal.progress}
            />
          ))}
        </div>
      </div>

      {/* Session History */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-5">
          Session History
        </h3>
        <div className="space-y-4">
          {mockPatientData.sessionHistory.map((session, index) => (
            <SessionHistoryCard
              key={index}
              {...session}
              onViewNote={handleViewNote} // Pass the new handler
            />
          ))}
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

// --- Existing Sub-Component (Updated) ---

// Component for the therapist card
const TherapistCard: React.FC<{
  therapist: Therapist;
  onViewDetails: (id: number) => void;
}> = ({ therapist, onViewDetails }) => {
  const statusClasses =
    therapist.status === "Active"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";

  const initialColor =
    therapist.initials === "MC" || therapist.initials === "SJ"
      ? "bg-blue-500"
      : "bg-green-500";

  return (
    <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 flex flex-col transition-shadow hover:shadow-lg">
      {/* Name and Specialty */}
      <div className="flex items-center space-x-3 mb-4">
        <div
          className={`w-8 h-8 flex items-center justify-center text-sm font-bold text-white rounded-full ${initialColor}`}
        >
          {therapist.initials}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {therapist.name}{" "}
            {therapist.isCurrentUser && (
              <span className="text-sm font-normal text-gray-500">(ME)</span>
            )}
          </h3>
          <p className="text-sm text-gray-500">{therapist.specialty}</p>
        </div>
      </div>

      {/* Status and Patients */}
      <div className="flex justify-between items-center mb-5 border-t pt-4">
        <div className="flex flex-col">
          <span className="text-sm text-gray-500 mb-1">Status</span>
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${statusClasses}`}
          >
            {therapist.status}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-sm text-gray-500 mb-1">Patients</span>
          <span className="text-2xl font-bold text-gray-800">
            {therapist.patients}
          </span>
        </div>
      </div>

      {/* View Details Button - UPDATED */}
      <button
        onClick={() => onViewDetails(therapist.id)}
        className="w-full py-2 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 transition duration-150 shadow-md hover:shadow-lg"
      >
        View Details
      </button>
    </div>
  );
};

// --- Main Component ---

const App: React.FC = () => {
  const [therapists, setTherapists] = useState<Therapist[]>(MOCK_THERAPISTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "All" | "Active" | "Inactive"
  >("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTherapistId, setSelectedTherapistId] = useState<number | null>(
    null
  );
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(
    null
  ); // NEW STATE for patient detail

  const handleAddTherapist = (profile: UserProfile) => {
    const newTherapist: Therapist = {
      id: therapists.length + 1,
      name: profile.name,
      initials: profile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2),
      specialty: profile.speciality,
      status: "Active",
      patients: 0,
    };

    setTherapists((prev) => [...prev, newTherapist]);
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const openEditModal = () => {
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleViewTherapistDetails = (therapistId: number) => {
    setSelectedTherapistId(therapistId);
    setSelectedPatientId(null); // Ensure patient view is closed when opening therapist view
  };

  const handleViewPatientDetails = (patientId: number) => {
    setSelectedPatientId(patientId);
  };

  const handleBackToTherapist = () => {
    setSelectedPatientId(null);
  };

  const handleBackToList = () => {
    setSelectedTherapistId(null);
    setSelectedPatientId(null);
  };

  const filteredTherapists = useMemo(() => {
    return therapists.filter((therapist) => {
      const matchesSearch =
        searchTerm.trim() === "" ||
        therapist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        therapist.specialty.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === "All" || therapist.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, filterStatus, therapists]);

  const totalTherapists = filteredTherapists.length;
  const selectedTherapist = therapists.find(
    (t) => t.id === selectedTherapistId
  );
  const selectedPatient = MOCK_PATIENTS.find((p) => p.id === selectedPatientId);

  const isListView = selectedTherapistId === null || !selectedTherapist;
  const isTherapistDetailView = !isListView && selectedPatientId === null;
  const isPatientDetailView =
    selectedPatientId !== null && selectedPatient && selectedTherapist;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">
      {/* List Header and Controls - Show only in list view */}
      {isListView && (
        <>
          <header className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                THERAPISTS
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Manage therapists in your practice.
              </p>
            </div>
            <button
              onClick={openAddModal}
              className="flex items-center bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg hover:bg-gray-700 transition"
            >
              <Plus size={16} className="mr-2" />
              Add New Therapist
            </button>
          </header>

          {/* Controls: Search, Filter, Count */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8 items-stretch">
            <div className="relative flex-grow lg:w-1/3">
              <Search
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-3 pl-10 pr-4 border border-gray-200 rounded-xl focus:ring-teal-500 focus:border-teal-500 transition shadow-sm"
              />
            </div>

            <div className="relative w-full sm:w-1/3 lg:w-1/6">
              <select
                value={filterStatus}
                onChange={(e) =>
                  setFilterStatus(
                    e.target.value as "All" | "Active" | "Inactive"
                  )
                }
                className="appearance-none w-full py-3 pl-4 pr-10 border border-gray-200 rounded-xl bg-white focus:ring-teal-500 focus:border-teal-500 transition shadow-sm cursor-pointer"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
              />
            </div>

            <div className="bg-green-50 p-3 rounded-xl flex items-center justify-between shadow-sm lg:w-1/6 min-w-[150px]">
              <span className="text-gray-700 font-medium">Total Therapist</span>
              <div className="bg-teal-500 w-8 h-8 flex items-center justify-center text-white font-bold rounded-full text-sm">
                {totalTherapists}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Conditional Rendering */}
      {isPatientDetailView && selectedPatient && selectedTherapist ? (
        <PatientDetail
          patient={selectedPatient}
          therapist={selectedTherapist}
          onBackToTherapist={handleBackToTherapist}
        />
      ) : isTherapistDetailView && selectedTherapist ? (
        <TherapistDetail
          therapist={selectedTherapist}
          onBack={handleBackToList}
          setIsEditModalOpen={openEditModal}
          onViewPatientDetails={handleViewPatientDetails} // Pass the handler
        />
      ) : (
        /* Therapist Card Grid - Show only in list view */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTherapists.map((therapist) => (
            <TherapistCard
              key={therapist.id}
              therapist={therapist}
              onViewDetails={handleViewTherapistDetails}
            />
          ))}

          {filteredTherapists.length === 0 && (
            <div className="lg:col-span-3 xl:col-span-4 text-center py-10 text-gray-500">
              No therapists match your current search or filter.
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Therapist Modal */}
      <AddTherapistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddTherapist}
        isEditMode={isEditMode}
      />
    </div>
  );
};

export default App;
 