"use client";
import { MyCancel, MyCreate, MyHashID, MyRequired, MySave, MySaving } from "@/components/myFunction";
import { FormatByOrderType } from "@/components/OrderType";
import { MyPagination } from "@/components/Pagination";
import PermissionGuard from "@/components/PermissionGuard";
import { ShipmentPriorityBadge } from "@/components/shipments/shipmentsComponent/shipment-priority-badge";
import { MySelectContent, MyShowingItem } from "@/components/Showing-item";
import { MyNoItemTableRow } from "@/components/table";
import { Button } from "@/components/ui/button";
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
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import api from '@/lib/axios';
import { sendBeacon } from "@/lib/beacon";
import { FormatTimestamp } from "@/lib/function";
import { PagingT } from "@/lib/response";
import { BaseFeeUrl } from "@/lib/ServiceUrl";
import { PERMISSIONS } from "@/src/constants/permissions";
import {
  Edit,
  Eye,
  FileText,
  Loader2,
  Plus,
  Printer,
  RefreshCw,
  Truck
} from "lucide-react";
import { usePathname } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import BaseFeeLogsPage from "./history";
import { BaseFeeParam, BaseFeeT } from "./utility";

export default function BaseFeePage() {
  // State for dialogs
  const [activeTab, setActiveTab] = useState("details");
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [editItemOpen, setEditItemOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteItemOpen, setDeleteItemOpen] = useState(false);
  const [baseFeeParam, setBaseFeeParam] = useState<BaseFeeParam>()
  const [viewHistoryOpen, setViewHistoryOpen] = useState(false);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BaseFeeT>();
  const [baseFeeItem, setBaseFeeItem] = useState<BaseFeeT[]>([]);
  const [pagination, setPagination] = useState<PagingT<BaseFeeT> | null>(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(process.env.NEXT_PUBLIC_PAGE_SIZE ? Number.parseInt(process.env.NEXT_PUBLIC_PAGE_SIZE) : 10);
  const pathname = usePathname();

  // Function to handle opening dialogs for package items
  const handleItemAction = (action: string, item: any) => {
    setSelectedItem(item);

    switch (action) {
      case "viewDetails":
        setViewDetailsOpen(true);
        sendBeacon({
          event: "VIEW",
          page: pathname,
          action: "VIEW_BASE_FEE",
          entity: BaseFeeUrl,
          entityId: item,
        });
        break;
      case "editItem":
        setEditItemOpen(true);
        break;
      case "viewHistory":
        setViewHistoryOpen(true);
        break;
      case "deleteItem":
        setDeleteItemOpen(true);
        break;
      default:
        break;
    }
  };

  // Function to handle form submission with loading state
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>, closeFunction: () => void) => {
    e.preventDefault();
    if (editItemOpen) {
      const formData = new FormData(e.currentTarget);
      const values: any = {};
      formData.forEach((value, key) => {
        values[key] = value;
      });
      updateBaseFee(values);
    }
    if (deleteItemOpen && selectedItem) deleteBaseFee(selectedItem.id);
  };

  useEffect(() => {
    getBaseFeeParam();
  }, []);

  useEffect(() => {
    getBaseFee();
  }, [page, size]);

  const getBaseFee = () => {
    api.get(`${BaseFeeUrl}`, {
      params: { page, size, sort: "updatedAt,desc" },
    }).then((res) => {
      const d: PagingT<BaseFeeT> = res.data.data
      setPagination(d);
      setBaseFeeItem(d.result);
    }).catch((err) => {
    }).finally(() => {
      setAddItemOpen(false);
      setEditItemOpen(false);
      setDeleteItemOpen(false);
      setIsSubmitting(false);
    });
  }

  const getBaseFeeParam = () => {
    setIsSubmitting(true);
    api.get(`${BaseFeeUrl}/param`).then((res) => {
      const d: BaseFeeParam = res.data.data
      setBaseFeeParam(d)
    }).catch((err) => {
    }).finally(() => {
      setIsSubmitting(false);
    });
  }

  const updateBaseFee = (p: BaseFeeT) => {
    setIsSubmitting(true);
    api.put(`${BaseFeeUrl}`, p).then((res) => {
      getBaseFee();
    }).catch((err) => {
    }).finally(() => {
      setIsSubmitting(false);
    });
  }

  const deleteBaseFee = (id: string) => {
    setIsSubmitting(true);
    api.delete(`${BaseFeeUrl}/${id}`).then((res) => {
      getBaseFee();
    }).catch((err) => {
    }).finally(() => {
      setIsSubmitting(false);
    });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget)
    const data: any = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    setIsSubmitting(true);
    api.post(`${BaseFeeUrl}`, data).then((response) => {
      getBaseFee();
    }).catch((error) => {
      console.error("onSubmit!", error);
    });
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Base Fee
          </h1>
          <p className="text-muted-foreground">
            Monitor and manage base fee options across all warehouse locations
          </p>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="all-base-fee" className="w-full ">
          <div className="flex  gap-4 xl:flex-row xl:items-center justify-between mb-4">
            <TabsList className="flex flex-wrap gap-2 h-full sm:w-max justify-start" >
              <TabsTrigger value="all-base-fee">Base Fee</TabsTrigger>
              <PermissionGuard permission={PERMISSIONS.GET_BASE_FEE_HISTORY}>
                <TabsTrigger value="history-base-fee">History</TabsTrigger>
              </PermissionGuard>
            </TabsList>
            <div className="flex items-center gap-2">
              <PermissionGuard permission={PERMISSIONS.BASE_FEE_WRITE}>
                <Dialog open={addItemOpen} onOpenChange={setAddItemOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-1" size="sm" onClick={() => setAddItemOpen(true)}>
                      <Plus className="h-4 w-4" />
                      <span className="hidden sm:inline">Add Base Fee</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] sm:h-max">
                    <DialogHeader>
                      <DialogTitle>Add New Base Fee</DialogTitle>
                      <DialogDescription>
                        Enter the details for the new base fee item. Click save
                        when you're done.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={onSubmit} id="item-form" className="sm:h-max">
                      <div className="grid grid-cols-2 gap-4 p-2 ">
                        <div className=" gap-2">
                          <Label htmlFor="feeType">Fee type <MyRequired /></Label>
                          <Select name="feeType" defaultValue={baseFeeParam?.feeType[0]} required>
                            <SelectTrigger id="feeType" >
                              <SelectValue placeholder="Select fee type" />
                            </SelectTrigger>
                            <SelectContent >
                              {baseFeeParam?.feeType?.map((value) => (
                                <SelectItem key={value} value={value}>
                                  {value}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className=" gap-2">
                          <Label htmlFor="baseAmount">Base amount <MyRequired /></Label>
                          <Input id="baseAmount" type="number" pattern="^[+]?\d+$" step={'any'} min={100} minLength={3} required placeholder="Enter base amount" name="baseAmount" />
                        </div>
                        <div className=" gap-2">
                          <Label htmlFor="orderType">Order type <MyRequired /></Label>
                          <Select name="orderType" defaultValue={baseFeeParam?.orderTypes[0]} required>
                            <SelectTrigger id="orderType" >
                              <SelectValue placeholder="Select order type" />
                            </SelectTrigger>
                            <SelectContent >
                              {baseFeeParam?.orderTypes?.map((value) => (
                                <SelectItem key={value} value={value}>
                                  {value}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className=" gap-2">
                          <Label htmlFor="note">Note</Label>
                          <Input id="note" placeholder="Enter note" name="note" />
                        </div>
                      </div>
                    </form>
                    <DialogFooter className="flex gap-2">
                      <Button variant="outline" onClick={() => setAddItemOpen(false)}>
                        <MyCancel />
                      </Button>
                      <Button form="item-form" type="submit">{isSubmitting ? "Creating..." :
                        <MyCreate />}</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </PermissionGuard>
              <DropdownMenu>
                <DropdownMenuTrigger asChild disabled>
                  {/* <Button variant="outline" size="sm" className="h-10">
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

          {/* All basefee Table */}
          <TabsContent value="all-base-fee" className="mt-0">
            <Card>
              <CardContent>
                <Table className="whitespace-nowrap">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">Nº</TableHead>
                      <TableHead className="w-[50px]">ID</TableHead>
                      <TableHead className="text-center">Order Type</TableHead>
                      <TableHead className="text-center">Fee Type</TableHead>
                      <TableHead>Base Amount</TableHead>
                      <TableHead>Note</TableHead>
                      <TableHead className="text-right">Updated By</TableHead>
                      <TableHead className="text-right">Updated Date</TableHead>
                      <TableHead className="w-[70px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <MyNoItemTableRow name="base fee" items={baseFeeItem} />
                    {baseFeeItem?.map((item, index) => (
                      <TableRow key={item.id} className="hover:bg-muted/50" onDoubleClick={() => handleItemAction("viewDetails", item)}>
                        <TableCell className="text-center">{index + 1 + (pagination?.currentPage ?? 0) * (pagination?.pageSize ?? 1)}</TableCell>
                        <TableCell className="font-mono text-xs">
                          {MyHashID(item.id)}
                        </TableCell>
                        <TableCell className="text-center"><ShipmentPriorityBadge priority={item.orderType} /> </TableCell>
                        <TableCell className="text-center">{item.feeType}</TableCell>
                        <TableCell>
                          {FormatByOrderType(item.baseAmount, item.feeType)}
                        </TableCell>
                        <TableCell>{item.note}</TableCell>
                        <TableCell className="text-right">
                          {item.updatedBy}
                        </TableCell>
                        <TableCell className="text-right">
                          {FormatTimestamp(item.updatedAt)}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() =>
                            handleItemAction("viewDetails", item)
                          }>
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
                    <Select defaultValue={size.toString()}
                      onValueChange={(value) => {
                        setPage(0); // reset to first page
                        setSize(Number(value));
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
          </TabsContent>

          <TabsContent value="history-base-fee" className="space-y-4">
            <BaseFeeLogsPage baseFeeParam={baseFeeParam} />
          </TabsContent>

        </Tabs>
      </div >

      {/* View Details Dialog */}
      < Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen} >
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] h-max overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Base Fee Details</DialogTitle>
            <DialogDescription>
              Detailed information about {selectedItem?.note}
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <>
              <div className="flex flex-wrap border-b">
                <button
                  className={`px-4 py-2 text-sm font-medium ${activeTab === "details"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground"
                    }`}
                  onClick={() => setActiveTab("details")}
                >
                  Details
                </button>
                {/* <button
                  className={`px-4 py-2 text-sm font-medium ${activeTab === "history"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground"
                    }`}
                  onClick={() => setActiveTab("history")}
                >
                  History
                </button> */}
              </div>

              {activeTab === "details" && (
                <div className="space-y-6 py-4">

                  {/* Fee Information */}
                  <div className="rounded-lg border">
                    <div className="border-b px-4 py-3">
                      <h3 className="font-semibold">Fee Information</h3>
                    </div>

                    <table className="w-full text-sm">
                      <thead><tr><th></th></tr><tr><th></th></tr></thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="w-1/3 bg-muted/30 px-4 py-3 font-medium">
                            Fee ID
                          </td>
                          <td className="px-4 py-3 font-medium">
                            {selectedItem.id}
                            <button
                              onClick={() => {
                                navigator.clipboard?.writeText(selectedItem.id)
                                toast({
                                  title: "Copied to clipboard",
                                  description: "Fee ID has been copied to the clipboard",
                                  variant: "default",
                                })
                              }}
                              className="rounded border px-2 py-1 text-xs hover:bg-muted"
                            >
                              Copy
                            </button>
                          </td>
                        </tr>

                        <tr className="border-b">
                          <td className="bg-muted/30 px-4 py-3 font-medium">
                            Fee Type
                          </td>
                          <td className="px-4 py-3">
                            {selectedItem.feeType}
                          </td>
                        </tr>

                        <tr className="border-b">
                          <td className="bg-muted/30 px-4 py-3 font-medium">
                            Base Amount
                          </td>
                          <td className="px-4 py-3 ">
                            {FormatByOrderType(selectedItem.baseAmount, selectedItem.feeType)}
                          </td>
                        </tr>

                        <tr>
                          <td className="bg-muted/30 px-4 py-3 font-medium">
                            Order Type
                          </td>
                          <td className="px-4 py-3">
                            <ShipmentPriorityBadge priority={selectedItem.orderType} />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Note */}
                  <div className="rounded-lg border">
                    <div className="border-b px-4 py-3">
                      <h3 className="font-semibold">Note</h3>
                    </div>

                    <div className="p-4 text-sm break-words whitespace-pre-wrap">
                      {selectedItem.note || (
                        <span className="text-muted-foreground">No note provided.</span>
                      )}
                    </div>
                  </div>

                  {/* Audit Information */}
                  <div className="rounded-lg border">
                    <div className="border-b px-4 py-3">
                      <h3 className="font-semibold">Audit Information</h3>
                    </div>

                    <table className="w-full text-sm">
                      <thead><tr><th></th></tr><tr><th></th></tr></thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="w-1/3 bg-muted/30 px-4 py-3 font-medium">
                            Created By
                          </td>
                          <td className="px-4 py-3">
                            <div>{selectedItem.createdBy}</div>
                            <div className="text-xs text-muted-foreground">
                              {FormatTimestamp(selectedItem.createdAt)}
                            </div>
                          </td>
                        </tr>

                        <tr>
                          <td className="bg-muted/30 px-4 py-3 font-medium">
                            Updated By
                          </td>
                          <td className="px-4 py-3">
                            <div>{selectedItem.updatedBy}</div>
                            <div className="text-xs text-muted-foreground">
                              {FormatTimestamp(selectedItem.updatedAt)}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                </div>
              )}

              {activeTab === "history" && (
                <div className="space-y-4 py-4">
                  <div className="flex flex-wrap gap-3 items-center justify-between">
                    <h3 className="font-medium">Base Fee History</h3>

                  </div>

                  <ScrollArea className="h-[300px] pr-4">
                    <div className="space-y-4">
                      {[...Array(5)]?.map((_, i) => (
                        <div key={i} className="rounded-lg border p-4">
                          <div className="flex flex-wrap gap-1 items-start justify-between">
                            <div className="flex flex-wrap items-start gap-3">
                              <div
                                className={`rounded-full p-2 ${i % 3 === 0
                                  ? "bg-green-500/10"
                                  : i % 3 === 1
                                    ? "bg-blue-500/10"
                                    : "bg-amber-500/10"
                                  }`}
                              >
                                {i % 3 === 0 ? (
                                  <RefreshCw className="h-4 w-4 text-green-500" />
                                ) : i % 3 === 1 ? (
                                  <Truck className="h-4 w-4 text-blue-500" />
                                ) : (
                                  <Edit className="h-4 w-4 text-amber-500" />
                                )}
                              </div>
                              <div>
                                <h4 className="font-medium">
                                  {i % 3 === 0
                                    ? "Restock"
                                    : i % 3 === 1
                                      ? "Transfer In"
                                      : "Adjustment"}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {i % 3 === 0
                                    ? `Added 150 units from supplier`
                                    : i % 3 === 1
                                      ? `Transferred 75 units from NYC2 warehouse`
                                      : `Adjusted address by -12 units (address count)`}
                                </p>
                                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                  <span>By: John Smith</span>
                                  <span>•</span>
                                  <span>
                                    Reference:{" "}
                                    {i % 3 === 0
                                      ? "PO-2023-4872"
                                      : i % 3 === 1
                                        ? "TR-2023-1254"
                                        : "ADJ-2023-0472"}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {i === 0
                                ? "2 hours ago"
                                : i === 1
                                  ? "Yesterday"
                                  : `${i + 1} days ago`}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}

            </>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDetailsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog >

      {/* Edit Item Dialog */}
      < Dialog open={editItemOpen} onOpenChange={setEditItemOpen} >
        <DialogContent className="sm:max-w-[600px] h-[90vh] sm:h-max overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Base Fee</DialogTitle>
            <DialogDescription>
              Update the details for {selectedItem?.note.substring(0, 5)}...
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <form
              onSubmit={(e) => handleSubmit(e, () => setEditItemOpen(false))}
            >
              <div className="grid gap-4 py-4 px-2">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Input type="hidden" name="id" defaultValue={selectedItem.id} />
                    <Label htmlFor="feeType">Fee type</Label>
                    <Select name="feeType" defaultValue={selectedItem.feeType} >
                      <SelectTrigger id="feeType" >
                        <SelectValue placeholder="Select fee type" />
                      </SelectTrigger>
                      <SelectContent >
                        {baseFeeParam?.feeType?.map((value) => (
                          <SelectItem key={value} value={value}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="baseAmount">Base amount</Label>
                    <Input id="baseAmount" type="number" required placeholder="Enter base amount" name="baseAmount" defaultValue={selectedItem.baseAmount} min={100} minLength={3} />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="orderType">Order type</Label>
                    <Select name="orderType" defaultValue={selectedItem.orderType} >
                      <SelectTrigger id="orderType" >
                        <SelectValue placeholder="Select order type" />
                      </SelectTrigger>
                      <SelectContent >
                        {baseFeeParam?.orderTypes?.map((value) => (
                          <SelectItem key={value} value={value}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="note">Note</Label>
                    <Input id="note" placeholder="Enter note" name="note" defaultValue={selectedItem.note} />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setEditItemOpen(false)}
                >
                  <MyCancel />
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <MySaving />
                  ) : (
                    <MySave />
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog >

      < Dialog open={deleteItemOpen} onOpenChange={setDeleteItemOpen} >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Delete Base Fee</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedItem?.note}? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <div className="py-4">
              <div className="mt-4 rounded-lg border p-4">
                <h3 className="font-medium">Base Fee Details</h3>
                <div className="mt-2 space-y-1 text-sm">
                  <div className="flex gap-2">
                    <span>ID:</span>
                    <span className="font-mono">{selectedItem.id}</span>
                  </div>
                  <div className="flex gap-2">
                    <span>Note:</span>
                    <span>{selectedItem.note}</span>
                  </div>
                  <div className="flex gap-2">
                    <span>Base Amount:</span>
                    <span>{FormatByOrderType(selectedItem.baseAmount, selectedItem.orderType)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteItemOpen(false)}>
              <MyCancel />
            </Button>
            <Button
              variant="destructive"
              onClick={(e) =>
                handleSubmit(e as any, () => setDeleteItemOpen(false))
              }
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Item"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog >

    </>
  );
}
