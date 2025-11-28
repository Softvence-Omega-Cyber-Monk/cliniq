import React, { useState } from "react";
import { Invoice, Notification } from "./BillingType";
import { CheckIcon, DownloadIcon, EyeIcon, InfoIcon, PencilIcon } from "./BillingIcons";
import { invoices, notifications,  } from "./BillingMockData";



const App: React.FC = () => {
  const [currentInvoices] = useState<Invoice[]>(invoices);
  const [currentNotifications, setNotifications] =
    useState<Notification[]>(notifications);
    

  // Helper to determine status badge colors
  const getStatusBadge = (status: Invoice["status"]) => {
    let classes = "px-3 py-1 text-xs font-semibold rounded-full w-fit";
    switch (status) {
      case "Paid":
        classes += " bg-green-100 text-green-700";
        break;
      case "Processing":
        classes += " bg-yellow-100 text-yellow-700";
        break;
      case "Failed":
        classes += " bg-red-100 text-red-700";
        break;
    }
    return <span className={classes}>{status}</span>;
  };

  const handleToggle = (index: number) => {
    setNotifications((prev) =>
      prev.map((n, i) => (i === index ? { ...n, enabled: !n.enabled } : n))
    );
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 ">
      <main className=" space-y-8">
        {/* HEADER */}
        <header className="mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-wide">
            BILLING & SUBSCRIPTION
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your practice's subscription plan and billing information
          </p>
        </header>

        {/* TOP SECTION: Subscription and Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Current Subscription Card (Left) */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Current Subscription
            </h2>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
              <div className="flex flex-col mb-4 sm:mb-0">
                <p className="text-xl font-bold text-gray-900">
                  Professional Plan
                </p>
                <p className="text-4xl font-extrabold text-teal-500 mt-2">
                  $149
                  <span className="text-base font-medium text-gray-500">
                    / Month
                  </span>
                </p>
              </div>

              <div className="p-4 bg-gray-100 rounded-lg text-sm w-full sm:max-w-xs sm:ml-4 flex flex-col justify-center border border-gray-200">
                <p className="text-gray-500 mb-1">Next Billing Date</p>
                <p className="font-semibold text-gray-800">November 10, 2025</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Auto-renewal enabled
                </p>

                <div className="flex space-x-2 mt-4 text-xs font-semibold">
                  <button className="flex-1 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                    Upgrade Plan
                  </button>
                  <button className="flex-1 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
                    Downgrade Plan
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-y-2 mb-6">
              {[
                "Up to 10 therapists",
                "Unlimited sessions",
                "500GB storage",
                "Advanced analytics",
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center text-sm text-gray-600"
                >
                  <CheckIcon />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {/* Redundant buttons removed to match image logic (buttons are in next billing block in image) */}
          </div>

          {/* Billing Summary Card (Right) */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Billing Summary
              </h2>

              <div className="space-y-3 text-gray-700">
                <div className="flex justify-between">
                  <span>Monthly Subscription</span>
                  <span className="font-semibold">$149</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span className="font-semibold">$17</span>
                </div>
                <div className="border-t border-gray-200 pt-4 mt-3 flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>$166</span>
                </div>
              </div>
            </div>

            <button className="mt-8 w-full py-3 bg-blue-100 text-blue-700 font-semibold rounded-lg flex items-center justify-center hover:bg-blue-200 transition-colors">
              <InfoIcon size={18} className="mr-2" />
              Next Charge in 10 days
            </button>
          </div>
        </div>

        {/* MIDDLE SECTION: Payment Methods and Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 pt-4">
          {/* Payment Methods Card (Left) */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Payment Methods
              </h2>
              <button className="text-teal-500 text-sm font-medium hover:text-teal-600 transition-colors">
                Add New +
              </button>
            </div>

            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-xl hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center">
                    {/* Card Icon Placeholder */}
                    <div className="w-10 h-6 visa-bg rounded-md flex items-center justify-center text-xs text-white font-bold mr-3 shadow-md">
                      {method.type.toUpperCase().substring(0, 4)}
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-gray-800">
                        XXXX XXXX {method.lastFour}
                      </p>
                      <p className="text-xs text-gray-500">
                        expires {method.expiry}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {method.isDefault && (
                      <span className="text-xs font-semibold text-teal-600 px-3 py-1 rounded-full">
                        Default
                      </span>
                    )}
                    <button className="text-blue-500 hover:text-blue-700 p-1">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Billing Notifications Card (Right) */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Billing Notifications
            </h2>

            <div className="space-y-4">
              {currentNotifications.map((notification, index) => (
                <div
                  key={index}
                  className="flex justify-between items-start pb-2"
                >
                  <div className="pr-4">
                    <p className="text-sm font-medium text-gray-800">
                      {notification.title}
                    </p>
                    <p className="text-xs text-gray-500">{notification.desc}</p>
                  </div>

                  {/* Custom Toggle Switch */}
                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 mt-1">
                    <input
                      type="checkbox"
                      checked={notification.enabled}
                      onChange={() => handleToggle(index)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COMPARE PLANS SECTION */}
        <div className="pt-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">
            Compare Plans
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <PlanCard key={index} plan={plan} />
            ))}
          </div>
        </div>

        {/* INVOICE HISTORY SECTION */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Invoice History
            </h2>
            <button className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center">
              <DownloadIcon />
              Export All
            </button>
          </div>

          {/* Invoice Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="text-left text-sm font-medium text-gray-500">
                  <th className="py-3 pr-4 whitespace-nowrap w-2/5 md:w-1/4">
                    Invoice
                  </th>
                  <th className="py-3 pr-4 whitespace-nowrap">Date</th>
                  <th className="py-3 pr-4 whitespace-nowrap">Amount</th>
                  <th className="py-3 pr-4 whitespace-nowrap w-1/6">Status</th>
                  <th className="py-3 pl-4 w-[80px] text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {currentInvoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 pr-4 font-medium text-gray-900 whitespace-nowrap">
                      Invoice #{invoice.id}
                    </td>
                    <td className="py-3 pr-4 whitespace-nowrap">
                      {invoice.date}
                    </td>
                    <td className="py-3 pr-4 whitespace-nowrap">
                      ${invoice.amount.toFixed(0)}
                    </td>
                    <td className="py-3 pr-4">
                      {getStatusBadge(invoice.status)}
                    </td>
                    <td className="py-3 pl-4 text-center">
                      <button className="text-blue-500 hover:text-blue-700 p-1">
                        <EyeIcon className="mx-auto" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* NEED HELP? SECTION */}
        <div className="text-center py-12">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Need Help?
          </h2>
          <p className="text-sm text-gray-500 mb-2">Contact Billing Support</p>
          <p className="text-xs text-gray-500 mb-6 max-w-sm mx-auto">
            Get help with billing questions on subscription issues
          </p>
          <button className="px-6 py-3 bg-teal-500 text-white font-semibold rounded-xl hover:bg-teal-600 transition-colors shadow-lg shadow-teal-500/30">
            Contact Support
          </button>
        </div>
      </main>
    </div>
  );
};

export default App;
