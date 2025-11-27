/* eslint-disable @typescript-eslint/no-explicit-any */
import { useUserId } from "@/hooks/useUserId";
import { useCreateNewClientMutation } from "@/store/api/ClientsApi";
import { useGetTherapistByClinicQuery } from "@/store/api/UsersApi";
import React, { useState } from "react";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";

// Define the type for the client form data
export interface ClientForm {
  name: string;
  email: string;
  phoneNumber: string; // for input
  healthIssues: string[];
  condition: string;
}

// Initial state with empty values
const initialFormState: ClientForm = {
  name: "",
  email: "",
  phoneNumber: "",
  healthIssues: [],
  condition: "",
};

// Input component for shared styling
interface FormInputProps {
  id: keyof ClientForm;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder = "",
}) => (
  <div className="flex flex-col space-y-2">
    <label htmlFor={id} className="text-sm font-semibold text-gray-700">
      {label}
    </label>
    <input
      id={id}
      type="text"
      name={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-150 ease-in-out text-base shadow-sm outline-none"
      aria-label={label}
    />
  </div>
);

// Dropdown component for therapist selection
interface TherapistDropdownProps {
  therapists: any[];
  selectedTherapistId: string;
  onChange: (id: string) => void;
}

const TherapistDropdown: React.FC<TherapistDropdownProps> = ({
  therapists,
  selectedTherapistId,
  onChange,
}) => {
  const [error, setError] = useState("");

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onChange(value);
    if (value) {
      setError("");
    } else {
      setError("Please select a therapist");
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <label htmlFor="therapist" className="text-sm font-semibold text-gray-700">
        Assign Therapist
      </label>
      <select
        id="therapist"
        value={selectedTherapistId}
        onChange={handleSelect}
        className={`p-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-150 ease-in-out text-base shadow-sm outline-none ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      >
        <option value="">Select a therapist</option>
        {therapists.map((therapist) => (
          <option key={therapist._id} value={therapist.user._id}>
            {therapist.user.firstName} {therapist.user.lastName}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

// Tag-style input for healthIssues
const HealthIssuesInput: React.FC<{
  value: string[];
  onChange: (val: string[]) => void;
}> = ({ value, onChange }) => {
  const [input, setInput] = useState("");

  const handleAdd = () => {
    const trimmed = input.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
      setInput("");
    }
  };

  const handleRemove = (issue: string) => {
    onChange(value.filter((v) => v !== issue));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-semibold text-gray-700">
        Health Issues
      </label>
      <div className="flex flex-wrap gap-2 border border-gray-300 p-2 rounded">
        {value.map((issue) => (
          <span
            key={issue}
            className="flex items-center bg-cyan-100 text-cyan-800 px-2 py-1 rounded-full text-sm"
          >
            {issue}
            <button
              type="button"
              onClick={() => handleRemove(issue)}
              className="ml-1 font-bold text-gray-600 hover:text-gray-900"
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type and press Enter"
          className="flex-1 outline-none"
        />
      </div>
    </div>
  );
};

export const AddNewClient: React.FC<{
  onClose: () => void;
  onClientAdded?: () => void;
}> = ({ onClose, onClientAdded }) => {
  const [formData, setFormData] = useState<ClientForm>(initialFormState);
  const userId = useUserId();
  const [selectedTherapist, setSelectedTherapist] = useState("");
  const [createNewClient, { isLoading }] = useCreateNewClientMutation();
  const { data: therapists, isLoading: therapistLoading } = useGetTherapistByClinicQuery(
    { id: userId! },
    { skip: !userId }
  );


  if (therapistLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#fff]/50 backdrop-blur-sm">
        <Spinner />
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTherapistSelect = (id: string) => {
    setSelectedTherapist(id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate therapist selection
    if (!selectedTherapist) {
      toast.error("Please select a therapist");
      return;
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phoneNumber,
      healthIssues: formData.healthIssues,
      condition: formData.condition,
      status: "active",
    };

    try {
      await createNewClient({
        therapistId: selectedTherapist,
        credentials: payload,
      }).unwrap();
      toast.success("New client added successfully!");
      setFormData(initialFormState); // reset form
      setSelectedTherapist(""); // reset therapist selection
      if (onClientAdded) onClientAdded();
      onClose(); // close modal
    } catch (err) {
      console.error(err);
      toast.error("Failed to add new client.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#fff]/50 backdrop-blur-sm p-4 font-sans">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl p-6 md:p-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Add New Client</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition duration-150 p-1 rounded-full hover:bg-gray-100"
            aria-label="Close Modal"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-6">
            <FormInput
              id="name"
              label="Name"
              value={formData.name}
              onChange={handleChange}
            />
            <FormInput
              id="email"
              label="Email"
              value={formData.email}
              onChange={handleChange}
            />
            <FormInput
              id="phoneNumber"
              label="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
            {/* Therapist Dropdown - only show if therapists are available */}
            <div className="">
              {therapists && therapists.length > 0 ? (
                <TherapistDropdown
                  therapists={therapists}
                  selectedTherapistId={selectedTherapist}
                  onChange={handleTherapistSelect}
                />
              ) : (
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Assign Therapist
                  </label>
                  <div className="p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                    No therapists available
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-6">
            <HealthIssuesInput
              value={formData.healthIssues}
              onChange={(arr) =>
                setFormData((prev) => ({ ...prev, healthIssues: arr }))
              }
            />
            <FormInput
              id="condition"
              label="Condition"
              value={formData.condition}
              onChange={handleChange}
            />
          </div>

          {/* Action Button */}
          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 bg-cyan-500 text-white font-bold rounded-lg shadow-md hover:bg-cyan-600 focus:outline-none focus:ring-4 focus:ring-cyan-300 transition duration-150 ease-in-out text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewClient;
