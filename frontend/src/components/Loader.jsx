export default function Loader({ text = "Loading..." }) {
  return (
    <div className="p-4 text-sm text-gray-600">
      <div className="animate-pulse">{text}</div>
    </div>
  );
}
