export default function Card({ title, right, children }) {
  return (
    <div className="bg-white border rounded p-4">
      {(title || right) && (
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">{title}</h2>
          <div>{right}</div>
        </div>
      )}
      {children}
    </div>
  );
}
