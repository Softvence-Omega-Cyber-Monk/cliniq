import React, { useState } from "react";
import { useAppSelector } from "@/hooks/useRedux";
import { useUserId } from "@/hooks/useUserId";
import { useCreateNewClientMutation } from "@/store/api/ClientsApi";
import { useAddClinicClientMutation } from "@/store/api/ClinicClientsApi";
import { toast } from "sonner";

export interface ClientForm {
  name: string;
  email: string;
  phoneNumber: string;
  healthIssues: string[];
  condition: string;
}

const initialFormState: ClientForm = {
  name: "",
  email: "",
  phoneNumber: "",
  healthIssues: [],
  condition: "",
};

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
      className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-150 text-base shadow-sm"
    />
  </div>
);

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
  const handleRemove = (issue: string) =>
    onChange(value.filter((v) => v !== issue));
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
  const userType = useAppSelector((state) => state.auth.userType);
  const userId = useUserId();

  const [formData, setFormData] = useState<ClientForm>(initialFormState);

  // Call both mutations unconditionally (Hooks rule)
  const [createTherapistClient, { isLoading: isLoadingTherapist }] =
    useCreateNewClientMutation();
  const [createClinicClient, { isLoading: isLoadingClinic }] =
    useAddClinicClientMutation();

  const isLoading =
    userType === "THERAPIST" ? isLoadingTherapist : isLoadingClinic;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phoneNumber,
      healthIssues: formData.healthIssues,
      condition: formData.condition,
      status: "active",
    };
try {
      if (userType === "THERAPIST") {
        await createTherapistClient({
          therapistId: userId!,
          credentials: payload,
        }).unwrap();
      } else if (userType === "CLINIC") {
        console.log(payload);
        await createClinicClient({
          clinicId: userId!,
          newClient: payload,
        }).unwrap();
      }

      toast.success("New client added successfully!");
      setFormData(initialFormState);
      if (onClientAdded) onClientAdded();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add new client.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#fff]/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl p-6 md:p-10">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Add New Client</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition duration-150 p-1 rounded-full hover:bg-gray-100"
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
            <HealthIssuesInput
              value={formData.healthIssues}
              onChange={(arr) =>
                setFormData((prev) => ({ ...prev, healthIssues: arr }))
              }
            />
          </div>
          <div className="mb-8">
            <FormInput
              id="condition"
              label="Condition"
              value={formData.condition}
              onChange={handleChange}
            />
          </div>

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