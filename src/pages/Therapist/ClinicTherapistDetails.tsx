import { InfoCard } from "@/common/InfoCard";
import {
  useGetTherapistClientTableQuery,
  useGetTherapistOverviewQuery,
} from "@/store/api/TherapistApi";
import { useGetTherapistByIdQuery } from "@/store/api/UsersApi";
import PatientIcon from "@/assets/Icons/Patients.svg";
import {
  Award,
  CalendarDaysIcon,
  CircleDashed,
  Disc3,
  MailIcon,
  PhoneIcon,
  UserIcon,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Toggle from "@/common/Toggle";
import { DetailPatientRow } from "@/common/ClientRow";
import ClinicTherapistDetailsSkeleton from "@/components/Skeleton/ClinicTherapistDetailsSkeleton";

export default function ClinicTherapistDetails() {
  const { therapistId } = useParams();
  const { data: therapistData, isLoading } =
    useGetTherapistByIdQuery(therapistId);
  const { data: overviewData, isLoading: isLoadingOverview } =
    useGetTherapistOverviewQuery(therapistId);
  const { data: clientData, isLoading: isLoadingClients } =
    useGetTherapistClientTableQuery(therapistId);

  if (isLoading || isLoadingOverview || isLoadingClients) {
    return <ClinicTherapistDetailsSkeleton />;
  }
  return (
    <div>
      <div className="space-y-8">
        <div className="text-sm ">
          <Link
            to={"/private-practice-admin/therapists"}
            className="cursor-pointer text-[#A7A9AC] hover:underline"
          >
            Therapists
          </Link>
          <span className="mx-2">/</span>
          <span className=" text-[#3FDCBF]">{therapistData?.fullName}</span>
        </div>
        {/* therapist info */}
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-website-primary-color">
                <h3 className="text-lg font-semibold text-white  ">
                  {therapistData?.fullName
                    .split(" ")
                    .map((w: string) => w[0])
                    .join(" ")
                    .toUpperCase()}
                </h3>
              </div>
              {/* <div>
                <h1 className="text-2xl font-bold text-brand-gray-800">
                  Therapist Name
                </h1>
                <p className="">Specialty</p>
              </div> */}
            </div>
            <div className="flex gap-2 text-white text-sm ">
              <button className="bg-[#32363F] cursor-pointer  font-medium py-2  px-4 rounded-lg  hover:bg-brand-gray-600 transition-colors">
                Suspend
              </button>
              <button className="bg-[#D45B53] font-semibold py-2 px-4 rounded-lg hover:bg-red-600 cursor-pointer transition-colors">
                Delete
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-[33px]">
            <InfoCard
              icon={<UserIcon className="text-website-primary-color" />}
              label="Full Name"
              value={therapistData?.fullName}
            />
            <InfoCard
              icon={<MailIcon className="w-5 h-5" />}
              label="Email Address"
              value={therapistData?.email}
            />
            <InfoCard
              icon={<PhoneIcon className="w-5 h-5" />}
              label="Phone Number"
              value={therapistData?.phone}
            />
            <InfoCard
              icon={<Award className="w-5 h-5" />}
              label="Qualifications"
              value={therapistData?.qualification}
            />
            <InfoCard
              icon={<Award className="w-5 h-5" />}
              label="Specialty"
              value={therapistData?.speciality}
            />
            <InfoCard
              icon={<CalendarDaysIcon className="w-5 h-5" />}
              label="Availability"
              value={therapistData?.availability || "Not Set"}
            />
          </div>
        </div>
        {/* thapist stat */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-sm p-6 flex justify-between items-center">
            <div>
              <p className="text-[#7E8086]">Total Patients</p>
              <p className="text-2xl font-semibold text-[#32363F]">
                {overviewData?.totalPatients || 0}
              </p>
            </div>
            <div className="bg-[#3FDCBF1A] border border-[#3FDCBF33] p-2 rounded-[8px]">
              <img src={PatientIcon} alt="" />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6 flex justify-between items-center">
            <div>
              <p className="text-[#7E8086]">Total Sessions (L30 Days)</p>
              <p className="text-2xl font-semibold text-[#32363F]">
                {overviewData?.totalSessions || 0}
              </p>
            </div>

            <div className="bg-[#3FDCBF1A] border border-[#3FDCBF33] p-2 rounded-[8px]">
              {" "}
              <Disc3 className=" text-website-primary-color" />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6 flex justify-between items-center">
            <div>
              <p className="text-[#7E8086] mb-1.5">Account Status</p>
              <Toggle value={overviewData?.accountStatus === "active"} />
            </div>
            <div className="w-10 h-10 bg-[#3FDCBF1A] border border-[#3FDCBF33] p-2 rounded-[8px]">
              <CircleDashed className=" text-website-primary-color" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl  overflow-x-auto p-2">
          <table className="w-full text-left">
            <thead className="bg-[#FAFAF7] rounded-[10px]">
              <tr>
                <th className="p-4 text-[#666666] font-normal">Patient Name</th>
                <th className="p-4 text-[#666666] font-normal">
                  Session Count
                </th>
                <th className="p-4 text-[#666666] font-normal">
                  Treatment Progress
                </th>
                <th className="p-4 text-[#666666] font-normal">Status</th>
                <th className="p-4 text-[#666666] font-normal">Action</th>
              </tr>
            </thead>
            <tbody>
              {clientData?.data && clientData.data.length > 0 ? (
                clientData.data.map((patient: any) => (
                  <DetailPatientRow key={patient.id} patient={patient} />
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center text-gray-500 py-6 italic"
                  >
                    No patients available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
