import { useMemo, useRef, useState } from "react";
import { api } from "../api";

import SectionTitle from "../components/SectionTitle";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";
import ErrorBox from "../components/ErrorBox";

import { loadJson } from "../utils/storageUtil";
import { widgetTitleById } from "../utils/widgetIds";
import { captureElementToPng } from "../utils/domToPng";
import { downloadBlob } from "../utils/fileUtil";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ExportPage() {
  const selectedWidgetIds = useMemo(() => loadJson("selectedWidgets", []), []);
  const [error, setError] = useState("");
  const [exporting, setExporting] = useState(false);

  const [primaryColor, setPrimaryColor] = useState("#1F6FEB");
  const [footerText, setFooterText] = useState("Upstream • Internal");
  const [title, setTitle] = useState("Dashboard Export");
  const [logoDataUrl, setLogoDataUrl] = useState("");

  const hiddenRef = useRef(null);

  const handleLogo = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setLogoDataUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const [tasks, setTasks] = useState([]);
  const [risks, setRisks] = useState([]);

  const loadDashboardData = async () => {
    const [tRes, rRes] = await Promise.all([
      api.get("/tasks"),
      api.get("/risks"),
    ]);
    setTasks(tRes.data.tasks || []);
    setRisks(rRes.data || []);
    return { tasks: tRes.data.tasks || [], risks: rRes.data || [] };
  };

  const computeMerged = (tList, rList) => {
    const map = new Map();
    rList.forEach((r) => map.set(r.taskId, r));
    return tList.map((t) => {
      const r = map.get(t._id) || { riskScore: 0, rationale: "No risk data" };
      return {
        _id: t._id,
        title: t.title,
        riskScore: r.riskScore,
        rationale: r.rationale,
      };
    });
  };

  const exportPpt = async () => {
    if (!selectedWidgetIds.length) {
      setError("No widgets selected. Go to Risk Dashboard and select widgets.");
      return;
    }

    try {
      setExporting(true);
      setError("");

      const { tasks: tList, risks: rList } = await loadDashboardData();
      const merged = computeMerged(tList, rList);

      await new Promise((r) => setTimeout(r, 50));

      const widgets = [];

      for (const wid of selectedWidgetIds) {
        const el = document.getElementById(`hidden-${wid}`);
        if (!el) continue;

        const pngDataUrl = await captureElementToPng(el);
        if (!pngDataUrl) continue;

        widgets.push({
          id: wid,
          title: widgetTitleById(wid),
          pngDataUrl,
        });
      }

      if (widgets.length === 0) {
        setError("Could not capture widgets. Try selecting widgets again.");
        return;
      }

      const res = await api.post("/exports/ppt", {
        widgetIds: selectedWidgetIds,
        scope: "dashboard",
        template: { primaryColor, footerText, title, logoDataUrl },
        widgets,
      });

      const exportId = res.data.exportId;

      const statusRes = await api.get(`/exports/${exportId}/status`);
      if (statusRes.data.state !== "ready") {
        setError("Export not ready yet. Try again in a moment.");
        return;
      }

      const fileRes = await api.get(`/exports/${exportId}/download`, {
        responseType: "blob",
      });

      downloadBlob(new Blob([fileRes.data]), `export-${exportId}.pptx`);
    } catch (e) {
      setError(e?.response?.data?.message || "Export failed");
    } finally {
      setExporting(false);
    }
  };

  const merged = useMemo(() => computeMerged(tasks, risks), [tasks, risks]);
  const top5 = useMemo(
    () => [...merged].sort((a, b) => b.riskScore - a.riskScore).slice(0, 5),
    [merged],
  );

  const chartData = useMemo(
    () =>
      merged.map((t) => ({
        name: t.title.length > 12 ? t.title.slice(0, 12) + "..." : t.title,
        risk: t.riskScore,
      })),
    [merged],
  );

  return (
    <div className="space-y-4">
      <SectionTitle
        title="Export to PPT"
        subtitle="Export selected dashboard widgets into a branded PPT."
      />

      <ErrorBox message={error} />

      <Card title="Selected Widgets">
        {selectedWidgetIds.length === 0 ? (
          <div className="text-sm text-gray-600">
            No widgets selected. Go to Risk Dashboard and select widgets.
          </div>
        ) : (
          <ul className="list-disc pl-5 text-sm">
            {selectedWidgetIds.map((w) => (
              <li key={w}>{widgetTitleById(w)}</li>
            ))}
          </ul>
        )}
      </Card>

      <Card title="Brand Template">
        <div className="grid gap-3 md:grid-cols-2">
          <Input
            label="Deck Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            label="Primary Color (hex)"
            value={primaryColor}
            onChange={(e) => setPrimaryColor(e.target.value)}
          />
          <div className="md:col-span-2">
            <Input
              label="Footer Text"
              value={footerText}
              onChange={(e) => setFooterText(e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <div className="text-sm mb-1">Logo (optional)</div>
            <input type="file" accept="image/*" onChange={handleLogo} />
            {logoDataUrl && (
              <img src={logoDataUrl} alt="logo preview" className="h-12 mt-2" />
            )}
          </div>

          <div className="md:col-span-2">
            <Button disabled={exporting} onClick={exportPpt} type="button">
              {exporting ? "Exporting..." : "Export to PPT"}
            </Button>
          </div>
        </div>
      </Card>

      <div
        ref={hiddenRef}
        className="fixed -left-[10000px] top-0 w-[900px] bg-white p-4"
        style={{ zIndex: -1 }}
      >
        {selectedWidgetIds.includes("top5") && (
          <div id="hidden-top5" className="border rounded p-3">
            <div className="font-bold mb-2">Top 5 Riskiest Tasks</div>
            {top5.map((t) => (
              <div key={t._id} className="mb-2">
                <div className="text-sm font-semibold">
                  {t.title} — Risk {t.riskScore}
                </div>
                <div className="text-xs text-gray-600">{t.rationale}</div>
              </div>
            ))}
          </div>
        )}

        {selectedWidgetIds.includes("riskChart") && (
          <div id="hidden-riskChart" className="border rounded p-3 mt-3">
            <div className="font-bold mb-2">Risk by Task (Bar Chart)</div>
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
          </div>
        )}

        {selectedWidgetIds.includes("rationales") && (
          <div id="hidden-rationales" className="border rounded p-3 mt-3">
            <div className="font-bold mb-2">All Task Risk Rationales</div>
            {merged.map((t) => (
              <div key={t._id} className="mb-2">
                <div className="text-sm font-semibold">
                  {t.title} — Risk {t.riskScore}
                </div>
                <div className="text-xs text-gray-600">{t.rationale}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
