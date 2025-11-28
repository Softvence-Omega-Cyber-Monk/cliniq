import type React from "react"
import { useState } from "react"
import { X, Upload, Loader2 } from "lucide-react"
import { useCreateResourceMutation, ResourceCategory } from "@/store/api/MaterialApi"

interface AddMaterialModalProps {
  onClose: () => void
}

export default function AddMaterialModal({ onClose }: AddMaterialModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    category: "" as ResourceCategory | "",
    shortDescription: "",
    longDescription: "",
    isActive: true,
  })
  const [file, setFile] = useState<File | null>(null)
  const [image, setImage] = useState<File | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [createResource, { isLoading }] = useCreateResourceMutation()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }
    if (!formData.category) {
      newErrors.category = "Category is required"
    }
    if (!formData.shortDescription.trim()) {
      newErrors.shortDescription = "Description is required"
    }
    if (!file) {
      newErrors.file = "File is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Validate file size (e.g., max 50MB)
      if (selectedFile.size > 50 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, file: "File size must be less than 50MB" }))
        return
      }
      setFile(selectedFile)
      setErrors(prev => ({ ...prev, file: "" }))
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedImage = e.target.files?.[0]
    if (selectedImage) {
      // Validate image file
      if (!selectedImage.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, image: "Please select a valid image file" }))
        return
      }
      // Validate image size (e.g., max 5MB)
      if (selectedImage.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: "Image size must be less than 5MB" }))
        return
      }
      setImage(selectedImage)
      setErrors(prev => ({ ...prev, image: "" }))
    }
  }

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      await createResource({
        title: formData.title,
        category: formData.category as ResourceCategory,
        shortDescription: formData.shortDescription,
        longDescription: formData.longDescription || undefined,
        isActive: formData.isActive,
        file: file!,
        image: image || undefined,
      }).unwrap()

      // Success - close modal
      onClose()
    } catch (error: any) {
      console.error('Failed to create resource:', error)
      setErrors({ 
        submit: error?.data?.message || "Failed to create resource. Please try again." 
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-900">Add New Material</h2>
          <button 
            onClick={onClose} 
            className="cursor-pointer p-1 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isLoading}
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="E.g., Cognitive Behavioral Therapy Overview"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg border ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-teal-500`}
              disabled={isLoading}
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as ResourceCategory })}
              className={`w-full px-3 py-2 rounded-lg border ${
                errors.category ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-teal-500`}
              disabled={isLoading}
            >
              <option value="">Select Category</option>
              <option value={ResourceCategory.WORKSHEET}>Worksheet</option>
              <option value={ResourceCategory.PDF}>PDF</option>
              <option value={ResourceCategory.VIDEO}>Video</option>
              <option value={ResourceCategory.DOCUMENT}>Document</option>
              <option value={ResourceCategory.GUIDE}>Guide</option>
              <option value={ResourceCategory.EXERCISE}>Exercise</option>
              <option value={ResourceCategory.OTHER}>Other</option>
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Short Description <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Provide a brief description of the material..."
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              rows={2}
              className={`w-full px-3 py-2 rounded-lg border ${
                errors.shortDescription ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none`}
              disabled={isLoading}
            />
            {errors.shortDescription && <p className="text-red-500 text-xs mt-1">{errors.shortDescription}</p>}
          </div>

          {/* Long Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Long Description (Optional)
            </label>
            <textarea
              placeholder="Provide detailed information..."
              value={formData.longDescription}
              onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              disabled={isLoading}
            />
          </div>

          {/* Upload File */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload File <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                accept=".pdf,.doc,.docx,.mp4,.avi,.mov"
                disabled={isLoading}
              />
              <label
                htmlFor="file-upload"
                className={`cursor-pointer w-full px-3 py-2 rounded-lg border ${
                  errors.file ? 'border-red-500' : 'border-gray-300'
                } text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Upload className="h-4 w-4" />
                {file ? file.name : 'Choose File to Upload'}
              </label>
            </div>
            {errors.file && <p className="text-red-500 text-xs mt-1">{errors.file}</p>}
            {file && (
              <p className="text-xs text-gray-600 mt-1">
                Size: {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            )}
          </div>

          {/* Upload Thumbnail Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thumbnail Image (Optional)
            </label>
            <div className="relative">
              <input
                type="file"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
                accept="image/*"
                disabled={isLoading}
              />
              <label
                htmlFor="image-upload"
                className={`cursor-pointer w-full px-3 py-2 rounded-lg border ${
                  errors.image ? 'border-red-500' : 'border-gray-300'
                } text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Upload className="h-4 w-4" />
                {image ? image.name : 'Choose Thumbnail Image'}
              </label>
            </div>
            {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
            {image && (
              <div className="mt-2">
                <img 
                  src={URL.createObjectURL(image)} 
                  alt="Preview" 
                  className="w-full h-32 object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={formData.isActive ? 'Active' : 'Inactive'}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'Active' })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              disabled={isLoading}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="cursor-pointer flex-1 px-4 py-2 rounded-lg bg-teal-500 text-white font-medium hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Save & Publish'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}