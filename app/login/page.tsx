"use client";

import { useState } from "react";
import { clearUser, storeUser, useLocalUser } from "@/lib/useLocalUser";

export default function LoginPage() {
  const { user, setUser } = useLocalUser();
  const [status, setStatus] = useState<string | null>(null);

  const handleLogin = async () => {
    const mockUser = {
      id: crypto.randomUUID(),
      name: "Alex Morgan",
      email: "alex@example.com"
    };

    storeUser(mockUser);
    setUser(mockUser);
    setStatus("Logged in locally. Creating stub user record...");

    await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mockUser)
    });

    setStatus("User saved. Continue to household setup.");
  };

  const handleLogout = () => {
    clearUser();
    setUser(null);
    setStatus("Logged out.");
  };

  return (
    <section>
      <div className="card">
        <h1>Login</h1>
        <p className="small">
          This is a stubbed login that stores a mock user in local storage.
        </p>
        {user ? (
          <div>
            <p>
              Logged in as <strong>{user.name}</strong> ({user.email}).
            </p>
            <button className="secondary" onClick={handleLogout}>
              Log out
            </button>
          </div>
        ) : (
          <button onClick={handleLogin}>Fake login</button>
        )}
        {status && <p className="small">{status}</p>}
      </div>
    </section>
  );
}
