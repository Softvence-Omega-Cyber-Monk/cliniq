import type React from "react"
import { useState } from "react"
import { X } from "lucide-react"

interface AddMaterialModalProps {
  onClose: () => void
}

export default function AddMaterialModal({ onClose }: AddMaterialModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    type: "PDF",
    description: "",
    status: "Active",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-900">Add New Material</h2>
          <button onClick={onClose} className="cursor-pointer p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              placeholder="E.g., Cognitive Behavioral Therapy Overview"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none"
              >
                <option value="">Select Category</option>
                <option value="CBT">CBT</option>
                <option value="DBT">DBT</option>
                <option value="Mindfulness">Mindfulness</option>
                <option value="ACT">ACT</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none"
              >
                <option value="PDF">PDF</option>
                <option value="Video">Video</option>
                <option value="Worksheet">Worksheet</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              placeholder="Provide a brief description of the material..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload File</label>
            <button
              type="button"
              className="cursor-pointer w-full px-3 py-2 rounded-lg border border-gray-300 text-teal-600 font-medium hover:bg-gray-50 transition-colors"
            >
              Choose File to Upload
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cursor-pointer flex-1 px-4 py-2 rounded-lg bg-teal-500 text-white font-medium hover:bg-teal-600 transition-colors"
            >
              Save & Publish
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
