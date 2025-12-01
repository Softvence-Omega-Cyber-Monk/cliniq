/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useUserId } from "@/hooks/useUserId";
import { useAddClinicClientMutation } from "@/store/api/ClinicClientsApi";
import { useCreateNewClientMutation } from "@/store/api/ClientsApi";
import { useAppSelector } from "@/hooks/useRedux";

// Validation
const clientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  condition: z.string().min(1, "Diagnosis details is required"),
  healthIssues: z
    .array(z.string())
    .min(1, "At least one health issue is required"),
  treatmentGoals: z.string().min(1, "Treatment goals are required"),
  status: z.enum(["active", "inactive", "completed"]),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface AddClientModalProps {
  onClose: () => void;
}

const AddClientModal = ({ onClose }: AddClientModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [healthIssueInput, setHealthIssueInput] = useState("");
  const [healthIssues, setHealthIssues] = useState<string[]>([
    "Depression",
    "Anxiety",
    "Insomnia",
  ]);
  const userId = useUserId();
  const userType = useAppSelector((state) => state.auth.userType);
  const [createTherapistClient, { isLoading: isLoadingTherapist }] =
    useCreateNewClientMutation();
  const [createClinicClient, { isLoading: isLoadingClinic }] =
    useAddClinicClientMutation();
  const isLoading =
    userType === "THERAPIST" ? isLoadingTherapist : isLoadingClinic;
  console.log(isLoading);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      condition: "",
      healthIssues: ["Depression", "Anxiety", "Insomnia"],
      treatmentGoals: "",
      status: "active",
    },
  });

  useEffect(() => {
    setValue("healthIssues", healthIssues);
  }, [healthIssues, setValue]);

  const handleAddHealthIssue = () => {
    if (
      healthIssueInput.trim() &&
      !healthIssues.includes(healthIssueInput.trim())
    ) {
      setHealthIssues([...healthIssues, healthIssueInput.trim()]);
      setHealthIssueInput("");
    } else if (healthIssues.includes(healthIssueInput.trim())) {
      toast.error("This behavioral health concern is already added");
    }
  };
  const handleRemoveHealthIssue = (issueToRemove: string) => {
    setHealthIssues(healthIssues.filter((issue) => issue !== issueToRemove));
  };

  const onSubmitForm = async (data: ClientFormData) => {
    setIsSubmitting(true);
    const toastId = toast.loading("Adding client...");
    const payload = {
      ...data,
    };

    try {
      if (userType === "THERAPIST" || userType === "INDIVIDUAL_THERAPIST") {
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
      toast.success("Client added successfully!", { id: toastId });
      onClose();
    } catch {
      toast.error("Failed to add client. Please try again.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/10 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div
        className="bg-[#EBF4F2] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3
              id="modal-title"
              className="text-xl font-semibold text-[#32363F]"
            >
              Add New Client
            </h3>
            <button
              onClick={onClose}
              className="text-secondary-text hover:text-primary-text text-[#3FDCBF] border-[#3FDCBF66] border bg-white rounded-full p-2 hover:bg-[#3FDCBF1A] transition"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmitForm)}>
            {/* Personal Information */}
            <div className="bg-gray rounded-xl p-2">
              <h4 className="text-lg font-medium text-[#32363F] mb-4">
                Personal Information
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">Full Name</label>
                  <input
                    type="text"
                    {...register("name")}
                    className={`w-full p-2 border ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    } rounded-lg bg-white`}
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm mb-2">Email</label>
                  <input
                    type="email"
                    {...register("email")}
                    className={`w-full p-2 border ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    } rounded-lg bg-white`}
                    placeholder="john.doe@example.com"
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm mb-2">Phone Number</label>
                  <input
                    type="tel"
                    {...register("phone")}
                    className={`w-full p-2 border ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    } rounded-lg bg-white`}
                    placeholder="+1234567890"
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-500">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="bg-gray rounded-xl p-2">
              <h4 className="text-lg font-medium text-[#32363F] mb-4">
                Medical Information
              </h4>

              {/* Condition + Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">
                    Primary Diagnosis Details
                  </label>
                  <select
                    {...register("condition")}
                    className={`w-full p-2 border ${
                      errors.condition ? "border-red-500" : "border-gray-300"
                    } rounded-lg bg-white`}
                  >
                    <option value="">Select a diagnosis details</option>
                    <option value="Anxiety Disorder">Anxiety Disorder</option>
                    <option value="Depression">Depression</option>
                    <option value="PTSD">PTSD</option>
                    <option value="Bipolar Disorder">Bipolar Disorder</option>
                    <option value="OCD">OCD</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-2">Status</label>
                  <select
                    {...register("status")}
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Health Issues */}
              <div className="mt-4">
                <label className="block text-sm mb-2">
                  Behavioral Health Issues
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={healthIssueInput}
                    onChange={(e) => setHealthIssueInput(e.target.value)}
                    placeholder="Add behavioral health issue"
                    className="flex-1 p-2 border border-gray-300 rounded-lg bg-white w-full"
                  />
                  <button
                    type="button"
                    onClick={handleAddHealthIssue}
                    className="px-4 py-1 bg-[#3FDCBF] text-white rounded-lg cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {healthIssues.map((issue, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-primary-blue/10 text-primary-blue text-xs px-2 py-1 rounded-full bg-green-50"
                    >
                      {issue}
                      <button
                        type="button"
                        onClick={() => handleRemoveHealthIssue(issue)}
                        className="hover:text-primary-red"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Treatment Goals */}
              <div className="mt-4">
                <label className="block text-sm mb-2">Treatment Goals</label>
                <textarea
                  {...register("treatmentGoals")}
                  className={`w-full p-2 border ${
                    errors.treatmentGoals ? "border-red-500" : "border-gray-300"
                  } rounded-lg bg-white`}
                  rows={3}
                  placeholder="Reduce anxiety, improve sleep quality"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 flex-1 border border-gray-300 text-gray-700 cursor-pointer rounded-lg text-sm"
                disabled={isSubmitting}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-4 py-2 flex-1 bg-[#3FDCBF] text-white rounded-lg text-sm cursor-pointer"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adding Client..." : "Add Client"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddClientModal;
