import React, { useState } from "react";
import { ExportIcon } from "./MaterialsIcons";
import { Resource } from "@/store/api/MaterialApi";
import { jsPDF } from "jspdf";

const PLACEHOLDER_IMAGE_URL =
  "https://placehold.co/800x400/F0F0F0/333333?text=Therapy+Session+Scene";

const MaterialDetailView: React.FC<{
  material: Resource;
  onBack: () => void;
}> = ({ material, onBack }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleExport = () => {
    setIsDownloading(true);
    try {
      const doc = new jsPDF();

      // Title
      doc.setFontSize(22);
      doc.text(material.title, 20, 30);

      // Metadata
      doc.setFontSize(14);
      doc.text(`Category: ${material.category}`, 20, 50);
      doc.text(`Type: ${material.fileType}`, 20, 60);
      doc.text(`Size: ${material.fileSize} KB`, 20, 70);
      doc.text(`Created: ${material.createdAt}`, 20, 80);
      doc.text(`Updated: ${material.updatedAt}`, 20, 90);

      // Description
      doc.setFontSize(16);
      doc.text("Description:", 20, 110);
      const description = material.longDescription || material.shortDescription || "";
      const splitText = doc.splitTextToSize(description, 170);
      doc.text(splitText, 20, 120);

      // Save PDF
      doc.save(`${material.title}.pdf`);
    } catch (error) {
      console.error("PDF generation failed", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen p-5 sm:p-10 rounded-xl shadow-lg border border-gray-100">
      {/* Breadcrumb */}
      <div className="text-sm mb-6 flex items-center text-gray-500">
        <button
          onClick={onBack}
          className="hover:text-teal-600 transition duration-150"
        >
          Materials
        </button>
        <span className="mx-2">/</span>
        <span className="font-medium text-gray-900 truncate max-w-xs sm:max-w-md">
          {material.title}
        </span>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4 mb-6">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight max-w-[75%] leading-tight">
          {material.title}
        </h1>

        <button
          onClick={handleExport}
          disabled={isDownloading}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg shadow-md transition ${
            isDownloading
              ? "bg-gray-400 text-gray-200 cursor-not-allowed"
              : "bg-teal-600 text-white hover:bg-teal-700"
          }`}
        >
          <ExportIcon className="w-5 h-5" />
          <span>{isDownloading ? "Downloading..." : "Export"}</span>
        </button>
      </div>

      {/* Description */}
      <div className="text-gray-700 text-sm sm:text-base mb-10 leading-relaxed">
        {material.longDescription || material.shortDescription}
      </div>

      {/* Image */}
      <div className="my-8 rounded-xl overflow-hidden shadow-md border border-gray-200">
        <img
          src={material.fileUrl || PLACEHOLDER_IMAGE_URL}
          alt={material.title}
          className="w-full h-auto object-cover"
        />
      </div>

      {/* Metadata */}
      <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 mb-10">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          File Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
          <p>
            <span className="font-medium text-gray-800">Category:</span> {material.category}
          </p>
          <p>
            <span className="font-medium text-gray-800">Type:</span> {material.fileType}
          </p>
          <p>
            <span className="font-medium text-gray-800">Size:</span> {material.fileSize} KB
          </p>
          <p>
            <span className="font-medium text-gray-800">Created:</span> {material.createdAt}
          </p>
          <p>
            <span className="font-medium text-gray-800">Updated:</span> {material.updatedAt}
          </p>
        </div>
      </div>

      {/* Extra Content */}
      <div className="text-gray-700 text-sm sm:text-base space-y-6 leading-relaxed">
        <p>
          This resource is designed to support professional therapeutic practice and enrich
          session-based learning. You may use it for guided sessions, workshops, or client-facing
          material depending on your access permissions.
        </p>

        <p>
          If you require enhanced formatting, downloadable assets, or integration into your clinic
          workflow, please notify the administration for access-level adjustments.
        </p>
      </div>
    </div>
  );
};

export default MaterialDetailView;
