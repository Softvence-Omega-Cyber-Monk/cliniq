import { useUserId } from "@/hooks/useUserId";
import {
  useRegisterTherapistMutation,
} from "@/store/api/AuthApi";
import React, { useState, useCallback, useMemo } from "react";
import { toast } from "sonner";

type Day = "SATURDAY" | "SUNDAY" | "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY";

interface UserProfile {
  name: string;
  email: string;
  phoneNumber: string;
  speciality: string;
  qualifications: string;
  licenseNumber: string;
  startTime: string;
  endTime: string;
  password: string;
  availableDays: [];
}

// Initial Data - Backend expects full day names
const ALL_DAYS: { label: string; value: Day }[] = [
  { label: "Sat", value: "SATURDAY" },
  { label: "Sun", value: "SUNDAY" },
  { label: "Mon", value: "MONDAY" },
  { label: "Tue", value: "TUESDAY" },
  { label: "Wed", value: "WEDNESDAY" },
  { label: "Thu", value: "THURSDAY" },
  { label: "Fri", value: "FRIDAY" },
];

const INITIAL_PROFILE_DATA: UserProfile = {
  name: "",
  email: "",
  phoneNumber: "",
  speciality: "",
  qualifications: "",
  licenseNumber: "",
  startTime: "",
  endTime: "",
  password: "",
  availableDays: [],
};

// Reusable Components
interface FormInputProps {
  label: string;
  name: keyof UserProfile;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  inputType?: "text" | "email" | "tel" | "time" | "password";
  isTextarea?: boolean;
  required?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  value,
  onChange,
  inputType = "text",
  isTextarea = false,
  required = false,
}) => (
  <div className="flex flex-col space-y-2">
    <label htmlFor={name} className="text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {isTextarea ? (
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        rows={3}
        className="p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-teal-500 transition-all duration-200 resize-none shadow-sm"
        placeholder={`Enter ${label.toLowerCase()}...`}
        required={required}
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
        required={required}
      />
    )}
  </div>
);

interface EditPersonalInfoProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (
    profile: UserProfile,
    daysAvailable: Day[]
  ) => void;
}

const EditPersonalInfo: React.FC<EditPersonalInfoProps> = ({
  isOpen,
  onClose,
}) => {
  const userId = useUserId();
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE_DATA);
  const [daysAvailable, setDaysAvailable] = useState<Day[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [registerTherapist] = useRegisterTherapistMutation();
  
  // General handler for all text/input changes
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

  // Handler for day selection/deselection
  const handleDayToggle = useCallback((day: Day) => {
    setDaysAvailable((prev) => {
      if (prev.includes(day)) {
        return prev.filter((d) => d !== day);
      } else {
        return [...prev, day].sort(
          (a, b) => ALL_DAYS.findIndex(d => d.value === a) - ALL_DAYS.findIndex(d => d.value === b)
        );
      }
    });
  }, []);

  // Validation function
  const validateForm = (): boolean => {
    if (!profile.name.trim()) {
      toast.error("Full name is required");
      return false;
    }
    if (!profile.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!profile.phoneNumber.trim()) {
      toast.error("Phone number is required");
      return false;
    }
    if (!profile.password || profile.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  // Save handler
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    setSaveMessage(null);

    try {
      const payload = {
        fullName: profile.name,
        email: profile.email,
        phone: profile.phoneNumber,
        password: profile.password,
        clinicId: userId,
        ...(profile.speciality && { speciality: profile.speciality }),
        ...(profile.qualifications && { qualification: profile.qualifications }),
        ...(profile.licenseNumber && { licenseNumber: profile.licenseNumber }),
        ...(daysAvailable.length > 0 && { availableDays: daysAvailable }),
      };

      const res = await registerTherapist(payload).unwrap();
      
      console.log(res);
      toast.success("Therapist added successfully!");
      
      setSaveMessage({
        type: "success",
        message: "Therapist added successfully!",
      });

      // Reset form after successful submission
      setTimeout(() => {
        setProfile(INITIAL_PROFILE_DATA);
        setDaysAvailable([]);
        setSaveMessage(null);
        onClose();
      }, 1500);
    } catch (error: any) {
      console.error(error);
      const errorMessage = error?.data?.message || "Failed to add therapist. Please try again.";
      toast.error(errorMessage);
      setSaveMessage({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const DayChip: React.FC<{ day: { label: string; value: Day } }> = useMemo(
    () =>
      ({ day }) => {
        const isSelected = daysAvailable.includes(day.value);

        return (
          <button
            type="button"
            onClick={() => handleDayToggle(day.value)}
            className={`flex items-center space-x-2 px-4 py-2 font-medium rounded-full transition-all cursor-pointer duration-200 transform hover:scale-105 active:scale-95 text-sm border ${
              isSelected
                ? "bg-teal-500 text-white border-teal-500 shadow-md"
                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
            }`}
            aria-label={isSelected ? `Remove ${day.label}` : `Add ${day.label}`}
          >
            <span>{day.label}</span>
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
      },
    [daysAvailable, handleDayToggle]
  );

  // Close modal when clicking backdrop
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 z-50 backdrop-blur-sm transition-opacity duration-300"
      onClick={handleBackdropClick}
    >
      {/* Modal Container with slide-in animation */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-transform duration-300 scale-100">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 rounded-t-2xl p-6 pb-4 z-10">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold text-gray-900">
              Add New Therapist
            </h1>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200 cursor-pointer"
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
            Add a therapist to your clinic by filling out the information below.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Full Name"
              name="name"
              value={profile.name}
              onChange={handleChange}
              required
            />
            <FormInput
              label="Email Address"
              name="email"
              value={profile.email}
              onChange={handleChange}
              inputType="email"
              required
            />
            <FormInput
              label="Password"
              name="password"
              value={profile.password}
              onChange={handleChange}
              inputType="password"
              required
            />
            <FormInput
              label="Phone Number"
              name="phoneNumber"
              value={profile.phoneNumber}
              onChange={handleChange}
              inputType="tel"
              required
            />
            <FormInput
              label="Speciality"
              name="speciality"
              value={profile.speciality}
              onChange={handleChange}
            />
            <FormInput
              label="License Number"
              name="licenseNumber"
              value={profile.licenseNumber}
              onChange={handleChange}
            />
          </div>

          {/* Qualifications */}
          <FormInput
            label="Qualifications & Certifications"
            name="qualifications"
            value={profile.qualifications}
            onChange={handleChange}
            isTextarea
          />

          {/* Availability Section */}
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">
                Available Days
              </p>
              <div className="flex flex-wrap gap-2">
                {ALL_DAYS.map((day) => (
                  <DayChip key={day.value} day={day} />
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

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 rounded-b-2xl p-6">
          <div className="flex justify-between items-center">
            {/* Save Message */}
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
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 text-gray-700 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className={`px-6 py-2.5 text-white font-medium rounded-lg transition-all duration-200 flex cursor-pointer items-center space-x-2 ${
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
                  <span>Save Changes</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPersonalInfo;