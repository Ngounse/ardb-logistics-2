import { CStatusBadge } from "@/components/StatusBadge";
import { DriverParams } from "./utility";

export const DriverDetailView = ({ driver: item, }: { driver: DriverParams; }) => {

    return (
        <div className="space-y-6 py-4">

            {/* Person Information */}
            <div className="overflow-hidden rounded-xl border shadow-sm">
                <div className="border-b bg-muted/40 px-4 py-3">
                    <h3 className="font-semibold">Person Information</h3>
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
                            <td className="w-1/3 bg-muted/20 px-4 py-3 font-medium text-muted-foreground">Person ID</td>
                            <td className="px-4 py-3 break-all">{item.person.id}</td>
                        </tr>

                        <tr className="border-b hover:bg-muted/10">
                            <td className="bg-muted/20 px-4 py-3 font-medium text-muted-foreground">Full Name</td>
                            <td className="px-4 py-3">{item.person?.firstName} {item.person?.lastName}</td>
                        </tr>

                        <tr className="border-b hover:bg-muted/10">
                            <td className="bg-muted/20 px-4 py-3 font-medium text-muted-foreground">Date of Birth</td>
                            <td className="px-4 py-3">{item.person.dateOfBirth}</td>
                        </tr>

                        <tr className="border-b hover:bg-muted/10">
                            <td className="bg-muted/20 px-4 py-3 font-medium text-muted-foreground">Gender</td>
                            <td className="px-4 py-3">{item.person.gender}</td>
                        </tr>

                        <tr className="border-b hover:bg-muted/10">
                            <td className="bg-muted/20 px-4 py-3 font-medium text-muted-foreground">Phone</td>
                            <td className="px-4 py-3">{item.person.phone}</td>
                        </tr>

                        <tr className="border-b hover:bg-muted/10">
                            <td className="bg-muted/20 px-4 py-3 font-medium text-muted-foreground">Email</td>
                            <td className="px-4 py-3">{item.person.email || "-"}</td>
                        </tr>

                        <tr>
                            <td className="bg-muted/20 px-4 py-3 font-medium text-muted-foreground">Address</td>
                            <td className="px-4 py-3">{item.person.address ?? "-"}</td>
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
                            <td className="w-1/3 bg-muted/20 px-4 py-3 font-medium text-muted-foreground">Employee ID</td>
                            <td className="px-4 py-3">{item.employeeCode}</td>
                        </tr>

                        <tr className="border-b hover:bg-muted/10">
                            <td className="bg-muted/20 px-4 py-3 font-medium text-muted-foreground">Driver ID</td>
                            <td className="px-4 py-3">{item.id}</td>
                        </tr>

                        <tr className="border-b hover:bg-muted/10">
                            <td className="bg-muted/20 px-4 py-3 font-medium text-muted-foreground">Driver Type</td>
                            <td className="px-4 py-3">{item.driverType}</td>
                        </tr>

                        <tr className="border-b hover:bg-muted/10">
                            <td className="bg-muted/20 px-4 py-3 font-medium text-muted-foreground">Driving Experience</td>
                            <td className="px-4 py-3">{item.drivingExperience} years</td>
                        </tr>

                        <tr className="border-b hover:bg-muted/10">
                            <td className="bg-muted/20 px-4 py-3 font-medium text-muted-foreground">Accident Count</td>
                            <td className="px-4 py-3">{item.accidentCount}</td>
                        </tr>

                        <tr className="border-b hover:bg-muted/10">
                            <td className="bg-muted/20 px-4 py-3 font-medium  text-muted-foreground">Violation Count</td>
                            <td className="px-4 py-3 ">{item.violationCount}</td>
                        </tr>

                        <tr >
                            <td className="bg-muted/20 px-4 py-3 font-medium text-muted-foreground">Status</td>
                            <td className="px-4 py-3 flex">{CStatusBadge(item.status)}</td>
                        </tr>

                    </tbody>
                </table>
            </div>

            {/* License Information */}
            <div className="overflow-hidden rounded-xl border shadow-sm">
                <div className="border-b bg-muted/40 px-4 py-3">
                    <h3 className="font-semibold">License Information</h3>
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
                            <td className="px-4 py-3">{item.licenseType}</td>
                        </tr>

                        <tr className="biorder-b hover:bg-muted/10">
                            <td className="w-1/3 bg-muted/20 px-4 py-3 font-medium text-muted-foreground">License Nº</td>
                            <td className="px-4 py-3">{item.licenseNumber}</td>
                        </tr>

                        <tr className="border-b hover:bg-muted/10">
                            <td className="bg-muted/20 px-4 py-3 font-medium text-muted-foreground">Issued Date</td>
                            <td className="px-4 py-3">{item.licenseIssueDate}</td>
                        </tr>

                        <tr>
                            <td className="bg-muted/20 px-4 py-3 font-medium text-muted-foreground">Expiry Date</td>
                            <td className="px-4 py-3">{item.licenseExpiryDate}</td>
                        </tr>

                    </tbody>
                </table>
            </div>

            <div className="overflow-hidden rounded-xl border shadow-sm">
                <div className="border-b bg-muted/40 px-4 py-3">
                    <h3 className="font-semibold">Vehicle Information</h3>
                </div>

                <table className="w-full border-collapse text-sm"><thead>
                    <tr>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                    <tbody>

                        <tr className="border-b hover:bg-muted/10">
                            <td className="w-1/3 bg-muted/20 px-4 py-3 font-medium text-muted-foreground">Plate Number</td>
                            <td className="px-4 py-3">{item.plateNumber}</td>
                        </tr>

                        <tr>
                            <td className="bg-muted/20 px-4 py-3 font-medium text-muted-foreground">Vehicle Type</td>
                            <td className="px-4 py-3">{item.vehicleType}</td>
                        </tr>

                    </tbody>
                </table>
            </div>

            {/* Location */}
            <div className="overflow-hidden rounded-xl border shadow-sm">
                <div className="border-b bg-muted/40 px-4 py-3">
                    <h3 className="font-semibold">Assignment Information</h3>
                </div>

                <table className="w-full border-collapse text-sm"><thead>
                    <tr>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                    <tbody>

                        <tr>
                            <td className="w-1/3 bg-muted/20 px-4 py-3 font-medium text-muted-foreground">Zone</td>
                            <td className="px-4 py-3">{item.zone}</td>
                        </tr>

                    </tbody>
                </table>
            </div>

            <div className="overflow-hidden rounded-xl border shadow-sm">
                <div className="border-b bg-muted/40 px-4 py-3">
                    <h3 className="font-semibold">Document Attachment</h3>
                </div>

                <table className="w-full border-collapse text-sm"><thead>
                    <tr>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                    <tbody>

                        <tr className="border-b hover:bg-muted/10">
                            <td className="w-1/3 bg-muted/20 px-4 py-3 font-medium text-muted-foreground">NID</td>
                            <td className="px-4 py-3">-</td>
                        </tr>

                        <tr >
                            <td className="bg-muted/20 px-4 py-3 font-medium text-muted-foreground">License Image</td>
                            <td className="px-4 py-3">-</td>
                        </tr>

                    </tbody>
                </table>
            </div>

            <div className="overflow-hidden rounded-xl border shadow-sm">
                <div className="border-b bg-muted/40 px-4 py-3">
                    <h3 className="font-semibold">Payment Information</h3>
                </div>

                <table className="w-full border-collapse text-sm"><thead>
                    <tr>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                    <tbody>

                        <tr className="border-b hover:bg-muted/10">
                            <td className="w-1/3 bg-muted/20 px-4 py-3 font-medium text-muted-foreground">Payment Method (Cash/Bank Transfer)</td>
                            <td className="px-4 py-3">-</td>
                        </tr>

                        <tr className="border-b hover:bg-muted/10">
                            <td className="bg-muted/20 px-4 py-3 font-medium text-muted-foreground">Bank Name</td>
                            <td className="px-4 py-3">-</td>
                        </tr>

                        <tr className="border-b hover:bg-muted/10">
                            <td className="bg-muted/20 px-4 py-3 font-medium text-muted-foreground">Account Name</td>
                            <td className="px-4 py-3">-</td>
                        </tr>

                        <tr>
                            <td className="bg-muted/20 px-4 py-3 font-medium text-muted-foreground">Account Number</td>
                            <td className="px-4 py-3">{item.person.bankAccountNo ?? "-"}</td>
                        </tr>

                    </tbody>
                </table>
            </div>

            <div className="overflow-hidden rounded-xl border shadow-sm">
                <div className="border-b bg-muted/40 px-4 py-3">
                    <h3 className="font-semibold">Approval History</h3>
                </div>

                <table className="w-full border-collapse text-sm"><thead>
                    <tr>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                    <tbody>

                        <tr className="border-b hover:bg-muted/10">
                            <td className="w-1/3 bg-muted/20 px-4 py-3 font-medium text-muted-foreground">Submitted By</td>
                            <td className="px-4 py-3">-</td>
                        </tr>

                        <tr className="border-b hover:bg-muted/10">
                            <td className="bg-muted/20 px-4 py-3 font-medium text-muted-foreground">Review By</td>
                            <td className="px-4 py-3">-</td>
                        </tr>

                        <tr className="border-b hover:bg-muted/10">
                            <td className="bg-muted/20 px-4 py-3 font-medium text-muted-foreground">Approved By</td>
                            <td className="px-4 py-3">-</td>
                        </tr>

                        <tr>
                            <td className="bg-muted/20 px-4 py-3 font-medium text-muted-foreground">Update By</td>
                            <td className="px-4 py-3">-</td>
                        </tr>

                    </tbody>
                </table>
            </div>

        </div>
    );
}