interface Props {
  title: string;
  value: string | number;
  color?: string;
  icon?: string;
}

export default function AnalyticsCard({ title, value, color = "blue" }: Props) {
  return (
    <div
      className={`rounded-xl shadow-md p-5 bg-${color}-100 border-l-4 border-${color}-500`}
    >
      <h3 className="text-gray-600 text-sm">{title}</h3>
      <p className="text-3xl font-semibold text-gray-800">{value}</p>
    </div>
  );
}
