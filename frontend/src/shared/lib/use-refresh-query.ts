"use client";

import { useState, useCallback, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";

const MIN_SPIN_DURATION_MS = 600;

export function useRefreshQuery(queryKey: string[]) {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const refresh = useCallback(async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);

    const startTime = Date.now();

    try {
      await queryClient.invalidateQueries({ queryKey });
      await queryClient.refetchQueries({ queryKey });
    } finally {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, MIN_SPIN_DURATION_MS - elapsed);

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setIsRefreshing(false), remaining);
    }
  }, [isRefreshing, queryClient, queryKey]);

  return { refresh, isRefreshing };
}
