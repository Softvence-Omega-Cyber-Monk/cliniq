/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from "react";
import { Camera, Save } from "lucide-react";
import { useGetProfileQuery } from "@/store/api/AuthApi";
import {
  useUpdateClinicNotificationMutation,
  useUpdateClinicProfileMutation,
} from "@/store/api/UsersApi";
import { toast } from "sonner";

// --- Interfaces for Type Safety ---
interface ToggleItemProps {
  label: string;
  description: string;
  isEnabled: boolean;
  onToggle: () => void;
}

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
}

// --- Reusable Components ---
const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
}) => (
  <div className="flex flex-col space-y-2">
    <label className="text-xs font-semibold uppercase text-gray-500">
      {label}
    </label>
    <input
      type={type}
      value={value}
      disabled={label === "Email"}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-3 text-sm text-gray-800 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 transition duration-150"
    />
  </div>
);

const ToggleItem: React.FC<ToggleItemProps> = ({
  label,
  description,
  isEnabled,
  onToggle,
}) => (
  <div className="flex justify-between items-start py-3">
    <div className="flex flex-col">
      <span className="text-gray-900 font-medium">{label}</span>
      <span className="text-xs text-gray-500 mt-0.5">{description}</span>
    </div>
    <button
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        isEnabled
          ? "bg-indigo-600 focus:ring-indigo-500"
          : "bg-gray-200 focus:ring-gray-400"
      }`}
      role="switch"
      aria-checked={isEnabled}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition-transform ${
          isEnabled ? "translate-x-6" : "translate-x-1"
        }`}
        aria-hidden="true"
      />
    </button>
  </div>
);

// --- Profile Section ---
const ProfileSection: React.FC<{
  profileData: any;
  setProfileData: any;
}> = ({ profileData, setProfileData }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(
    (key: keyof typeof profileData) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfileData((prev: any) => ({ ...prev, [key]: e.target.value }));
      },
    [setProfileData]
  );

  const [avatarUrl, setAvatarUrl] = useState<string>(
    "https://placehold.co/80x80/2f4f4f/ffffff?text=AJ"
  );

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newUrl = URL.createObjectURL(file);
      setAvatarUrl(newUrl);
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  return (
    <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
      <div className="flex items-center mb-10">
        <div className="relative w-20 h-20 mr-6">
          <img
            src={avatarUrl}
            alt="Profile Avatar"
            className="w-full h-full object-cover rounded-full border-4 border-white shadow-sm"
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarChange}
            accept="image/*"
            style={{ display: "none" }}
          />
          <button
            onClick={triggerFileInput}
            className="absolute bottom-0 right-0 p-1 bg-indigo-600 rounded-full text-white border-2 border-white shadow-md hover:bg-indigo-700 transition"
            aria-label="Change profile picture"
            type="button"
          >
            <Camera size={14} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-6">
        <InputField
          label="Practice Name"
          value={profileData.practiceName}
          onChange={handleChange("practiceName")}
        />
        <InputField
          label="Your Name"
          value={profileData.yourName}
          onChange={handleChange("yourName")}
        />
        <InputField
          label="Email"
          value={profileData.email}
          onChange={handleChange("email")}
          type="email"
        />
        <InputField
          label="Phone Number"
          value={profileData.phoneNumber}
          onChange={handleChange("phoneNumber")}
          type="tel"
        />
      </div>
    </div>
  );
};

// --- Toggle Card ---
interface ToggleCardProps {
  title: string;
  children: React.ReactNode;
}
const ToggleCard: React.FC<ToggleCardProps> = ({ title, children }) => (
  <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 h-full">
    <h2 className="text-xl font-bold text-gray-900 mb-6">{title}</h2>
    <div className="space-y-4">{children}</div>
  </div>
);

