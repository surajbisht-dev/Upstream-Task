export default function ErrorBox({ message }) {
  if (!message) return null;
  return (
    <div className="p-3 border border-red-300 bg-red-50 text-red-700 rounded text-sm">
      {message}
    </div>
  );
}
