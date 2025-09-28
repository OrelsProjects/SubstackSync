"use client";

import { initEventTracker, setUserEventTracker } from "@/eventTracker";
import { useAppSelector } from "@/lib/hooks/redux";
import { initLogger, setUserLogger } from "@/logger";
import { useEffect, useState } from "react";

export default function ClientTrackersProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isInitialized, setIsInitialized] = useState(false);
  const { user } = useAppSelector(state => state.auth);

  useEffect(() => {
    if (isInitialized) return;
    try {
      initLogger();
      initEventTracker();
      setIsInitialized(true);
    } catch (error) {
      console.error("Error initializing event tracker", error);
    } finally {
      setIsInitialized(true);
    }
  }, [isInitialized]);

  useEffect(() => {
    if (user) {
      setUserEventTracker(user);
      setUserLogger(user);
    }
  }, [user]);

  if (!isInitialized) {
    return null;
  }

  return children;
}
