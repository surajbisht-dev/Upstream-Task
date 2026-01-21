export default function WidgetCard({
  id,
  title,
  selected,
  onToggle,
  children,
}) {
  return (
    <div
      className={
        "border rounded bg-white " + (selected ? "ring-2 ring-black" : "")
      }
    >
      <div className="p-3 border-b flex items-center justify-between">
        <div className="font-semibold text-sm">{title}</div>

        <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
          <input
            type="checkbox"
            checked={!!selected}
            onChange={() => onToggle(id)}
          />
          Select
        </label>
      </div>

      <div className="p-3">{children}</div>
    </div>
  );
}
