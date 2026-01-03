"use client";

import { useEffect, useState } from "react";

export type LocalUser = {
  id: string;
  name: string;
  email: string;
};

const STORAGE_KEY = "statement-reader-user";

export const getStoredUser = (): LocalUser | null => {
  if (typeof window === "undefined") {
    return null;
  }
  const raw = window.localStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as LocalUser) : null;
};

export const storeUser = (user: LocalUser) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
};

export const clearUser = () => {
  window.localStorage.removeItem(STORAGE_KEY);
};

export const useLocalUser = () => {
  const [user, setUser] = useState<LocalUser | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  return { user, setUser };
};
