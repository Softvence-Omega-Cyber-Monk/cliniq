import { useState } from "react"
import { X, Plus, Trash2, Loader2 } from "lucide-react"
import { useCreateSubscriptionPlanMutation } from "@/store/api/SubscriptionsPlansApi"

interface AddPlanModalProps {
  onClose: () => void
}

export default function AddPlanModal({ onClose }: AddPlanModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    billingCycle: "MONTHLY" as "MONTHLY" | "YEARLY",
    role: "CLINIC" as "CLINIC" | "INDIVIDUAL_THERAPIST",
    maxClients: "",
    maxTherapists: "",
    isActive: true,
  })
  const [features, setFeatures] = useState<string[]>([""])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [createPlan, { isLoading }] = useCreateSubscriptionPlanMutation()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Plan name is required"
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = "Valid price is required"
    }

    const validFeatures = features.filter(f => f.trim())
    if (validFeatures.length === 0) {
      newErrors.features = "At least one feature is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddFeature = () => {
    setFeatures([...features, ""])
  }

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index))
  }

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...features]
    newFeatures[index] = value
    setFeatures(newFeatures)
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    const validFeatures = features.filter(f => f.trim())

    try {
      await createPlan({
        name: formData.name,
        price: parseFloat(formData.price),
        billingCycle: formData.billingCycle,
        features: validFeatures,
        role: formData.role,
        maxClients: formData.maxClients ? parseInt(formData.maxClients) : undefined,
        maxTherapists: formData.maxTherapists ? parseInt(formData.maxTherapists) : undefined,
        isActive: formData.isActive,
      }).unwrap()

      onClose()
    } catch (error: any) {
      console.error('Failed to create plan:', error)
      setErrors({
        submit: error?.data?.message || "Failed to create plan. Please try again."
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-900">Add New Subscription Plan</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isLoading}
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Plan Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Plan Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Individual Plan"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-teal-500`}
              disabled={isLoading}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Price and Billing Cycle */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="29"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border ${errors.price ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-teal-500`}
                disabled={isLoading}
                min="0"
                step="0.01"
              />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Billing Cycle
              </label>
              <select
                value={formData.billingCycle}
                onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value as "MONTHLY" | "YEARLY" })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                disabled={isLoading}
              >
                <option value="MONTHLY">Monthly</option>
                <option value="YEARLY">Yearly</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as "CLINIC" | "INDIVIDUAL_THERAPIST" })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                disabled={isLoading}
              >
                <option value="CLINIC">Clinic</option>
                <option value="INDIVIDUAL_THERAPIST">Individual Therapist</option>
              </select>
            </div>
          </div>

          {/* Max Clients and Therapists */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Clients (Optional)
              </label>
              <input
                type="number"
                placeholder="e.g., 50"
                value={formData.maxClients}
                onChange={(e) => setFormData({ ...formData, maxClients: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                disabled={isLoading}
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Therapists (Optional)
              </label>
              <input
                type="number"
                placeholder="e.g., 10"
                value={formData.maxTherapists}
                onChange={(e) => setFormData({ ...formData, maxTherapists: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                disabled={isLoading}
                min="0"
              />
            </div>
          </div>

          {/* Features */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Features <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={handleAddFeature}
                className="text-sm text-teal-600 hover:text-teal-700 flex items-center gap-1"
                disabled={isLoading}
              >
                <Plus className="h-4 w-4" />
                Add Feature
              </button>
            </div>
            <div className="space-y-2">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g., Up to 10 clients"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    disabled={isLoading}
                  />
                  {features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {errors.features && <p className="text-red-500 text-xs mt-1">{errors.features}</p>}
          </div>

          {/* Active Status */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Active Status</p>
              <p className="text-sm text-gray-600">Make this plan available immediately</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="sr-only peer"
                disabled={isLoading}
              />
              <div className="w-11 h-6 bg-gray-200 peer-checked:bg-teal-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
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
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 rounded-lg bg-teal-500 text-white font-medium hover:bg-teal-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Plan'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}