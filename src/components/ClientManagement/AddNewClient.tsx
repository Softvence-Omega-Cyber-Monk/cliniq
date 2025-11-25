import { useUserId } from "@/hooks/useUserId";
import { useCreateNewClientMutation } from "@/store/api/ClientsApi";
import React, { useState } from "react";
import { toast } from "sonner";

// Define the type for the client form data
export interface ClientForm {
  name: string;
  email: string;
  phoneNumber: string;
  healthIssues: string;
  condition: string;
}

// Initial state with empty values
const initialFormState: ClientForm = {
  name: "",
  email: "",
  phoneNumber: "",
  healthIssues: "",
  condition: "",
};

// Define a type for the Input component props
interface FormInputProps {
  id: keyof ClientForm;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

/**
 * Custom Input Component with shared styling
 */
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

export const AddNewClient: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const [formData, setFormData] = useState<ClientForm>(initialFormState);
  const userId = useUserId();
  console.log(userId);
  const [createNewClient, { isLoading, error, data }] =
    useCreateNewClientMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Client Data Submitted:", formData);
    const updatedFormData = {
      ...formData,
      status: "active",
    };
    try {
      const response = await createNewClient({
        therapistId: userId,
        credentials: updatedFormData,
      }).unwrap();
      console.log(response);
      toast.success("New client added successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to add new client.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#fff]/50 bg-opacity-30 p-4 font-sans backdrop-blur-sm">
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
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Two-Column Layout for Name/Email and Phone/Speciality */}
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
            <FormInput
              id="healthIssues"
              label="healthIssues"
              value={formData.healthIssues}
              onChange={handleChange}
            />
          </div>

          {/* Single Column Layout for Condition */}
          <div className="mb-8">
            <FormInput
              id="condition"
              label="Condition"
              value={formData.condition}
              onChange={handleChange}
            />
          </div>

          {/* Action Button - Placed to the right */}
          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button
              type="submit"
              className="px-8 py-3 bg-cyan-500 text-white font-bold rounded-lg shadow-md hover:bg-cyan-600 focus:outline-none focus:ring-4 focus:ring-cyan-300 transition duration-150 ease-in-out text-lg"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewClient;
