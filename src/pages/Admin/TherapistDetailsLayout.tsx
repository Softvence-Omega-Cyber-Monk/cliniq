import { Outlet, useParams } from "react-router-dom";

export default function TherapistDetailsLayout() {
  const { therapistId } = useParams();
  console.log(therapistId);
  return (
    <div className="min-h-[calc(100vh-105px)] bg-[#f3f3ec] p-4 sm:p-8">
      <Outlet />
    </div>
  );
}
