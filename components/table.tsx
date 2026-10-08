"use client"
import { TableCell, TableRow } from "./ui/table";

type TableRowProps = {
    readonly colSpan?: number; // 0-based
    readonly name?: string
    readonly items: any[]
};

export function MyNoItemTableRow({
    colSpan,
    name,
    items
}: TableRowProps) {
    if (items.length !== 0) return
    return (
        <TableRow >
            <TableCell colSpan={colSpan || 200} className="h-24 text-center text-muted-foreground">
                No {name || "item"} found.
            </TableCell>
        </TableRow>
    );
}
