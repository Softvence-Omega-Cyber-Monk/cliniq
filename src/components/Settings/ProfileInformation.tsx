/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import SectionHeader from "./SectionHeader";
import InputField from "./InputField";
import { User } from "lucide-react";
import { useGetProfileQuery } from "@/store/api/AuthApi";
import { useUpdateTherapistProfileMutation } from "@/store/api/UsersApi";
import { toast } from "sonner";
import { useUserId } from "@/hooks/useUserId";

const ProfileInformation: React.FC = () => {
  const { data, isLoading, error } = useGetProfileQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  const [updateTherapistProfile, { isLoading: isUpdating }] =
    useUpdateTherapistProfileMutation();

  const user = data?.user;
  const userId = useUserId();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    licenseNumber: "",
  });

  // Sync form with API data once loaded
  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        licenseNumber: user.licenseNumber || "",
      });
    }
  }, [user]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        fullName: form.fullName,
        phone: form.phone,
        licenseNumber: form.licenseNumber,
      };

      const res = await updateTherapistProfile({
        id: userId,
        data: payload,
      }).unwrap();
      console.log(res);
      toast.success("Profile updated successfully");
    } catch (err: any) {
      toast.error(err?.data?.message || "Update failed. Please try again.");
    }
  };

  return (
    <form
      className="p-8 bg-website-secondary-color rounded-xl mb-8"
      onSubmit={handleSubmit}
    >
      <div className="flex gap-3.5">
        <User className="text-[#298CDF]" />
        <SectionHeader title="Profile Information" subtitle="" />
      </div>

      {error && (
        <div className="p-4 mt-4 bg-red-100 text-red-700 rounded-xl">
          Failed to load profile. Please try again.
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-10 bg-gray-300/40 rounded-xl animate-pulse"
            ></div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 mt-4">
            <InputField
              value={form.fullName}
              label="Full Name"
              id="fullName"
              onChange={(e) => handleChange("fullName", e.target.value)}
            />

            <InputField
              value={form.email}
              label="Email"
              id="email"
              type="email"
            />

            <InputField
              value={form.phone}
              label="Phone"
              id="phone"
              onChange={(e) => handleChange("phone", e.target.value)}
            />

            <InputField
              value={form.licenseNumber}
              label="License Number"
              id="licenseNumber"
              onChange={(e) => handleChange("licenseNumber", e.target.value)}
            />

            <div />
          </div>

          <div className="mt-4 ">
            <button
              className="text-sm text-white font-semibold py-2 px-16 rounded-[12px] 
      hover:opacity-90 cursor-pointer transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-[#3fdcbf]"
              disabled={isUpdating}
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </>
      )}
    </form>
  );
};

export default ProfileInformation;
