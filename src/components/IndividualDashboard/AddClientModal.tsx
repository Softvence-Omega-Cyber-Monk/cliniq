/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useCreateNewClientMutation } from "@/store/api/ClientsApi";
import { useGetTherapistByClinicQuery } from "@/store/api/UsersApi";
import { useUserId } from "@/hooks/useUserId";

// Validation
const clientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  condition: z.string().min(1, "Condition is required"),
  healthIssues: z.array(z.string()).min(1, "At least one health issue is required"),
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
  const [healthIssues, setHealthIssues] = useState<string[]>(["Depression", "Anxiety", "Insomnia"]);
  const [selectedTherapist, setSelectedTherapist] = useState<string | null>(null);
  const userId = useUserId();
  const [createNewClient] = useCreateNewClientMutation();
  const { data: therapist } = useGetTherapistByClinicQuery(userId);

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
    if (healthIssueInput.trim() && !healthIssues.includes(healthIssueInput.trim())) {
      setHealthIssues([...healthIssues, healthIssueInput.trim()]);
      setHealthIssueInput("");
    } else if (healthIssues.includes(healthIssueInput.trim())) {
      toast.error("This health issue is already added");
    }
  };

  const handleRemoveHealthIssue = (issueToRemove: string) => {
    setHealthIssues(healthIssues.filter((issue) => issue !== issueToRemove));
  };

  const onSubmitForm = async (data: ClientFormData) => {
    if (!selectedTherapist) {
      toast.error("Please select a therapist");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Adding client...");
    const payload = {
      ...data,
      clinicId:userId
    }
    try {
      const res = await createNewClient({
        therapistId: selectedTherapist,
        credentials: payload,
      }).unwrap();
      console.log(res)
      toast.success("Client added successfully!", { id: toastId });
      onClose();
    } catch {
      toast.error("Failed to add client. Please try again.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div
        className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 id="modal-title" className="text-xl font-bold text-primary-text">
              Add New Client
            </h3>
            <button
              onClick={onClose}
              className="text-secondary-text hover:text-primary-text"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmitForm)}>

            {/* NEW — Therapist Dropdown */}
            <div className="bg-gray rounded-xl p-4 mb-6">
              <h4 className="text-lg font-bold text-primary-text mb-4">Assign Therapist</h4>

              <label className="block text-sm mb-2">Select Therapist</label>
              <select
                className="w-full p-2 border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-blue"
                value={selectedTherapist || ""}
                onChange={(e) => setSelectedTherapist(e.target.value)}
              >
                <option value="">Select therapist</option>

                {therapist?.data?.map((t: any) => (
                  <option key={t.id} value={t.id}>
                    {t.fullName}
                  </option>
                ))}
              </select>
            </div>

            {/* Personal Information */}
            <div className="bg-gray rounded-xl p-4 mb-6">
              <h4 className="text-lg font-bold text-primary-text mb-4">Personal Information</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">Full Name</label>
                  <input
                    type="text"
                    {...register("name")}
                    className={`w-full p-2 border ${
                      errors.name ? "border-red-500" : "border-border"
                    } rounded-lg bg-white`}
                    placeholder="John Doe"
                  />
                  {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-sm mb-2">Email</label>
                  <input
                    type="email"
                    {...register("email")}
                    className={`w-full p-2 border ${
                      errors.email ? "border-red-500" : "border-border"
                    } rounded-lg bg-white`}
                    placeholder="john.doe@example.com"
                  />
                  {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-sm mb-2">Phone Number</label>
                  <input
                    type="tel"
                    {...register("phone")}
                    className={`w-full p-2 border ${
                      errors.phone ? "border-red-500" : "border-border"
                    } rounded-lg bg-white`}
                    placeholder="+1234567890"
                  />
                  {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="bg-gray rounded-xl p-4 mb-6">
              <h4 className="text-lg font-bold text-primary-text mb-4">Medical Information</h4>

              {/* Condition + Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">Primary Condition</label>
                  <select
                    {...register("condition")}
                    className={`w-full p-2 border ${
                      errors.condition ? "border-red-500" : "border-border"
                    } rounded-lg bg-white`}
                  >
                    <option value="">Select a condition</option>
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
                    className="w-full p-2 border border-border rounded-lg bg-white"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Health Issues */}
              <div className="mt-4">
                <label className="block text-sm mb-2">Health Issues</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={healthIssueInput}
                    onChange={(e) => setHealthIssueInput(e.target.value)}
                    placeholder="Add health issue"
                    className="flex-1 p-2 border border-border rounded-lg bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddHealthIssue}
                    className="px-4 py-2 bg-primary-blue text-white rounded-lg"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {healthIssues.map((issue, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-primary-blue/10 text-primary-blue text-xs px-2 py-1 rounded-full"
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
                    errors.treatmentGoals ? "border-red-500" : "border-border"
                  } rounded-lg bg-white`}
                  rows={3}
                  placeholder="Reduce anxiety, improve sleep quality"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-border rounded-lg text-sm"
                disabled={isSubmitting}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-4 py-2 bg-black text-white rounded-lg text-sm"
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
