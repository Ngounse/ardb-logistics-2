"use client";
import { MyPagination } from "@/components/Pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
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
import api from '@/lib/axios';
import { FormatTimestamp } from "@/lib/function";
import { PagingT, ResponseT } from "@/lib/response";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  CirclePercent,
  Download,
  Edit,
  Eye,
  FileText,
  Loader2,
  MoreHorizontal,
  Package,
  PackagePlus,
  Printer,
  RefreshCw,
  Search,
  Trash2,
  Truck
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { CurrencyT, ExchangeRateT, Status, WalletT } from "../utility";
import { MySelectContent, MyShowingItem } from "@/components/Showing-item";
import { statusConfig } from "../../fleet/vehicles/utility";
import { MyCancel, MySave } from "@/components/myFunction";

export default function ExchangeRatesPage() {
  // State for dialogs
  const url = `wallet-service/api/v1/exchange-rates`;
  const [activeTab, setActiveTab] = useState("details");
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [editItemOpen, setEditItemOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteItemOpen, setDeleteItemOpen] = useState(false);
  const [viewHistoryOpen, setViewHistoryOpen] = useState(false);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ExchangeRateT>();
  const [exchangeRateItem, setExchangeRateItem] = useState<ExchangeRateT[]>([]);
  const [pagination, setPagination] = useState<PagingT<ExchangeRateT> | null>(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(process.env.NEXT_PUBLIC_PAGE_SIZE ? Number.parseInt(process.env.NEXT_PUBLIC_PAGE_SIZE) : 10);

  // Function to handle opening dialogs for package items
  const handleItemAction = (action: string, item: any) => {
    setSelectedItem(item);

    switch (action) {
      case "viewDetails":
        setViewDetailsOpen(true);
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
      updateCurrency(values);
    }
    // if (deleteItemOpen && selectedItem) deleteCurrency(selectedItem.code);
  };

  useEffect(() => {
    getCurrency();
  }, [page, pageSize]);

  const getCurrency = () => {
    api.get(`${url}`, {
      params: { page, size: pageSize, },
    }).then((res) => {
      const d: ExchangeRateT[] = res.data.data;
      setExchangeRateItem(d);
    }).catch((err) => {
      console.error("error::", err);
    }).finally(() => {
      setAddItemOpen(false);
      setEditItemOpen(false);
      setDeleteItemOpen(false);
      setIsSubmitting(false);
    });
  }

  const updateCurrency = (p: CurrencyT) => {
    setIsSubmitting(true);
    // api.put(`${url}/${selectedItem?.code}`, p).then((res) => {
    //   getCurrency();
    // }).catch((err) => {
    //   setIsSubmitting(false);
    //   console.error("updateBaseFee::", err);
    // });
  }

  const deleteCurrency = (code: string) => {
    setIsSubmitting(true);
    api.delete(`${url}/${code}`).then((res) => {
      getCurrency();
    }).catch((err) => {
      setIsSubmitting(false);
      console.error("deleteBaseFee::", err);
    });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      fromCurrencyCode: formData.get("fromCurrencyCode"),
      toCurrencyCode: formData.get("toCurrencyCode"),
      rate: Number(formData.get("rate")),
      source: formData.get("source"),
      effectiveDate: new Date(
        formData.get("effectiveDate") as string
      ).toISOString(),
    };

    setIsSubmitting(true);
    api.post(`${url}`, payload).then((response) => {
      getCurrency();
    }).catch((error) => {
      setIsSubmitting(false);
      console.error("onSubmit!", error);
    });
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Exchange Rates
          </h1>
          <p className="text-muted-foreground">
            Monitor and manage exchange rate options across all logistic operations. Add new currencies, update existing ones, and ensure accurate exchange rates for seamless international transactions.
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Exchange Rates
                  </p>
                  <h3 className="text-2xl font-bold">{exchangeRateItem?.length ?? 0}</h3>
                </div>
                <div className="rounded-full bg-primary/10 p-3">
                  <CirclePercent className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="all-base-fee" className="w-full">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <TabsList className="flex flex-wrap gap-2 h-full sm:w-max justify-start" >
              <TabsTrigger value="all-base-fee">All Exchange Rates</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <Dialog open={addItemOpen} onOpenChange={setAddItemOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-1" size="sm" onClick={() => setAddItemOpen(true)}>
                    <PackagePlus className="h-4 w-4" />
                    <span className="hidden sm:inline">Add Exchange Rate</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] h-[90vh] sm:h-max overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Exchange Rate</DialogTitle>
                    <DialogDescription>
                      Enter the details for the new exchange rate. Click save
                      when you're done.
                    </DialogDescription>
                  </DialogHeader>
                  <form id="item-form" onSubmit={onSubmit}>
                    <div className="grid gap-4 py-4">

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label>From Currency</Label>
                          <Input name="fromCurrencyCode" placeholder="KHR" required />
                        </div>

                        <div className="grid gap-2">
                          <Label>To Currency</Label>
                          <Input name="toCurrencyCode" placeholder="CNY" required />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label>Rate</Label>
                          <Input name="rate" type="number" step="0.0001" placeholder="6.82" required />
                        </div>

                        <div className="grid gap-2">
                          <Label>Source</Label>
                          <Select name="source" defaultValue="MANUAL">
                            <SelectTrigger>
                              <SelectValue placeholder="Select source" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="MANUAL">MANUAL</SelectItem>
                              <SelectItem value="AUTO">AUTO</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <Label>Effective Date</Label>
                        <Input
                          name="effectiveDate"
                          type="datetime-local"
                          required
                        />
                      </div>

                    </div>
                  </form>
                  <DialogFooter className="flex gap-2">
                    <Button variant="outline" onClick={() => setAddItemOpen(false)}>Cancel</Button>
                    <Button form="item-form" type="submit">{isSubmitting ? "Creating..." : "Create"}</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-10">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
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

          {/* Filters */}
          <div className="my-4 flex gap-4 flex-wrap 2xl:flex-nowrap justify-between">
            <div className="relative w-full min-w-[280px] max-w-[500px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                disabled
                type="search"
                placeholder="Search Name..."
                className="w-full pl-8"
              />
            </div>
          </div>

          {/* Package Table */}
          <TabsContent value="all-base-fee" className="mt-0">
            <Card>

              <CardContent>
                <Table className="whitespace-nowrap">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Nº</TableHead>
                      <TableHead className="w-[100px]">Code</TableHead>
                      <TableHead>Symbol</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Rate</TableHead>
                      <TableHead>Inverse Rate</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Last Updated</TableHead>
                      <TableHead className="w-[70px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {exchangeRateItem?.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell>{index + 1 + (pagination?.currentPage ?? 0) * (pagination?.pageSize ?? 1)}</TableCell>
                        <TableCell className="font-mono text-xs">
                          {item.fromCurrency.code} → {item.toCurrency.code}
                        </TableCell>
                        <TableCell>{item.fromCurrency.symbol} → {item.toCurrency.symbol} </TableCell>
                        <TableCell>{item.fromCurrency.name} → {item.toCurrency.name}</TableCell>
                        <TableCell>{item.rate}</TableCell>
                        <TableCell>{item.inverseRate}</TableCell>
                        <TableCell>
                          {item.isActive ? (<Badge variant="success">Active</Badge>) : (<Badge variant="destructive">Inactive</Badge>)}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.updatedBy}, {FormatTimestamp(item.updatedAt)}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleItemAction("viewDetails", item)
                                }
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleItemAction("editItem", item)
                                }
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Item
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() =>
                                  handleItemAction("deleteItem", item)
                                }
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Item
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
          </TabsContent>

        </Tabs>
      </div>

      {/* View Details Dialog */}
      <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] h-max overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Exchange Rate Details</DialogTitle>
            <DialogDescription>
              Detailed information about {selectedItem?.fromCurrency.code} → {selectedItem?.toCurrency.code} exchange rate.
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

              {/* {activeTab === "details" && (
                <div className="space-y-4 py-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Package ID
                    </h3>
                    <p className="font-medium">{selectedItem.code}</p>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Fee Type
                    </h3>
                    <p>{"selectedItem.feeType"}</p>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Base amount
                    </h3>
                    <p>{"selectedItem.baseAmount"}</p>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Order Type
                      </h3>
                      <div className="flex items-center gap-2">
                        <span>{"selectedItem.orderType"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Note
                      </h3>
                      <div className="flex items-center gap-2">
                        <span>{"selectedItem.note"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        First Created
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedItem.createdBy} {FormatTimestamp(selectedItem.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Last Updated
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedItem.updatedBy} {FormatTimestamp(selectedItem.updatedAt)}
                      </p>
                    </div>

                  </div>

                </div>
              )} */}

              {/* {activeTab === "history" && (
                <div className="space-y-4 py-4">
                  <div className="flex flex-wrap gap-3 items-center justify-between">
                    <h3 className="font-medium">Exchange Rate History</h3>

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
              )} */}

            </>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDetailsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={editItemOpen} onOpenChange={setEditItemOpen}>
        <DialogContent className="sm:max-w-[600px] h-[90vh] sm:h-max overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Exchange</DialogTitle>
            <DialogDescription>
              Update the details for {selectedItem?.fromCurrency.code} → {selectedItem?.toCurrency.code} exchange rate. Click save when you're done.
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <form
              onSubmit={(e) => handleSubmit(e, () => setEditItemOpen(false))}
            >
              {/* <div className="grid gap-4 py-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="editCode">Code</Label>
                    <Input disabled id="editCode" type="text" required placeholder="Enter code" name="code" defaultValue={selectedItem.code} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="editName">Name</Label>
                    <Input id="editName" type="text" required placeholder="Enter name" name="name" defaultValue={selectedItem.name} />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="editSymbol">Symbol</Label>
                    <Input id="editSymbol" type="text" required placeholder="Enter symbol" name="symbol" defaultValue={selectedItem.symbol} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="editDecimalPlaces">Decimal Places</Label>
                    <Input id="editDecimalPlaces" type="number" required placeholder="Enter decimal places" name="decimalPlaces" defaultValue={selectedItem.decimalPlaces} />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="editIsActive">Status</Label>
                    <Select name="isActive" defaultValue={selectedItem.isActive.toString()} >
                      <SelectTrigger id="editIsActive" >
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent >
                        {Status?.map((status) => (
                          <SelectItem key={status.key} value={status.boolean.toString()}>
                            {status.value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div> */}
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
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <MySave />
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Item Dialog */}
      <Dialog open={deleteItemOpen} onOpenChange={setDeleteItemOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Delete Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedItem?.fromCurrency.code} → {selectedItem?.toCurrency.code}? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <div className="py-4">
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-red-800">Warning</h3>
                    <p className="text-sm text-red-700 mt-1">
                      Deleting this item will permanently remove it from your
                      package system. All associated history and data will be
                      lost.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-lg border p-4">
                <h3 className="font-medium">Currency Details</h3>
                <div className="mt-2 space-y-1 text-sm">
                  <div className="flex gap-2">
                    <span>Code:</span>
                    <span className="font-mono">{selectedItem.fromCurrency.code} → {selectedItem.toCurrency.code}</span>
                  </div>
                  <div className="flex gap-2">
                    <span>Name:</span>
                    <span>{selectedItem.fromCurrency.name} → {selectedItem.toCurrency.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <span>Display Symbol:</span>
                    <span>{selectedItem.toCurrency.symbol}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteItemOpen(false)}>
              Cancel
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
      </Dialog>

    </>
  );
}

// Helper Components

// Mock Data

// Import File component for documents tab


