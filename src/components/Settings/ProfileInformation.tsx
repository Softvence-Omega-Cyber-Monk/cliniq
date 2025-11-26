import React from "react";
import SectionHeader from "./SectionHeader";
import InputField from "./InputField";
import SaveButton from "./SaveButton";

const ProfileInformation: React.FC = () => (
  <div className="p-8 bg-website-secondary-color rounded-xl  mb-8">
    <SectionHeader
      title="Profile Information"
      subtitle="Manage your contact and identity settings."
    />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
      <InputField label="First Name" id="firstName" />
      <InputField label="Last Name" id="lastName" />
      <InputField label="Email" id="email" type="email" />
      <InputField label="Phone" id="phone" />
      <InputField label="License Number" id="license" />
      {/* Empty slot for layout alignment */}
      <div />
    </div>
    <div className="mt-4">
      <SaveButton>Save Changes</SaveButton>
    </div>
  </div>
);

export default ProfileInformation;
