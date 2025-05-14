"use client";

import { SessionProvider } from "next-auth/react";
import React, { useEffect, useState } from "react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Prevent hydration mismatch by avoiding rendering on server
  if (!isMounted) return null;

  return <SessionProvider>{children}</SessionProvider>;
}
