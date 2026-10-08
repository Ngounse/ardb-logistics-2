"use client";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import { MyHashID } from "@/components/myFunction";
import { MyPagination } from "@/components/Pagination";
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
import { toast } from "@/hooks/use-toast";
import api from '@/lib/axios';
import { FormatTimestamp } from "@/lib/function";
import { PagingT } from "@/lib/response";
import { AgentUrl } from "@/lib/ServiceUrl";
import {
  Edit,
  Eye,
  FileText,
  MoreHorizontal,
  Plus,
  Printer,
  RefreshCw,
  Search,
  Trash2
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { AgentForm } from "./AgentForm";
import { useAgentTemplate } from "./AgentTemplateContext";
import { AgentFilters, AgentFormData, AgentT } from "./utility";

export default function AgentPage() {
  // helper to format date strings (date of birth)
  // State for dialogs
  const agentParam = useAgentTemplate();
  const [activeTab, setActiveTab] = useState<'all' | 'CUSTOMER' | 'MERCHANT' | 'DRIVER' | 'AGENT' | 'OPERATOR'>('all');
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [editItemOpen, setEditItemOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteItemOpen, setDeleteItemOpen] = useState(false);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AgentT>();
  const [agentItem, setAgentItem] = useState<AgentFormData[]>([]);
  const [page, setPage] = useState(0);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PagingT<AgentFormData> | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pageSize, setPageSize] = useState(process.env.NEXT_PUBLIC_PAGE_SIZE ? Number.parseInt(process.env.NEXT_PUBLIC_PAGE_SIZE) : 20);
  const [filters, setFilters] = useState<AgentFilters>({
    searchQuery: "",
    agentStatus: "all",
    commissionType: "all"
  })

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
    getAgent();
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1000)
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const data = Object.fromEntries(formData.entries());

    if (isEdit) {
      updateAgent(data);
    } else {
      createAgent(data);
    }
  };


  useEffect(() => {
    getAgent();
  }, [page, pageSize, filters]);

  useEffect(() => {

  }, []);

  const optional = <T,>(value: T | "all") =>
    value === "all" || value === "" ? undefined : value;

  const getAgent = () => {

    api.get(`${AgentUrl}`, {
      params: {
        page,
        size: pageSize,
        code: optional(filters.searchQuery),
        agentStatus: optional(filters.agentStatus),
        commissionType: optional(filters.commissionType),
        sort: "updatedAt,desc",
      }
    }).then((res) => {
      const d: PagingT<AgentFormData> = res.data.data;
      setAgentItem(d.result);
      setPagination(d);

      if (d.result.length == 0) setAgentItem([mock])
    })
      .finally(() => {
        setAddItemOpen(false);
        setEditItemOpen(false);
        setDeleteItemOpen(false);
        setIsSubmitting(false);
      });
  };

  const updateAgent = (data: any) => {
    setIsSubmitting(true);
    api.put(`${AgentUrl}`, data).then((res) => {
      getAgent();
    }).catch((err) => {
      setIsSubmitting(false);
      console.error("error::", err);
    });
  }

  const handleDelete = async () => {
    setIsSubmitting(true);
    await api.delete(`${AgentUrl}/${selectedItem?.id}`).then((res) => {
      getAgent();
    }).finally(() => {
      setIsSubmitting(false);
    })
  };

  const createAgent = (data: any) => {
    setIsSubmitting(true);
    if (data.id == "") data.id = undefined;
    api.post(`${AgentUrl}`, data)
      .then(() => getAgent())
      .catch((error) => {
        console.error("There was an error!", error);
      }).finally(() => {
        setIsSubmitting(false);
      });
  };

  const mock: AgentFormData = {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "agentCode": "string",
    "physicalAddress": "string",
    "city": "string",
    "province": "string",
    "postalCode": "string",
    "country": "string",
    "securityDeposit": 0,
    "latitude": 0,
    "longitude": 0,
    "status": "ACTIVE",
    "bankName": "string",
    "accountNumber": "string",
    "accountName": "string",
    "commissionType": "FLAT",
    "commisionAmount": 0
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Agents Management (In progressing)
          </h1>
          <p className="text-muted-foreground">
            Monitor and manage agent options across all locations
          </p>
        </div>

        {/* Main Content */}
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as any)}
          className="w-full"
        >
          <div className="flex flex-col gap-4 justify-end">
            {/* <TabsList className="flex flex-wrap gap-2 h-full sm:w-max justify-start" >
              <TabsTrigger value="all">All Agents</TabsTrigger> 
              {personTypeOptions.map((pt) => (
                <TabsTrigger key={pt} value={pt}>
                  {pt}
                </TabsTrigger>
              ))} 
            </TabsList> */}
            <div>
              <div className="flex items-center gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isRefreshing} >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
                <Dialog open={addItemOpen} onOpenChange={setAddItemOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-1" size="sm" onClick={() => setAddItemOpen(true)}>
                      <Plus className="h-4 w-4" />
                      <span className="hidden sm:inline">Add</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]  ">
                    <DialogHeader>
                      <DialogTitle>Add New Agent</DialogTitle>
                      <DialogDescription>
                        Enter the details for the new agent item.
                        Click create when you're done.
                      </DialogDescription>
                    </DialogHeader>
                    <AgentForm
                      mode="create"
                      initialData={mock}
                      onSubmit={handleSubmit}
                      onOpenChange={setAddItemOpen}
                      agentparam={agentParam}
                    />

                  </DialogContent>
                </Dialog>

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

          </div>

          {/* Filters */}
          <div className="my-4 flex flex-wrap  gap-4">
            <div className="relative w-full min-w-[280px] max-w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search Code..."
                className="w-full pl-8"
              />
            </div>
            <div className="flex gap-4">
              <div className="relative w-full min-w-[160px] max-w-[280px]">
                <Select value={filters?.commissionType} onValueChange={(value) => setFilters({ ...filters, commissionType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Commission</SelectItem>
                    {agentParam?.commissionType.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="relative w-full min-w-[160px] max-w-[280px]">
                <Select value={filters.agentStatus} onValueChange={(value) => setFilters({ ...filters, agentStatus: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {agentParam?.status.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/*admin Table */}
          <TabsContent value="all" className="mt-0">
            <Card>
              <CardContent>
                <Table className="whitespace-nowrap">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Nº</TableHead>
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead className="w-[100px]">First Name</TableHead>
                      <TableHead className="w-[100px]">Last Name</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>DOB</TableHead>
                      <TableHead>Person Type</TableHead>
                      <TableHead className="text-right">Updated By</TableHead>
                      <TableHead className="text-right">Updated Date</TableHead>
                      <TableHead className="w-[70px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <MyNoItemTableRow name="agent" items={agentItem} />
                    {agentItem?.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell>{index + 1 + (pagination?.currentPage ?? 0) * (pagination?.pageSize ?? 1)}</TableCell>
                        <TableCell className="font-mono text-xs">
                          {MyHashID(item.id)}
                        </TableCell>
                        <TableCell className="font-medium">
                          {item.accountName}
                        </TableCell>
                        <TableCell>
                          {/* <div className="font-medium">
                            {item.lastName}</div> */}
                        </TableCell>
                        <TableCell>{item.bankName}</TableCell>
                        <TableCell>{item.bankName}</TableCell>
                        <TableCell>{item.bankName}</TableCell>
                        <TableCell className="text-right">
                          {item.bankName}
                        </TableCell>
                        <TableCell className="text-right">
                          {/* {FormatTimestamp(item.updatedAt)} */}
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
                                Edit Agent
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() =>
                                  handleItemAction("deleteItem", item)
                                }
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Agent
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
            <DialogTitle>Person Details</DialogTitle>
            <DialogDescription>
              Detailed information about
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-6 py-4">

              {/* Personal Information */}
              <div className="rounded-lg border">
                <div className="border-b px-4 py-3">
                  <h3 className="font-semibold">Personal Information</h3>
                </div>

                <table className="w-full text-sm">
                  <thead><tr><th></th></tr><tr><th></th></tr></thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="w-1/3 bg-muted/30 px-4 py-3 font-medium">
                        Person ID
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{selectedItem.id}</span>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              navigator.clipboard?.writeText(selectedItem.id);
                              toast({
                                title: "Copied to clipboard",
                                description: "Person ID has been copied.",
                              });
                            }}
                          >
                            Copy
                          </Button>
                        </div>
                      </td>
                    </tr>

                    {/* <tr className="border-b">
                      <td className="bg-muted/30 px-4 py-3 font-medium">
                        First Name
                      </td>
                      <td className="px-4 py-3">{selectedItem.firstName}</td>
                    </tr>

                    <tr className="border-b">
                      <td className="bg-muted/30 px-4 py-3 font-medium">
                        Last Name
                      </td>
                      <td className="px-4 py-3">{selectedItem.lastName}</td>
                    </tr>

                    <tr className="border-b">
                      <td className="bg-muted/30 px-4 py-3 font-medium">
                        Gender
                      </td>
                      <td className="px-4 py-3">{selectedItem.gender}</td>
                    </tr> */}

                    <tr>
                      <td className="bg-muted/30 px-4 py-3 font-medium">
                        Date of Birth
                      </td>
                      <td className="px-4 py-3">
                        {/* {FormatDate(selectedItem.dateOfBirth)} */}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Contact Information */}
              <div className="rounded-lg border">
                <div className="border-b px-4 py-3">
                  <h3 className="font-semibold">Contact Information</h3>
                </div>

                <table className="w-full text-sm">
                  <thead><tr><th></th></tr><tr><th></th></tr></thead>
                  {/* <tbody>
                    <tr className="border-b">
                      <td className="w-1/3 bg-muted/30 px-4 py-3 font-medium">
                        Phone
                      </td>
                      <td className="px-4 py-3">{selectedItem.phone}</td>
                    </tr>

                    <tr>
                      <td className="bg-muted/30 px-4 py-3 font-medium">
                        Email
                      </td>
                      <td className="px-4 py-3">{selectedItem.email}</td>
                    </tr>
                  </tbody> */}
                </table>
              </div>

              {/* Employment Information */}
              <div className="rounded-lg border">
                <div className="border-b px-4 py-3">
                  <h3 className="font-semibold">Employment Information</h3>
                </div>

                <table className="w-full text-sm">
                  <thead><tr><th></th></tr><tr><th></th></tr></thead>
                  {/* <tbody>
                    <tr className="border-b">
                      <td className="w-1/3 bg-muted/30 px-4 py-3 font-medium">
                        Person Type
                      </td>
                      <td className="px-4 py-3">{selectedItem.personType}</td>
                    </tr>

                    <tr className="border-b">
                      <td className="bg-muted/30 px-4 py-3 font-medium">
                        Fee Type
                      </td>
                      <td className="px-4 py-3">{selectedItem.feeType}</td>
                    </tr>

                    <tr>
                      <td className="bg-muted/30 px-4 py-3 font-medium">
                        Fee Amount
                      </td>
                      <td className="px-4 py-3 font-semibold">
                        {selectedItem.feeAmount}
                      </td>
                    </tr>
                  </tbody> */}
                </table>
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
            <DialogTitle>Edit Agent</DialogTitle>
            <DialogDescription>
              Update the details for
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (

            <AgentForm
              mode="edit"
              onOpenChange={setEditItemOpen}
              initialData={selectedItem}
              onSubmit={handleSubmit}
              agentparam={agentParam}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Item Dialog */}
      {selectedItem &&
        <DeleteConfirmDialog
          open={deleteItemOpen}
          onOpenChange={setDeleteItemOpen}
          onConfirm={handleDelete}
          loading={isSubmitting}
          itemName={selectedItem?.accountName}
        >
          {selectedItem && (
            <div className="mt-4 rounded-lg border p-4">
              <h3 className="font-medium">Vehicle Details</h3>

              <div className="mt-2 space-y-1 text-sm">
                <div className="flex gap-2">
                  <span>ID:</span>
                  <span>{selectedItem.id}</span>
                </div>

                <div className="flex gap-2">
                  <span>Account Name:</span>
                  <span>{selectedItem.accountName}</span>
                </div>

                <div className="flex gap-2">
                  <span>Bank Name:</span>
                  <span>{selectedItem.bankName}</span>
                </div>
              </div>
            </div>
          )}
        </DeleteConfirmDialog>
      }
    </>
  );
}
