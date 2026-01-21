export default function Input({ label, ...props }) {
  return (
    <label className="block">
      {label && <div className="text-sm mb-1">{label}</div>}
      <input
        {...props}
        className={
          "w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-black " +
          (props.className || "")
        }
      />
    </label>
  );
}