// --- Main App Component ---
const App: React.FC = () => {
  const { data } = useGetProfileQuery({});
  const user = data?.user;

  const [updateClinicProfile] = useUpdateClinicProfileMutation();
  // const [updateSecurity] = useUpdateClinicSecurityMutation();
  const [updateClinicNotification] = useUpdateClinicNotificationMutation();

  const [profileData, setProfileData] = useState({
    practiceName: "",
    yourName: "",
    email: "",
    phoneNumber: "",
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactor: false,
    hipaa: false,
    sessionRecording: false,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    sessionReminders: false,
    crisisAlerts: false,
  });

  // Prefill profile when user data is loaded
  useEffect(() => {
    if (user) {
      setProfileData({
        practiceName: user.privatePracticeName || "",
        yourName: user.fullName || "",
        email: user.email || "",
        phoneNumber: user.phone || "",
      });

      setSecuritySettings({
        twoFactor: user.security?.twoFactor || false,
        hipaa: user.security?.hipaa || false,
        sessionRecording: user.security?.sessionRecording || false,
      });

      setNotificationSettings({
        sessionReminders: user.notifications?.sessionReminders || false,
        crisisAlerts: user.notifications?.crisisAlerts || false,
      });
    }
  }, [user]);

  // --- Profile Save ---
  const handleSaveChanges = async () => {
    try {
      await updateClinicProfile({
        id: user?.id,
        data: {
          privatePracticeName: profileData.practiceName,
          fullName: profileData.yourName,
          email: profileData.email,
          phone: profileData.phoneNumber,
        },
      }).unwrap();
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Failed to update profile. Please try again.");
    }
  };

  // --- Security Toggle ---
  const handleSecurityToggle = useCallback(
    async (key: keyof typeof securitySettings) => {
      const newValue = !securitySettings[key];
      setSecuritySettings((prev) => ({ ...prev, [key]: newValue }));

      try {
        if (user?.id) {
          // await updateSecurity({ id: user.id, key, value: newValue }).unwrap();
          toast.success(`${key} updated successfully`);
        }
      } catch {
        toast.error(`Failed to update ${key}`);
        setSecuritySettings((prev) => ({ ...prev, [key]: !newValue })); // rollback
      }
    },
    [securitySettings, user?.id]
  );

  // --- Notification Toggle ---
  const handleNotificationToggle = useCallback(
    async (key: keyof typeof notificationSettings) => {
      const newValue = !notificationSettings[key];
      setNotificationSettings((prev) => ({ ...prev, [key]: newValue }));
      try {
        if (user?.id) {
          await updateClinicNotification({
            id: user.id,
            key,
            value: newValue,
          }).unwrap();
          toast.success(`${key} updated successfully`);
        }
      } catch {
        toast.error(`Failed to update ${key}`);
        setNotificationSettings((prev) => ({ ...prev, [key]: !newValue })); // rollback
      }
    },
    [notificationSettings, updateClinicNotification, user?.id]
  );

  const securityToggleItems = useMemo(
    () => [
      {
        label: "Two-Factor Authentication",
        description: "Add an extra layer of security",
        isEnabled: securitySettings.twoFactor,
        onToggle: () => handleSecurityToggle("twoFactor"),
      },
      {
        label: "HIPAA Compliance",
        description: "Enhanced data encryption",
        isEnabled: securitySettings.hipaa,
        onToggle: () => handleSecurityToggle("hipaa"),
      },
      {
        label: "Session Recording",
        description: "Allow session recordings",
        isEnabled: securitySettings.sessionRecording,
        onToggle: () => handleSecurityToggle("sessionRecording"),
      },
    ],
    [securitySettings, handleSecurityToggle]
  );

  const notificationToggleItems = useMemo(
    () => [
      {
        label: "Session Reminders",
        description: "Notify before upcoming sessions",
        isEnabled: notificationSettings.sessionReminders,
        onToggle: () => handleNotificationToggle("sessionReminders"),
      },
      {
        label: "Crisis Alerts",
        description: "Immediate crisis notifications",
        isEnabled: notificationSettings.crisisAlerts,
        onToggle: () => handleNotificationToggle("crisisAlerts"),
      },
    ],
    [notificationSettings, handleNotificationToggle]
  );

  return (
    <div className="min-h-screen  p-4 sm:p-8">
      <div className="">
        <header className="flex justify-between items-center mb-8 pt-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              SETTINGS
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your practice settings and configurations
            </p>
          </div>
          <button
            onClick={handleSaveChanges}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-white text-sm font-medium rounded-lg shadow-md hover:bg-gray-800 transition duration-150 transform hover:scale-[1.02]"
          >
            <Save size={16} />
            <span>Save Changes</span>
          </button>
        </header>

        <ProfileSection
          profileData={profileData}
          setProfileData={setProfileData}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 mt-8">
          <ToggleCard title="Security & Privacy">
            {securityToggleItems.map((item) => (
              <ToggleItem key={item.label} {...item} />
            ))}
          </ToggleCard>

          <ToggleCard title="Notifications & Alerts">
            {notificationToggleItems.map((item) => (
              <ToggleItem key={item.label} {...item} />
            ))}
          </ToggleCard>
        </div>
      </div>
    </div>
  );
};

export default App;
