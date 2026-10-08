import { CStatusBadge } from "@/components/StatusBadge";
import { VehicleT } from "./utility";
import { FormatTimestamp } from "@/lib/function";

export const VehicleDetailView = ({ vehicle: v, }: { vehicle: VehicleT; }) => {
    const todo = '//TODO : waiting api'
    return (
        <div className="space-y-6  py-4">

            {/* Person Information */}
            <div className="overflow-hidden rounded-xl border shadow-sm">
                <div className="border-b bg-muted/40 px-4 py-3">
                    <h3 className="font-semibold">Vehicle Information</h3>
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
                            <td className="w-1/3 bg-muted/20 px-4 py-3 font-medium text-muted-foreground">Vehicle Listing ID</td>
                            <td className="px-4 py-3 break-all">{v.id}</td>
                        </tr>

                        <tr className="border-b hover:bg-muted/10">
                            <td className="bg-muted/20 px-4 py-3 font-medium text-muted-foreground">Vehicle Category</td>
                            <td className="px-4 py-3">{v.categoryId}</td>
                        </tr>

                        <tr className="border-b hover:bg-muted/10">
                            <td className="bg-muted/20 px-4 py-3 font-medium text-muted-foreground">Ownership Type</td>
                            <td className="px-4 py-3">{v.tenorType}</td>
                        </tr>

                        <tr className="border-b hover:bg-muted/10">
                            <td className="bg-muted/20 px-4 py-3 font-medium text-muted-foreground">Plate Number</td>
                            <td className="px-4 py-3">{v.licensePlate}</td>
                        </tr>

                        <tr className="border-b hover:bg-muted/10">
                            <td className="bg-muted/20 px-4 py-3 font-medium text-muted-foreground">Brand</td>
                            <td className="px-4 py-3">{v.mark}</td>
                        </tr>

                        <tr className="border-b hover:bg-muted/10">
                            <td className="bg-muted/20 px-4 py-3 font-medium text-muted-foreground">Model</td>
                            <td className="px-4 py-3">{v.model || "-"}</td>
                        </tr>

                        <tr>
                            <td className="bg-muted/20 px-4 py-3 font-medium text-muted-foreground">Manufacturing Year</td>
                            <td className="px-4 py-3">{v.year ?? "-"}</td>
                        </tr>

                        <tr>
                            <td className="bg-muted/20 px-4 py-3 font-medium text-muted-foreground">Cargo Weight</td>
                            <td className="px-4 py-3">{v.weight ?? "-"}</td>
                        </tr>

                        <tr>
                            <td className="bg-muted/20 px-4 py-3 font-medium text-muted-foreground">Vehicle Status</td>
                            <td className="px-4 py-3">{CStatusBadge(v.vehicleStatus)}</td>
                        </tr>

                    </tbody>
                </table>
            </div>

            {/* Driver Information */}
            <div className="overflow-hidden rounded-xl border shadow-sm">
                <div className="border-b bg-muted/40 px-4 py-3">
                    <h3 className="font-semibold">Driver Information</h3>
                </div>

                <table className="w-full border-collapse text-sm"><thead>
                    <tr>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                    <tbody>

                        <tr className="border-b hover:bg-muted/10">
                            <td className="w-1/3 bg-muted/20 px-4 py-3 font-medium text-muted-foreground">Driver ID</td>
                            <td className="px-4 py-3">{v.driverId}</td>
                        </tr>

                        <tr className="border-b hover:bg-muted/10">
                            <td className="bg-muted/20 px-4 py-3 font-medium text-muted-foreground">Full Name</td>
                            <td className="px-4 py-3">{v.driverName}</td>
                        </tr>

                        <tr className="border-b hover:bg-muted/10">
                            <td className="bg-muted/20 px-4 py-3 font-medium text-muted-foreground">Phone Number</td>
                            <td className="px-4 py-3">{v.phone}</td>
                        </tr>

                        <tr >
                            <td className="bg-muted/20 px-4 py-3 font-medium text-muted-foreground">Email</td>
                            <td className="px-4 py-3 flex">{v.person?.email}</td>
                        </tr>

                    </tbody>
                </table>
            </div>

            {/* License Information */}
            <div className="overflow-hidden rounded-xl border shadow-sm">
                <div className="border-b bg-muted/40 px-4 py-3">
                    <h3 className="font-semibold">Driver License Information</h3>
                </div>

                <table className="w-full border-collapse text-sm"><thead>
                    <tr>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                    <tbody>
                        <tr className="border-b hover:bg-muted/10">
                            <td className="bg-muted/20 px-4 py-3 font-medium text-muted-foreground">License Type</td>
                            <td className="px-4 py-3">{v.licenseType}</td>
                        </tr>

                        <tr className="biorder-b hover:bg-muted/10">
                            <td className="w-1/3 bg-muted/20 px-4 py-3 font-medium text-muted-foreground">License Nº</td>
                            <td className="px-4 py-3">{v.licenseNumber}</td>
                        </tr>

                        <tr className="border-b hover:bg-muted/10">
                            <td className="bg-muted/20 px-4 py-3 font-medium text-muted-foreground">Issued Date</td>
                            <td className="px-4 py-3">{v.licenseIssueDate}</td>
                        </tr>

                        <tr>
                            <td className="bg-muted/20 px-4 py-3 font-medium text-muted-foreground">Expiry Date</td>
                            <td className="px-4 py-3">{v.licenseExpiryDate}</td>
                        </tr>

                    </tbody>
                </table>
            </div>

            <div className="overflow-hidden rounded-xl border shadow-sm">
                <div className="border-b bg-muted/40 px-4 py-3">
                    <h3 className="font-semibold">Service Type</h3>
                </div>

                <table className="w-full border-collapse text-sm"><thead>
                    <tr>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                    <tbody>

                        <tr className="border-b hover:bg-muted/10">
                            <td className="w-1/3 bg-muted/20 px-4 py-3 font-medium text-muted-foreground">Food Delivery</td>
                            {/* <td className="px-4 py-3">{v.plateNumber}</td> */} {todo}
                        </tr>

                        <tr>
                            <td className="bg-muted/20 px-4 py-3 font-medium text-muted-foreground">Transport</td>
                            {/* <td className="px-4 py-3">{v.vehicleType}</td> */} {todo}
                        </tr>


                        <tr>
                            <td className="bg-muted/20 px-4 py-3 font-medium text-muted-foreground">Express</td>
                            {/* <td className="px-4 py-3">{v.vehicleType}</td> */} {todo}
                        </tr>

                        <tr>
                            <td className="bg-muted/20 px-4 py-3 font-medium text-muted-foreground">Go Now</td>
                            {/* <td className="px-4 py-3">{v.vehicleType}</td> */} {todo}
                        </tr>

                    </tbody>
                </table>
            </div>

            <div className="overflow-hidden rounded-xl border shadow-sm">
                <div className="border-b bg-muted/40 px-4 py-3">
                    <h3 className="font-semibold">Audit Information</h3>
                </div>

                <table className="w-full border-collapse text-sm"><thead>
                    <tr>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                    <tbody>

                        <tr className="border-b hover:bg-muted/10">
                            <td className="w-1/3 bg-muted/20 px-4 py-3 font-medium text-muted-foreground">Created By</td>
                            <td className="px-4 py-3">{v.createdBy ?? '-'} </td>
                        </tr>

                        <tr className="border-b hover:bg-muted/10">
                            <td className="bg-muted/20 px-4 py-3 font-medium text-muted-foreground">Created Date</td>
                            <td className="px-4 py-3">{FormatTimestamp(v.createdAt) ?? '-'}</td>
                        </tr>

                        <tr className="border-b hover:bg-muted/10">
                            <td className="bg-muted/20 px-4 py-3 font-medium text-muted-foreground">Updated By</td>
                            <td className="px-4 py-3">{v.updatedBy ?? '-'}</td>
                        </tr>

                        <tr>
                            <td className="bg-muted/20 px-4 py-3 font-medium text-muted-foreground">Updated Date</td>
                            <td className="px-4 py-3">{FormatTimestamp(v.updatedAt) ?? '-'}</td>
                        </tr>

                    </tbody>
                </table>
            </div>
        </div>
    );
}