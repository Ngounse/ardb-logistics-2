"use client";
import { MyBusinessTypeBadge } from "@/components/BusinessTypeBadge";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import { MyClose, MyHashID, MyOptionalParams, MytoUpperCase } from "@/components/myFunction";
import { MyPagination } from "@/components/Pagination";
import PermissionGuard from "@/components/PermissionGuard";
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
  DialogTrigger
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
import { InformationAudit, InformationMerchant, InformationPersonal } from "@/components/viewDetails/InformationCard";
import api from '@/lib/axios';
import { FormatTimestamp } from "@/lib/function";
import { PagingT } from "@/lib/response";
import { MerchantUrl } from "@/lib/ServiceUrl";
import { PERMISSIONS } from "@/src/constants/permissions";
import {
  Edit,
  Eye,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  Trash2
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { MerchantForm } from "./MerchantForm";
import { useAgentTemplate } from "./MerchantTemplateContext";
import { MerchantFilters, MerchantFormData, MerchantT } from "./utility";

export default function AgentPage() {
  const url = MerchantUrl;
  const merchantParam = useAgentTemplate();
  const [activeTab, setActiveTab] = useState<'all' | 'CUSTOMER' | 'MERCHANT' | 'DRIVER' | 'AGENT' | 'OPERATOR'>('all');
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [editItemOpen, setEditItemOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteItemOpen, setDeleteItemOpen] = useState(false);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MerchantFormData>();
  const [merchantItem, setMerchantItem] = useState<MerchantT[]>([]);
  const [page, setPage] = useState(0);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PagingT<MerchantT> | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pageSize, setPageSize] = useState(process.env.NEXT_PUBLIC_PAGE_SIZE ? Number.parseInt(process.env.NEXT_PUBLIC_PAGE_SIZE) : 20);
  const [filters, setFilters] = useState<MerchantFilters>({
    shopName: "",
    businessType: "all",
    sort: "createdAt,desc"
  })

  const [search, setSearch] = useState<string>();

  // Function to handle opening dialogs for package items
  const handleItemAction = (action: string, item: any) => {
    setSelectedItem(item);
    setIsEdit(false)
    switch (action) {
      case "viewDetails":
        setViewDetailsOpen(true);
        break;
      case "editItem":
        setEditItemOpen(true);
        setIsEdit(true)
        break;
      case "deleteItem":
        setDeleteItemOpen(true);
        break;
      default:
        break;
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true)
    getMerchant();
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1000)
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const data = Object.fromEntries(formData.entries());

    if (isEdit && data.id) {
      updateMerchant(data);
    } else {
      createMerchant(data);
    }
  };

  useEffect(() => {
    getMerchant();
  }, [page, pageSize, filters]);

  useEffect(() => {
    setIsRefreshing(true)
    const timer = setTimeout(() => {
      setFilters((currentFilters) => ({
        ...currentFilters,
        shopName: search ?? "",
      }))
    }, 380)
    return () => clearTimeout(timer);
  }, [search]);

  const getMerchant = () => {

    api.get(`${url}`, {
      params: {
        page,
        size: pageSize,
        shopName: MyOptionalParams(filters.shopName),
        businessType: MyOptionalParams(filters.businessType),
        sort: filters.sort,
      }
    }).then((res) => {
      const d: PagingT<MerchantT> = res.data.data;
      setMerchantItem(d.result);
      setPagination(d);
    })
      .finally(() => {
        setAddItemOpen(false);
        setEditItemOpen(false);
        setDeleteItemOpen(false);
        setIsSubmitting(false);
        setIsRefreshing(false)
      });
  };

  const updateMerchant = (data: any) => {
    setIsSubmitting(true);
    api.put(`${url}/${data.id}`, data).then((res) => {
      getMerchant();
    }).catch((err) => {
      console.error("error::", err);
    }).finally(() => {
      setIsSubmitting(false);
    })
  }

  const handleDelete = async () => {
    setIsSubmitting(true);
    await api.delete(`${url}/${selectedItem?.merchantId}`).then((res) => {
      getMerchant();
    }).finally(() => {
      setIsSubmitting(false);
    })
  };

  const createMerchant = (data: any) => {
    setIsSubmitting(true);
    if (data.id == "") data.id = undefined;
    api.post(`${url}`, data)
      .then(() => getMerchant())
      .catch((error) => {
        console.error("There was an error!", error);
      }).finally(() => {
        setIsSubmitting(false);
      });
  };

  // const getMerchantById = () => {
  //   setIsSubmitting(true);
  //   api.get(`${url}/${'355b994f-7af6-4091-9f90-1d0ae60b9ef1'}`, {}).then((res) => {
  //     // const d: PagingT<MerchantT> = res.data.data;
  //     // setMerchantItem(d.result);
  //     // setPagination(d);
  //     console.log("res::", res);
  //     // if (d.result.length == 0) setAgentItem([mock])
  //   })
  // };

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Merchants Management
          </h1>
          <p className="text-muted-foreground">
            Monitor and manage merchant options across all locations
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as any)}
          className="w-full"
        >
          <div className="flex flex-col gap-4 justify-end">
            <div>

            </div>
          </div>

          <div className="mb-4 flex flex-wrap  gap-4">
            <div className="relative w-full min-w-[280px] max-w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Shop Name..."
                className="w-full pl-8"
              />
            </div>
            <div className="flex gap-4">
              <div className="relative w-full min-w-[160px] max-w-[280px]">
                <Select value={filters?.businessType} onValueChange={(value) => setFilters({ ...filters, businessType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Business" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Business</SelectItem>
                    {merchantParam?.businessType.map((type) => (
                      <SelectItem key={type} value={type}>
                        {MytoUpperCase(type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="ml-auto">
              <div className="flex items-center gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={handleRefresh}
                  disabled={isRefreshing} >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""} `} />
                  Refresh
                </Button>
                <PermissionGuard permission={PERMISSIONS.CREATE_MERCHANT}>
                  <Dialog open={addItemOpen} onOpenChange={setAddItemOpen}>
                    <DialogTrigger asChild>
                      <Button className="gap-1" size="sm" onClick={() => setAddItemOpen(true)}>
                        <Plus className="h-4 w-4" />
                        <span className="hidden sm:inline">Add</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] h-[100vh] sm:h-max overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add New Merchant</DialogTitle>
                        <DialogDescription>
                          Enter the details for the new merchant item.
                          Click create when you're done.
                        </DialogDescription>
                      </DialogHeader>
                      <MerchantForm
                        mode="create"
                        onSubmit={handleSubmit}
                        onOpenChange={setAddItemOpen}
                        agentparam={merchantParam}
                      />

                    </DialogContent>
                  </Dialog>
                </PermissionGuard>
              </div>
            </div>
          </div>

          <TabsContent value="all" className="mt-0">
            <Card>
              <CardContent>
                <Table className="whitespace-nowrap">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px] text-center">Nº</TableHead>
                      <TableHead className="w-[120px] ">ID</TableHead>
                      <TableHead className="text-center">Shop Name</TableHead>
                      <TableHead className="w-[120px] text-center">Business Type</TableHead>
                      <TableHead className="w-[120px]">Owner</TableHead>
                      <TableHead className="w-[120px] text-center">Phone</TableHead>
                      <TableHead className="w-[120px] text-center">Created Date</TableHead>
                      <TableHead className="w-[120px] text-center">Updated Date</TableHead>
                      <TableHead className="w-[70px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <MyNoItemTableRow name="agent" items={merchantItem} />
                    {merchantItem?.map((item, index) => (
                      <TableRow key={item.merchantId} className="hover:bg-muted" onDoubleClick={() => handleItemAction("viewDetails", item)}>
                        <TableCell className="text-center">{index + 1 + (pagination?.currentPage ?? 0) * (pagination?.pageSize ?? 1)}</TableCell>
                        <TableCell className="font-mono text-xs text-center">
                          {MyHashID(item.merchantId)}
                        </TableCell>
                        <TableCell className="font-medium">
                          {item.shopName}
                        </TableCell>
                        <TableCell className="text-center"> {MyBusinessTypeBadge(item.businessType)}</TableCell>
                        <TableCell>{item.person.lastName} {item.person.firstName}</TableCell>
                        <TableCell className="text-center">
                          {item.person.phone}
                        </TableCell>
                        <TableCell className="text-center">
                          {FormatTimestamp(item.createdAt)}
                        </TableCell>
                        <TableCell className="text-center">
                          {FormatTimestamp(item.updatedAt)}
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
                              <PermissionGuard permission={PERMISSIONS.UPDATE_MERCHANT}>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleItemAction("editItem", item)
                                  }
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Merchant
                                </DropdownMenuItem>
                              </PermissionGuard>
                              <PermissionGuard permission={PERMISSIONS.DELETE_MERCHANT}>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() =>
                                    handleItemAction("deleteItem", item)
                                  }
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete Merchant
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

      <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
        <DialogContent className="sm:max-w-[770px] h-[100vh] sm:h-max overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Merchant Details</DialogTitle>
            <DialogDescription>
              Detailed information about
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-6 sm:h-[80vh] md:h-[60vh] overflow-y-auto py-2 pr-2">

              <InformationMerchant merchant={selectedItem} />
              <InformationPersonal person={selectedItem.person} />
              <InformationAudit item={selectedItem} />
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDetailsOpen(false)}>
              <MyClose />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editItemOpen} onOpenChange={setEditItemOpen}>
        <DialogContent className="sm:max-w-[600px] h-[90vh] sm:h-max overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Merchant</DialogTitle>
            <DialogDescription>
              Update the details for {selectedItem?.person.firstName}  {selectedItem?.person.lastName}
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <MerchantForm
              mode="edit"
              onOpenChange={setEditItemOpen}
              initialData={selectedItem}
              onSubmit={handleSubmit}
              agentparam={merchantParam}
            />
          )}
        </DialogContent>
      </Dialog>

      {selectedItem &&
        <DeleteConfirmDialog
          open={deleteItemOpen}
          onOpenChange={setDeleteItemOpen}
          onConfirm={handleDelete}
          loading={isSubmitting}
          itemName={selectedItem?.shopName}
        >
          {selectedItem && (
            <div className="mt-4 rounded-lg border p-4">
              <h3 className="font-medium">Merchant Details</h3>

              <div className="mt-2 space-y-1 text-sm">
                <div className="flex gap-2">
                  <span>ID:</span>
                  <span>{selectedItem.merchantId}</span>
                </div>

                <div className="flex gap-2">
                  <span>Shop Name:</span>
                  <span>{selectedItem.shopName}</span>
                </div>

                <div className="flex gap-2">
                  <span>Business Type:</span>
                  <span>{MyBusinessTypeBadge(selectedItem.businessType)}</span>
                </div>
              </div>
            </div>
          )}
        </DeleteConfirmDialog>
      }
    </>
  );
}
