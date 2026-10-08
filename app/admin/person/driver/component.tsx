"use client"

import { MyHashID, MySubstring } from "@/components/myFunction"
import { ShipmentStatusBadge } from "@/components/shipments/shipment-status-badge"
import { CStatusBadge } from "@/components/StatusBadge"
import { MyNoItemTableRow } from "@/components/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FormatTimestamp } from "@/lib/function"
import {
    Eye,
    Filter,
    NotepadText,
    Search,
    X
} from "lucide-react"
import { DriverFilters, DriverParams, Registration } from "./utility"
import PermissionGuard from "@/components/PermissionGuard"
import { PERMISSIONS } from "@/src/constants/permissions"

export interface DriverFiltersProps {
    readonly filters: DriverFilters
    readonly showFilters: boolean
    readonly onFiltersChange: (filters: Partial<DriverFilters>) => void
    readonly onShowFiltersToggle: () => void
    readonly onClearFilters: () => void
    readonly params?: any
}

export function DriverFiltersComponent({
    filters,
    showFilters,
    onFiltersChange,
    onShowFiltersToggle,
    onClearFilters,
    params,
}: DriverFiltersProps) {

    const hasActiveFilters =
        filters.driverStatus !== "all" ||
        filters.driverType !== "all" ||
        filters.licenseType !== "all" ||
        filters.licenseNumber !== ""

    const activeFiltersCount = [
        filters.driverStatus !== "all" && "1",
        filters.driverType !== "all" && "1",
        filters.licenseType !== "all" && "1",
        filters.licenseNumber !== "" && "1",
    ].filter(Boolean).length

    return (
        <div>
            <div className="flex flex-wrap flex-col md:flex-row gap-2 md:gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search by name"
                        className="pl-8"
                        value={filters.name}
                        onChange={(e) => onFiltersChange({ name: e.target.value })}
                    />
                </div>

                <div className="flex flex-wrap gap-2">
                    <Button
                        // variant={showFilters ? "default" : "outline"}
                        variant="outline"
                        size="sm"
                        onClick={onShowFiltersToggle}
                        className="h-10"
                    >
                        <Filter className="h-4 w-4 mr-2" />
                        Filters
                        {hasActiveFilters && (
                            <Badge className="ml-2 bg-primary text-primary-foreground">{activeFiltersCount}</Badge>
                        )}
                    </Button>

                    {hasActiveFilters && (
                        <Button variant="ghost" size="sm" onClick={onClearFilters} className="h-10">
                            <X className="h-4 w-4 mr-2" />
                            Clear Filters
                        </Button>
                    )}
                </div>
            </div>

        </div>
    )
}


