"use client";

import { useEffect, useState } from "react";
import { useLocalUser } from "@/lib/useLocalUser";

type Household = {
  id: string;
  name: string;
};

export default function HouseholdPage() {
  const { user } = useLocalUser();
  const [households, setHouseholds] = useState<Household[]>([]);
  const [name, setName] = useState("");
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

  const handleCreate = async () => {
    if (!user) return;
    setStatus("Creating household...");
    const response = await fetch("/api/households", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, userId: user.id })
    });
    const data = await response.json();
    setHouseholds((prev) => [...prev, data.household]);
    setName("");
    setStatus("Household created.");
  };

  if (!user) {
    return (
      <section className="card">
        <h1>Household</h1>
        <p>Please log in first.</p>
      </section>
    );
  }

  return (
    <section>
      <div className="card">
        <h1>Household</h1>
        <p className="small">
          Create or select a household. Stored in the local SQLite DB.
        </p>
        <label htmlFor="household-name">New household name</label>
        <input
          id="household-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <button onClick={handleCreate} disabled={!name.trim()}>
          Create household
        </button>
        {status && <p className="small">{status}</p>}
      </div>
      <div className="card">
        <h2>Existing households</h2>
        {households.length === 0 ? (
          <p className="small">No households yet.</p>
        ) : (
          <ul>
            {households.map((household) => (
              <li key={household.id}>
                {household.name} <span className="small">({household.id})</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
