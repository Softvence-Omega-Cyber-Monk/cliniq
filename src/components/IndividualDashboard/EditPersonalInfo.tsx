/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRegisterTherapistMutation } from '@/store/api/AuthApi';
import React, { useState, useCallback, useRef } from 'react';

// type Day = 'Sat' | 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';

interface UserProfile {
  name: string;
  email: string;
  phoneNumber: string;
  speciality: string;
  qualifications: string;
  startTime: string;
  endTime: string;
  licenseNumber: string; // NEW FIELD
}

// const ALL_DAYS: Day[] = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

const INITIAL_PROFILE_DATA: UserProfile = {
  name: '',
  email: '',
  phoneNumber: '',
  speciality: '',
  qualifications: '',
  startTime: '',
  endTime: '',
  licenseNumber: '' // NEW FIELD
};

interface FormInputProps {
  label: string;
  name: keyof UserProfile;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  inputType?: 'text' | 'email' | 'tel' | 'time';
  isTextarea?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  value,
  onChange,
  inputType = 'text',
  isTextarea = false
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
        onChange={onChange}
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

interface EditPersonalInfoProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (profile: any) => void;
}

const EditPersonalInfo: React.FC<EditPersonalInfoProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE_DATA);
  // const [daysAvailable, setDaysAvailable] = useState<Day[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [profileImage, setProfileImage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [registerTherapist] = useRegisterTherapistMutation()
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  // const handleDayToggle = useCallback((day: Day) => {
  //   setDaysAvailable(prev => {
  //     if (prev.includes(day)) {
  //       return prev.filter(d => d !== day);
  //     } else {
  //       return [...prev, day].sort((a, b) => ALL_DAYS.indexOf(a) - ALL_DAYS.indexOf(b));
  //     }
  //   });
  // }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    await new Promise(resolve => setTimeout(resolve, 1200));

    const finalPayload = {
      fullName: profile.name,
      licenseNumber: profile.licenseNumber,
      qualification: profile.qualifications,
      email: profile.email,
      phone: profile.phoneNumber,
      speciality: profile.speciality,
      defaultSessionDuration: 60,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      password: "123456",
      // startTime: profile.startTime,
      // endTime: profile.endTime,
      // availableDays: daysAvailable,
      // profileImage: profileImage
    };

    if (onSave) {
      onSave(finalPayload);
    }
    const result = await registerTherapist(finalPayload).unwrap();
    console.log(result)
    console.log("FINAL PAYLOAD:", finalPayload);

    setIsSaving(false);
    setSaveMessage({ type: 'success', message: 'Profile updated successfully!' });

    setTimeout(() => setSaveMessage(null), 3000);
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

  // const DayChip: React.FC<{ day: Day }> = useMemo(() => ({ day }) => {
  //   const isSelected = daysAvailable.includes(day);

  //   return (
  //     <button
  //       onClick={() => handleDayToggle(day)}
  //       className={`flex items-center space-x-2 px-4 py-2 font-medium rounded-full transition-all duration-200 transform hover:scale-105 active:scale-95 text-sm border ${
  //         isSelected
  //           ? 'bg-teal-500 text-white border-teal-500 shadow-md'
  //           : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
  //       }`}
  //       aria-label={isSelected ? `Remove ${day}` : `Add ${day}`}
  //     >
  //       <span>{day}</span>
  //       {isSelected && (
  //         <svg 
  //           xmlns="http://www.w3.org/2000/svg" 
  //           className="h-4 w-4" 
  //           fill="none" 
  //           viewBox="0 0 24 24" 
  //           stroke="currentColor" 
  //           strokeWidth={2}
  //         >
  //           <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  //         </svg>
  //       )}
  //     </button>
  //   );
  // }, [daysAvailable, handleDayToggle]);

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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-transform duration-300 scale-100">
        
        <div className="sticky top-0 bg-white border-b border-gray-200 rounded-t-2xl p-6 pb-4 z-10">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold text-gray-900">Edit Personal Info</h1>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-gray-500 text-sm">Update your professional information and availability</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
                accept="image/*"
              />
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-teal-400 to-teal-600 shadow-md">
                {profileImage ? (
                  <img 
                    src={profileImage}
                    alt="Profile" 
                    className="object-cover w-full h-full" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
              <button 
                onClick={handleEditPictureClick} 
                className="absolute -bottom-1 -right-1 p-1.5 bg-white border border-gray-300 rounded-full shadow-lg text-teal-600 hover:text-teal-700 transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zm-1.88 1.88l-6.107 6.107v3.182h3.182l6.107-6.107-3.182-3.182z" />
                </svg>
              </button>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{profile.name}</h3>
              <p className="text-sm text-gray-500">{profile.speciality}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput label="Full Name" name="name" value={profile.name} onChange={handleChange} />
            <FormInput label="Email Address" name="email" value={profile.email} onChange={handleChange} inputType="email" />
            <FormInput label="Phone Number" name="phoneNumber" value={profile.phoneNumber} onChange={handleChange} inputType="tel" />
            <FormInput label="Speciality" name="speciality" value={profile.speciality} onChange={handleChange} />

            {/* NEW FIELD */}
            <FormInput 
              label="License Number"
              name="licenseNumber"
              value={profile.licenseNumber}
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
              <p className="text-sm font-medium text-gray-700 mb-3">Available Days</p>
              <div className="flex flex-wrap gap-2">
                {/* {ALL_DAYS.map((day) => (
                  <DayChip key={day} day={day} />
                ))} */}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput label="Start Time" name="startTime" value={profile.startTime} onChange={handleChange} inputType="time" />
              <FormInput label="End Time" name="endTime" value={profile.endTime} onChange={handleChange} inputType="time" />
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 rounded-b-2xl p-6">
          <div className="flex justify-between items-center">

            {saveMessage && (
              <div 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  saveMessage.type === 'success' 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {saveMessage.message}
              </div>
            )}
            
            <div className="flex space-x-3 ml-auto">
              <button
                onClick={onClose}
                className="px-6 py-2.5 text-gray-700 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`px-6 py-2.5 text-white font-medium rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                  isSaving
                    ? 'bg-teal-400 cursor-not-allowed'
                    : 'bg-teal-500 hover:bg-teal-600 shadow-md hover:shadow-lg'
                }`}
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
