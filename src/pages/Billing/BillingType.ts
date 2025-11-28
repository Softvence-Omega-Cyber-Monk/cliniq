export interface PaymentMethod {
  id: number;
  type: "Visa" | "MasterCard";
  lastFour: string;
  expiry: string;
  isDefault: boolean;
}

export interface Plan {
  name: string;
  tagline: string;
  price: number;
  period: string;
  features: string[];
  isCurrent: boolean;
  buttonText: string;
  isPopular: boolean;
}

export interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: "Paid" | "Processing" | "Failed";
}

export interface Notification {
  title: string;
  desc: string;
  enabled: boolean;
}