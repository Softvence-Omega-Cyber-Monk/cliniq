import React, { useState } from 'react';
import { ChevronDown, Mail, Phone, MessageSquare, Search, Lock, RefreshCcw, Bug, Link, ChevronUp } from 'lucide-react'; // CheckCircle removed

// --- Data Structures ---

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

interface Guide {
  icon: React.ReactNode;
  title: string;
}

// --- Mock Data ---

const faqData: FAQ[] = [
  {
    id: 1,
    question: 'How do I add a new therapist to my private practice?',
    answer: 'To add a new therapist, go to the Therapists section in the Private Practice Dashboard, click on the Add New Therapist button, and fill out their details. Once added, you can assign clients to them.',
  },
  {
    id: 2,
    question: "Can I change a therapist's role or permissions?",
    answer: 'Yes, role and permission management is available in the Therapist Settings page. You can customize access levels for patient data, billing information, and practice settings.',
  },
  {
    id: 3,
    question: 'How do I manage patient data for my therapists?',
    answer: 'Patient data access is centrally managed through the Practice Owner account. You can configure data visibility and editing rights per therapist or per patient file.',
  },
  {
    id: 4,
    question: "How do I update my practice's billing information?",
    answer: 'Billing details can be updated securely in the Subscription & Billing tab located in your main settings. Changes take effect immediately for the next billing cycle.',
  },
  {
    id: 5,
    question: 'Can I upgrade or downgrade my subscription plan?',
    answer: 'Subscription changes can be initiated at any time from the Billing page. Upgrades are effective immediately, and downgrades take effect at the end of the current billing period.',
  },
];

const guideData: Guide[] = [
  { icon: <Lock className="w-4 h-4 text-red-500" />, title: 'Login Issues Resolution' },
  { icon: <RefreshCcw className="w-4 h-4 text-green-500" />, title: 'Session Syncing Problems' },
  { icon: <Bug className="w-4 h-4 text-orange-500" />, title: 'Platform Bug Reporting' },
  { icon: <Link className="w-4 h-4 text-blue-500" />, title: 'Connection Issues' },
];

// --- Components ---

const FAQItem: React.FC<{ faq: FAQ; isOpen: boolean; toggle: () => void }> = ({ faq, isOpen, toggle }) => (
  <div className="border-b border-gray-200">
    <button
      className="flex justify-between items-center w-full py-4 text-left font-semibold text-gray-800 transition duration-150 ease-in-out hover:bg-gray-50 px-0"
      onClick={toggle}
      aria-expanded={isOpen}
      aria-controls={`faq-answer-${faq.id}`}
    >
      <span>{faq.question}</span>
      <span className="flex items-center">
        {/* Checkmark icon removed as requested */}
        
        {/* Circle container for the Chevron icons */}
        <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#3FDCBF] text-white ml-3">
          {isOpen ? (
            <ChevronUp className="w-4 h-4 transition-transform" />
          ) : (
            <ChevronDown className="w-4 h-4 transition-transform" />
          )}
        </div>
      </span>
    </button>
    <div
      id={`faq-answer-${faq.id}`}
      className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0'}`}
    >
      <p className="text-gray-600 pl-0 pr-8 text-sm">{faq.answer}</p>
    </div>
  </div>
);

const FAQSection: React.FC = () => {
  const [openId, setOpenId] = useState<number | null>(faqData[0].id); // Open the first one by default

  const toggleItem = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="p-0">
      {faqData.map((faq) => (
        <FAQItem
          key={faq.id}
          faq={faq}
          isOpen={openId === faq.id}
          toggle={() => toggleItem(faq.id)}
        />
      ))}
    </div>
  );
};

const TroubleshootingGuides: React.FC = () => {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Troubleshooting Guides</h3>
      
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search troubleshooting guides..."
          // Adjusted padding to 'pl-4 pr-10' to make room for the icon on the right
          className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 text-sm shadow-sm transition"
        />
        {/* Moved Search icon to the right side */}
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      </div>

      <div className="space-y-3">
        {guideData.map((guide, index) => (
          <div key={index} className="flex items-center text-gray-600 text-sm hover:text-emerald-600 cursor-pointer transition">
            <span className="mr-3">{guide.icon}</span>
            <span className="underline-offset-4 hover:underline">{guide.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const TicketSubmission: React.FC = () => {
  const [subject, setSubject] = useState('');
  const [therapist, setTherapist] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ subject, therapist, description });
    // In a real app, you would send this to an API
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Submit Support Ticket</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
          <input
            id="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Brief description of the issue"
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm shadow-sm focus:ring-emerald-500 focus:border-emerald-500 transition"
          />
        </div>

        <div>
          <label htmlFor="therapist" className="block text-sm font-medium text-gray-700">Therapist (Optional)</label>
          <select
            id="therapist"
            value={therapist}
            onChange={(e) => setTherapist(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-gray-300 bg-white rounded-lg text-sm shadow-sm focus:ring-emerald-500 focus:border-emerald-500 appearance-none cursor-pointer transition"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%236B7280'%3E%3Cpath fill-rule='evenodd' d='M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z' clip-rule='evenodd' /%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.5em 1.5em' }}
          >
            <option value="">Select therapist</option>
            <option value="jane-doe">Jane Doe</option>
            <option value="john-smith">John Smith</option>
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detailed description of the issue"
            rows={4}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm shadow-sm focus:ring-emerald-500 focus:border-emerald-500 resize-none transition"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#298CDF] text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-150 ease-in-out shadow-md"
        >
          Submit Ticket
        </button>
      </form>
    </div>
  );
};

const ContactSupport: React.FC = () => {
  return (
    <div className="mt-8 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Contact Support</h2>
      
      <div className="space-y-4">
        <div className="flex items-center text-gray-700">
          <Mail className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0" />
          <a href="mailto:support@practiceadmin.com" className="text-sm font-medium hover:text-blue-600 transition">
            support@practiceadmin.com
          </a>
        </div>
        
        <div className="flex items-center text-gray-700">
          <Phone className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0" />
          <span className="text-sm font-medium">1-800-SUPPORT</span>
        </div>

        <div className="flex items-center text-gray-700">
          <MessageSquare className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0" />
          <span className="text-sm font-medium">Live Chat Available</span>
        </div>
      </div>
    </div>
  );
};


export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans p-4 sm:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-10 pt-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">SUPPORT CENTER</h1>
          <p className="text-gray-600">Find answers, troubleshoot issues, and get help when you need it</p>
        </header>

        {/* Content Grid */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-10">
          
          {/* Left Column (FAQ & Guides) */}
          <div className="lg:col-span-2 space-y-8 bg-white p-6 sm:p-8 rounded-xl shadow-md border border-gray-100">
            
            <section aria-labelledby="faq-title">
              <h2 id="faq-title" className="text-xl font-bold text-gray-800 mb-4 hidden">Frequently Asked Questions</h2>
              <FAQSection />
            </section>

            <section aria-labelledby="troubleshooting-title">
              <TroubleshootingGuides />
            </section>
          </div>

          {/* Right Column (Ticket & Contact) */}
          <div className="lg:col-span-1 mt-8 lg:mt-0 space-y-8">
            <TicketSubmission />
            <ContactSupport />
          </div>
        </div>
      </div>
    </div>
  );
}