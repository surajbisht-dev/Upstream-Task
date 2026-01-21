export default function Toast({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white px-4 py-3 rounded shadow-lg text-sm flex gap-3 items-center">
      <div>{message}</div>
      <button onClick={onClose} className="underline">
        close
      </button>
    </div>
  );
}
