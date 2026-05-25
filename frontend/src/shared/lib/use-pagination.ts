import { useState, useMemo, useCallback } from "react";

const DEFAULT_PAGE_SIZE = 6;

export function usePagination<T>(items: T[], pageSize = DEFAULT_PAGE_SIZE) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, currentPage, pageSize]);

  const goToPage = useCallback(
    (page: number) => {
      setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    },
    [totalPages]
  );

  const resetPage = useCallback(() => setCurrentPage(1), []);

  return { paginatedItems, currentPage, totalItems, pageSize, totalPages, goToPage, resetPage };
}
