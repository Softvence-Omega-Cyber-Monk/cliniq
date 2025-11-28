import React from "react";
import { ContactDetail } from "./types";

const ContactCard: React.FC<ContactDetail> = ({
  icon: Icon,
  title,
  description,
  actionText,
  detail,
}) => {
  const isLink = title === "Phone Support" || title === "Email Support";
  const ButtonTag = isLink ? "a" : "button";
  const href = isLink
    ? title === "Phone Support"
      ? `tel:${detail}`
      : `mailto:${detail}`
    : undefined;

  return (
    <div className="bg-[#FAFAF7] p-6 md:p-8 rounded-xl transition-shadow hover:shadow h-full flex flex-col">
      <div
        className={`p-3 w-fit rounded-full mb-4 ${
          title === "Live Chat"
            ? "bg-emerald-100"
            : title === "Email Support"
            ? "bg-indigo-100"
            : "bg-lime-100"
        }`}
      >
        <Icon
          className={`w-6 h-6 ${
            title === "Live Chat"
              ? "text-emerald-500"
              : title === "Email Support"
              ? "text-indigo-500"
              : "text-lime-500"
          }`}
        />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 flex-grow mb-6">{description}</p>

      <ButtonTag
        href={href}
        className={`w-full py-2.5 text-sm font-medium rounded-lg transition-colors border flex justify-center items-center ${
          isLink
            ? "bg-transparent border-emerald-500 text-emerald-600 hover:bg-emerald-50"
            : "bg-emerald-500 text-white hover:bg-emerald-600 border-emerald-500"
        }`}
      >
        {actionText}
      </ButtonTag>
    </div>
  );
};

export default ContactCard;
