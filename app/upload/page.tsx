"use client";

import { useEffect, useState } from "react";
import { useLocalUser } from "@/lib/useLocalUser";

type Household = {
  id: string;
  name: string;
};

export default function UploadPage() {
  const { user } = useLocalUser();
  const [households, setHouseholds] = useState<Household[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [importId, setImportId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const response = await fetch(`/api/households?userId=${user.id}`);
      const data = await response.json();
      setHouseholds(data.households ?? []);
    };
    load();
  }, [user]);

  const handleSubmit = async () => {
    if (!user || !file || !selectedId) return;
    setStatus("Uploading metadata and running stub extraction...");
    const response = await fetch("/api/imports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        householdId: selectedId,
        userId: user.id,
        fileName: file.name,
        fileType: file.type || "application/octet-stream",
        fileSize: file.size
      })
    });
    const data = await response.json();
    setImportId(data.importId);
    setStatus("Import created with mock transactions.");
  };

  if (!user) {
    return (
      <section className="card">
        <h1>Upload</h1>
        <p>Please log in first.</p>
      </section>
    );
  }

  return (
    <section>
      <div className="card">
        <h1>Upload</h1>
        <p className="small">
          Upload a PDF/CSV/image. Only metadata is stored; extraction is mocked.
        </p>
        <label htmlFor="household-select">Household</label>
        <select
          id="household-select"
          value={selectedId}
          onChange={(event) => setSelectedId(event.target.value)}
        >
          <option value="">Select a household</option>
          {households.map((household) => (
            <option key={household.id} value={household.id}>
              {household.name}
            </option>
          ))}
        </select>
        <label htmlFor="file-input">Statement file</label>
        <input
          id="file-input"
          type="file"
          accept=".pdf,.csv,image/*"
          onChange={(event) =>
            setFile(event.target.files ? event.target.files[0] : null)
          }
        />
        <button onClick={handleSubmit} disabled={!selectedId || !file}>
          Create import
        </button>
        {status && <p className="small">{status}</p>}
        {importId && (
          <p>
            View import: <a href={`/imports/${importId}`}>{importId}</a>
          </p>
        )}
      </div>
    </section>
  );
}
