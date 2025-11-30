import React from "react";
import ProfileInformation from "@/components/Settings/ProfileInformation";
import Notifications from "@/components/Settings/Notifications";
import Security from "@/components/Settings/Security";
import Preferences from "@/components/Settings/Preferences";
import BillingAndSubscription from "@/components/Settings/BillingAndSubscription";
import { useAppSelector } from "@/hooks/useRedux";
import BillingComponent from "@/components/BillingComponent";

interface File {
  name: string;
  content: string;
  mime_type: string;
}

interface IndividualTherapistSettingsProps {
  file?: File;
}

const IndividualTherapistSettings: React.FC<
  IndividualTherapistSettingsProps
> = () => {
  const userType = useAppSelector((state) => state.auth.userType);
  return (
    <div className="min-h-screen">
      <main className=" px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-800">SETTINGS</h1>
          <p className="text-basic text-[#7E8086]">
            Manage your account and preferences.
          </p>
        </div>
        <div className="space-y-8">
          <ProfileInformation />
          <Notifications />
          <Security />
          <Preferences />
          {userType === "INDIVIDUAL_THERAPIST" && <BillingComponent />}
        </div>
      </main>

      <style styled-tsx>{`
        .toggle-checkbox {
          top: 0;
          left: 0;
          transform: translateX(0);
          transition: transform 0.2s ease-in-out;
        }
        .toggle-checkbox:checked {
          transform: translateX(1.5rem); /* w-6 (1.5rem) - w-10 (2.5rem) */
        }
      `}</style>
    </div>
  );
};

export default IndividualTherapistSettings;
