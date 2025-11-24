
import React, { useState, useRef, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Role } from './types';
import { UserIcon, UsersIcon, ChevronDownIcon } from './Icons';
import { useRegisterClinicMutation } from '@/store/api/AuthApi';


interface SignUpFormProps {
  initialRole: Role;
  onSwitchToLogin: () => void;
}

type FormData = {
  fullName: string;
  privatePracticeName?: string;
  countryCode: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptPolicy: boolean;
};
const countries = [
  { name: "Afghanistan", code: "+93", flag: "🇦🇫" },
  { name: "Albania", code: "+355", flag: "🇦🇱" },
  { name: "Algeria", code: "+213", flag: "🇩🇿" },
  { name: "Andorra", code: "+376", flag: "🇦🇩" },
  { name: "Angola", code: "+244", flag: "🇦🇴" },
  { name: "Antigua and Barbuda", code: "+1-268", flag: "🇦🇬" },
  { name: "Argentina", code: "+54", flag: "🇦🇷" },
  { name: "Armenia", code: "+374", flag: "🇦🇲" },
  { name: "Australia", code: "+61", flag: "🇦🇺" },
  { name: "Austria", code: "+43", flag: "🇦🇹" },
  { name: "Azerbaijan", code: "+994", flag: "🇦🇿" },
  { name: "Bahamas", code: "+1-242", flag: "🇧🇸" },
  { name: "Bahrain", code: "+973", flag: "🇧🇭" },
  { name: "Bangladesh", code: "+880", flag: "🇧🇩" },
  { name: "Barbados", code: "+1-246", flag: "🇧🇧" },
  { name: "Belarus", code: "+375", flag: "🇧🇾" },
  { name: "Belgium", code: "+32", flag: "🇧🇪" },
  { name: "Belize", code: "+501", flag: "🇧🇿" },
  { name: "Benin", code: "+229", flag: "🇧🇯" },
  { name: "Bhutan", code: "+975", flag: "🇧🇹" },
  { name: "Bolivia", code: "+591", flag: "🇧🇴" },
  { name: "Bosnia and Herzegovina", code: "+387", flag: "🇧🇦" },
  { name: "Botswana", code: "+267", flag: "🇧🇼" },
  { name: "Brazil", code: "+55", flag: "🇧🇷" },
  { name: "Brunei", code: "+673", flag: "🇧🇳" },
  { name: "Bulgaria", code: "+359", flag: "🇧🇬" },
  { name: "Burkina Faso", code: "+226", flag: "🇧🇫" },
  { name: "Burundi", code: "+257", flag: "🇧🇮" },
  { name: "Cabo Verde", code: "+238", flag: "🇨🇻" },
  { name: "Cambodia", code: "+855", flag: "🇰🇭" },
  { name: "Cameroon", code: "+237", flag: "🇨🇲" },
  { name: "Canada", code: "+1", flag: "🇨🇦" },
  { name: "Central African Republic", code: "+236", flag: "🇨🇫" },
  { name: "Chad", code: "+235", flag: "🇹🇩" },
  { name: "Chile", code: "+56", flag: "🇨🇱" },
  { name: "China", code: "+86", flag: "🇨🇳" },
  { name: "Colombia", code: "+57", flag: "🇨🇴" },
  { name: "Comoros", code: "+269", flag: "🇰🇲" },
  { name: "Congo (Congo-Brazzaville)", code: "+242", flag: "🇨🇬" },
  { name: "Costa Rica", code: "+506", flag: "🇨🇷" },
  { name: "Croatia", code: "+385", flag: "🇭🇷" },
  { name: "Cuba", code: "+53", flag: "🇨🇺" },
  { name: "Cyprus", code: "+357", flag: "🇨🇾" },
  { name: "Czech Republic", code: "+420", flag: "🇨🇿" },
  { name: "Denmark", code: "+45", flag: "🇩🇰" },
  { name: "Djibouti", code: "+253", flag: "🇩🇯" },
  { name: "Dominica", code: "+1-767", flag: "🇩🇲" },
  { name: "Dominican Republic", code: "+1-809", flag: "🇩🇴" },
  { name: "Ecuador", code: "+593", flag: "🇪🇨" },
  { name: "Egypt", code: "+20", flag: "🇪🇬" },
  { name: "El Salvador", code: "+503", flag: "🇸🇻" },
  { name: "Equatorial Guinea", code: "+240", flag: "🇬🇶" },
  { name: "Eritrea", code: "+291", flag: "🇪🇷" },
  { name: "Estonia", code: "+372", flag: "🇪🇪" },
  { name: "Eswatini", code: "+268", flag: "🇸🇿" },
  { name: "Ethiopia", code: "+251", flag: "🇪🇹" },
  { name: "Fiji", code: "+679", flag: "🇫🇯" },
  { name: "Finland", code: "+358", flag: "🇫🇮" },
  { name: "France", code: "+33", flag: "🇫🇷" },
  { name: "Gabon", code: "+241", flag: "🇬🇦" },
  { name: "Gambia", code: "+220", flag: "🇬🇲" },
  { name: "Georgia", code: "+995", flag: "🇬🇪" },
  { name: "Germany", code: "+49", flag: "🇩🇪" },
  { name: "Ghana", code: "+233", flag: "🇬🇭" },
  { name: "Greece", code: "+30", flag: "🇬🇷" },
  { name: "Grenada", code: "+1-473", flag: "🇬🇩" },
  { name: "Guatemala", code: "+502", flag: "🇬🇹" },
  { name: "Guinea", code: "+224", flag: "🇬🇳" },
  { name: "Guinea-Bissau", code: "+245", flag: "🇬🇼" },
  { name: "Guyana", code: "+592", flag: "🇬🇾" },
  { name: "Haiti", code: "+509", flag: "🇭🇹" },
  { name: "Honduras", code: "+504", flag: "🇭🇳" },
  { name: "Hungary", code: "+36", flag: "🇭🇺" },
  { name: "Iceland", code: "+354", flag: "🇮🇸" },
  { name: "India", code: "+91", flag: "🇮🇳" },
  { name: "Indonesia", code: "+62", flag: "🇮🇩" },
  { name: "Iran", code: "+98", flag: "🇮🇷" },
  { name: "Iraq", code: "+964", flag: "🇮🇶" },
  { name: "Ireland", code: "+353", flag: "🇮🇪" },
  { name: "Israel", code: "+972", flag: "🇮🇱" },
  { name: "Italy", code: "+39", flag: "🇮🇹" },
  { name: "Ivory Coast", code: "+225", flag: "🇨🇮" },
  { name: "Jamaica", code: "+1-876", flag: "🇯🇲" },
  { name: "Japan", code: "+81", flag: "🇯🇵" },
  { name: "Jordan", code: "+962", flag: "🇯🇴" },
  { name: "Kazakhstan", code: "+7", flag: "🇰🇿" },
  { name: "Kenya", code: "+254", flag: "🇰🇪" },
  { name: "Kiribati", code: "+686", flag: "🇰🇮" },
  { name: "Kuwait", code: "+965", flag: "🇰🇼" },
  { name: "Kyrgyzstan", code: "+996", flag: "🇰🇬" },
  { name: "Laos", code: "+856", flag: "🇱🇦" },
  { name: "Latvia", code: "+371", flag: "🇱🇻" },
  { name: "Lebanon", code: "+961", flag: "🇱🇧" },
  { name: "Lesotho", code: "+266", flag: "🇱🇸" },
  { name: "Liberia", code: "+231", flag: "🇱🇷" },
  { name: "Libya", code: "+218", flag: "🇱🇾" },
  { name: "Liechtenstein", code: "+423", flag: "🇱🇮" },
  { name: "Lithuania", code: "+370", flag: "🇱🇹" },
  { name: "Luxembourg", code: "+352", flag: "🇱🇺" },
  { name: "Madagascar", code: "+261", flag: "🇲🇬" },
  { name: "Malawi", code: "+265", flag: "🇲🇼" },
  { name: "Malaysia", code: "+60", flag: "🇲🇾" },
  { name: "Maldives", code: "+960", flag: "🇲🇻" },
  { name: "Mali", code: "+223", flag: "🇲🇱" },
  { name: "Malta", code: "+356", flag: "🇲🇹" },
  { name: "Marshall Islands", code: "+692", flag: "🇲🇭" },
  { name: "Mauritania", code: "+222", flag: "🇲🇷" },
  { name: "Mauritius", code: "+230", flag: "🇲🇺" },
  { name: "Mexico", code: "+52", flag: "🇲🇽" },
  { name: "Micronesia", code: "+691", flag: "🇫🇲" },
  { name: "Moldova", code: "+373", flag: "🇲🇩" },
  { name: "Monaco", code: "+377", flag: "🇲🇨" },
  { name: "Mongolia", code: "+976", flag: "🇲🇳" },
  { name: "Montenegro", code: "+382", flag: "🇲🇪" },
  { name: "Morocco", code: "+212", flag: "🇲🇦" },
  { name: "Mozambique", code: "+258", flag: "🇲🇿" },
  { name: "Myanmar", code: "+95", flag: "🇲🇲" },
  { name: "Namibia", code: "+264", flag: "🇳🇦" },
  { name: "Nauru", code: "+674", flag: "🇳🇷" },
  { name: "Nepal", code: "+977", flag: "🇳🇵" },
  { name: "Netherlands", code: "+31", flag: "🇳🇱" },
  { name: "New Zealand", code: "+64", flag: "🇳🇿" },
  { name: "Nicaragua", code: "+505", flag: "🇳🇮" },
  { name: "Niger", code: "+227", flag: "🇳🇪" },
  { name: "Nigeria", code: "+234", flag: "🇳🇬" },
  { name: "North Korea", code: "+850", flag: "🇰🇵" },
  { name: "North Macedonia", code: "+389", flag: "🇲🇰" },
  { name: "Norway", code: "+47", flag: "🇳🇴" },
  { name: "Oman", code: "+968", flag: "🇴🇲" },
  { name: "Pakistan", code: "+92", flag: "🇵🇰" },
  { name: "Palau", code: "+680", flag: "🇵🇼" },
  { name: "Panama", code: "+507", flag: "🇵🇦" },
  { name: "Papua New Guinea", code: "+675", flag: "🇵🇬" },
  { name: "Paraguay", code: "+595", flag: "🇵🇾" },
  { name: "Peru", code: "+51", flag: "🇵🇪" },
  { name: "Philippines", code: "+63", flag: "🇵🇭" },
  { name: "Poland", code: "+48", flag: "🇵🇱" },
  { name: "Portugal", code: "+351", flag: "🇵🇹" },
  { name: "Qatar", code: "+974", flag: "🇶🇦" },
  { name: "Romania", code: "+40", flag: "🇷🇴" },
  { name: "Russia", code: "+7", flag: "🇷🇺" },
  { name: "Rwanda", code: "+250", flag: "🇷🇼" },
  { name: "Saint Kitts and Nevis", code: "+1-869", flag: "🇰🇳" },
  { name: "Saint Lucia", code: "+1-758", flag: "🇱🇨" },
  { name: "Saint Vincent", code: "+1-784", flag: "🇻🇨" },
  { name: "Samoa", code: "+685", flag: "🇼🇸" },
  { name: "San Marino", code: "+378", flag: "🇸🇲" },
  { name: "Sao Tome and Principe", code: "+239", flag: "🇸🇹" },
  { name: "Saudi Arabia", code: "+966", flag: "🇸🇦" },
  { name: "Senegal", code: "+221", flag: "🇸🇳" },
  { name: "Serbia", code: "+381", flag: "🇷🇸" },
  { name: "Seychelles", code: "+248", flag: "🇸🇨" },
  { name: "Sierra Leone", code: "+232", flag: "🇸🇱" },
  { name: "Singapore", code: "+65", flag: "🇸🇬" },
  { name: "Slovakia", code: "+421", flag: "🇸🇰" },
  { name: "Slovenia", code: "+386", flag: "🇸🇮" },
  { name: "Solomon Islands", code: "+677", flag: "🇸🇧" },
  { name: "Somalia", code: "+252", flag: "🇸🇴" },
  { name: "South Africa", code: "+27", flag: "🇿🇦" },
  { name: "South Korea", code: "+82", flag: "🇰🇷" },
  { name: "South Sudan", code: "+211", flag: "🇸🇸" },
  { name: "Spain", code: "+34", flag: "🇪🇸" },
  { name: "Sri Lanka", code: "+94", flag: "🇱🇰" },
  { name: "Sudan", code: "+249", flag: "🇸🇩" },
  { name: "Suriname", code: "+597", flag: "🇸🇷" },
  { name: "Sweden", code: "+46", flag: "🇸🇪" },
  { name: "Switzerland", code: "+41", flag: "🇨🇭" },
  { name: "Syria", code: "+963", flag: "🇸🇾" },
  { name: "Taiwan", code: "+886", flag: "🇹🇼" },
  { name: "Tajikistan", code: "+992", flag: "🇹🇯" },
  { name: "Tanzania", code: "+255", flag: "🇹🇿" },
  { name: "Thailand", code: "+66", flag: "🇹🇭" },
  { name: "Timor-Leste", code: "+670", flag: "🇹🇱" },
  { name: "Togo", code: "+228", flag: "🇹🇬" },
  { name: "Tonga", code: "+676", flag: "🇹🇴" },
  { name: "Trinidad and Tobago", code: "+1-868", flag: "🇹🇹" },
  { name: "Tunisia", code: "+216", flag: "🇹🇳" },
  { name: "Turkey", code: "+90", flag: "🇹🇷" },
  { name: "Turkmenistan", code: "+993", flag: "🇹🇲" },
  { name: "Tuvalu", code: "+688", flag: "🇹🇻" },
  { name: "Uganda", code: "+256", flag: "🇺🇬" },
  { name: "Ukraine", code: "+380", flag: "🇺🇦" },
  { name: "United Arab Emirates", code: "+971", flag: "🇦🇪" },
  { name: "United Kingdom", code: "+44", flag: "🇬🇧" },
  { name: "United States", code: "+1", flag: "🇺🇸" },
  { name: "Uruguay", code: "+598", flag: "🇺🇾" },
  { name: "Uzbekistan", code: "+998", flag: "🇺🇿" },
  { name: "Vanuatu", code: "+678", flag: "🇻🇺" },
  { name: "Vatican City", code: "+379", flag: "🇻🇦" },
  { name: "Venezuela", code: "+58", flag: "🇻🇪" },
  { name: "Vietnam", code: "+84", flag: "🇻🇳" },
  { name: "Yemen", code: "+967", flag: "🇾🇪" },
  { name: "Zambia", code: "+260", flag: "🇿🇲" },
  { name: "Zimbabwe", code: "+263", flag: "🇿🇼" }
];

