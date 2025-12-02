import { useUserId } from "@/hooks/useUserId";
import { useGetClinicClientByIdQuery } from "@/store/api/ClinicClientsApi";
import {
  Activity,
  Briefcase,
  HeartPulse,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { DetailItem } from "../Therapist/DetailItem";
import { TreatmentGoal } from "../Therapist/TreatmentGoal";
import { SessionHistoryCard } from "../Therapist/SessionHistoryCard";
import { Session } from "@/components/Settings/types";
import PatientDetailsSkeleton from "@/components/Skeleton/PatientDetailsSkeleton";

export default function PatientDetails() {
  const clinicId = useUserId();
  const { patientId } = useParams();
  const {
    data: patientData,
    isLoading,
    error,
  } = useGetClinicClientByIdQuery({
    clinicId: clinicId || "",
    clientId: patientId || "",
  });
  console.log(patientData);
  if (isLoading) {
    return <PatientDetailsSkeleton />;
  } else if (error instanceof Error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
        <button className=" flex items-center space-x-1 font-medium">
          <span>Therapist</span>
          <span>/</span>
          <span>{patientData?.therapist?.fullName}</span>
          <span>/</span>
          <span className="text-website-primary-color">
            {patientData?.name}
          </span>
        </button>
      </div>
      {/* patient Details */}
      <div className="bg-white p-6 rounded-xl  ">
        <h2 className="text-2xl font-medium text-[#32363F] mb-4 pb-3">
          Patient Information
        </h2>
        <div className=" flex justify-between gap-8 flex-col md:flex-row lg:w-[70%]">
          <div className="space-y-4">
            <DetailItem
              icon={User}
              label="Full Name"
              value={patientData?.name}
            />
            <DetailItem
              icon={Mail}
              label="Email Address"
              value={patientData?.email}
            />
            <DetailItem
              icon={HeartPulse}
              label="Health Issues"
              value="Anxiety, Depression, Stress Management"
            />
          </div>
          <div className="space-y-4">
            <DetailItem
              icon={Phone}
              label="Phone Number"
              value={patientData?.phone}
            />
            <DetailItem
              icon={Activity}
              label="Condition"
              value={patientData?.condition}
            />
            <DetailItem
              icon={Briefcase}
              label="Status"
              value={patientData?.status}
            />
          </div>
        </div>
      </div>
      {/* Treatment Progress */}
      <div className="bg-white p-6 rounded-xl ">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-medium text-[#32363F]">
            Overall Treatment Progress
          </h3>
          <span className="text-2xl font-extrabold text-[#32363F]">
            {patientData?.overallProgress || 10}%
          </span>
        </div>
        <div className="relative h-3 rounded-full bg-[#298CDF1A]">
          <div
            className="absolute h-3 rounded-full bg-[#298CDF] transition-all duration-1000"
            style={{ width: `${patientData?.overallProgress || 10}%` }}
          ></div>
        </div>
      </div>
      {/* Treatment Goals */}
      <div className="bg-white p-6 rounded-xl ">
        <h3 className="text-xl font-medium text-[#32363F] mb-4 pb-3">
          Treatment Goals
        </h3>
        <div className="space-y-5">
          <TreatmentGoal title="Reduce anxiety symptoms by 50%" progress={65} />
          <TreatmentGoal title="Improve sleep quality" progress={40} />
          <TreatmentGoal title="Develop coping strategies" progress={80} />
        </div>
      </div>
      {/* Session History */}
      <div className="bg-white p-6 rounded-xl ">
        <h3 className="text-xl font-medium text-[#32363F] mb-5">
          Session History
        </h3>
        <div className="space-y-4">
          {patientData?.sessionHistory.map((session: Session) => (
            <SessionHistoryCard
              key={session.sessionId}
              date={session.sessionDate}
              duration={session.duration}
              type={session.sessionType}
              notes={session.notes}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
