import React from "react";
import { FileTextIcon } from "./MaterialsIcons";
import { Resource } from "@/store/api/MaterialApi";

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const MaterialCard: React.FC<{
  material: Resource;
  onView: (id: string) => void;
}> = ({ material, onView }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transition-all hover:shadow-xl">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start">
          <div className="p-2 mr-3 bg-green-50 text-green-600 rounded-lg">
            <FileTextIcon />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 leading-tight">
              {material.title}
            </h3>

            <span className="inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-600">
              {material.category}
            </span>
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4">{material.shortDescription}</p>

      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <div className="text-xs text-gray-500 space-y-1">
          <p>Uploaded: {formatDate(material.createdAt)}</p>
          <p>Size: {formatFileSize(material.fileSize)}</p>
        </div>

        <button
          className="px-6 py-2 bg-teal-500 text-white font-medium rounded-lg shadow-md hover:bg-teal-600 transition duration-150 ease-in-out transform hover:scale-[1.02]"
          onClick={() => onView(material.id)}
        >
          View
        </button>
      </div>
    </div>
  );
};

export default MaterialCard;
