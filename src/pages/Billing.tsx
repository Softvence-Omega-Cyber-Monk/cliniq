import React, { useState } from "react";

// --- TYPESCRIPT INTERFACES ---

interface PaymentMethod {
  id: number;
  type: "Visa" | "MasterCard";
  lastFour: string;
  expiry: string;
  isDefault: boolean;
}

interface Plan {
  name: string;
  tagline: string;
  price: number;
  period: string;
  features: string[];
  isCurrent: boolean;
  buttonText: string;
  isPopular: boolean;
}

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: "Paid" | "Processing" | "Failed";
}

interface Notification {
  title: string;
  desc: string;
  enabled: boolean;
}

// --- DUMMY DATA ---

const paymentMethods: PaymentMethod[] = [
  { id: 1, type: "Visa", lastFour: "1234", expiry: "12/26", isDefault: true },
  { id: 2, type: "Visa", lastFour: "0011", expiry: "10/26", isDefault: false },
];

const plans: Plan[] = [
  {
    name: "Individual Plan",
    tagline: "Perfect for starting your practice",
    price: 29,
    period: "/month",
    features: [
      "Up to 15 clients",
      "Session management",
      "Basic reporting",
      "Email support",
    ],
    isCurrent: false,
    buttonText: "Downgrade",
    isPopular: false,
  },
  {
    name: "Private Practice",
    tagline: "For growing solo practices",
    price: 49,
    period: "/month",
    features: [
      "Up to 50 clients",
      "Advanced session tools",
      "Full analytics & reports",
      "Crisis alert system",
      "Priority support",
    ],
    isCurrent: true,
    buttonText: "Current Plan",
    isPopular: true,
  },
  {
    name: "Private Practice",
    tagline: "For established practices",
    price: 79,
    period: "/month",
    features: [
      "Unlimited clients",
      "All Professional features",
      "AI-powered insights",
      "Custom integrations",
      "Dedicated support",
    ],
    isCurrent: false,
    buttonText: "Upgrade",
    isPopular: false,
  },
];

const invoices: Invoice[] = [
  { id: "001234", date: "12/05/23", amount: 256, status: "Paid" },
  { id: "001235", date: "04/11/22", amount: 234, status: "Paid" },
  { id: "001236", date: "19/08/21", amount: 894, status: "Paid" },
  { id: "001237", date: "27/03/20", amount: 894, status: "Paid" }, // Changed to paid for consistency with image
  { id: "001238", date: "30/09/19", amount: 894, status: "Paid" },
];

const notifications: Notification[] = [
  {
    title: "Payment reminders",
    desc: "Get notified if 7 days before payment",
    enabled: true,
  },
  {
    title: "Payment confirmations",
    desc: "Get notified upon successful payment",
    enabled: true,
  },
  {
    title: "Plan changes",
    desc: "Notifications for subscription updates",
    enabled: false,
  },
];

// --- ICONS (Simulated Lucide Icons for single-file self-containment) ---

const CheckIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-teal-500 mr-2 flex-shrink-0"
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const PencilIcon: React.FC<{ className?: string }> = ({
  className = "w-4 h-4",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    <path d="m15 5 4 4" />
  </svg>
);

const InfoIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 18,
  className = "",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
);

const DownloadIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="mr-1"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" x2="12" y1="15" y2="3" />
  </svg>
);

const EyeIcon: React.FC<{ className?: string }> = ({
  className = "w-4 h-4",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

// --- COMPONENTS ---

const PlanCard: React.FC<{ plan: Plan }> = ({ plan }) => {
  const isCurrent = plan.isCurrent;
  const cardClasses = isCurrent
    ? "border-2 border-teal-500 shadow-2xl shadow-teal-100/50"
    : "border border-gray-200 hover:shadow-lg transition-shadow";

  const buttonClasses = isCurrent
    ? "bg-gray-200 text-gray-700 cursor-default shadow-none"
    : "bg-teal-500 text-white hover:bg-teal-600 transition-colors shadow-lg shadow-teal-500/20";

  return (
    <div
      className={`p-6 rounded-2xl flex flex-col h-full bg-white ${cardClasses}`}
    >
      {plan.isPopular && (
        <div className="text-xs font-semibold text-teal-700 bg-teal-100 px-3 py-1 rounded-full w-fit mb-4 self-start">
          Current Plan
        </div>
      )}
      <h3 className="text-xl font-bold text-gray-800 mb-1">{plan.name}</h3>
      <p className="text-sm text-gray-500 mb-6">{plan.tagline}</p>

      <div className="flex items-baseline mb-6">
        <span className="text-4xl font-extrabold text-gray-900">
          ${plan.price}
        </span>
        <span className="text-base font-medium text-gray-500">
          {plan.period}
        </span>
      </div>

      <div className="space-y-3 flex-grow">
        {plan.features.map((feature, index) => (
          <div key={index} className="flex items-start text-sm text-gray-700">
            <CheckIcon />
            <span>{feature}</span>
          </div>
        ))}
      </div>

      <button
        className={`mt-6 w-full py-3 rounded-xl font-semibold text-base ${buttonClasses} transition-all duration-300`}
        disabled={isCurrent}
        onClick={() =>
          !isCurrent && console.log(`${plan.buttonText} ${plan.name}`)
        }
      >
        {plan.buttonText}
      </button>
    </div>
  );
};

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
