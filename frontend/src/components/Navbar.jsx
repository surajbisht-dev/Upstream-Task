import { NavLink } from "react-router-dom";

const linkClass = ({ isActive }) =>
  "px-3 py-2 rounded text-sm " +
  (isActive ? "bg-black text-white" : "bg-gray-200 hover:bg-gray-300");

export default function Navbar() {
  return (
    <header className="bg-white border-b">
      <div className="max-w-6xl mx-auto p-4 flex gap-2 flex-wrap items-center">
        <div className="font-bold mr-3">Upstream Practical</div>

        <NavLink to="/" className={linkClass} end>
          Approvals
        </NavLink>
        <NavLink to="/tasks" className={linkClass}>
          Tasks
        </NavLink>
        <NavLink to="/risks" className={linkClass}>
          Risk Dashboard
        </NavLink>
        <NavLink to="/export" className={linkClass}>
          Export PPT
        </NavLink>
      </div>
    </header>
  );
}
