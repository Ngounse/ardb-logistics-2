"use client";
import { MyCancel, MyCreate, MyDelete, MyRequired, MySave } from "@/components/myFunction";
import { FormatByOrderType, FormatKHR } from "@/components/OrderType";
import { MyPagination } from "@/components/Pagination";
import PermissionGuard from "@/components/PermissionGuard";
import { ShipmentPriorityBadge } from "@/components/shipments/shipmentsComponent/shipment-priority-badge";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import api from '@/lib/axios';
import { FormatTimestamp } from "@/lib/function";
import { PagingT } from "@/lib/response";
import { PERMISSIONS } from "@/src/constants/permissions";
import {
  Edit,
  Eye,
  FileText,
  IdCardIcon,
  Loader2,
  MoreHorizontal,
  Plus,
  Printer,
  RefreshCw,
  Search,
  Settings,
  Trash2
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { CommissionRuleForm, CommissionRuleParam, CommissionRuleT, TierPriceForm, TierPriceParam, TierPriceT } from "./utility";

export default function CommissionRulePage() {
  // State for dialogs
  const title = "Commission";
  const description = "Manage commission rules for different order types and fee structures.";

  const urlCommission = `delivery-service/api/v1/commission-rule`;
  const urlTierPrice = `delivery-service/api/v1/tier-price`;
  const [activeMainTab, setActiveMainTab] = useState<"all-commission-rules" | "tiered">("all-commission-rules");
  const [activeTab, setActiveTab] = useState("details");
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [editItemOpen, setEditItemOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteItemOpen, setDeleteItemOpen] = useState(false);
  const [commissionRuleParam, setCommissionRuleParam] = useState<CommissionRuleParam>()
  const [viewHistoryOpen, setViewHistoryOpen] = useState(false);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CommissionRuleT>();
  const [commissionRuleItem, setCommissionRuleItem] = useState<CommissionRuleT[]>([]);
  const [pagination, setPagination] = useState<PagingT<CommissionRuleT> | null>(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(process.env.NEXT_PUBLIC_PAGE_SIZE ? Number.parseInt(process.env.NEXT_PUBLIC_PAGE_SIZE) : 10);
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFilters] = useState<any>({
    id: null,
    orderType: null,
    commissionType: null,
    active: 'all'
  })
  const [ruleForm, setRuleForm] = useState<CommissionRuleForm>({
    fulfillmentType: '',
    commissionType: '',
    amount: 0,
    active: true,
  });

  const [commissionId, setCommissionId] = useState<string | undefined>(undefined);
  const [tierPrice, setTierPrice] = useState<TierPriceT[]>([]);
  const [tierPriceParam, setTierPriceParam] = useState<TierPriceParam>();
  const [addTierPriceOpen, setAddTierPriceOpen] = useState(false);
  const [editTierPriceOpen, setEditTierPriceOpen] = useState(false);
  const [selectedTierPrice, setSelectedTierPrice] = useState<TierPriceT | undefined>(undefined);
  const [deleteTierOpen, setDeleteTierOpen] = useState(false);
  const [tierPriceForm, setTierPriceForm] = useState<TierPriceForm>({
    tierPriceType: 'FLAT',
    amountFrom: 0,
    amountTo: 0,
    amount: 0,
  });

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
      case "tiered":
        setActiveMainTab("tiered");
        break;
      default:
        break;
    }
  };

  // Function to handle opening dialogs for package items
  const handleTieredAction = (action: string, item: any) => {
    setSelectedTierPrice(item)
    switch (action) {
      case "viewDetails":
        setViewDetailsOpen(true);
        break;
      case "tiered":
        setActiveMainTab("tiered");
        break;
      case "editTiered":
        setEditTierPriceOpen(true);
        break;
      case "deleteItem":
        setDeleteTierOpen(true);
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
      updateCommissionRule(values);
    }
  };

  useEffect(() => {
    getParam();
  }, []);

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true)
    if (activeMainTab === "all-commission-rules") getCommissionRule();
    if (activeMainTab === "tiered" && commissionId) getTierPrices();
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1000)
  }

  useEffect(() => {
    const timer = setTimeout(() => { setDebouncedSearch(filters); }, 500);
    setPage(0);
    return () => clearTimeout(timer);
  }, [filters]);

  useEffect(() => {
    if (activeMainTab === "all-commission-rules") {
      getCommissionRule();
    }
  }, [debouncedSearch, page, pageSize]);

  useEffect(() => {
    if (commissionId) getTierPrices();
    else setTierPrice([])
  }, [commissionId]);

  const getCommissionRule = () => {
    api.get(`${urlCommission}`, {
      params: {
        ...filters, page,
        size: pageSize,
        sort: "updatedAt,desc",
        active: filters.active == 'all' ? undefined : filters.active

      },
    }).then((res) => {
      const d: PagingT<CommissionRuleT> = res.data.data
      setPagination(d);
      setCommissionRuleItem(d.result);
    }).catch((err) => {
      console.error("error::", err);
    }).finally(() => {
      setAddItemOpen(false);
      setEditItemOpen(false);
      setDeleteItemOpen(false);
      setIsSubmitting(false);
    });
  }

  const getParam = () => {
    setIsSubmitting(true);
    api.get(`${urlCommission}/param`).then((res) => {
      const d: CommissionRuleParam = res.data.data;
      setCommissionRuleParam(d);
    });
    api.get(`${urlTierPrice}/param`).then((res) => {
      const d: TierPriceParam = res.data.data;
      setTierPriceParam(d);
    });
  }

  const updateCommissionRule = (cr: CommissionRuleT) => {
    setIsSubmitting(true);
    api.put(`${urlCommission}/${cr.id}`, cr).then((res) => {
      getCommissionRule();
    }).catch((err) => {
      setIsSubmitting(false);
      console.error("updateCommissionRule::", err);
    });
  }

  const handleDelete = (id: number, url: string) => {
    setIsSubmitting(true);
    api.delete(`${url}/${id}`).then((res) => {
      setCommissionRuleItem(commissionRuleItem.filter((item) => item.id !== id));
      setDeleteItemOpen(false);
    }).catch((err) => {
      setIsSubmitting(false);
      console.error("deleteCommissionRule::", err);
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
    api.post(`${urlCommission}`, data).then((response) => {
      getCommissionRule();
      setRuleForm({ ...ruleForm, commissionType: commissionRuleParam!.commissionType[0] })
    }).catch((error) => {
      console.error("onSubmit!", error);
    }).finally(() => {
      setIsSubmitting(false);
    });
  };

  const onTierPriceSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget)
    const data: any = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    data.amountTo = tierPriceForm.amountTo == 0 ? null : tierPriceForm.amountTo;
    api.post(`${urlTierPrice}`, data).then((response) => {
      tierPrice.push(response.data.data);
      setAddTierPriceOpen(false);
    }).catch((error) => {
      console.error("onTierPriceSubmit!", error);
    }).finally(() => {
      setIsSubmitting(false);
    });
  };

  const onUpdateTierPriceSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget)
    const data: any = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    data.amountTo = tierPriceForm.amountTo == 0 ? null : tierPriceForm.amountTo;
    api.put(`${urlTierPrice}/${selectedTierPrice?.id}`, data).then((response) => {
      getTierPrices();
    }).catch((error) => {
      console.error("onTierPriceSubmit!", error);
    }).finally(() => {
      setIsSubmitting(false);
    });
  };

  const handleTierDelete = (id: number, url: string) => {
    setIsSubmitting(true);
    api.delete(`${url}/${id}`).then((res) => {
      setTierPrice(tierPrice.filter((item) => item.id !== id));
      setDeleteTierOpen(false);
    }).catch((err) => {
      setIsSubmitting(false);
      console.error("deleteCommissionRule::", err);
    }).finally(() => {
      setIsSubmitting(false);
    });
  };

  const getTierPrices = () => {
    api.get(`${urlTierPrice}/${commissionId}`, {
      params: { sort: "updatedAt,desc" }
    }).then((res) => {
      const d: TierPriceT[] = res.data.data;
      setTierPrice(d);
      setEditTierPriceOpen(false);
    }).catch((err) => {
      console.error("error::", err);
    }).finally(() => {
      setIsSubmitting(false);
    });
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {title}
          </h1>
          <p className="text-muted-foreground">
            {description}
          </p>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="all-commission-rules" value={activeMainTab} onValueChange={(value) => setActiveMainTab(value as any)} className="w-full ">
          <div className="flex  gap-4 xl:flex-row xl:items-center justify-between mb-4">
            <TabsList className="flex flex-wrap gap-2 h-full sm:w-max justify-start" >
              <TabsTrigger value="all-commission-rules">All Commission Rules</TabsTrigger>
              <TabsTrigger value="tiered">Tiered Commission</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <PermissionGuard permission={PERMISSIONS.CREATE_COMMISSION_RULE}>
                <Dialog open={addItemOpen} onOpenChange={setAddItemOpen}>
                  {activeMainTab == 'all-commission-rules' &&
                    <DialogTrigger asChild>
                      <div className="flex items-center gap-2">
                        <Button className="gap-1" size="sm" onClick={() => {
                          setAddItemOpen(true);
                        }}>
                          <Plus className="h-4 w-4" />
                          <span className="hidden sm:inline">Add Rule</span>
                        </Button>
                      </div>
                    </DialogTrigger>
                  }
                  <DialogContent className="sm:max-w-[600px] h-[90vh] sm:h-max overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New Commission Rule</DialogTitle>
                      <DialogDescription>
                        Enter the details for the new commission rule. Click save
                        when you're done.
                      </DialogDescription>
                    </DialogHeader>
                    <form id="item-form" onSubmit={onSubmit} >
                      <div className="grid gap-4 py-4 px-2">
                        <div className="grid sm:grid-cols-1 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="fulfillmentType">Delivery type</Label>
                            <Select name="fulfillmentType"
                              defaultValue={commissionRuleParam?.fulfillmentType[0]}
                              onValueChange={(value) => setRuleForm((current) => ({ ...current, fulfillmentType: value }))} >
                              <SelectTrigger id="fulfillmentType" >
                                <SelectValue placeholder="Select fulfillment type" />
                              </SelectTrigger>
                              <SelectContent >
                                {commissionRuleParam?.fulfillmentType?.map((value) => (
                                  <SelectItem key={value} value={value}>
                                    {value}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="commissionType">Commission Type</Label>
                            <Select name="commissionType"
                              defaultValue={ruleForm.commissionType || commissionRuleParam?.commissionType[0]}
                              onValueChange={(value) => setRuleForm((current) => ({ ...current, commissionType: value }))} >
                              <SelectTrigger id="commissionType" >
                                <SelectValue placeholder="Select commission type" />
                              </SelectTrigger>
                              <SelectContent >
                                {commissionRuleParam?.commissionType?.map((value) => (
                                  <SelectItem key={value} value={value}>
                                    {value}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          {ruleForm.commissionType != 'TIERED' &&
                            (<div className="grid gap-2">
                              <Label htmlFor="Amount">Amount <MyRequired /></Label>
                              <Input
                                id="rule-amount"
                                name="amount"
                                type="number"
                                min={ruleForm.commissionType == 'FLAT' ? 100 : 0}
                                step="any"
                                required
                              />
                            </div>)}

                          {ruleForm.commissionType == 'TIERED' && (
                            <Input
                              id="rule-amount" name="amount" type="hidden"
                              defaultValue={0} min={0} step="any" required />)}
                        </div>
                        <div className="grid sm:grid-cols-1 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="active">Status</Label>
                            <Select name="active" defaultValue={"true"} >
                              <SelectTrigger id="active" >
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent >
                                <SelectItem value="true">Active</SelectItem>
                                <SelectItem value="false">Inactive</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </form>
                    <DialogFooter className="flex gap-2">
                      <Button variant="outline" onClick={() => setAddItemOpen(false)}>
                        <MyCancel />
                      </Button>
                      <Button form="item-form" type="submit">{isSubmitting ? "Creating..." :
                        <MyCreate />
                      }</Button>
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

          {/* Commission Table */}
          <TabsContent value="all-commission-rules" className="mt-0">
            {/* Filters */}
            <div className="my-4 flex gap-4 flex-wrap 2xl:flex-nowrap ">
              <div className="relative min-w-[220px] max-w-[500px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  value={filters.id}
                  onChange={(e) => setFilters({ ...filters, id: e.currentTarget.value })}
                  placeholder="Search ID..."
                  className=" pl-8"
                />
              </div>

              <div className="relative  min-w-[160px] max-w-[500px]">

              </div>
            </div>

            <Card>
              <CardContent>
                <Table className="whitespace-nowrap">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">Nº</TableHead>
                      <TableHead className="w-[50px]">ID</TableHead>
                      <TableHead className="text-center">
                        <Select name="fulfillmentType" defaultValue={filters.orderType || "all"} onValueChange={(value) => setFilters({ ...filters, orderType: value == "all" ? null : value })}>
                          <SelectTrigger id="fulfillmentType" >Order Types </SelectTrigger>
                          <SelectContent >
                            <SelectItem key={null} value={"all"}>
                              All
                            </SelectItem>
                            {commissionRuleParam?.fulfillmentType?.map((value) => (
                              <SelectItem key={value} value={value}>
                                {value}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableHead>
                      <TableHead className="text-center">
                        <Select name="commissionType" defaultValue={filters.commissionType || "all"} onValueChange={(value) => setFilters({ ...filters, commissionType: value == "all" ? null : value })}>
                          <SelectTrigger id="commissionType" >
                            Commission Type
                          </SelectTrigger>
                          <SelectContent >
                            <SelectItem key={null} value={"all"}>
                              All
                            </SelectItem>
                            {commissionRuleParam?.commissionType?.map((value) => (
                              <SelectItem key={value} value={value}>
                                {value}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableHead>
                      <TableHead>
                        <Select name="active" defaultValue={filters.status || "all"} onValueChange={(value) => setFilters({ ...filters, active: value == "all" ? null : value })}>
                          <SelectTrigger id="active" >
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent >
                            <SelectItem key={"Commission-Rule-All"} value={"all"}>
                              All
                            </SelectItem>
                            <SelectItem key={"Commission-Rule-Active"} value={"true"}>
                              Active
                            </SelectItem>
                            <SelectItem key={"Commission-Rule-Inactive"} value={"false"}>
                              Inactive
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </TableHead>
                      <TableHead className="text-right">Updated By</TableHead>
                      <TableHead className="text-right">Updated Date</TableHead>
                      <TableHead className="w-[70px]">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <MyNoItemTableRow colSpan={9} name="commission rule" items={commissionRuleItem} />
                    {commissionRuleItem?.map((item, index) => (
                      <TableRow key={item.id} onDoubleClick={() => handleItemAction("viewDetails", item)}>
                        <TableCell className="text-center">{index + 1 + (pagination?.currentPage ?? 0) * (pagination?.pageSize ?? 1)}</TableCell>
                        <TableCell className="font-mono text-xs text-center">
                          {item.id}
                        </TableCell>
                        <TableCell className="text-center"><ShipmentPriorityBadge priority={item.orderType} /> </TableCell>
                        <TableCell className="text-center">
                          {FormatByOrderType(item.amount, item.commissionType)}
                        </TableCell>
                        <TableCell className="text-center">{CStatusBadge(item.active ? "active" : "inactive")}
                        </TableCell>
                        <TableCell className="text-right"> {item.updatedBy} </TableCell>
                        <TableCell className="text-right"> {FormatTimestamp(item.updatedAt)} </TableCell>

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
                              <PermissionGuard permission={PERMISSIONS.UPDATE_COMMISSION_RULE}>
                                <DropdownMenuItem
                                  onClick={() => {
                                    handleItemAction("editItem", item)
                                    setRuleForm((current) => ({ ...current, commissionType: item.commissionType }))
                                  }
                                  }
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Rule
                                </DropdownMenuItem>
                              </PermissionGuard>
                              <PermissionGuard permission={PERMISSIONS.DELETE_COMMISSION_RULE}>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() =>
                                    handleItemAction("deleteItem", item)
                                  }
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete Rule
                                </DropdownMenuItem>
                              </PermissionGuard>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <PermissionGuard permission={PERMISSIONS.GET_TIER_PRICE}>
                            {(item.commissionType === "TIERED" && item.active == true) && (
                              <Button variant="ghost" size="icon" onClick={() => {
                                handleItemAction("tiered", item)
                                setCommissionId(item.id.toString())
                              }}>
                                <Settings className="h-4 w-4" />
                                <span className="sr-only">Tier price</span>
                              </Button>
                            )}
                          </PermissionGuard>
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

          {/* tier Table */}
          <TabsContent value="tiered" className="mt-0 flex flex-col gap-4">
            {/* Filters */}
            <div className="flex gap-4 flex-wrap 2xl:flex-nowrap justify-between">
              <div className="relative min-w-[220px] max-w-[500px]">
                <Label> Commission Rule ID</Label>
                <IdCardIcon className="absolute left-2.5 bottom-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  readOnly
                  value={commissionId}
                  onChange={(e) => setCommissionId(e.currentTarget.value)}
                  placeholder="Commission ID"
                  className=" pl-8"
                />
              </div>
              {!commissionId && <span className="text-red-[500]">Please select commission rule type (Tiered) </span>}
              {commissionId &&
                <PermissionGuard permission={PERMISSIONS.CREATE_TIER_PRICE}>
                  <Dialog open={addTierPriceOpen} onOpenChange={setAddTierPriceOpen}>
                    <DialogTrigger asChild>
                      <div className="flex items-center gap-2">
                        <Button className="gap-1" variant={commissionId ? 'default' : 'ghost'} size="sm"
                          disabled={!commissionId || commissionId == ""}>
                          <Plus className="h-4 w-4" />
                          <span className="hidden sm:inline">Add Tier Price</span>
                        </Button>
                      </div>

                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] h-[90vh] sm:h-max overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add New Tier Price</DialogTitle>
                        <DialogDescription>
                          Enter the details for the new tier price. Click save
                          when you're done.
                        </DialogDescription>
                      </DialogHeader>
                      <form id="item-form" onSubmit={onTierPriceSubmit} >
                        <input type="hidden" name="commissionRuleId" value={commissionId} />
                        <div className="grid gap-4 py-4 px-2">
                          <div className="grid sm:grid-cols-1 gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="tierPriceType">Tier Price Type</Label>
                              <Select name="tierPriceType"
                                defaultValue={tierPriceForm.tierPriceType || tierPriceParam?.tierPriceType[0]}
                                onValueChange={(value) => setTierPriceForm((current) => ({ ...current, tierPriceType: value }))}
                              >
                                <SelectTrigger id="tierPriceType" >
                                  <SelectValue placeholder="Select fulfillment type" />
                                </SelectTrigger>
                                <SelectContent >
                                  {tierPriceParam?.tierPriceType?.map((value) => (
                                    <SelectItem key={value} value={value}>
                                      {value}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="Amount">Commission  <MyRequired /></Label>
                              <Input
                                id="tier-amount"
                                name="amount"
                                placeholder="Amount"
                                type="number"
                                min={tierPriceForm.tierPriceType == 'FLAT' ? 100 : 0}
                                step="any"
                                required
                              />
                            </div>
                          </div>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="amountFrom">Amount From <MyRequired /></Label>
                              <Input
                                id="amountFrom"
                                name="amountFrom"
                                placeholder="Amount"
                                type="number"
                                min={100}
                                step="any"
                                onChange={(e) => { setTierPriceForm((current) => ({ ...current, amountFrom: Number(e.target.value) })) }}
                                required
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="amountTo">Amount To </Label>
                              <Input
                                id="amountTo"
                                name="amountTo"
                                placeholder="Amount"
                                type="number"
                                onChange={(e) => { setTierPriceForm((current) => ({ ...current, amountTo: Number(e.target.value) })) }}
                                min={0}
                                step="any"
                              />
                            </div>
                          </div>
                        </div>
                      </form>
                      {tierPriceForm?.amountTo != 0 && tierPriceForm?.amountTo <= tierPriceForm?.amountFrom && (
                        <span className="text-red-500">
                          * Amount From is greater than Amount To
                        </span>
                      )}
                      <DialogFooter className="flex gap-2">
                        <Button variant="outline" onClick={() => setAddTierPriceOpen(false)}>
                          <MyCancel />
                        </Button>
                        <Button form="item-form"
                          disabled={tierPriceForm?.amountTo != 0 && tierPriceForm?.amountTo <= tierPriceForm?.amountFrom}
                          type="submit">{isSubmitting ? "Creating..." :
                            <MyCreate />
                          }</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </PermissionGuard>
              }
            </div>

            <Card>
              <CardContent>
                <Table className="whitespace-nowrap">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">Nº</TableHead>
                      <TableHead className="w-[50px]">ID</TableHead>
                      <TableHead className="text-center">Commission</TableHead>
                      <TableHead className="text-center">Amount Range</TableHead>
                      <TableHead className="text-center">Tier Type</TableHead>
                      <TableHead className="text-right">Updated By</TableHead>
                      <TableHead className="text-right">Updated Date</TableHead>
                      <TableHead className="w-[70px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <MyNoItemTableRow colSpan={8} name="tier price" items={tierPrice} />
                    {tierPrice?.map((item, index) => (
                      <TableRow key={item.id} >
                        <TableCell className="text-center">{index + 1 + (pagination?.currentPage ?? 0) * (pagination?.pageSize ?? 1)}</TableCell>
                        <TableCell className="text-center">{item.id}</TableCell>
                        <TableCell className="text-center">  {FormatByOrderType(item.amount, item.tierPriceType)} </TableCell>
                        <TableCell className="text-center"> {FormatKHR(item.amountFrom)} {item.amountTo && '-'} {FormatKHR(item.amountTo)}</TableCell>
                        <TableCell className="text-center">  {item.tierPriceType} </TableCell>
                        <TableCell className="text-right"> {item.updatedBy} </TableCell>
                        <TableCell className="text-right"> {FormatTimestamp(item.updatedAt)} </TableCell>
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
                              <PermissionGuard permission={PERMISSIONS.UPDATE_TIER_PRICE}>
                                <DropdownMenuItem
                                  onClick={() => {
                                    handleTieredAction("editTiered", item)
                                    setTierPriceForm((current) => ({ ...current, tierPriceType: item.tierPriceType, amountFrom: item.amountFrom }))
                                  }}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Tiered
                                </DropdownMenuItem>
                              </PermissionGuard>
                              <PermissionGuard permission={PERMISSIONS.DELETE_TIER_PRICE}>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() =>
                                    handleTieredAction("deleteItem", item)
                                  }
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete Tiered
                                </DropdownMenuItem>
                              </PermissionGuard>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div >

      {/* View Details Dialog */}
      < Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen} >
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] h-max overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{title} Details</DialogTitle>
            <DialogDescription>
              Detailed information about {selectedItem?.orderType} - {selectedItem?.commissionType} commission rule.
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
                      <h3 className="font-semibold">Rule Information</h3>
                    </div>

                    <table className="w-full text-sm">
                      <thead> <tr> <th > </th> <th > </th> </tr> </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="w-1/3 bg-muted/30 px-4 py-3 font-medium">
                            Rule ID
                          </td>
                          <td className="px-4 py-3 font-medium">
                            {selectedItem.id}

                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="bg-muted/30 px-4 py-3 font-medium">
                            Order Type
                          </td>
                          <td className="px-4 py-3">
                            <ShipmentPriorityBadge priority={selectedItem.orderType} />
                          </td>
                        </tr>

                        <tr className="border-b">
                          <td className="bg-muted/30 px-4 py-3 font-medium">
                            Commission Type
                          </td>
                          <td className="px-4 py-3">
                            {selectedItem.commissionType}
                          </td>
                        </tr>

                        <tr className="border-b">
                          <td className="bg-muted/30 px-4 py-3 font-medium">
                            Amount
                          </td>
                          <td className="px-4 py-3 font-semibold">
                            {FormatByOrderType(selectedItem.amount, selectedItem.commissionType)}
                          </td>
                        </tr>

                        <tr className="">
                          <td className="bg-muted/30 px-4 py-3 font-medium">
                            Status
                          </td>
                          <td className="px-4 py-3">
                            {selectedItem?.active ? "Active" : "Inactive"}
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
                      <thead> <tr> <th > </th> <th > </th> </tr> </thead>
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
      </Dialog >

      {/* Edit Item Dialog */}
      < Dialog open={editItemOpen} onOpenChange={setEditItemOpen} >
        <DialogContent className="sm:max-w-[600px] h-[90vh] sm:h-max overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Rule</DialogTitle>
            <DialogDescription>
              Update the details for {<ShipmentPriorityBadge priority={selectedItem?.orderType || ""} />} - {selectedItem?.commissionType} commission rule.
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <form
              onSubmit={(e) => handleSubmit(e, () => setEditItemOpen(false))}
            >
              <div className="grid gap-4 py-4 px-2">
                <div className="grid sm:grid-cols-1 gap-4">
                  <div className="grid gap-2">
                    <Input type="hidden" name="id" defaultValue={selectedItem.id} />
                    <Label htmlFor="fulfillmentType">Order Type</Label>
                    <Select name="fulfillmentType" defaultValue={selectedItem.orderType} >
                      <SelectTrigger id="fulfillmentType" >
                        <SelectValue placeholder="Select fulfillment type" />
                      </SelectTrigger>
                      <SelectContent >
                        {commissionRuleParam?.fulfillmentType?.map((value) => (
                          <SelectItem key={value} value={value}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid sm:grid-cols-1 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="commissionType">Commission Type</Label>
                      <Select name="commissionType" defaultValue={selectedItem.commissionType}
                        onValueChange={(value) => setRuleForm((current) => ({ ...current, commissionType: value }))}
                      >
                        <SelectTrigger id="commissionType" >
                          <SelectValue placeholder="Select commission type" />
                        </SelectTrigger>
                        <SelectContent >
                          {commissionRuleParam?.commissionType?.map((value) => (
                            <SelectItem key={value} value={value}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {ruleForm.commissionType != 'TIERED' &&
                    (<div className="grid gap-2">
                      <Label htmlFor="Amount">Amount  <MyRequired /></Label>
                      <Input
                        id="edit-rule-amount"
                        name="amount"
                        type="number"
                        defaultValue={selectedItem.amount}
                        min={ruleForm.commissionType == 'FLAT' ? 100 : 0}
                        step="any"
                        required
                      />
                    </div>
                    )}
                  {ruleForm.commissionType == 'TIERED' && (
                    <Input
                      id="edit-rule-amount" name="amount" type="hidden"
                      defaultValue={0} min={0} step="any" required />
                  )}
                  <div className="grid sm:grid-cols-1 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="active">Status</Label>
                      <Select name="active" defaultValue={selectedItem.active.toString()} >
                        <SelectTrigger id="active" >
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent >
                          <SelectItem value="true">Active</SelectItem>
                          <SelectItem value="false">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
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
      </Dialog >

      {/* Delete Item Dialog */}
      < Dialog open={deleteItemOpen} onOpenChange={setDeleteItemOpen} >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Delete Rule</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedItem?.orderType}? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <div >
              <div className="rounded-lg border p-4">
                <h3 className="font-medium">Rule Details</h3>
                <div className="mt-2 space-y-1 text-sm">
                  <div className="flex gap-2">
                    <span>ID:</span>
                    <span className="font-mono">{selectedItem.id}</span>
                  </div>
                  <div className="flex gap-2">
                    <span>Commission Type:</span>
                    <span>{selectedItem.commissionType}</span>
                  </div>
                  <div className="flex gap-2">
                    <span>Order Type:</span>
                    <span>{selectedItem.orderType}</span>
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
              onClick={() => handleDelete(selectedItem!.id, urlCommission)}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <MyDelete />
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog >

      <Dialog open={editTierPriceOpen} onOpenChange={setEditTierPriceOpen}>
        <DialogContent className="sm:max-w-[600px] h-[90vh] sm:h-max overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Tier Price</DialogTitle>
            <DialogDescription>
              Enter the details tier price. Click save
              when you're done.
            </DialogDescription>
          </DialogHeader>
          {selectedTierPrice &&
            <form id="item-form" onSubmit={onUpdateTierPriceSubmit} >
              <input type="hidden" name="commissionRuleId" value={commissionId} />
              <div className="grid gap-4 py-4 px-2">
                <div className="grid sm:grid-cols-1 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="tierPriceType">Tier Price Type</Label>
                    <Select name="tierPriceType"
                      defaultValue={selectedTierPrice.tierPriceType || tierPriceParam?.tierPriceType[0]}
                      onValueChange={(value) => setTierPriceForm((current) => ({ ...current, tierPriceType: value }))}>
                      <SelectTrigger id="tierPriceType" >
                        <SelectValue placeholder="Select fulfillment type" />
                      </SelectTrigger>
                      <SelectContent >
                        {tierPriceParam?.tierPriceType?.map((value) => (
                          <SelectItem key={value} value={value}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="Amount">Amount  <MyRequired /></Label>
                    <Input
                      id="tier-amount"
                      name="amount"
                      type="number"
                      min={tierPriceForm.tierPriceType == 'FLAT' ? 100 : 0}
                      step="any"
                      defaultValue={selectedTierPrice.amount}
                      required
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="amountFrom">Amount From  <MyRequired /></Label>
                    <Input
                      id="amountFrom"
                      name="amountFrom"
                      type="number"
                      min={100}
                      step="any"
                      onChange={(e) => { setTierPriceForm((current) => ({ ...current, amountFrom: Number(e.target.value) })) }}
                      defaultValue={selectedTierPrice.amountFrom}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="amountTo">Amount To</Label>
                    <Input
                      id="amountTo"
                      name="amountTo"
                      type="number"
                      min={0}
                      step="any"
                      onChange={(e) => { setTierPriceForm((current) => ({ ...current, amountTo: Number(e.target.value) })) }}
                      defaultValue={selectedTierPrice.amountTo}
                    // required
                    />
                  </div>
                </div>
              </div>
            </form>
          }
          {(tierPriceForm?.amountTo != 0) && tierPriceForm?.amountTo <= tierPriceForm?.amountFrom && (<span className="text-red-500">
            - Amount From is greater than Amount To
          </span>)}
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setEditTierPriceOpen(false)}>
              <MyCancel />
            </Button>
            <Button form="item-form" disabled={tierPriceForm?.amountTo != 0 && tierPriceForm?.amountTo <= tierPriceForm?.amountFrom}
              type="submit">
              <MySave />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Item Dialog */}
      < Dialog open={deleteTierOpen} onOpenChange={setDeleteTierOpen} >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Delete Tier</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete ? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {selectedTierPrice && (
            <div >
              <div className="rounded-lg border p-4">
                <h3 className="font-medium">Tier Details</h3>
                <div className="mt-2 space-y-1 text-sm">
                  <div className="flex gap-2">
                    <span>ID:</span>
                    <span className="font-mono">{selectedTierPrice.id}</span>
                  </div>
                  <div className="flex gap-2">
                    <span>Tier Price Type:</span>
                    <span>{selectedTierPrice.tierPriceType}</span>
                  </div>
                  <div className="flex gap-2">
                    <span>Amount:</span>
                    <span>{FormatByOrderType(selectedTierPrice.amount, selectedTierPrice.tierPriceType)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTierOpen(false)}>
              <MyCancel />
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleTierDelete(selectedTierPrice!.id, urlTierPrice)}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <MyDelete />
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog >

    </>
  );
}
