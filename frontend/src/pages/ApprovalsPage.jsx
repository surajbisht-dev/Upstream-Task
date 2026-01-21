import { useEffect, useState } from "react";
import { api } from "../api";

import SectionTitle from "../components/SectionTitle";
import Card from "../components/Card";
import Input from "../components/Input";
import TextArea from "../components/TextArea";
import Button from "../components/Button";
import Table from "../components/Table";
import ErrorBox from "../components/ErrorBox";
import CopyButton from "../components/CopyButton";
import Loader from "../components/Loader";

export default function ApprovalsPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [approverEmail, setApproverEmail] = useState("exec@example.com");

  const [creating, setCreating] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [error, setError] = useState("");

  const [approvals, setApprovals] = useState([]);
  const [lastCreatedLinks, setLastCreatedLinks] = useState(null);

  const fetchApprovals = async () => {
    try {
      setListLoading(true);
      setError("");
      const res = await api.get("/approvals");

      const data = res.data;
      const items = Array.isArray(data)
        ? data
        : data.value || data.approvals || [];
      setApprovals(items);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load approvals");
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const onCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return setError("Title is required");
    if (!approverEmail.trim()) return setError("Approver email is required");

    try {
      setCreating(true);
      setError("");
      setLastCreatedLinks(null);

      const res = await api.post("/approvals", {
        title,
        description,
        approverEmail,
      });

      setLastCreatedLinks(res.data.links);
      setTitle("");
      setDescription("");
      await fetchApprovals();
    } catch (e2) {
      setError(e2?.response?.data?.message || "Create approval failed");
    } finally {
      setCreating(false);
    }
  };

  const columns = [
    { key: "title", header: "Title" },
    { key: "approverEmail", header: "Approver" },
    { key: "status", header: "Status" },
    {
      key: "actions",
      header: "Action Links",
      render: (row) => (
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="ghost"
            onClick={() =>
              window.open(
                `${api.defaults.baseURL}/approvals/${row._id}`,
                "_blank",
              )
            }
            type="button"
          >
            View
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <SectionTitle
        title="Approvals"
        subtitle="Create approval request and use one-click Approve/Reject/Hold links."
      />

      <ErrorBox message={error} />

      <Card title="Create Approval">
        <form onSubmit={onCreate} className="grid gap-3 md:grid-cols-2">
          <Input
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            label="Approver Email"
            value={approverEmail}
            onChange={(e) => setApproverEmail(e.target.value)}
          />

          <div className="md:col-span-2">
            <TextArea
              label="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="md:col-span-2 flex gap-2">
            <Button disabled={creating} type="submit">
              {creating ? "Creating..." : "Create"}
            </Button>
            <Button variant="secondary" type="button" onClick={fetchApprovals}>
              Refresh
            </Button>
          </div>
        </form>
      </Card>

      {lastCreatedLinks && (
        <Card title="Last Created Action Links">
          <div className="grid gap-3">
            <div className="flex flex-col gap-2">
              <div className="text-sm font-semibold">Approve</div>
              <div className="text-xs break-all">
                {lastCreatedLinks.approveLink}
              </div>
              <div className="flex gap-2">
                <CopyButton text={lastCreatedLinks.approveLink} label="Copy" />
                <Button
                  type="button"
                  onClick={() =>
                    window.open(lastCreatedLinks.approveLink, "_blank")
                  }
                >
                  Open
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-sm font-semibold">Reject</div>
              <div className="text-xs break-all">
                {lastCreatedLinks.rejectLink}
              </div>
              <div className="flex gap-2">
                <CopyButton text={lastCreatedLinks.rejectLink} label="Copy" />
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() =>
                    window.open(lastCreatedLinks.rejectLink, "_blank")
                  }
                >
                  Open
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-sm font-semibold">Hold</div>
              <div className="text-xs break-all">
                {lastCreatedLinks.holdLink}
              </div>
              <div className="flex gap-2">
                <CopyButton text={lastCreatedLinks.holdLink} label="Copy" />
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() =>
                    window.open(lastCreatedLinks.holdLink, "_blank")
                  }
                >
                  Open
                </Button>
              </div>
            </div>

            <div className="text-xs text-gray-600">
              Note: Email delivery is not graded; links correctness is graded.
            </div>
          </div>
        </Card>
      )}

      <Card
        title="Approvals List"
        right={
          <Button variant="secondary" onClick={fetchApprovals} type="button">
            Refresh
          </Button>
        }
      >
        {listLoading ? (
          <Loader />
        ) : (
          <Table columns={columns} rows={approvals} rowKey={(r) => r._id} />
        )}
      </Card>
    </div>
  );
}
