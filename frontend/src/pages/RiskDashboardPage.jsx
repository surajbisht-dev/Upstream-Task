import { useEffect, useMemo, useState } from "react";
import { api } from "../api";

import SectionTitle from "../components/SectionTitle";
import ErrorBox from "../components/ErrorBox";
import Loader from "../components/Loader";
import WidgetCard from "../components/WidgetCard";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { loadJson, saveJson } from "../utils/storageUtil";
import { widgetConfig } from "../utils/widgetIds";

export default function RiskDashboardPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [tasks, setTasks] = useState([]);
  const [risks, setRisks] = useState([]);

  const [selectedWidgetIds, setSelectedWidgetIds] = useState(() =>
    loadJson("selectedWidgets", []),
  );

  const toggleWidget = (id) => {
    setSelectedWidgetIds((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      saveJson("selectedWidgets", next);
      return next;
    });
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [tRes, rRes] = await Promise.all([
        api.get("/tasks"),
        api.get("/risks"),
      ]);

      setTasks(tRes.data.tasks || []);
      setRisks(rRes.data || []);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const riskMap = useMemo(() => {
    const m = new Map();
    risks.forEach((r) => m.set(r.taskId, r));
    return m;
  }, [risks]);

  const merged = useMemo(() => {
    return tasks.map((t) => {
      const r = riskMap.get(t._id) || {
        riskScore: 0,
        rationale: "No risk data",
      };
      return {
        _id: t._id,
        title: t.title,
        status: t.status,
        dueDate: t.dueDate,
        riskScore: r.riskScore,
        rationale: r.rationale,
      };
    });
  }, [tasks, riskMap]);

  const top5 = useMemo(() => {
    return [...merged].sort((a, b) => b.riskScore - a.riskScore).slice(0, 5);
  }, [merged]);

  const chartData = useMemo(() => {
    return merged.map((t) => ({
      name: t.title.length > 12 ? t.title.slice(0, 12) + "..." : t.title,
      risk: t.riskScore,
      fullTitle: t.title,
    }));
  }, [merged]);

  if (loading) return <Loader text="Loading dashboard..." />;

  return (
    <div className="space-y-4">
      <SectionTitle
        title="Risk Dashboard"
        subtitle="Rule-based risk score per task with top-5 list and chart."
      />

      <ErrorBox message={error} />

      <div className="grid gap-4 md:grid-cols-2">
        <div
          id={widgetConfig.find((w) => w.id === "top5")?.domId || "widget-top5"}
        >
          <WidgetCard
            id="top5"
            title="Top 5 Riskiest Tasks"
            selected={selectedWidgetIds.includes("top5")}
            onToggle={toggleWidget}
          >
            {top5.length === 0 ? (
              <div className="text-sm text-gray-600">No tasks</div>
            ) : (
              <ol className="list-decimal pl-5 space-y-2">
                {top5.map((t) => (
                  <li key={t._id}>
                    <div className="font-semibold text-sm">
                      {t.title} —{" "}
                      <span className="font-normal">Risk {t.riskScore}</span>
                    </div>
                    <div className="text-xs text-gray-600">{t.rationale}</div>
                  </li>
                ))}
              </ol>
            )}
          </WidgetCard>
        </div>

        <div
          id={
            widgetConfig.find((w) => w.id === "riskChart")?.domId ||
            "widget-chart"
          }
        >
          <WidgetCard
            id="riskChart"
            title="Risk by Task (Bar Chart)"
            selected={selectedWidgetIds.includes("riskChart")}
            onToggle={toggleWidget}
          >
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="risk" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-xs text-gray-600 mt-2">
              Hover on bars to see values.
            </div>
          </WidgetCard>
        </div>

        <div
          className="md:col-span-2"
          id={
            widgetConfig.find((w) => w.id === "rationales")?.domId ||
            "widget-rationales"
          }
        >
          <WidgetCard
            id="rationales"
            title="All Task Risk Rationales"
            selected={selectedWidgetIds.includes("rationales")}
            onToggle={toggleWidget}
          >
            {merged.length === 0 ? (
              <div className="text-sm text-gray-600">No tasks</div>
            ) : (
              <div className="grid gap-2 md:grid-cols-2">
                {merged.map((t) => (
                  <div key={t._id} className="border rounded p-2">
                    <div className="flex justify-between text-sm">
                      <div className="font-semibold">{t.title}</div>
                      <div className="text-gray-700">Risk {t.riskScore}</div>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {t.rationale}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </WidgetCard>
        </div>
      </div>

      <div className="text-xs text-gray-600">
        Selected widgets are saved in localStorage and will be used in Export
        page.
      </div>
    </div>
  );
}
