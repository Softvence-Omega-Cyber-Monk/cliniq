/* eslint-disable @typescript-eslint/no-explicit-any */
import { useUserId } from "@/hooks/useUserId";
import { useRegisterTherapistMutation } from "@/store/api/AuthApi";
import { useUpdateTherapistProfileMutation } from "@/store/api/UsersApi";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface AddTherapistModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditMode?: boolean;
  therapistData?: any; // data passed from parent for editing
}

type Day = "Sat" | "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri";
const ALL_DAYS: Day[] = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

interface TherapistForm {
  name: string;
  email: string;
  phoneNumber: string;
  speciality: string;
  qualification: string;
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
  isEditMode = false,
  therapistData,
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
      qualification: "",
      startTime: "",
      endTime: "",
      licenseNumber: "",
      password: "",
      // profileImage: null,
      daysAvailable: [],
    },
  });

  const [registerTherapist] = useRegisterTherapistMutation();
  const [updateTherapistProfile] = useUpdateTherapistProfileMutation();

  // const fileInputRef = useRef<HTMLInputElement>(null);
  const [_previewImage, setPreviewImage] = useState<string>("");

  const daysAvailable = watch("daysAvailable");
  const name = watch("name");
  const speciality = watch("speciality");
  const clinicId = useUserId();

  /* --------------------------------------
      LOAD DEFAULT VALUES IN EDIT MODE
  ---------------------------------------*/
  useEffect(() => {
    if (isOpen && isEditMode && therapistData) {
      reset({
        name: therapistData.fullName || "",
        email: therapistData.email || "",
        phoneNumber: therapistData.phone || "",
        speciality: therapistData.speciality || "",
        qualification: therapistData.qualification || "",
        startTime: therapistData.startTime || "",
        endTime: therapistData.endTime || "",
        licenseNumber: therapistData.licenseNumber || "",
        password: "",
        // profileImage: null,
        daysAvailable: therapistData.daysAvailable || [],
      });

      if (therapistData.profileImageUrl) {
        setPreviewImage(therapistData.profileImageUrl);
      }
    }
  }, [isOpen, isEditMode, therapistData, reset]);

  /* --------------------------------------
            DAY CHIP HANDLER
  ---------------------------------------*/
  const handleDayToggle = (day: Day) => {
    const current = watch("daysAvailable") || [];
    const updated = current.includes(day)
      ? current.filter((d) => d !== day)
      : [...current, day];

    setValue("daysAvailable", updated);
  };

  /* --------------------------------------
            IMAGE HANDLER
  ---------------------------------------*/
  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     setPreviewImage(URL.createObjectURL(file));
  //     setValue("profileImage", e.target.files);
  //   }
  // };

  // const handleEditPictureClick = () => fileInputRef.current?.click();

  /* --------------------------------------
            FORM SUBMIT HANDLER
  ---------------------------------------*/
  const onSubmit = async (data: TherapistForm) => {
    const payload: any = {
      fullName: data.name,
      email: data.email,
      phone: data.phoneNumber,
      speciality: data.speciality,
      qualifications: data.qualification,
      startTime: data.startTime,
      endTime: data.endTime,
      licenseNumber: data.licenseNumber,
      clinicId: clinicId!,
      daysAvailable: data.daysAvailable,
    };

    if (!isEditMode) {
      payload.password = data.password;
    }

    // if (data.profileImage && data.profileImage.length > 0) {
    //   payload.profileImage = data.profileImage[0];
    // }

    try {
      let res;

      if (isEditMode) {
        res = await updateTherapistProfile({
          id: therapistData.id,
          data: payload,
        }).unwrap();

        toast.success("Profile updated successfully.");
      } else {
        res = await registerTherapist(payload).unwrap();
        toast.success("Therapist added successfully.");
      }

      console.log("Response:", res);
    } catch (err) {
      console.log(err);
      toast.error("Operation failed. Please try again.");
    }

    reset();
    setPreviewImage("");
    onClose();
  };
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 bg-black/10 backdrop-blur-sm z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            {isEditMode ? "Edit Therapist Profile" : "Add New Therapist"}
          </h1>
          <button onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Profile */}
          <div className="flex items-center gap-4">
            <div className="relative">
              {/* <input
                type="file"
                {...register("profileImage")}
                ref={(e) => {
                  register("profileImage").ref(e);
                  fileInputRef.current = e;
                }}
                onChange={handleImageChange}
                className="hidden"
                accept="image/*"
              /> */}

              {/* <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center shadow-md">
                {previewImage ? (
                  <img
                    src={previewImage}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="text-xl font-bold">
                    {name ? name[0] : "T"}
                  </span>
                )}
              </div> */}

              {/* <button
                type="button"
                onClick={handleEditPictureClick}
                className="absolute -bottom-1 -right-1 bg-white border rounded-full p-1 shadow"
              >
                Edit
              </button> */}
            </div>

            <div>
              <h3 className="font-semibold">{name || "Therapist Name"}</h3>
              <p className="text-gray-500">{speciality || "Speciality"}</p>
            </div>
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              {...register("name")}
              placeholder="Full Name"
              className="border p-3 rounded-lg"
            />
            <input
              {...register("email")}
              placeholder="Email"
              className="border p-3 rounded-lg"
            />
            <input
              {...register("phoneNumber")}
              placeholder="Phone"
              className="border p-3 rounded-lg"
            />
            <input
              {...register("speciality")}
              placeholder="Speciality"
              className="border p-3 rounded-lg"
            />
            <input
              {...register("licenseNumber")}
              placeholder="License Number"
              className="border p-3 rounded-lg"
            />
            {!isEditMode && (
              <input
                {...register("password")}
                placeholder="Password"
                className="border p-3 rounded-lg"
                type="password"
              />
            )}
          </div>

          <textarea
            {...register("qualification")}
            placeholder="Qualifications"
            className="border p-3 rounded-lg w-full"
            rows={3}
          />

          {/* Days */}
          <div>
            <p className="font-medium mb-2">Available Days</p>
            <div className="flex flex-wrap gap-2">
              {ALL_DAYS.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDayToggle(day)}
                  className={`px-4 py-2 rounded-full border ${
                    daysAvailable.includes(day)
                      ? "bg-teal-500 text-white"
                      : "bg-white"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              {...register("startTime")}
              type="time"
              className="border p-3 rounded-lg"
            />
            <input
              {...register("endTime")}
              type="time"
              className="border p-3 rounded-lg"
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-teal-600 text-white rounded-lg"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Saving…"
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