export const DriverTableBody = ({ driverList: dataList, pagination, onView }: { driverList: DriverParams[]; pagination: any; onView: (driver: DriverParams) => void; }) => {

    return (
        <TableBody>
            <MyNoItemTableRow items={dataList} name="driver" colSpan={20} />
            {dataList?.map((item, index) => (
                <TableRow key={`Driver-${item.id}`} className="hover:bg-muted/50" onDoubleClick={() => onView(item)}>
                    <TableCell className="text-center">{index + 1 + (pagination?.currentPage ?? 0) * (pagination?.pageSize ?? 1)}</TableCell>
                    <TableCell className="font-mono text-xs text-center">
                        {MyHashID(item.id)}
                    </TableCell>
                    <TableCell>
                        <div className="font-medium">{`${item.person?.firstName} ${item.person?.lastName}`} </div>
                    </TableCell>
                    <TableCell className="pl-4">{item.person?.phone}</TableCell>
                    <TableCell className="text-center">{item.driverType}</TableCell>
                    <TableCell className="text-center">{item.vehicleCategoryName}</TableCell>
                    <TableCell className="text-right">  {item.zone}   </TableCell>
                    <TableCell>{CStatusBadge(item.status)}</TableCell>
                    <TableCell>
                        <Button size={'icon'} variant={'ghost'}
                            onClick={() =>
                                onView(item)
                            }
                        >
                            <Eye className="mr-2 h-4 w-4" />
                            <span className="sr-only">View Details</span>
                        </Button>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    );
}

export const CommonTableHeader = () => {
    return (
        <TableHeader>
            <TableRow>
                <TableHead className="w-[50px]">Nº</TableHead>
                <TableHead className="w-[50px]">Request ID</TableHead>
                <TableHead className="w-[100px]">Applicant</TableHead>
                <TableHead className="w-[100px]">Phone Number</TableHead>
                <TableHead>Driver Type</TableHead>
                <TableHead>Vehicle Type</TableHead>
                <TableHead className="text-right">Submitted From</TableHead>
                <TableHead className="text-right">Requested Date</TableHead>
                <TableHead className="text-center w-[100px]">Status</TableHead>
                <TableHead className="w-[70px]"></TableHead>
            </TableRow>
        </TableHeader>
    );
};

export const RegistrationTableHeader = () => {
    return (
        <TableHeader>
            <TableRow>
                <TableHead className="w-[50px]">Nº</TableHead>
                <TableHead className="w-[50px]">Request ID</TableHead>
                <TableHead className="w-[100px]">Applicant</TableHead>
                <TableHead className="w-[100px]">Phone Number</TableHead>
                <TableHead>Driver Type </TableHead>
                <TableHead>Vehicle Type</TableHead>
                <TableHead className="text-right">Requested Date</TableHead>
                <TableHead className="text-center w-[100px]">Status</TableHead>
                <TableHead className="w-[70px]"></TableHead>
            </TableRow>
        </TableHeader>
    );
};;

export const RegistrationTableBody = ({ myReqList: dataList, pagination, handleItemAction }: { myReqList: Registration[]; pagination: any; handleItemAction: (action: string, item: Registration, isRegistered: boolean) => void }) => {
    return (
        <TableBody>
            <MyNoItemTableRow key="no-driver-registration" name="driver registration" items={[dataList]} colSpan={20} />
            {dataList?.map((item, index) => (
                <TableRow key={`Regi-${item.id}`} className="hover:bg-muted/50" onDoubleClick={() => handleItemAction("viewDetails", item, true)}>
                    <TableCell className="text-center">{index + 1 + (pagination?.currentPage ?? 0) * (pagination?.pageSize ?? 1)}</TableCell>
                    <TableCell className="font-mono text-xs">
                        {MyHashID(item.id)}
                    </TableCell>
                    <TableCell>{item.lastName} {item.firstName}</TableCell>
                    <TableCell className="pl-4">{item.phone}</TableCell>
                    <TableCell className="text-center"> {item.driverType ? item.driverType.charAt(0).toUpperCase() + item.driverType.slice(1).toLocaleLowerCase().replace("_", " ") : ""}
                    </TableCell>
                    <TableCell>{item.VehicleType}</TableCell>
                    <TableCell className="text-center">{FormatTimestamp(item.createdAt)}</TableCell>
                    <TableCell><ShipmentStatusBadge status={item.approvalStatus} /></TableCell>
                    <TableCell>

                        <Button size={'icon'} variant={'ghost'}
                            onClick={() =>
                                handleItemAction("viewDetails", item, true)
                            }
                        >
                            <NotepadText className="mr-2 h-4 w-4" />
                            <span className="sr-only">View Details</span>
                        </Button>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    );
}

export const RequestTableHeader = CommonTableHeader;

export const RequestTableBody = ({ myReqList: dataList, pagination, handleItemAction }: { myReqList: DriverParams[]; pagination: any; handleItemAction: (action: string, item: DriverParams, isRegistered: boolean) => void }) => {
    return (
        <TableBody>
            <MyNoItemTableRow name="no-driver-to-become-driver" items={[dataList]} colSpan={dataList.length} />
            {dataList?.map((item, index) => (
                <TableRow key={item.id} className="hover:bg-muted/50" onDoubleClick={() => handleItemAction("viewDetails", item, false)}>
                    <TableCell className="text-center">{index + 1 + (pagination?.currentPage ?? 0) * (pagination?.pageSize ?? 1)}</TableCell>
                    <TableCell className="font-mono text-xs">
                        {MyHashID(item.id)}
                    </TableCell>
                    <TableCell >
                        <MySubstring item={item.person?.firstName} substring={20} />  <MySubstring item={item.person?.lastName} substring={20} />
                    </TableCell>
                    <TableCell className="pl-4">{item.person?.phone}</TableCell>
                    <TableCell className="text-center"> {item.driverType ? item.driverType.charAt(0).toUpperCase() + item.driverType.slice(1).toLocaleLowerCase().replace("_", " ") : ""}
                    </TableCell>
                    <TableCell className="text-center">
                        {item.vehicleCategoryName ? item.vehicleCategoryName.charAt(0).toUpperCase() + item.vehicleCategoryName.slice(1).toLocaleLowerCase().replace("_", " ") : ""}
                    </TableCell>
                    <TableCell>{item.submittedFrom}</TableCell>
                    <TableCell className="text-center">
                        {item.createdAt ? FormatTimestamp(item.createdAt) : "N/A"}
                    </TableCell>
                    <TableCell className=" justify-center items-center"><ShipmentStatusBadge status={item.status} /></TableCell>
                    <TableCell>
                        <PermissionGuard permission={PERMISSIONS.BECOME_DRIVER_READ_BY_ID}>
                            <Button size={'icon'} variant={'ghost'}
                                onClick={() => handleItemAction("viewDetails", item, false)} >
                                <NotepadText className="mr-2 h-4 w-4" />
                                <span className="sr-only">View Details</span>
                            </Button>
                        </PermissionGuard>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    );
}
