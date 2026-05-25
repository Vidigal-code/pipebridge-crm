"use client";

import { useMemo, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

const DEFAULT_PAGE_SIZE = 6;
const PAGE_PARAM = "page";

function parsePageParam(params: URLSearchParams): number {
  const raw = params.get(PAGE_PARAM);
  const parsed = raw ? parseInt(raw, 10) : 1;
  return isNaN(parsed) || parsed < 1 ? 1 : parsed;
}

export function usePagination<T>(items: T[], pageSize = DEFAULT_PAGE_SIZE) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentPage = useMemo(() => {
    const page = parsePageParam(searchParams);
    const maxPage = Math.max(1, Math.ceil(items.length / pageSize));
    return Math.min(page, maxPage);
  }, [searchParams, items.length, pageSize]);

  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, currentPage, pageSize]);

  const goToPage = useCallback(
    (page: number) => {
      const clamped = Math.max(1, Math.min(page, totalPages));
      const params = new URLSearchParams(searchParams.toString());
      if (clamped === 1) {
        params.delete(PAGE_PARAM);
      } else {
        params.set(PAGE_PARAM, String(clamped));
      }
      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname);
    },
    [totalPages, searchParams, router, pathname]
  );

  const resetPage = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(PAGE_PARAM);
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }, [searchParams, router, pathname]);

  return { paginatedItems, currentPage, totalItems, pageSize, totalPages, goToPage, resetPage };
}
