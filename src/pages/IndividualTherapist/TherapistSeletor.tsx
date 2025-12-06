import { useUserId } from "@/hooks/useUserId";
import { useGetTherapistByClinicQuery } from "@/store/api/UsersApi";
export default function TherapistSelector() {
  const id = useUserId();
  const { data: therapists, isLoading } = useGetTherapistByClinicQuery({ id });
  console.log(therapists);

  return (
    <select className="w-[200px] px-3 text-black bg-[#EBEBEC] py-2  rounded-md">
      <option value="" disabled selected>
        Select therapist
      </option>
      {isLoading && <option>Loading...</option>}

      {therapists?.data?.map((t: any) => (
        <option key={t.id} value={t.id} style={{ color: "black" }}>
          {t.fullName}
        </option>
      ))}
    </select>
  );
}
