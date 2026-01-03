"use client";

import { useEffect, useState } from "react";
import { useLocalUser } from "@/lib/useLocalUser";

type Household = {
  id: string;
  name: string;
};

type SheetConnection = {
  id: string;
  spreadsheetId: string;
  tabPrefix: string;
};

export default function SheetPage() {
  const { user } = useLocalUser();
  const [households, setHouseholds] = useState<Household[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [spreadsheetId, setSpreadsheetId] = useState("");
  const [tabPrefix, setTabPrefix] = useState("Statements_");
  const [connections, setConnections] = useState<SheetConnection[]>([]);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const response = await fetch(`/api/households?userId=${user.id}`);
      const data = await response.json();
      setHouseholds(data.households ?? []);
    };
    load();
  }, [user]);

  useEffect(() => {
    const loadConnections = async () => {
      if (!selectedId) return;
      const response = await fetch(
        `/api/sheet-connections?householdId=${selectedId}`
      );
      const data = await response.json();
      setConnections(data.connections ?? []);
    };
    loadConnections();
  }, [selectedId]);

  const handleSave = async () => {
    if (!selectedId) return;
    setStatus("Saving stub sheet connection...");
    const response = await fetch("/api/sheet-connections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ householdId: selectedId, spreadsheetId, tabPrefix })
    });
    const data = await response.json();
    setConnections((prev) => [...prev, data.connection]);
    setSpreadsheetId("");
    setStatus("Saved.");
  };

  if (!user) {
    return (
      <section className="card">
        <h1>Sheet</h1>
        <p>Please log in first.</p>
      </section>
    );
  }

  return (
    <section>
      <div className="card">
        <h1>Sheet Connection</h1>
        <p className="small">
          Store a spreadsheet ID and tab prefix. No Google API calls yet.
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
        <label htmlFor="spreadsheet-id">Spreadsheet ID</label>
        <input
          id="spreadsheet-id"
          value={spreadsheetId}
          onChange={(event) => setSpreadsheetId(event.target.value)}
        />
        <label htmlFor="tab-prefix">Tab naming prefix</label>
        <input
          id="tab-prefix"
          value={tabPrefix}
          onChange={(event) => setTabPrefix(event.target.value)}
        />
        <button
          onClick={handleSave}
          disabled={!selectedId || !spreadsheetId.trim()}
        >
          Save connection
        </button>
        {status && <p className="small">{status}</p>}
      </div>
      <div className="card">
        <h2>Saved connections</h2>
        {connections.length === 0 ? (
          <p className="small">No sheet connections yet.</p>
        ) : (
          <ul>
            {connections.map((connection) => (
              <li key={connection.id}>
                {connection.spreadsheetId} ({connection.tabPrefix})
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