// hbvkfhgvfrgevufbvfbvfbvfhbvfvbrfbvufbf

const RoleSelector: React.FC<{ 
  selectedRole: Role; 
  onRoleChange: (role: Role) => void;
  disabled?: boolean;
}> = ({ selectedRole, onRoleChange, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const roleData = {
    [Role.PRIVATE_PRACTICE]: { icon: <UsersIcon className="w-5 h-5" />, label: 'PRIVATE PRACTICE' },
    [Role.INDIVIDUAL]: { icon: <UserIcon className="w-5 h-5" />, label: 'INDIVIDUAL' },
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (role: Role) => {
    onRoleChange(role);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full flex items-center justify-between text-left px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-clinic-primary focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="flex items-center">
          <span className="mr-3 text-clinic-accent">{roleData[selectedRole as keyof typeof roleData].icon}</span>
          {roleData[selectedRole as keyof typeof roleData].label}
        </span>
        <ChevronDownIcon 
          className={`w-5 h-5 ml-2 text-gray-400 transform transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
          <ul className="py-1" role="listbox">
            {Object.keys(roleData).map((role) => (
              <li key={role} role="option">
                <button
                  type="button"
                  onClick={() => handleSelect(role as Role)}
                  className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center focus:outline-none focus:bg-gray-50"
                >
                  <span className="mr-3 text-gray-500">{roleData[role as keyof typeof roleData].icon}</span>
                  {roleData[role as keyof typeof roleData].label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const CountrySelector: React.FC<{
  selectedCountry: string;
  onCountryChange: (countryCode: string) => void;
  disabled?: boolean;
}> = ({ selectedCountry, onCountryChange, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedCountryData = countries.find(country => country.code === selectedCountry) || countries[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (countryCode: string) => {
    onCountryChange(countryCode);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="flex items-center justify-between text-left px-3 py-2 text-sm bg-transparent focus:outline-none"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="flex items-center">
          <span className="mr-2">{selectedCountryData.flag}</span>
          <span className="text-gray-700">{selectedCountryData.code}</span>
        </span>
        <ChevronDownIcon 
          className={`w-4 h-4 ml-1 text-gray-400 transform transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>
      {isOpen && (
        <div className="absolute z-20 w-48 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          <ul className="py-1" role="listbox">
            {countries.map((country) => (
              <li key={country.code} role="option">
                <button
                  type="button"
                  onClick={() => handleSelect(country.code)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center focus:outline-none focus:bg-gray-50"
                >
                  <span className="mr-2">{country.flag}</span>
                  <span className="mr-2 text-gray-600">{country.code}</span>
                  <span className="text-gray-500 text-xs">{country.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const SignUpForm: React.FC<SignUpFormProps> = ({ initialRole, onSwitchToLogin }) => {
  const [currentRole, setCurrentRole] = useState<Role>(initialRole);
  const [registerClinic, { isLoading }] = useRegisterClinicMutation();
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<FormData>({
    defaultValues: {
      countryCode: '+1'
    }
  });
  
  const password = watch("password");
  const acceptPolicy = watch("acceptPolicy");
  const countryCode = watch("countryCode");

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const payload = {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        phone: `${data.countryCode}${data.phone}`,
        ...(currentRole === Role.PRIVATE_PRACTICE && { privatePracticeName: data.privatePracticeName }),
      };
      await registerClinic(payload).unwrap();
      alert("Account created successfully! Please log in.");
      onSwitchToLogin();
    } catch (error) {
      console.error('Signup error:', error);
      alert("Account creation failed. Please try again.");
    }
  };

  const handleCountryChange = (newCountryCode: string) => {
    setValue('countryCode', newCountryCode);
  };

  return (
    <div className="flex flex-col h-full min-h-[600px] mx-4">
          <div className="flex justify-between items-center gap-9 mb-8 mt-4">
            <div>
              {/* <label className="text-sm font-bold text-gray-700 block mb-2">
                Account Type
              </label> */}
              <RoleSelector 
                selectedRole={currentRole} 
                onRoleChange={setCurrentRole}
                disabled={isLoading}
              />
            </div>
            <p className="text-sm">
              Already have an account?{' '}
              <button 
                type="button"
                onClick={onSwitchToLogin} 
                className="font-bold text-clinic-accent hover:underline focus:outline-none focus:ring-2 focus:ring-clinic-accent focus:ring-offset-2 rounded text-[#3FDCBF]"
                disabled={isLoading}
              >
                Sign In
              </button>
            </p>
          </div>
      <div className="flex flex-col justify-center">
        <div className="w-full">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
            <p className="text-gray-500 mt-2">Join us today! Please fill in your details.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="text-sm font-bold text-gray-700 block mb-2">
                Your Name
              </label>
              <input 
                id="fullName"
                type="text"
                {...register("fullName", { 
                  required: "Name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters"
                  }
                })} 
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-primary focus:border-transparent transition-colors bg-[#fff]"
                aria-describedby={errors.fullName ? "fullName-error" : undefined}
                disabled={isLoading}
              />
              {errors.fullName && (
                <p id="fullName-error" className="text-red-500 text-xs mt-2 flex items-center">
                  <span className="mr-1">⚠</span>
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {currentRole === Role.PRIVATE_PRACTICE && (
              <div>
                <label htmlFor="privatePracticeName" className="text-sm font-bold text-gray-700 block mb-2">
                  Private Practice Name
                </label>
                <input 
                  id="privatePracticeName"
                  type="text"
                  {...register("privatePracticeName", { 
                    required: "Practice name is required",
                    minLength: {
                      value: 2,
                      message: "Practice name must be at least 2 characters"
                    }
                  })} 
                  placeholder="Enter your practice name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-primary focus:border-transparent transition-colors bg-[#fff]"
                  aria-describedby={errors.privatePracticeName ? "privatePracticeName-error" : undefined}
                  disabled={isLoading}
                />
                {errors.privatePracticeName && (
                  <p id="privatePracticeName-error" className="text-red-500 text-xs mt-2 flex items-center">
                    <span className="mr-1">⚠</span>
                    {errors.privatePracticeName.message}
                  </p>
                )}
              </div>
            )}

            <div>
              <label htmlFor="phone" className="text-sm font-bold text-gray-700 block mb-2">
                Phone Number
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-clinic-primary focus-within:border-transparent transition-colors">
                <div className="border-r border-gray-300">
                  <CountrySelector 
                    selectedCountry={countryCode}
                    onCountryChange={handleCountryChange}
                    disabled={isLoading}
                  />
                </div>
                <input 
                  id="phone"
                  type="tel"
                  {...register("phone", { 
                    required: "Phone number is required",
                    pattern: {
                      value: /^[0-9+\-\s()]+$/,
                      message: "Please enter a valid phone number"
                    },
                    minLength: {
                      value: 6,
                      message: "Phone number must be at least 6 digits"
                    }
                  })} 
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-3 border-none rounded-r-lg focus:outline-none focus:ring-0 bg-[#fff]"
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                  disabled={isLoading}
                />
              </div>
              {errors.phone && (
                <p id="phone-error" className="text-red-500 text-xs mt-2 flex items-center">
                  <span className="mr-1">⚠</span>
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="text-sm font-bold text-gray-700 block mb-2">
                Email
              </label>
              <input 
                id="email"
                type="email"
                {...register("email", { 
                  required: "Email is required", 
                  pattern: { 
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 
                    message: "Please enter a valid email address" 
                  } 
                })} 
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-primary focus:border-transparent transition-colors bg-[#fff]"
                aria-describedby={errors.email ? "email-error" : undefined}
                disabled={isLoading}
              />
              {errors.email && (
                <p id="email-error" className="text-red-500 text-xs mt-2 flex items-center">
                  <span className="mr-1">⚠</span>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-bold text-gray-700 block mb-2">
                Password
              </label>
              <input 
                id="password"
                type="password"
                {...register("password", { 
                  required: "Password is required", 
                  minLength: { 
                    value: 6, 
                    message: "Password must be at least 6 characters" 
                  } 
                })} 
                placeholder="Create a password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-primary focus:border-transparent transition-colors bg-[#fff]"
                aria-describedby={errors.password ? "password-error" : undefined}
                disabled={isLoading}
              />
              {errors.password && (
                <p id="password-error" className="text-red-500 text-xs mt-2 flex items-center">
                  <span className="mr-1">⚠</span>
                  {errors.password.message}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="text-sm font-bold text-gray-700 block mb-2">
                Confirm Password
              </label>
              <input 
                id="confirmPassword"
                type="password"
                {...register("confirmPassword", { 
                  required: "Please confirm your password", 
                  validate: value => value === password || "Passwords do not match" 
                })} 
                placeholder="Retype your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-primary focus:border-transparent transition-colors bg-[#fff]"
                aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <p id="confirmPassword-error" className="text-red-500 text-xs mt-2 flex items-center">
                  <span className="mr-1">⚠</span>
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            
            <div className="flex items-start space-x-3 pt-2">
              <input 
                id="acceptPolicy"
                type="checkbox"
                {...register("acceptPolicy", { 
                  required: "You must accept the privacy policy to continue" 
                })} 
                className="h-5 w-5 text-clinic-primary border-gray-300 rounded focus:ring-clinic-primary mt-0.5 flex-shrink-0"
                disabled={isLoading}
              />
              <label htmlFor="acceptPolicy" className="text-sm text-gray-600 leading-5">
                I accept the privacy policy. We value your personal information and outline how we collect, use, and protect your data. By using our services, you agree to these terms.
              </label>
            </div>
            {errors.acceptPolicy && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <span className="mr-1">⚠</span>
                {errors.acceptPolicy.message}
              </p>
            )}

            <div className="flex justify-center">
            <button 
              type="submit" 
              disabled={isLoading || !acceptPolicy}
              className="w-full flex items-center justify-center h-[60px] px-10 py-2 bg-[#298CDF] text-white font-bold rounded-[20px] gap-2 hover:bg-opacity-90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#298CDF] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
