import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Container from "./components/Container";

import ApprovalsPage from "./pages/ApprovalsPage";
import TasksPage from "./pages/TasksPage";
import RiskDashboardPage from "./pages/RiskDashboardPage";
import ExportPage from "./pages/ExportPage";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Container>
        <Routes>
          <Route path="/" element={<ApprovalsPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/risks" element={<RiskDashboardPage />} />
          <Route path="/export" element={<ExportPage />} />
        </Routes>
      </Container>
    </div>
  );
}
