interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({ icon, label, value }) => (
  <div className="flex items-start gap-4">
    <div className="bg-[#3FDCBF1A] text-website-primary-color p-2 rounded-lg">
      {icon}
    </div>
    <div>
      <p className="text-sm text-[#7E8086]">{label}</p>
      <p className="font-medium text-[#575A62]">{value}</p>
    </div>
  </div>
);
