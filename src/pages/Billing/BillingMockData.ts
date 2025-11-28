import { Invoice, Notification, PaymentMethod, Plan } from "./BillingType";

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

export { paymentMethods, plans, invoices, notifications };