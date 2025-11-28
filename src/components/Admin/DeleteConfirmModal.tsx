"use client"
import { X } from "lucide-react"

interface Material {
  
  id: string;
  title: string;
  category: string;
  categoryColor: string;
  type: string;
  description: string;
  status: "Active" | "Inactive";
  uploadDate: string;
  size: string;
}

interface DeleteConfirmModalProps {
  material: Material
  onConfirm: () => void
  onCancel: () => void
}

export default function DeleteConfirmModal({ material, onConfirm, onCancel }: DeleteConfirmModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Delete Educational Material?</h2>
          <button onClick={onCancel} className="cursor-pointer p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-600 mb-4">Are you sure you want to delete "{material.title}"?</p>
          <p className="text-sm text-gray-500">
            This action cannot be undone and the material will no longer be available to therapists.
          </p>

          <div className="flex gap-3 pt-6">
            <button
              onClick={onCancel}
              className="cursor-pointer flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="cursor-pointer flex-1 px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
