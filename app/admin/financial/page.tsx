"use client";
import { MyHashID } from "@/components/myFunction";
import { FormatByOrderType } from "@/components/OrderType";
import { MyPagination } from "@/components/Pagination";
import { MySelectContent, MyShowingItem } from "@/components/Showing-item";
import { MyNoItemTableRow } from "@/components/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Card,
    CardContent
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import api from '@/lib/axios';
import { FormatDateTime, FormatTimestamp } from "@/lib/function";
import { PagingT } from "@/lib/response";
import { CommissionTranUrl } from "@/lib/ServiceUrl";
import { format } from "date-fns";
import {
    CalendarIcon,
    Eye,
    FileText,
    Printer,
    RefreshCw,
    Search,
    X
} from "lucide-react";
import { useEffect, useState } from "react";
import { SettlementStatus, TransactionF, TransactionT } from "./utility";

// Mock data for vehicles
export default function CommissionTransactionListPage() {
    const title = "Commission Transaction";
    const [selectedTransaction, setSelectedTransaction] = useState<TransactionT>();
    const [showVehicleDetails, setShowVehicleDetails] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [transactionList, setTransactionList] = useState<TransactionT[]>([]);;
    const [page, setPage] = useState(0);
    const [pagination, setPagination] = useState<PagingT<TransactionT> | null>(null);
    const [pageSize, setPageSize] = useState(process.env.NEXT_PUBLIC_PAGE_SIZE ? Number.parseInt(process.env.NEXT_PUBLIC_PAGE_SIZE) : 20);
    const [debouncedSearch, setDebouncedSearch] = useState<TransactionF>();
    const emptyFilters: TransactionF = {
        deliveryId: '',
        invoiceId: '',
        settlementStatus: null,
        fromDate: undefined,
        toDate: undefined,
    };
    const [filters, setFilters] = useState<TransactionF>({
        deliveryId: '',
        invoiceId: '',
        settlementStatus: null,
        fromDate: undefined,
        toDate: undefined,
    });

    const clearFilter = () => {
        setFilters(emptyFilters)
    }

    useEffect(() => {
        const timer = setTimeout(() => { setDebouncedSearch(filters); }, 500);
        setPage(0);
        return () => clearTimeout(timer);
    }, [filters]);

    useEffect(() => {
        getTransaction();
    }, []);

    useEffect(() => {
        getTransaction();
    }, [page, pageSize, debouncedSearch]);

    const getTransaction = () => {
        setIsRefreshing(true);
        api.get(`${CommissionTranUrl}`, {
            params: {
                page,
                size: pageSize,
                invoiceId: filters.invoiceId == '' ? null : filters.invoiceId,
                deliveryId: filters.deliveryId == '' ? null : filters.deliveryId,
                settlementStatus: filters.settlementStatus == 'all' ? null : filters.settlementStatus,
                fromDate: filters.fromDate ? formatDateTime(filters.fromDate.toDateString()) : null,
                toDate: filters.toDate ? formatDateTime(filters.toDate.toISOString()) : null,
                sort: "updatedAt,desc",
            },
            // headers: {
            //     Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`
            // }
        }).then((res) => {
            const d: PagingT<TransactionT> = res.data.data
            setTransactionList(d.result);
            setPagination(d);
        }).finally(() => {
            setIsRefreshing(false);
        });
    }

    const handleRefresh = () => {
        setIsRefreshing(true);
        getTransaction();
    };

    const formatDateTime = (value: string) => {
        const date = new Date(value);

        const parts = new Intl.DateTimeFormat("en-GB", {
            timeZone: "Asia/Phnom_Penh",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        }).formatToParts(date);

        const get = (type: string) =>
            parts.find((p) => p.type === type)?.value ?? "";

        return `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get("minute")}:${get("second")}`;
    };

    const getBageByStatus = (status: string) => {
        const upperCase = status.toUpperCase()
        switch (upperCase) {
            case "SETTLED":
                return "default"
            case "FAILED":
                return "destructive"
            case "PENDING":
                return "warning"
            case "PROCESSING":
                return "success"
            default:
                return "outline"
        }
    }

    const formatFromDate = () => {
        if (!filters.fromDate) return "Delivered From"
        if (filters.fromDate) return filters.fromDate.toLocaleDateString()
    }

    const formatToDate = () => {
        if (!filters.toDate) return "Delivered To"
        if (filters.toDate) return filters.toDate.toLocaleDateString()
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                    <p className="text-muted-foreground">
                        Manage and monitor your entire transaction.
                        information
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                    >
                        <RefreshCw
                            className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
                        />
                        Refresh
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            {/* <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Export
                            <ChevronDown className="h-4 w-4 ml-2" />
                            </Button> */}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                                <FileText className="h-4 w-4 mr-2" />
                                Export as CSV
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <FileText className="h-4 w-4 mr-2" />
                                Export as Excel
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <FileText className="h-4 w-4 mr-2" />
                                Export as PDF
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Printer className="h-4 w-4 mr-2" />
                                Print
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                </div>
            </div>

            {/* Transaction Table */}
            {/* Filters */}
            <div className="my-4 flex gap-4 flex-wrap 2xl:flex-nowrap ">
                <div className="relative min-w-[180px] max-w-[500px]">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        value={filters?.deliveryId}
                        onChange={(e) => setFilters({ ...filters, deliveryId: e.currentTarget.value })}
                        placeholder="Delivery ID..."
                        className=" pl-8"
                    />
                </div>

                <div className="relative  min-w-[180px] max-w-[500px]">
                    <Input
                        placeholder="Invoice Id"
                        maxLength={36}
                        value={filters.invoiceId}
                        onChange={(e) => setFilters({ ...filters, invoiceId: e.currentTarget.value })
                        }
                    />
                </div>

                <div className="relative  min-w-[180px] max-w-[500px]">
                    <Select name="settlementStatus" value={filters.settlementStatus ? filters.settlementStatus : 'all'} onValueChange={(value) => setFilters({ ...filters, settlementStatus: value == "all" ? null : value })}>
                        <SelectTrigger id="settlementStatus" >
                            <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent >
                            <SelectItem key={null} value={"all"}>
                                All
                            </SelectItem>
                            {SettlementStatus.map((value) => (
                                <SelectItem key={value} value={value}>
                                    {value}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex gap-4">
                    <div className="relative  min-w-[180px] max-w-[280px]"> <Popover >
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {formatFromDate()}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                initialFocus
                                mode="single"
                                defaultMonth={filters.fromDate}
                                selected={filters.fromDate}
                                onSelect={(from) => {
                                    setFilters({
                                        ...filters,
                                        fromDate: from,
                                    })
                                }}
                                numberOfMonths={1}
                            />
                        </PopoverContent>
                    </Popover>
                    </div>

                    <div className="relative  min-w-[180px] max-w-[500px]">
                        <Popover >
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {formatToDate()}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    initialFocus
                                    mode="single"
                                    defaultMonth={filters.toDate}
                                    selected={filters.fromDate}
                                    onSelect={(to) => {
                                        setFilters({
                                            ...filters,
                                            toDate: to,
                                        })
                                    }}
                                    numberOfMonths={1}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
                {JSON.stringify(emptyFilters) !== JSON.stringify(filters) &&
                    <Button disabled={JSON.stringify(emptyFilters) == JSON.stringify(filters)} variant="ghost" size="sm" onClick={clearFilter} className="h-10">
                        <X className="h-4 w-4 mr-2" />
                        Clear
                    </Button>
                }
            </div>

            <Card>
                <CardContent>
                    <Table className="whitespace-nowrap">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px] text-center">Nº</TableHead>
                                <TableHead className="text-center">ID</TableHead>
                                <TableHead>Delivery ID</TableHead>
                                <TableHead>Merchant ID</TableHead>
                                <TableHead className="text-center">Amount Order</TableHead>
                                <TableHead className="text-center">Fee Type</TableHead>
                                <TableHead className="text-center">Fee</TableHead>
                                <TableHead className="text-center">Description</TableHead>
                                <TableHead className="text-center">Status</TableHead>
                                <TableHead className="text-center">Delivered Date</TableHead>
                                <TableHead className="text-center">Updated Date</TableHead>
                                <TableHead className="w-[60px]"></TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            <MyNoItemTableRow
                                colSpan={10}
                                key="transaction"
                                name="transaction"
                                items={transactionList}
                            />

                            {transactionList.map((tran, index) => (
                                <TableRow
                                    key={tran.id}
                                    className="cursor-pointer"
                                    onDoubleClick={() => {
                                        setSelectedTransaction(tran);
                                        setShowVehicleDetails(true);
                                    }}
                                >
                                    <TableCell className="text-center">
                                        {index + 1}
                                    </TableCell>

                                    <TableCell>
                                        {MyHashID(tran.id)}
                                    </TableCell>

                                    <TableCell>
                                        {MyHashID(tran.deliveryId)}
                                    </TableCell>

                                    <TableCell>
                                        {MyHashID(tran.merchantId)}
                                    </TableCell>

                                    <TableCell className="text-right ">
                                        {FormatByOrderType(tran.amount, tran.currency)}
                                    </TableCell>

                                    <TableCell className="text-center">
                                        {tran.feeType}
                                    </TableCell>

                                    <TableCell className="text-right">
                                        {FormatByOrderType(tran.commissionAmount, tran.currency)}
                                    </TableCell>

                                    <TableCell className="text-center">
                                        {tran.description}
                                    </TableCell>

                                    <TableCell className="text-center">
                                        <Badge variant={getBageByStatus(tran.settlementStatus)} >
                                            {tran.settlementStatus}
                                        </Badge>
                                    </TableCell>

                                    <TableCell className="text-center">
                                        {FormatDateTime(tran.createdAt)}
                                    </TableCell>

                                    <TableCell className="text-center">
                                        {FormatDateTime(tran.updatedAt)}
                                    </TableCell>

                                    <TableCell>
                                        <Button variant="ghost" size="icon" onClick={() => {
                                            setSelectedTransaction(tran);
                                            setShowVehicleDetails(true);
                                        }}>
                                            <Eye className="h-4 w-4" />
                                            <span className="sr-only">View Details</span>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <div className="mt-4 flex flex-wrap gap-2 items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            <MyShowingItem pagination={pagination} />
                            <Select defaultValue={pageSize.toString()}
                                onValueChange={(value) => {
                                    setPage(0); // reset to first page
                                    setPageSize(Number(value));
                                }} >

                                <MySelectContent />
                            </Select>
                        </div>
                        <div className="flex items-center gap-2">
                            <MyPagination
                                currentPage={pagination?.currentPage ?? 0}
                                totalPage={pagination?.totalPage ?? 1}
                                onPageChange={setPage} />
                        </div>
                    </div>

                </CardContent>
            </Card>

            {/* Transaction Details Dialog */}
            <Dialog
                open={showVehicleDetails}
                onOpenChange={setShowVehicleDetails}
            >
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>
                            Transaction Details
                        </DialogTitle>

                        <DialogDescription>
                            Complete information about this settlement transaction.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedTransaction && (
                        <div className="max-h-[75vh] space-y-6 overflow-y-auto pr-2">

                            {/* Transaction Information */}
                            <div className="rounded-lg border">
                                <div className="border-b px-4 py-3">
                                    <h3 className="font-semibold">
                                        Transaction Information
                                    </h3>
                                </div>

                                <table className="w-full text-sm">
                                    <thead><tr><th></th></tr><tr><th></th></tr></thead>

                                    <tbody>

                                        <tr className="border-b">
                                            <td className="w-1/3 bg-muted/30 px-4 py-3 font-medium">
                                                Transaction ID
                                            </td>
                                            <td className="break-all px-4 py-3">
                                                {selectedTransaction.id}
                                            </td>
                                        </tr>

                                        <tr className="border-b">
                                            <td className="bg-muted/30 px-4 py-3 font-medium">
                                                Delivery ID
                                            </td>
                                            <td className="break-all px-4 py-3">
                                                {selectedTransaction.deliveryId}
                                            </td>
                                        </tr>

                                        <tr className="border-b">
                                            <td className="bg-muted/30 px-4 py-3 font-medium">
                                                Invoice ID
                                            </td>
                                            <td className="break-all px-4 py-3">
                                                {selectedTransaction.invoiceId || "-"}
                                            </td>
                                        </tr>

                                        <tr className="border-b">
                                            <td className="bg-muted/30 px-4 py-3 font-medium">
                                                Currency
                                            </td>
                                            <td className="px-4 py-3 font-semibold uppercase">
                                                {selectedTransaction.currency}
                                            </td>
                                        </tr>

                                        <tr className="border-b">
                                            <td className="bg-muted/30 px-4 py-3 font-medium">
                                                Commission Amount
                                            </td>
                                            <td className="px-4 py-3   ">
                                                {FormatByOrderType(selectedTransaction.commissionAmount, selectedTransaction.currency)}
                                            </td>
                                        </tr>

                                        <tr>
                                            <td className="bg-muted/30 px-4 py-3 font-medium">
                                                Description
                                            </td>
                                            <td className="px-4 py-3">
                                                {selectedTransaction.description || "-"}
                                            </td>
                                        </tr>

                                    </tbody>
                                </table>
                            </div>

                            {/* Financial Information */}
                            <div className="rounded-lg border">
                                <div className="border-b px-4 py-3">
                                    <h3 className="font-semibold">
                                        Financial Information
                                    </h3>
                                </div>

                                <table className="w-full text-sm">
                                    <thead><tr><th></th></tr><tr><th></th></tr></thead>
                                    <tbody>

                                        <tr className="border-b">
                                            <td className="w-1/3 bg-muted/30 px-4 py-3  font-medium">
                                                Amount
                                            </td>
                                            <td className="px-4 py-3 ">
                                                {FormatByOrderType(selectedTransaction.amount, selectedTransaction.currency)}
                                            </td>
                                        </tr>

                                        <tr className="border-b">
                                            <td className="bg-muted/30 px-4 py-3 font-medium">
                                                Fee
                                            </td>
                                            <td className="px-4 py-3">
                                                {FormatByOrderType(selectedTransaction.fee, selectedTransaction.currency)}
                                            </td>
                                        </tr>

                                        <tr className="border-b">
                                            <td className="bg-muted/30 px-4 py-3 font-medium">
                                                Fee Type
                                            </td>
                                            <td className="px-4 py-3 capitalize">
                                                {selectedTransaction.feeType || "-"}
                                            </td>
                                        </tr>

                                        <tr className="border-b">
                                            <td className="bg-muted/30 px-4 py-3 font-medium">
                                                Commission Amount
                                            </td>
                                            <td className="px-4 py-3  ">
                                                {FormatByOrderType(selectedTransaction.fee, selectedTransaction.currency)}
                                            </td>
                                        </tr>

                                        <tr className="border-b">
                                            <td className="bg-muted/30 px-4 py-3 font-medium">
                                                To Account
                                            </td>
                                            <td className="break-all px-4 py-3">
                                                {selectedTransaction.toAccount || "-"}
                                            </td>
                                        </tr>

                                        <tr>
                                            <td className="bg-muted/30 px-4 py-3 font-medium">
                                                Settlement Status
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge
                                                    variant={
                                                        getBageByStatus(selectedTransaction.settlementStatus)
                                                    }
                                                >
                                                    {selectedTransaction.settlementStatus}
                                                </Badge>
                                            </td>
                                        </tr>

                                    </tbody>
                                </table>
                            </div>

                            {/* Parties / References */}
                            <div className="rounded-lg border">
                                <div className="border-b px-4 py-3">
                                    <h3 className="font-semibold">
                                        Parties & References
                                    </h3>
                                </div>

                                <table className="w-full text-sm">
                                    <thead><tr><th></th></tr><tr><th></th></tr></thead>
                                    <tbody>

                                        <tr className="border-b">
                                            <td className="w-1/3 bg-muted/30 px-4 py-3 font-medium">
                                                Merchant ID
                                            </td>
                                            <td className="break-all px-4 py-3">
                                                {selectedTransaction.merchantId || "-"}
                                            </td>
                                        </tr>

                                        <tr className="border-b">
                                            <td className="bg-muted/30 px-4 py-3 font-medium">
                                                Agent ID
                                            </td>
                                            <td className="break-all px-4 py-3">
                                                {selectedTransaction.agentId || "-"}
                                            </td>
                                        </tr>

                                        <tr>
                                            <td className="bg-muted/30 px-4 py-3 font-medium">
                                                Driver ID
                                            </td>
                                            <td className="break-all px-4 py-3">
                                                {selectedTransaction.driverId || "-"}
                                            </td>
                                        </tr>

                                    </tbody>
                                </table>
                            </div>

                            {/* Audit Information */}
                            <div className="rounded-lg border">
                                <div className="border-b px-4 py-3">
                                    <h3 className="font-semibold">
                                        Audit Information
                                    </h3>
                                </div>

                                <table className="w-full text-sm">
                                    <thead><tr><th></th></tr><tr><th></th></tr></thead>
                                    <tbody>

                                        <tr className="border-b">
                                            <td className="w-1/3 bg-muted/30 px-4 py-3 font-medium">
                                                Created By ID
                                            </td>
                                            <td className="break-all px-4 py-3">
                                                {selectedTransaction.createdById}
                                            </td>
                                        </tr>

                                        <tr className="border-b">
                                            <td className="bg-muted/30 px-4 py-3 font-medium">
                                                Created By
                                            </td>
                                            <td className="px-4 py-3">
                                                {selectedTransaction.createdBy}
                                            </td>
                                        </tr>

                                        <tr className="border-b">
                                            <td className="bg-muted/30 px-4 py-3 font-medium">
                                                Created At
                                            </td>
                                            <td className="px-4 py-3">
                                                {FormatDateTime(selectedTransaction.createdAt)}
                                            </td>
                                        </tr>

                                        <tr className="border-b">
                                            <td className="bg-muted/30 px-4 py-3 font-medium">
                                                Updated By
                                            </td>
                                            <td className="px-4 py-3">
                                                {selectedTransaction.updatedBy}
                                            </td>
                                        </tr>

                                        <tr>
                                            <td className="bg-muted/30 px-4 py-3 font-medium">
                                                Updated At
                                            </td>
                                            <td className="px-4 py-3">
                                                {FormatDateTime(selectedTransaction.updatedAt)}
                                            </td>
                                        </tr>

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowVehicleDetails(false)}
                        >
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>


        </div>
    );
}
