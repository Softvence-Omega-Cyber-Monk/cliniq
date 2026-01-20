import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, FormEvent, useEffect } from "react";
import { X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useGetProfileQuery } from "@/store/api/AuthApi";
import { useUpdateTherapistMutation } from "@/store/api/TherapistApi";
import { useUserId } from "@/hooks/useUserId";
import { toast } from "sonner";

interface EditPersonalInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  speciality: string;
  qualification: string;
  availabilityDays: string[];
  availabilityStartTime: string;
  availabilityEndTime: string;
}

const days = [
  { label: "Mon" },
  { label: "Tue" },
  { label: "Wed" },
  { label: "Thu" },
  { label: "Fri" },
  { label: "Sat" },
  { label: "Sun" },
];

export default function EditPersonalInfoModal({
  isOpen,
  onClose,
}: EditPersonalInfoModalProps) {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    speciality: "",
    qualification: "",
    availabilityDays: [],
    availabilityStartTime: "",
    availabilityEndTime: "",
  });
  const id = useUserId();
  const { data: user } = useGetProfileQuery("");
  const [updateTherapist, { isLoading }] = useUpdateTherapistMutation();
  // Initialize form with existing data if available
  useEffect(() => {
    if (isOpen && user?.user) {
      const userdata = user.user;
      const userAvailableDays = userdata?.availableDays || [];

      setSelectedDays(userAvailableDays);

      setFormData({
        fullName: userdata?.fullName || "",
        email: userdata?.email || "",
        phone: userdata?.phone || "",
        speciality: userdata?.speciality || "",
        qualification: userdata?.qualification || "",
        availabilityDays: userAvailableDays,
        availabilityStartTime: userdata?.availabilityStartTime || "09:00",
        availabilityEndTime: userdata?.availabilityEndTime || "17:00",
      });
    }
  }, [isOpen, user]); // Removed selectedDays from dependencies

  const toggleDay = (day: string) => {
    const newSelectedDays = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];

    setSelectedDays(newSelectedDays);
    setFormData((prev) => ({
      ...prev,
      availabilityDays: newSelectedDays,
    }));
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const submissionData = {
      ...formData,
    };
    try {
      const res = await updateTherapist({
        id,
        data: submissionData,
      }).unwrap();
      console.log(res);
      toast.success("Profile updated successfully");
      onClose();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[805px] w-full border-none rounded-2xl bg-[#EBF4F2] p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Edit Personal Info
          </DialogTitle>
        </DialogHeader>

        {/* Form wrapper with onSubmit */}
        <form onSubmit={handleSubmit}>
          {/* Profile Image */}
          <div className="flex items-center gap-4 mt-4">
            {/* Profile image upload removed for brevity */}
          </div>

          {/* Form */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input
                variant="primary"
                placeholder="Dr. Michael Chen"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                variant="primary"
                placeholder="michaelchen@cliniq.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                type="email"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Phone Number</label>
              <Input
                variant="primary"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                type="tel"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Speciality</label>
              <Input
                variant="primary"
                placeholder="Cognitive Behavioral Therapy"
                value={formData.speciality}
                onChange={(e) =>
                  handleInputChange("speciality", e.target.value)
                }
              />
            </div>

            <div className="col-span-2">
              <label className="text-sm font-medium">Qualifications</label>
              <Input
                variant="primary"
                placeholder="PhD in Psychology, Certified CBT Therapist"
                value={formData.qualification}
                onChange={(e) =>
                  handleInputChange("qualification", e.target.value)
                }
              />
            </div>
          </div>

          {/* Availability Days */}
          <div className="mt-6">
            <label className="text-sm font-medium mb-2 block">
              Availability Days
            </label>
            <div className="flex gap-4">
              {days.map((day) => (
                <button
                  type="button"
                  onClick={() => toggleDay(day.label)}
                  className={`bg-[#F5F9EF] flex items-center gap-1.5 px-3 rounded-[12px] border transition-all duration-300 ease-in-out cursor-pointer py-1.5 ${
                    selectedDays.includes(day.label)
                      ? "border-[#BDDC9A]"
                      : "border-none"
                  }`}
                  key={day.label}
                >
                  {day.label}
                  {selectedDays.includes(day.label) && (
                    <X size={20} className="text-[#6F8A48]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Working Hours */}
          <div className="flex gap-2.5 mt-4">
            <div className="w-1/4">
              <Label>Start Time</Label>
              <Input
                variant="primary"
                type="time"
                value={formData.availabilityStartTime}
                onChange={(e) =>
                  handleInputChange("availabilityStartTime", e.target.value)
                }
              />
            </div>
            <div className="w-1/4">
              <Label>End Time</Label>
              <Input
                variant="primary"
                type="time"
                value={formData.availabilityEndTime}
                onChange={(e) =>
                  handleInputChange("availabilityEndTime", e.target.value)
                }
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-6 rounded-lg"
            >
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              type="submit"
              className="bg-[#33D0B8] text-white px-6 rounded-lg hover:bg-[#2ab8a3]"
            >
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>

        {/* Close button */}
        <Button
          onClick={onClose}
          className="size-[32px] rounded-full absolute border border-[#3FDCBF66] text-website-primary-color bg-[#FFFFFF] right-5 top-5 cursor-pointer"
          type="button"
        >
          <X />
        </Button>
      </DialogContent>
    </Dialog>
  );
}
