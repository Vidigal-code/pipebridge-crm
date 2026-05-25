import { useMemo, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/shared/lib/styles";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const BTN_BASE = "p-2 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed";
const BTN_ACTIVE = "bg-accent text-white";
const BTN_INACTIVE = "text-content-secondary hover:bg-surface-hover";

function PageButton({
  page,
  isActive,
  onClick,
}: {
  page: number;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-8 h-8 rounded-lg text-sm font-medium transition-colors",
        isActive ? BTN_ACTIVE : BTN_INACTIVE
      )}
    >
      {page}
    </button>
  );
}

function buildPageNumbers(current: number, total: number): (number | string)[] {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | string)[] = [1];

  if (current > 3) pages.push("...");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push("...");

  pages.push(total);
  return pages;
}

export default function Pagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
}: PaginationProps) {
  const totalPages = useMemo(() => Math.ceil(totalItems / pageSize), [totalItems, pageSize]);
  const pages = useMemo(() => buildPageNumbers(currentPage, totalPages), [currentPage, totalPages]);

  const goPrev = useCallback(() => onPageChange(currentPage - 1), [currentPage, onPageChange]);
  const goNext = useCallback(() => onPageChange(currentPage + 1), [currentPage, onPageChange]);

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-1 mt-6">
      <button onClick={goPrev} disabled={currentPage === 1} className={BTN_BASE}>
        <ChevronLeft className="w-4 h-4" />
      </button>
      {pages.map((page, i) =>
        typeof page === "string" ? (
          <span key={`ellipsis-${i}`} className="w-8 h-8 flex items-center justify-center text-content-tertiary text-sm">
            {page}
          </span>
        ) : (
          <PageButton key={page} page={page} isActive={page === currentPage} onClick={() => onPageChange(page)} />
        )
      )}
      <button onClick={goNext} disabled={currentPage === totalPages} className={BTN_BASE}>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
