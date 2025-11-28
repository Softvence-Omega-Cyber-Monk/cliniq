"use client"

import { useState } from "react"
import { Trash2, Plus, Edit, Loader2, AlertCircle } from "lucide-react"
import { useGetAllSubscriptionPlansQuery, useDeleteSubscriptionPlanMutation } from "@/store/api/SubscriptionsPlansApi"
import AddPlanModal from "./AddPlanModal"
import EditPlanModal from "./EditPlanModal"

export default function Settings() {
  const [twoFactorAuth, setTwoFactorAuth] = useState(true)
  const [showAddPlanModal, setShowAddPlanModal] = useState(false)
  const [showEditPlanModal, setShowEditPlanModal] = useState(false)
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)

  // Fetch subscription plans
  const { data: plans, isLoading: plansLoading, error: plansError } = useGetAllSubscriptionPlansQuery()

  // Delete plan mutation
  const [deletePlan, { isLoading: deleting }] = useDeleteSubscriptionPlanMutation()

  const loginHistory = [
    { user: "Admin User", lastLogin: "2 hours ago", status: "Active" },
    { user: "Dr. Sarah Mitchell", lastLogin: "5 hours ago", status: "Active" },
    { user: "Dr. James Cooper", lastLogin: "1 day ago", status: "Inactive" },
  ]

  const handleEditPlan = (planId: string) => {
    setSelectedPlanId(planId)
    setShowEditPlanModal(true)
  }

  const handleDeletePlan = async (planId: string) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      try {
        await deletePlan(planId).unwrap()
      } catch (error) {
        console.error('Failed to delete plan:', error)
        alert('Failed to delete plan. Please try again.')
      }
    }
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Platform Settings</h1>
        <p className="text-gray-600">Configure system preferences, security, and platform features</p>
      </div>
      {/* Security Settings */}
      <div className="rounded-lg bg-white p-6 space-y-6 border border-gray-200 w-full">
        <h2 className="text-lg font-semibold text-gray-900">Security Settings</h2>

        {/* 2FA */}
        <div className="flex items-center justify-between pb-6 border-b border-gray-200">
          <div>
            <p className="font-medium text-gray-900">Two-Factor Authentication (2FA)</p>
            <p className="text-sm text-gray-600">Require 2FA for all admin and therapist accounts</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={twoFactorAuth}
              onChange={(e) => setTwoFactorAuth(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-checked:bg-teal-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
          </label>
        </div>

        {/* Password Policies */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Password Policies</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Minimum Password Length</label>
              <select className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500">
                <option>8 characters</option>
                <option>12 characters</option>
                <option>16 characters</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Password Expiration</label>
              <select className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500">
                <option>30 days</option>
                <option>60 days</option>
                <option>90 days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Login History */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Login History</h3>
          <div className="space-y-2">
            {loginHistory.map((entry, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{entry.user}</p>
                  <p className="text-sm text-gray-600">Last login: {entry.lastLogin}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${entry.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                    }`}
                >
                  {entry.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="space-y-4 bg-white border border-gray-200 w-full px-8 py-5 rounded-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Subscription Plans</h2>
          <button
            onClick={() => setShowAddPlanModal(true)}
            className="px-4 py-2 rounded-lg bg-teal-500 text-white font-medium hover:bg-teal-600 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New Plan
          </button>
        </div>

        {plansLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
          </div>
        ) : plansError ? (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600">Failed to load subscription plans</p>
          </div>
        ) : plans && plans?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans?.map((plan) => (
              <div key={plan.id} className="rounded-lg border border-gray-200 bg-white p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                      <span className="text-sm text-gray-600">/{plan?.billingCycle?.toLowerCase()}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${plan.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                    {plan.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <ul className="space-y-2 mb-6">
                  {Array.isArray(plan?.features) && plan.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-start gap-2 text-sm text-gray-900">
                      <span className="text-teal-500 mt-0.5">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                  {plan.maxClients && (
                    <li className="flex items-start gap-2 text-sm text-gray-900">
                      <span className="text-teal-500 mt-0.5">✓</span>
                      <span>Up to {plan.maxClients} clients</span>
                    </li>
                  )}
                  {plan.maxTherapists && (
                    <li className="flex items-start gap-2 text-sm text-gray-900">
                      <span className="text-teal-500 mt-0.5">✓</span>
                      <span>Up to {plan.maxTherapists} therapists</span>
                    </li>
                  )}
                </ul>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditPlan(plan.id)}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-gray-900 font-medium hover:bg-gray-50 flex items-center justify-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeletePlan(plan.id)}
                    disabled={deleting}
                    className="px-4 py-2 rounded-lg border border-red-200 text-red-600 font-medium hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No subscription plans found</p>
          </div>
        )}
      </div>

      {/* Change Password */}
      <div className="rounded-lg bg-white p-6 space-y-4 border border-gray-200 w-full">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Current Password</label>
            <input
              type="password"
              placeholder="••••••••••••"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">New Password</label>
              <input
                type="password"
                placeholder="••••••••••••"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Re-type New Password</label>
              <input
                type="password"
                placeholder="••••••••••••"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
        </div>
        <button className="px-6 py-2 rounded-lg bg-teal-500 text-white font-medium hover:bg-teal-600">
          Save changes
        </button>
      </div>
      {/* Modals */}
      {showAddPlanModal && <AddPlanModal onClose={() => setShowAddPlanModal(false)} />}
      {showEditPlanModal && selectedPlanId && (
        <EditPlanModal
          planId={selectedPlanId}
          onClose={() => {
            setShowEditPlanModal(false)
            setSelectedPlanId(null)
          }}
        />
      )}
    </div>
  )
}