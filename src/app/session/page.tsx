"use client";

import React, { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import type { Session } from "next-auth";

export default function SessionTestPage() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    async function fetchSession() {
      const sessionData = await getSession();
      setSession(sessionData);
      console.log("Session data:", sessionData);
    }
    fetchSession();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Session Test Page</h1>
      <pre>{JSON.stringify(session, null, 2) || "Loading..."}</pre>
    </div>
  );
}
