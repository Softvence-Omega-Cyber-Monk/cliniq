import { useUserId } from "@/hooks/useUserId";
import { useRegisterTherapistMutation } from "@/store/api/AuthApi";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface AddTherapistModalProps {
  isOpen: boolean;
  onClose: () => void;
  //   onSave: (formData: FormData) => void;
  isEditMode?: boolean;
}

type Day = "Sat" | "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri";
const ALL_DAYS: Day[] = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

interface TherapistForm {
  name: string;
  email: string;
  phoneNumber: string;
  speciality: string;
  qualifications: string;
  startTime: string;
  endTime: string;
  licenseNumber: string;
  password: string;
  profileImage: FileList | null;
  daysAvailable: Day[];
}

const AddTherapistModal: React.FC<AddTherapistModalProps> = ({
  isOpen,
  onClose,
  //   onSave,
  isEditMode = false,
}) => {
  const {
    register,
    handleSubmit,

    watch,
    setValue,
    reset,
    formState: { isSubmitting },
  } = useForm<TherapistForm>({
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      speciality: "",
      qualifications: "",
      startTime: "",
      endTime: "",
      licenseNumber: "",
      password: "",
      profileImage: null,
      daysAvailable: [],
    },
  });
  const [registerTherapist] = useRegisterTherapistMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string>("");

  const daysAvailable = watch("daysAvailable");
  const profileName = watch("name");
  const speciality = watch("speciality");

  const handleDayToggle = (day: Day) => {
    const currentDays = watch("daysAvailable") || [];
    const updatedDays = currentDays.includes(day)
      ? currentDays.filter((d) => d !== day)
      : [...currentDays, day].sort(
          (a, b) => ALL_DAYS.indexOf(a) - ALL_DAYS.indexOf(b)
        );
    setValue("daysAvailable", updatedDays);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setValue("profileImage", e.target.files);
    }
  };

  const handleEditPictureClick = () => fileInputRef.current?.click();
  const clinicId = useUserId();
  const onSubmit = async (data: TherapistForm) => {
    // const formData = new FormData();
    // formData.append("fullName", data.name);
    // formData.append("email", data.email);
    // formData.append("phone", data.phoneNumber);
    // formData.append("speciality", data.speciality);
    // formData.append("qualifications", data.qualifications);
    // formData.append("startTime", data.startTime);
    // formData.append("endTime", data.endTime);
    // formData.append("licenseNumber", data.licenseNumber);
    // formData.append("password", data.password);
    // formData.append("clinicId", clinicId!);
    // formData.append("daysAvailable", JSON.stringify(data.daysAvailable));
    // if (data.profileImage && data.profileImage.length > 0) {
    //   formData.append("profileImage", data.profileImage[0]);
    // }

    const therapistData = {
      fullName: data.name,
      email: data.email,
      phone: data.phoneNumber,
      speciality: data.speciality,
      qualifications: data.qualifications,
      startTime: data.startTime,
      endTime: data.endTime,
      licenseNumber: data.licenseNumber,
      password: data.password,
      clinicId: clinicId!,
      daysAvailable: data.daysAvailable,
    //   profileImage:
    //     data.profileImage && data.profileImage.length > 0
    //       ? data.profileImage[0]
    //       : null,
    };

    try {
      const res = await registerTherapist(therapistData).unwrap();
      console.log(res);
      toast.success("Therapist added successfully!");
    } catch {
      toast.error("Failed to add therapist. Please try again.");
    }

    if (!isEditMode) {
      reset();
      setPreviewImage("");
    }
  };

  if (!isOpen) return null;

  const DayChip: React.FC<{ day: Day }> = ({ day }) => {
    const isSelected = daysAvailable.includes(day);
    return (
      <button
        type="button"
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
    if (e.target === e.currentTarget) onClose();
  };

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

        <form className="p-6 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Profile Picture */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="file"
                {...register("profileImage")}
                ref={(e) => {
                  register("profileImage").ref(e); // RHF's ref
                  fileInputRef.current = e; // your local ref
                }}
                onChange={handleImageChange}
                className="hidden"
                accept="image/*"
              />
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-teal-400 to-teal-600 shadow-md flex items-center justify-center text-xl font-bold text-white">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Profile"
                    className="object-cover w-full h-full"
                  />
                ) : profileName ? (
                  profileName
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
                type="button"
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
                {profileName || "Therapist Name"}
              </h3>
              <p className="text-sm text-gray-500">
                {speciality || "Speciality"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              {...register("name", { required: true })}
              placeholder="Full Name"
              className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-teal-500"
            />
            <input
              {...register("email", { required: true })}
              type="email"
              placeholder="Email Address"
              className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-teal-500"
            />
            <input
              {...register("phoneNumber")}
              type="tel"
              placeholder="Phone Number"
              className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-teal-500"
            />
            <input
              {...register("speciality", { required: true })}
              placeholder="Speciality"
              className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-teal-500"
            />
            <input
              {...register("licenseNumber")}
              placeholder="License Number"
              className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-teal-500"
            />
            <input
              {...register("password")}
              type="password"
              placeholder="Password"
              className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-teal-500"
            />
          </div>

          <textarea
            {...register("qualifications")}
            placeholder="Qualifications & Certifications"
            className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-teal-500 w-full resize-none"
            rows={3}
          />

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
            <input
              {...register("startTime")}
              type="time"
              className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-teal-500"
            />
            <input
              {...register("endTime")}
              type="time"
              className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2.5 text-gray-700 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2.5 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
                isSubmitting
                  ? "bg-teal-400 cursor-not-allowed"
                  : "bg-teal-500 hover:bg-teal-600 shadow-md hover:shadow-lg"
              }`}
            >
              {isSubmitting
                ? "Saving..."
                : isEditMode
                ? "Save Changes"
                : "Save Therapist"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTherapistModal;
