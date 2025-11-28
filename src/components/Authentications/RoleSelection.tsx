import React from "react";
import { Role } from "./types";
import drIcon from "../../assets/Icons/Dr.svg";
import drsIcon from "../../assets/Icons/drs.svg";

interface RoleSelectionProps {
  onContinue: (role: Role) => void;
  onSwitchToLogin: () => void;
  selectedRole: Role;
  onRoleChange: (role: Role) => void;
}

const RoleCard: React.FC<{
  role: Role;
  title: string;
  description: string;
  icon: string;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ title, description, icon, isSelected, onSelect }) => {
  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer p-6 rounded-xl border-2 transition-all duration-200 ${
        isSelected
          ? "border-[#3FDCBF1A] bg-[#3FDCBF1A] shadow-md"
          : "border-gray-200 bg-white hover:border-[#3FDCBF1A] hover:bg-[#3FDCBF1A]"
      }`}
    >
      <div className="flex items-start  space-x-4">
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
            isSelected
              ? "bg-clinic-accent text-white"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          <img src={icon} alt="" />
        </div>
        <div>
          <h3 className="font-bold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
};

const RoleSelection: React.FC<RoleSelectionProps> = ({
  onContinue,
  onSwitchToLogin,
  selectedRole,
  onRoleChange,
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="text-right mt-5 mr-[80px]">
        <p className="text-gray-600">
          Already have an account?{" "}
          <button
            onClick={onSwitchToLogin}
            className="font-bold text-clinic-accent hover:underline text-[#3FDCBF]"
          >
            Sign In
          </button>
        </p>
      </div>
      <div className="flex-grow flex flex-col flex-start justify-center mx-auto">
        <div className="max-w-[600px] mr-auto w-full">
          <h2 className="text-3xl font-bold text-gray-800">JOIN US!</h2>
          <p className="text-gray-500 mt-2">
            Lorem ipsum dolor sit amet consectetur. Aliquet ac arcu nullam nunc
            aliquet.
          </p>
          <div className="space-y-4 mt-8">
            <RoleCard
              role={Role.INDIVIDUAL}
              title="INDIVIDUAL"
              description="Lorem ipsum dolor sit amet consectetur. Aliquet ac arcu nullam nunc aliquet."
              icon={drIcon}
              isSelected={selectedRole === Role.INDIVIDUAL}
              onSelect={() => onRoleChange(Role.INDIVIDUAL)}
            />
            <RoleCard
              role={Role.PRIVATE_PRACTICE}
              title="PRIVATE PRACTICE"
              description="Lorem ipsum dolor sit amet consectetur. Aliquet ac arcu nullam nunc aliquet."
              icon={drsIcon}
              isSelected={selectedRole === Role.PRIVATE_PRACTICE}
              onSelect={() => onRoleChange(Role.PRIVATE_PRACTICE)}
            />
          </div>
          <div className="mt-8">
            <button
              onClick={() => onContinue(selectedRole)}
              className="
                                  w-[200px]
                                     flex items-center justify-center 
                                      h-[60px] 
                                 px-10 py-2 
                                     bg-[#298CDF] 
                                 text-white font-bold 
                                        rounded-[20px] 
                                      gap-2
                                  hover:bg-opacity-90 
                                                  transition-colors 
                                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#298CDF]
                                          "
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RoleSelection;
