interface DetailItemProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
}

export const DetailItem: React.FC<DetailItemProps> = ({
  icon: Icon,
  label,
  value,
}) => (
  <div className="flex items-start space-x-3">
    <div className="bg-[#3FDCBF1A] p-2.5 rounded-lg border border-[#3FDCBF33]">
      <Icon size={20} className="text-teal-500 flex-shrink-0" />
    </div>
    <div className="flex flex-col">
      <span className="text-sm  text-[#7E8086]">{label}</span>
      <p className="text-base text-[#575A62] font-medium">{value}</p>
    </div>
  </div>
);
