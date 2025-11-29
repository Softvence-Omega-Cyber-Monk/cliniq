import React from 'react';
import SectionHeader from './SectionHeader';
import PlanCard from './PlanCard';
import { PlanCardProps } from './types';

const BillingAndSubscription: React.FC = () => {
  const plans: PlanCardProps[] = [
    {
      title: 'Basic',
      price: 29,
      description: 'Perfect for starting your practice',
      isPopular: false,
      features: [
        { text: 'Up to 15 Clients', isIncluded: true },
        { text: 'Standard scheduling', isIncluded: true },
        { text: 'Basic reporting', isIncluded: true },
        { text: 'Email support', isIncluded: true },
        { text: 'Customizable intake forms', isIncluded: false },
        { text: 'Full analytics & reports', isIncluded: false },
        { text: 'Dedicated account manager', isIncluded: false },
        { text: 'Priority support', isIncluded: false },
      ],
      buttonText: 'Downgrade',
      buttonColor: 'downgrade',
    },
    {
      title: 'Professional',
      price: 49,
      description: 'The standard choice for growing solo practices.',
      isPopular: true,
      features: [
        { text: 'Up to 50 Clients', isIncluded: true },
        { text: 'All basic features', isIncluded: true },
        { text: 'Customizable intake forms', isIncluded: true },
        { text: 'Full analytics & reports', isIncluded: true },
        { text: 'Dedicated account manager', isIncluded: false },
        { text: 'Priority support', isIncluded: false },
      ],
      buttonText: 'Current Plan',
      buttonColor: 'current',
    },
    {
      title: 'Premium',
      price: 79,
      description: 'Best for established practices and small teams.',
      isPopular: false,
      features: [
        { text: 'Unlimited Clients', isIncluded: true },
        { text: 'All Professional features', isIncluded: true },
        { text: 'AI-powered insights', isIncluded: true },
        { text: 'Dedicated account manager', isIncluded: true },
        { text: 'Priority support', isIncluded: true },
      ],
      buttonText: 'Upgrade',
      buttonColor: 'upgrade',
    },
  ];

  return (
    <div className="p-8 bg-white rounded-xl shadow-sm mb-8">
      <SectionHeader
        title="Billing & Subscription"
        subtitle="View and manage your current billing cycle and plan."
      />

      {/* Current Plan Banner */}
      {/*  */}
    </div>
  );
};

export default BillingAndSubscription;
