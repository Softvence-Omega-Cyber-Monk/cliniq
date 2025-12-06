/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useUserId } from "@/hooks/useUserId";
import { useGetTherapistByClinicQuery } from "@/store/api/UsersApi";
import { useAssignTherapistToClientMutation } from "@/store/api/ClinicClientsApi";
import { toast } from "sonner";

interface TherapistSelectorProps {
  clientId: string;
  assignedTherapistId?: string;
}

export default function TherapistSelector({
  clientId,
  assignedTherapistId,
}: TherapistSelectorProps) {
  const clinicId = useUserId();
  const { data: therapists, isLoading: therapistsLoading } =
    useGetTherapistByClinicQuery({ id: clinicId });

  const [assignTherapist, { isLoading: assignTherapistLoading }] =
    useAssignTherapistToClientMutation();

  const [selectedTherapist, setSelectedTherapist] = useState<string>(
    assignedTherapistId || ""
  );

  // Update selected therapist if the assignedTherapistId prop changes
  useEffect(() => {
    if (assignedTherapistId) {
      setSelectedTherapist(assignedTherapistId);
    }
  }, [assignedTherapistId]);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const therapistId = e.target.value;
    setSelectedTherapist(therapistId);

    // Show loading toast
    const loadingToast = toast.loading("Assigning therapist...", {
      id: "assign-therapist",
    });

    try {
      await assignTherapist({ clinicId, clientId, therapistId }).unwrap();

      toast.success("Therapist assigned successfully!", { id: loadingToast });
    } catch (err) {
      console.error(err);
      toast.error("Failed to assign therapist.", { id: loadingToast });
    }
  };

  return (
    <select
      className="w-[200px] px-3 text-black bg-[#EBEBEC] py-2 rounded-md"
      value={selectedTherapist}
      onChange={handleChange}
      disabled={assignTherapistLoading || therapistsLoading}
    >
      {!selectedTherapist && (
        <option value="" disabled>
          {assignTherapistLoading ? "Assigning..." : "Select therapist"}
        </option>
      )}

      {therapistsLoading && <option>Loading therapists...</option>}

      {therapists?.data?.map((t: any) => (
        <option key={t.id} value={t.id} style={{ color: "black" }}>
          {t.fullName}
        </option>
      ))}
    </select>
  );
}
