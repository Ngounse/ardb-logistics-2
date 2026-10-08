import {
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { PagingT } from "@/lib/response";

type ShowingProps = {
    readonly pagination: PagingT<any> | null | undefined;
};

export function MyShowingItem({ pagination }: ShowingProps) {
    if (!pagination?.totalElements) return null

    return (
        <>
            Showing {pagination?.currentPage ? (pagination.currentPage * pagination.pageSize + 1) : 1}-{Math.min((pagination?.currentPage ?? 0) * (pagination?.pageSize ?? 1) + (pagination?.pageSize ?? 1), pagination?.totalElements ?? 0)} of {pagination?.totalElements ?? 0} items
        </>
    );
}

export function MySelectContent({ }) {

    return (
        <>
            <SelectTrigger  >
                <SelectValue placeholder="Select page size" />
            </SelectTrigger>
            <SelectContent>
                {[5, 10, 20, 50, 100, 250, 500]?.map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                        {size}
                    </SelectItem>
                ))}
            </SelectContent>
        </>
    );
}