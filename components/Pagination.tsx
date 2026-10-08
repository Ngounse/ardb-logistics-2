import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

type PaginationProps = {
    readonly currentPage: number; // 0-based
    readonly totalPage: number;
    readonly onPageChange: (page: number) => void;
};

export function MyPagination({
    currentPage,
    totalPage,
    onPageChange,
}: PaginationProps) {
    if (totalPage <= 1) return null;

    const MAX_VISIBLE = 5;

    let start = Math.max(0, currentPage - 2);
    let end = Math.min(totalPage - 1, start + MAX_VISIBLE - 1);

    // adjust start if we're near the end
    if (end - start < MAX_VISIBLE - 1) {
        start = Math.max(0, end - MAX_VISIBLE + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    return (
        <div className="flex items-center gap-1 mt-4">
            <Button
                disabled={currentPage === 0}
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ChevronLeft className="h-4 w-4 " />
            </Button>

            {start > 0 && (
                <>
                    <Button variant="outline"
                        size="sm"
                        onClick={() => onPageChange(0)}
                        className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        1
                    </Button>
                    <span className="px-2">...</span>
                </>
            )}

            {pages.map((p) => (
                <Button
                    variant={p === currentPage ? "default" : "outline"}
                    className={`px-3 py-1 border rounded ${p === currentPage ? "cursor-not-allowed" : ""}`}
                    size="sm"
                    key={p}
                    onClick={() => onPageChange(p)}
                >
                    {p + 1}
                </Button>
            ))}

            {end < totalPage - 1 && (
                <>
                    <span className="px-2">...</span>
                    <Button variant="outline"
                        size="sm"
                        className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => onPageChange(totalPage - 1)}
                    >
                        {totalPage}
                    </Button>
                </>
            )}

            <Button
                disabled={currentPage === totalPage - 1}
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
}
