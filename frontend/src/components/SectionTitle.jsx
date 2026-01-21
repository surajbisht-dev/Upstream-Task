export default function SectionTitle({ title, subtitle }) {
  return (
    <div className="mb-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
    </div>
  );
}
