import React from "react";
import ProfileInformation from "@/components/Settings/ProfileInformation";
import Notifications from "@/components/Settings/Notifications";
import Security from "@/components/Settings/Security";
import Preferences from "@/components/Settings/Preferences";
import BillingAndSubscription from "@/components/Settings/BillingAndSubscription";

const Settings: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 ">
      <header className="py-8 px-6 bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-extrabold text-gray-800">SETTINGS</h1>
          <p className="text-sm text-gray-500">
            Manage your account and preferences.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="space-y-8">
          <ProfileInformation />
          <Notifications />
          <Security />
          <Preferences />
          <BillingAndSubscription />
        </div>
      </main>

      {/* Tailwind classes that make the toggle switch work */}
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

export default Settings;
