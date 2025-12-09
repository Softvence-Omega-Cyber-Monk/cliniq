import { useState } from "react";
import { useChangePasswordMutation } from "@/store/api/AuthApi";
import SectionHeader from "./SectionHeader";
import { Input } from "../ui/input";
import { toast } from "sonner";

const Security: React.FC = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { currentPassword, newPassword, confirmPassword } = formData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    try {
      await changePassword({
        currentPassword,
        newPassword,
      }).unwrap();

      toast.success("Password updated successfully!");

      // Reset input fields
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to change password.");
    }
  };

  return (
    <div className="p-8 bg-white rounded-xl shadow-sm mb-8">
      <SectionHeader
        title="Security"
        subtitle="Update your password to keep your account secure."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        {/* Current Password */}
        <div className="flex flex-col">
          <label htmlFor="currentPassword" className="text-sm font-medium">
            Current Password
          </label>
          <Input
            id="currentPassword"
            name="currentPassword"
            variant={"primary"}
            className=""
            value={formData.currentPassword}
            onChange={handleChange}
            type="password"
            placeholder="Enter current password"
          />
        </div>

        {/* Empty Column for layout */}
        <div className="hidden md:block" />

        {/* New Password */}
        <div className="flex flex-col">
          <label htmlFor="newPassword" className="text-sm font-medium">
            New Password
          </label>
          <Input
            variant={"primary"}
            id="newPassword"
            name="newPassword"
            type="password"
            placeholder="Enter new password"
            value={formData.newPassword}
            onChange={handleChange}
          />
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col">
          <label htmlFor="confirmPassword" className="text-sm font-medium">
            Confirm New Password
          </label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm new password"
            value={formData.confirmPassword}
            onChange={handleChange}
            variant={"primary"}
          />
        </div>
      </div>

      {/* Normal Button */}
      <div className="mt-4">
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="px-6 py-2 bg-website-primary-color text-white rounded-lg  disabled:bg-gray-400 transition cursor-pointer duration-200 disabled:cursor-not-allowed"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default Security;
