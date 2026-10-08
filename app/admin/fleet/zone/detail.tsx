import { CStatusBadge } from "@/components/StatusBadge";
import { DetailRow } from "@/components/viewDetails/DetailRow";
import { DetailSection } from "@/components/viewDetails/DetailSection";
import { FormatTimestamp } from "@/lib/function";
import { Feature } from "./utility";

export const ZoneDetailView = ({ feature: item, }: { feature: Feature; }) => {

    return (
        <div className="space-y-6 py-4">

            {/* Person Information */}
            <div className="overflow-hidden rounded-xl border shadow-sm">
                <div className="border-b bg-muted/40 px-4 py-3">
                    <h3 className="font-semibold">Zone Information</h3>
                </div>

                <table className="w-full border-collapse text-sm">
                    <thead>
                        <tr>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>

                        <tr className="border-b hover:bg-muted/10">
                            <td className="w-1/3 bg-muted/20 px-4 py-3 font-medium text-muted-foreground">Zone ID</td>
                            <td className="px-4 py-3 break-all">{item.properties.id}</td>
                        </tr>

                        <tr className="border-b hover:bg-muted/10">
                            <td className="bg-muted/20 px-4 py-3 font-medium text-muted-foreground">Zone Name</td>
                            <td className="px-4 py-3">{item.properties.name}</td>
                        </tr>

                        <tr className="border-b hover:bg-muted/10">
                            <td className="bg-muted/20 px-4 py-3 font-medium text-muted-foreground">Description</td>
                            <td className="px-4 py-3">{item.properties.description}</td>
                        </tr>


                        <tr >
                            <td className="bg-muted/20 px-4 py-3 font-medium text-muted-foreground">Status</td>
                            <td className="px-4 py-3 flex">{CStatusBadge(item.properties.status ? "Active" : "Inactive")}</td>
                        </tr>

                    </tbody>
                </table>
            </div>

            {/* Driver Information */}
            <div className="overflow-hidden rounded-xl border shadow-sm">
                <div className="border-b bg-muted/40 px-4 py-3">
                    <h3 className="font-semibold">Coverage Information</h3>
                </div>

                <table className="w-full border-collapse text-sm"><thead>
                    <tr>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                    <tbody>

                        <tr className="border-b hover:bg-muted/10">
                            <td className="w-1/3 bg-muted/20 px-4 py-3 font-medium text-muted-foreground">Zone Type</td>
                            <td className="px-4 py-3">{item.geometry.type}</td>
                        </tr>

                        <tr className="border-b hover:bg-muted/10">
                            <td className="bg-muted/20 px-4 py-3 font-medium text-muted-foreground">Coverage Area</td>
                            <td className="px-4 py-3">{item.properties.name}</td>
                        </tr>

                        <tr className="border-b hover:bg-muted/10">
                            <td className="bg-muted/20 px-4 py-3 font-medium text-muted-foreground">Coordinates</td>
                            <td className="px-4 py-3">{item.geometry.coordinates[0].map((coord) => coord.join(', ')).join(' | ')}</td>
                        </tr>

                    </tbody>
                </table>
            </div>


            <DetailSection title="Audit Information">
                <DetailRow
                    label="Created"
                    value={`${item.properties.createdBy ?? '-'} • ${FormatTimestamp(
                        item.properties.createdAt
                    )}`}
                />

                <DetailRow
                    label="Updated"
                    value={`${item.properties.updatedBy ?? "-"} • ${item.properties.updatedAt
                        ? FormatTimestamp(item.properties.updatedAt)
                        : "-"
                        }`}
                />
            </DetailSection>

        </div>
    );
}