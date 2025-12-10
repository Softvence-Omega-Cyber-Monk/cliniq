import React from "react";
import logincover from "@/assets/photo_2025-12-09_08-34-05v5.png";
import { Role } from "./types";

interface AuthLayoutProps {
  children: React.ReactNode;
  role: Role;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, role }) => {
  console.log(role);
  const coverImage = logincover;
  const imageClassName =
    "w-full max-h-full object-contain object-bottom opacity-80";
  return (
    <div className="flex flex-col md:flex-row bg-white min-h-screen">
      {/* LEFT SIDE */}
      <div className="w-full sticky top-0 h-screen md:w-6/12 bg-[#0B0D3D] text-white  flex flex-col  justify-between overflow-hidden">
        {/* TEXT (above image) */}

        <div className="relative z-10 text-center mt-[50px]">
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
            CliniQ
          </h1>
          <p className="mt-4 text-lg text-gray-300">A smarter Practice</p>
        </div>

        {/* IMAGE (behind text) */}
        <div className=" flex items-end justify-center z-0">
          <img
            src={coverImage}
            alt="Group of medical professionals"
            className={imageClassName}
          />
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full pb-6 md:w-7/12 px-10 bg-[#ECEFDE]">{children}</div>
    </div>
  );
};

export default AuthLayout;
