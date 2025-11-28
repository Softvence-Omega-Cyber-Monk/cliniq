import React, { useState } from "react";
import SectionHeader from "./SectionHeader";
import InputField from "./InputField";
import SaveButton from "./SaveButton";
import { User } from "lucide-react";
import { useGetProfileQuery } from "@/store/api/AuthApi";

const ProfileInformation: React.FC = () => {
  const { data, isLoading, error } = useGetProfileQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  const user = data?.user;
  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    licenseNumber: user?.licenseNumber || "",
  });

  return (
    <form className="p-8 bg-website-secondary-color rounded-xl mb-8">
      {/* Header */}
      <div className="flex gap-3.5">
        <User className="text-[#298CDF]" />
        <SectionHeader title="Profile Information" subtitle="" />
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 mt-4 bg-red-100 text-red-700 rounded-xl">
          Failed to load profile. Please try again.
        </div>
      )}

      {/* Loading Skeleton */}
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
          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 mt-4">
            <InputField
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              value={user?.fullName || ""}
              label="Full Name"
              id="fullName"
            />

            <InputField
              value={user?.email || ""}
              label="Email"
              id="email"
              type="email"
            />

            <InputField value={user?.phone || ""} label="Phone" id="phone" />

            <InputField
              value={user?.licenseNumber || ""}
              label="License Number"
              id="licenseNumber"
            />

            {/* Empty for layout */}
            <div />
          </div>

          {/* Save Button */}
          <div className="mt-4">
            <SaveButton className="text-sm">Save Changes</SaveButton>
          </div>
        </>
      )}
    </form>
  );
};

export default ProfileInformation;
