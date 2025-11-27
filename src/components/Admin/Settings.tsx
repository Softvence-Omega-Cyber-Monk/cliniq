"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"

interface Category {
  id: string
  name: string
  sessions: number
}

export default function Settings() {
  const [categories, setCategories] = useState<Category[]>([
    { id: "1", name: "Individual Therapy", sessions: 342 },
    { id: "2", name: "Group Therapy", sessions: 128 },
    { id: "3", name: "Cognitive Behavioral Therapy (CBT)", sessions: 156 },
    { id: "4", name: "Dialectical Behavior Therapy (DBT)", sessions: 89 },
  ])

  const [emailNotifications, setEmailNotifications] = useState(true)
  const [sessionReminders, setSessionReminders] = useState(true)
  const [crisisAlerts, setCrisisAlerts] = useState(true)
  const [twoFactorAuth, setTwoFactorAuth] = useState(true)

  const loginHistory = [
    { user: "Admin User", lastLogin: "2 hours ago", status: "Active" },
    { user: "Dr. Sarah Mitchell", lastLogin: "5 hours ago", status: "Active" },
    { user: "Dr. James Cooper", lastLogin: "1 day ago", status: "Inactive" },
  ]

  const plans = [
    {
      name: "Individual Plan",
      price: 29,
      features: ["Up to 10 clients", "Session management", "Basic reporting", "Email support"],
    },
    {
      name: "Private Practice",
      price: 49,
      features: [
        "Up to 50 clients",
        "Advanced session management",
        "Full analytics & reports",
        "Crisis alert system",
        "Priority support",
      ],
    },
    {
      name: "Private Practice",
      price: 79,
      features: [
        "Unlimited clients",
        "All Professional features",
        "AI-powered insights",
        "Custom integrations",
        "Dedicated support",
      ],
    },
  ]

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Platform Settings</h1>
        <p className="text-muted-foreground">Configure system preferences, security, and platform features</p>
      </div>

      {/* System Configuration */}
      <div className="rounded-lg w-[82vw] bg-card p-6 space-y-4 bg-white border border-gray-200">
        <h2 className="text-lg font-semibold text-foreground">System Configuration</h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Time Zone</label>
            <select className="w-full rounded-lg border border-gray-200 bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-teal-500">
              <option>Eastern Time (ET)</option>
              <option>Central Time (CT)</option>
              <option>Mountain Time (MT)</option>
              <option>Pacific Time (PT)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Platform Language</label>
            <select className="w-full rounded-lg border border-gray-200 bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-teal-500">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="rounded-lg bg-card p-6 space-y-4 bg-white border border-gray-200 w-[82vw]">
        <h2 className="text-lg font-semibold text-foreground">Notification Preferences</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Email Notifications</p>
              <p className="text-sm text-muted-foreground">Receive email notifications for important events</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-muted peer-checked:bg-teal-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Session Reminders</p>
              <p className="text-sm text-muted-foreground">Send automated reminders for upcoming sessions</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={sessionReminders}
                onChange={(e) => setSessionReminders(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-muted peer-checked:bg-teal-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Crisis Alerts</p>
              <p className="text-sm text-muted-foreground">Immediate notifications for crisis situations</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={crisisAlerts}
                onChange={(e) => setCrisisAlerts(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-muted peer-checked:bg-teal-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Session Categories */}
      <div className="rounded-lg bg-card p-6 space-y-4 bg-white border border-gray-200 w-[82vw]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Session Categories</h2>
            <p className="text-sm text-muted-foreground">Current Categories ({categories.length})</p>
          </div>
          <button className="px-4 py-2 rounded-lg bg-teal-500 text-white font-medium hover:bg-teal-600">
            + Add Category
          </button>
        </div>
        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="font-medium text-foreground">{cat.name}</p>
                <p className="text-sm text-muted-foreground">{cat.sessions} sessions assigned</p>
              </div>
              <button className="text-muted-foreground hover:text-red-500">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground italic">
          Note: Categories with assigned sessions cannot be deleted. Please reassign sessions before removing a
          category.
        </p>
      </div>

      {/* Security Settings */}
      <div className="rounded-lg border border-border bg-card p-6 space-y-6 bg-white border border-gray-200 w-[82vw]">
        <h2 className="text-lg font-semibold text-foreground">Security Settings</h2>

        {/* 2FA */}
        <div className="flex items-center justify-between pb-6 border-b border-border">
          <div>
            <p className="font-medium text-foreground">Two-Factor Authentication (2FA)</p>
            <p className="text-sm text-muted-foreground">Require 2FA for all admin and therapist accounts</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={twoFactorAuth}
              onChange={(e) => setTwoFactorAuth(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-muted peer-checked:bg-teal-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
          </label>
        </div>

        {/* Password Policies */}
        <div className="space-y-4">
          <h3 className="font-medium text-foreground">Password Policies</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Minimum Password Length</label>
              <select className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-teal-500">
                <option>8 characters</option>
                <option>12 characters</option>
                <option>16 characters</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Password Expiration</label>
              <select className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-teal-500">
                <option>30 days</option>
                <option>60 days</option>
                <option>90 days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Login History */}
        <div className="space-y-4">
          <h3 className="font-medium text-foreground">Login History</h3>
          <div className="space-y-2">
            {loginHistory.map((entry, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium text-foreground">{entry.user}</p>
                  <p className="text-sm text-muted-foreground">Last login: {entry.lastLogin}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    entry.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
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
      <div className="space-y-4 bg-white border border-gray-200 w-[82vw] px-8 py-5">
        <h2 className="text-lg font-semibold text-foreground">Subscription Plans</h2>
        <div className="grid grid-cols-3 gap-6">
          {plans.map((plan, idx) => (
            <div key={idx} className="rounded-lg border border-border bg-card p-6 bg-white border border-gray-200">
              <h3 className="text-lg font-semibold text-foreground mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold text-foreground">${plan.price}</span>
                <span className="text-sm text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, fidx) => (
                  <li key={fidx} className="flex items-center gap-2 text-sm text-foreground">
                    <span className="text-teal-500">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="w-full px-4 py-2 rounded-lg border border-border text-foreground font-medium hover:bg-muted">
                Edit Plan
              </button>
            </div>
          ))}
        </div>
        <button className="mt-4 px-6 py-2 rounded-lg bg-teal-500 text-white font-medium hover:bg-teal-600">
          Add New Plan
        </button>
      </div>

      {/* Change Password */}
      <div className="rounded-lg border border-border bg-card p-6 space-y-4 bg-white border border-gray-200 w-[82vw]">
        <h2 className="text-lg font-semibold text-foreground mb-4">Change Password</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Current Password</label>
            <input
              type="password"
              placeholder="••••••••••••"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white border border-gray-200"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">New Password</label>
              <input
                type="password"
                placeholder="••••••••••••"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white border border-gray-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Re-type New Password</label>
              <input
                type="password"
                placeholder="••••••••••••"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white border border-gray-200"
              />
            </div>
          </div>
        </div>
        <button className="px-6 py-2 rounded-lg bg-teal-500 text-white font-medium hover:bg-teal-600">
          Save changes
        </button>
      </div>

      {/* Contact Information */}
      <div className="rounded-lg border border-border bg-card p-6 space-y-4 bg-white border border-gray-200 w-[82vw]">
        <h2 className="text-lg font-semibold text-foreground">Contact Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email</label>
            <input
              type="email"
              defaultValue="abc@gmail.com"
              className="border border-gray-200 w-full rounded-lg bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
            <input
              type="tel"
              defaultValue="+123 3435 565 558"
              className="border border-gray-200 w-full rounded-lg bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
        <button className="px-6 py-2 rounded-lg bg-teal-500 text-white font-medium hover:bg-teal-600">
          Save changes
        </button>
      </div>

      {/* Platform Branding */}
      <div className="rounded-lg bg-card p-6 space-y-4 bg-white border border-gray-200 w-[82vw]">
        <h2 className="text-lg font-semibold text-foreground">Platform Branding</h2>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Platform Name</label>
          <input
            type="text"
            defaultValue="CLINIQ"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <button className="px-6 py-2 rounded-lg bg-teal-500 text-white font-medium hover:bg-teal-600">
          Upload Logo
        </button>
        <p className="text-xs text-muted-foreground">Recommended: PNG or SVG max 2MB</p>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="px-6 py-2 rounded-lg bg-teal-500 text-white font-medium hover:bg-teal-600">
          Save changes
        </button>
      </div>
    </div>
  )
}
