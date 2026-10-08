"use client";
import { MyCancel, MyCreate, MyDelete, MyHashID, MyRequired, MySave, MySubstring } from "@/components/myFunction";
import { MyPagination } from "@/components/Pagination";
import PermissionGuard from "@/components/PermissionGuard";
import { MySelectContent, MyShowingItem } from "@/components/Showing-item";
import { CStatusBadge } from "@/components/StatusBadge";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Tabs, TabsContent } from "@/components/ui/tabs";
import api from '@/lib/axios';
import { FormatTimestamp } from "@/lib/function";
import { PagingT } from "@/lib/response";
import { PackagesUrl } from "@/lib/ServiceUrl";
import { PERMISSIONS } from "@/src/constants/permissions";
import {
  Edit,
  Eye,
  FileText,
  Loader2,
  MoreHorizontal,
  Plus,
  Printer,
  RefreshCw,
  Search,
  Trash2
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { Status } from "../../utility/utility";
import { PackageT } from "./utility";

export default function PackagePage() {
  // State for dialogs
  const [activeTab, setActiveTab] = useState("details");
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [editItemOpen, setEditItemOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteItemOpen, setDeleteItemOpen] = useState(false);
  const [viewHistoryOpen, setViewHistoryOpen] = useState(false);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PackageT>();
  const [packageItem, setPackageItem] = useState<PackageT[]>([]);
  const [pagination, setPagination] = useState<PagingT<PackageT> | null>(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(process.env.NEXT_PUBLIC_PAGE_SIZE ? parseInt(process.env.NEXT_PUBLIC_PAGE_SIZE) : 10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

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
      updatePackage(values);
    }
    if (deleteItemOpen && selectedItem) deletePackage(selectedItem.id);
  };

  useEffect(() => {
    const timer = setTimeout(() => { setDebouncedSearch(search); }, 500);
    setPage(0)
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setIsSubmitting(true);
    getPackaging(debouncedSearch);
  }, [debouncedSearch, page, size]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    getPackaging();
  };

  const getPackaging = (name = "") => {
    api.get(`${PackagesUrl}`, {
      params: { page, size, name, sort: "updatedAt,desc" },
    }).then((res) => {
      const d: PagingT<PackageT> = res.data.data
      setPagination(d);
      setPackageItem(d.result);
    }).catch((err) => {
      console.error("error::", err);
    }).finally(() => {
      setAddItemOpen(false);
      setEditItemOpen(false);
      setDeleteItemOpen(false);
      setIsSubmitting(false);
      setIsRefreshing(false);
    });
  }

  const updatePackage = (p: PackageT) => {
    setIsSubmitting(true);
    api.put(`${PackagesUrl}/${p.id}`, p).then((res) => {
      getPackaging();
    }).catch((err) => {
      setIsSubmitting(false);
      console.error("error::", err);
    });
  }

  const deletePackage = (id: string) => {
    setIsSubmitting(true);
    api.delete(`${PackagesUrl}/${id}`).then((res) => {
      getPackaging();
      setDeleteItemOpen(false);
    }).catch((err) => {
      console.error(err);
    }).finally(() => {
      setIsSubmitting(false);
    });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget)
    const data: any = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    api.post(`${PackagesUrl}`, data).then((response) => {
      getPackaging();
    }).catch((error) => {
      console.error("There was an error!", error);
    }).finally(() => {
      setIsSubmitting(false);
    });
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Package
          </h1>
          <p className="text-muted-foreground">
            Monitor and manage packaging options across all warehouse locations
          </p>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="all-package" className="w-full">
          <div className="flex gap-4 xl:flex-row xl:items-center justify-between">
            <div className="relative w-full min-w-[280px] max-w-[500px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search name..."
                className="w-full pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
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
              <PermissionGuard permission={PERMISSIONS.PACKAGE_WRITE}>
                <Dialog open={addItemOpen} onOpenChange={setAddItemOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-1" size="sm" onClick={() => setAddItemOpen(true)}>
                      <Plus className="h-4 w-4" />
                      <span className="hidden sm:inline">Add Package</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] h-[90vh] sm:h-max overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New Package</DialogTitle>
                      <DialogDescription>
                        Enter the details for the new package item. Click save
                        when you're done.
                      </DialogDescription>
                    </DialogHeader>
                    <form id="item-form" onSubmit={onSubmit}>
                      <div className="grid gap-4 py-4 px-2">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="packageName">Name  <MyRequired /></Label>
                            <Input id="packageName" required placeholder="Enter package name" name="name" minLength={4} maxLength={100} />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="packageStatus">Status</Label>
                            <Select name="status" defaultValue={Status[0].key} >
                              <SelectTrigger id="packageStatus" >
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent >
                                {Status?.map((status) => (
                                  <SelectItem key={status.key} value={status.key}>
                                    {status.value}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="packageOrder">Order</Label>
                            <Input id="packageOrder" type="number" placeholder="Enter order number" name="orders" />
                          </div>
                        </div>
                      </div>
                    </form>
                    <DialogFooter className="flex gap-2">
                      <Button variant="outline" onClick={() => setAddItemOpen(false)}>
                        <MyCancel />
                      </Button>
                      <Button form="item-form" type="submit">{isSubmitting ? "Creating..." : <MyCreate />}</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </PermissionGuard>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
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

          {/* Filters */}
          <div className="my-4 ">  </div>

          {/* Package Table */}
          <TabsContent value="all-package" className="mt-0">
            <Card>
              <CardContent>
                <Table className="whitespace-nowrap">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">Nº</TableHead>
                      <TableHead className="w-[50px]">Package ID</TableHead>
                      <TableHead>Package Name</TableHead>
                      <TableHead className="w-[100px] text-center">Orders</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-right">Updated By</TableHead>
                      <TableHead className="text-right">Updated Date</TableHead>
                      <TableHead className="w-[70px]">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <MyNoItemTableRow name="package" items={packageItem} />
                    {packageItem?.map((item, index) => (
                      <TableRow key={item.id} className="hover:bg-muted/50" onDoubleClick={() => handleItemAction("viewDetails", item)}>
                        <TableCell className="text-center">
                          {index + 1 + (pagination?.currentPage ?? 0) * (pagination?.pageSize ?? 1)}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {MyHashID(item.id)}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            <MySubstring item={item.name} substring={50} />
                          </div>
                        </TableCell>
                        <TableCell className="w-[10px] text-center">
                          {item.orders}
                        </TableCell>
                        <TableCell className="w-[10px] text-center">
                          {CStatusBadge(item.status)}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.updatedBy}
                        </TableCell>
                        <TableCell className="text-right">
                          {FormatTimestamp(item.updatedAt)}
                        </TableCell>
                        <TableCell className="text-center">
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
                              <PermissionGuard permission={PERMISSIONS.PACKAGE_UPDATE}>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleItemAction("editItem", item)
                                  }
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Package
                                </DropdownMenuItem>
                              </PermissionGuard>
                              <DropdownMenuSeparator />
                              <PermissionGuard permission={PERMISSIONS.PACKAGE_DELETE}>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() =>
                                    handleItemAction("deleteItem", item)
                                  }
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </PermissionGuard>
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
                    <Select defaultValue={size.toString()}
                      onValueChange={(value) => {
                        setPage(0); // reset to first page
                        setSize(Number(value));
                      }} >
                      <MySelectContent />
                    </Select>
                  </div>
                  <div className="grid gap-2 ">

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
            <DialogTitle>Package Details</DialogTitle>
            <DialogDescription>
              Detailed information about {selectedItem?.name.substring(0, 50)}{selectedItem?.name && selectedItem.name.length > 50 && '...'}
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
                {/* <button disabled
                  className={`px-4 py-2 text-sm font-medium  ${activeTab === "history"
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

                  {/* Package Information */}
                  <div className="rounded-lg border">
                    <div className="border-b px-4 py-3">
                      <h3 className="font-semibold">Package Information</h3>
                    </div>
                    <table className="w-full text-sm">
                      <thead>
                        <tr>
                          <th scope="col" className="w-1/3 px-4 py-2 text-left font-medium">
                          </th>
                          <th scope="col" className="px-4 py-2 text-left font-medium">
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="w-1/3 bg-muted/30 px-4 py-3 font-medium">
                            Package ID
                          </td>
                          <td className="px-4 py-3 font-medium">
                            {selectedItem.id}
                          </td>
                        </tr>

                        <tr>
                          <td className="bg-muted/30 px-4 py-3 font-medium">
                            Package Name
                          </td>
                          <td className="px-4 py-3 break-words">
                            {selectedItem.name}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Status */}
                  <div className="rounded-lg border">
                    <div className="border-b px-4 py-3">
                      <h3 className="font-semibold">Status</h3>
                    </div>

                    <table className="w-full text-sm">
                      <thead>
                        <tr>
                          <th scope="col" className="w-1/3 px-4 py-2 text-left font-medium">
                          </th>
                          <th scope="col" className="px-4 py-2 text-left font-medium">
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="w-1/3 bg-muted/30 px-4 py-3 font-medium">
                            Current Status
                          </td>
                          <td className="px-4 py-3 flex items-center gap-2">
                            {CStatusBadge(selectedItem.status)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="rounded-lg border">
                    <div className="border-b px-4 py-3">
                      <h3 className="font-semibold">Orders</h3>
                    </div>

                    <table className="w-full text-sm">
                      <thead>
                        <tr>
                          <th scope="col" className="w-1/3 px-4 py-2 text-left font-medium">
                          </th>
                          <th scope="col" className="px-4 py-2 text-left font-medium">
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="w-1/3 bg-muted/30 px-4 py-3 font-medium">
                            Order Number
                          </td>
                          <td className="px-4 py-3">
                            {selectedItem.orders}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Audit Information */}
                  <div className="rounded-lg border">
                    <div className="border-b px-4 py-3">
                      <h3 className="font-semibold">Audit Information</h3>
                    </div>

                    <table className="w-full text-sm">
                      <thead>
                        <tr>
                          <th scope="col" className="w-1/3 px-4 py-2 text-left font-medium">
                          </th>
                          <th scope="col" className="px-4 py-2 text-left font-medium">
                          </th>
                        </tr>
                      </thead>
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
            <DialogTitle>Edit Package</DialogTitle>
            <DialogDescription>
              Update the details for {selectedItem?.name.substring(0, 5)}...
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <form
              onSubmit={(e) => handleSubmit(e, () => setEditItemOpen(false))}
            >
              <div className="grid gap-4 py-4 px-2">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    id="edit-item-id"
                    type="hidden"
                    name="id"
                    defaultValue={selectedItem.id}
                  />
                  <div className="grid gap-2">
                    <Label htmlFor="edit-item-name">Item Name</Label>
                    <Input
                      id="edit-item-name"
                      minLength={4} maxLength={100}
                      name="name"
                      defaultValue={selectedItem.name}
                    />
                  </div>
                  <div className="grid gap-2" >
                    <Label htmlFor="edit-category">Status</Label>
                    <Select
                      defaultValue={selectedItem.status} name="status">
                      <SelectTrigger id="edit-category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Status?.map((status) => (
                          <SelectItem key={status.key} value={status.key}>
                            {status.value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-item-order">Order</Label>
                    <Input id="edit-item-order" type="number" placeholder="Enter order number" min="0" step={"1"} defaultValue={selectedItem.orders} name="orders" />
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
            <DialogTitle>Delete Package</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <div className="rounded-lg border p-4">
              <h3 className="font-medium">Package Details</h3>
              <div className="mt-2 space-y-1 text-sm">
                <div className="flex gap-2">
                  <span>ID:</span>
                  <span className="font-mono"> {selectedItem.id}</span>
                </div>
                <div className="flex gap-2">
                  <span>Name:</span>
                  <span> {selectedItem.name}</span>
                </div>
                <div className="flex gap-2">
                  <span>Status:</span>
                  <span> {CStatusBadge(selectedItem.status)} </span>
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
              ) : (<MyDelete />)}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </>
  );
}
