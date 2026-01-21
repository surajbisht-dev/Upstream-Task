export default function Button({ children, variant = "primary", ...props }) {
  const base =
    "px-3 py-2 rounded text-sm disabled:opacity-60 disabled:cursor-not-allowed";

  const styles =
    variant === "primary"
      ? "bg-black text-white hover:bg-gray-800"
      : variant === "danger"
        ? "bg-red-600 text-white hover:bg-red-700"
        : variant === "ghost"
          ? "bg-transparent border hover:bg-gray-50"
          : "bg-gray-200 hover:bg-gray-300";

  return (
    <button {...props} className={`${base} ${styles} ${props.className || ""}`}>
      {children}
    </button>
  );
}
