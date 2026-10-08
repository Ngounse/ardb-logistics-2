"use client";
import PopupAlert from "@/components/ErrorProvider/PopupAlert";
import { MyPagination } from "@/components/Pagination";
import { ShipmentStatusBadge } from "@/components/shipments/shipment-status-badge";
import { MySelectContent, MyShowingItem } from "@/components/Showing-item";
import { CStatusBadge } from "@/components/StatusBadge";
import { MyNoItemTableRow } from "@/components/table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription
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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import { DetailRow } from "@/components/viewDetails/DetailRow";
import { DetailSection } from "@/components/viewDetails/DetailSection";
import { toast } from "@/hooks/use-toast";
import api from '@/lib/axios';
import { FormatDateTimestamp, FormatTimestamp } from "@/lib/function";
import { PagingT } from "@/lib/response";
import {
  AlertTriangle,
  Badge,
  Eye,
  FileText,
  Filter,
  Loader2,
  Mail,
  Phone,
  Printer,
  RefreshCw,
  Search,
  User,
  X
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { VehicleParam } from "../../fleet/vehicles/utility";
import { DriverFiltersComponent, DriverFiltersProps, DriverTableBody, RegistrationTableBody, RegistrationTableHeader, RequestTableBody, RequestTableHeader } from "./component";
import { DriverDetailView } from "./detail";
import { BecomeFilters, DriverFilters, DriverParams, DriverT, DriverParam, Registration, StatusLog, RegistrationFilters } from "./utility";
import { MyCancel, MyHandleCopy, MySave, MySubstring } from "@/components/myFunction";
import PermissionGuard from "@/components/PermissionGuard";
import { PERMISSIONS } from "@/src/constants/permissions";

const DriverTableHeader = ({
  filters,
  onFiltersChange,
  params,
}: DriverFiltersProps) => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[50px]">Nº</TableHead>
        <TableHead className="w-[50px]">Driver ID</TableHead>
        <TableHead className="w-[100px]">Full Name</TableHead>
        <TableHead>Phone Number</TableHead>
        <TableHead className="w-[120px]">
          <Select value={filters.driverType} onValueChange={(value) => onFiltersChange({ driverType: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Driver Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Driver Type</SelectItem>
              {params?.driverType?.map((type: string) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </TableHead>
        <TableHead>
          <Select value={filters.licenseType} onValueChange={(value) => onFiltersChange({ licenseType: value })}>
            <SelectTrigger>
              <SelectValue placeholder="License Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">License Type</SelectItem>
              {params?.licenseType?.map((type: string) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </TableHead>
        <TableHead>Zone</TableHead>
        <TableHead>
          <Select value={filters.driverStatus} onValueChange={(value) => onFiltersChange({ driverStatus: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {params?.driverStatus?.map((type: string) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </TableHead>
        <TableHead className="w-[70px]"></TableHead>
      </TableRow>
    </TableHeader>
  );
};

// Helper function to check if button should be disabled
const BtnReview = (status: string) => {
  return status == "APPROVED" || status == "REJECT";
}

// Helper function to format ISO date to input format
const formatForInput = (isoString: string) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

// Initialize default filter state
const getInitialFilters = (): DriverFilters => ({
  employeeCode: "",
  driverStatus: "all",
  driverType: "all",
  licenseType: "all",
  licenseNumber: "",
  name: "",
});

// Initialize default page size
const getInitialPageSize = (): number =>
  process.env.NEXT_PUBLIC_PAGE_SIZE ? Number.parseInt(process.env.NEXT_PUBLIC_PAGE_SIZE) : 20;

export default function DriverListPage() {
  // State for dialogs
  const becomeUrl = `person-service/api/v1/become-driver`;
  const driverUrl = `person-service/api/v1/driver`;
  const vehicleUrl = `vehicle-service/api/v1/vehicle`;

  // UI State
  const [activeTab, setActiveTab] = useState<'DRIVER' | 'REGISTRATION' | 'REQUEST'>('DRIVER');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [note, setNote] = useState("");
  const [discText, setDiscText] = useState('View all approved drivers and manage their information.');

  // Dialog State
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [editItemOpen, setEditItemOpen] = useState(false);
  const [deleteItemOpen, setDeleteItemOpen] = useState(false);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Data State
  const [selectedItem, setSelectedItem] = useState<DriverParams | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<DriverParams | null>(null);
  const [statusLogs, setStatusLogs] = useState<StatusLog[]>([]);
  const [isRegistered, setIsRegistered] = useState(false);

  // Pagination State
  const [pageRe, setPageRe] = useState(0);
  const [pageBe, setPageBe] = useState(0);
  const [pageDriver, setPageDriver] = useState(0);
  const [size, setSize] = useState(getInitialPageSize());

  // List Data State
  const [reqBecome, setReqBecome] = useState<DriverParams[]>([]);
  const [pendingRegistration, setPendingRegistration] = useState<Registration[]>([]);
  const [driverList, setDriverList] = useState<DriverT[]>([]);

  // Pagination Info State
  const [paginationDriver, setPaginationDriver] = useState<PagingT<DriverParams> | null>(null);
  const [paginationRe, setPaginationRe] = useState<PagingT<Registration> | null>(null);
  const [paginationBecame, setPaginationBecame] = useState<PagingT<DriverParams> | null>(null);

  // Template State
  const [driverParam, setDriverParam] = useState<DriverParam>();
  const [vehicleParam, setVehicleParam] = useState<VehicleParam>();

  // Filter State
  const [filters, setFilters] = useState<DriverFilters>(getInitialFilters());
  const [filtersRe, setFiltersRe] = useState<RegistrationFilters>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: 'all',
    approvalStatus: ''
  });
  const [emptyFiltersRe, setEmptyFiltersRe] = useState<RegistrationFilters>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: 'all',
    approvalStatus: ''
  });

  const [filtersBecome, setFiltersBecome] = useState<BecomeFilters>({
    id: '',
    personId: '',
    licenseNumber: '',
    status: 'PENDING',
  });
  const BecomeParamStatus = ['PENDING', 'REVIEW', 'APPROVED', 'REJECT']
  const [isfiltersBecome, setIsfiltersBecome] = useState<boolean>(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeTab === "DRIVER") { getDriverList(); }
      if (activeTab === "REQUEST") {
        // Fetch become-driver list when searching by full-id/personId or when no id filters are set
        if (
          filtersBecome.id.length >= 26 ||
          filtersBecome.personId.length >= 26 ||
          (filtersBecome.id.length === 0 && filtersBecome.personId.length === 0)
        ) {
          getBecomeDriver();
        }
      }
    }, 500);
    setPageDriver(0);
    return () => clearTimeout(timer);
  }, [filters, filtersBecome]);

  // Helper function to clear all filters
  const clearFilters = () => {
    setFilters(getInitialFilters());
  };

  // Handle item actions with simplified logic
  const handleItemAction = (action: string, item: any, isReg: boolean) => {
    setSelectedItem(item);
    setIsRegistered(isReg);

    const actionMap: Record<string, () => void> = {
      viewDetails: () => {
        setViewDetailsOpen(true);
        getById(item.id);
      },
      editItem: () => setEditItemOpen(true),
      deleteItem: () => setDeleteItemOpen(true),
    };
    actionMap[action]?.();
  };

  const getParamData = () => {
    api.get(`${vehicleUrl}/param`).then((res) => {
      const d: VehicleParam = res.data.data;
      setVehicleParam(d);
    });

    api.get(`${driverUrl}/param`, {
    }).then((res) => {
      const d: DriverParam = res.data.data;
      setDriverParam(d);
    })
  };

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>,
    closeFunction: () => void
  ) => {
    e.preventDefault();

    if (editItemOpen) {
      const formData = new FormData(e.currentTarget);
      const values: any = {};
      formData.forEach((value, key) => {
        values[key] = value;
      });

      values.licenseIssueDate = new Date(values.licenseIssueDate).toISOString();
      values.licenseExpiryDate = new Date(values.licenseExpiryDate).toISOString();

      updateMyrequest(values);
      closeFunction();
    }

    if (deleteItemOpen && selectedItem) {
      deleteMyrequest(selectedItem.id);
    }
  };

  useEffect(() => {
    getParamData();
  }, []);

  useEffect(() => {
    if (activeTab === "DRIVER") {
      getDriverList();
    }
  }, [activeTab, pageDriver, size]);

  useEffect(() => {
    if (activeTab === "REGISTRATION") {
      getRe();
    }
  }, [activeTab, pageRe, size]);

  useEffect(() => {
    if (activeTab === "REQUEST") {
      getBecomeDriver();
    }
  }, [activeTab, pageBe, size]);

  useEffect(() => {
    setIsRefreshing(true)
    const timer = setTimeout(() => {
      getRe();
    }, 380)
    return () => clearTimeout(timer);
  }, [filtersRe]);

  const getListByCase = () => {
    switch (activeTab) {
      case "DRIVER":
        getDriverList();
        break;
      case "REGISTRATION":
        getRe();
        break;
      case "REQUEST":
        getBecomeDriver();
        break;
      default:
        break;
    }
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    getListByCase();
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1000)
  };

  const getById = (id: string) => {
    const url = isRegistered ? `${driverUrl}/pending-registration/${id}` : `${becomeUrl}/${id}`;
    api.get(url, {
    }).then((res) => {
      const d = res.data.data;
      if (!isRegistered) {
        setSelectedItem(d.request);
        setStatusLogs(d.statusLogs);
      } else {
        setSelectedItem(res.data);
        setStatusLogs([]);
      }
    })
  };

  const formatForInput = (isoString: string) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const getBecomeDriver = () => {
    api.get(`${becomeUrl}`, {
      params: {
        page: pageBe,
        size,
        id: filtersBecome.id == '' ? undefined : filtersBecome.id,
        personId: filtersBecome.personId == '' ? undefined : filtersBecome.personId,
        licenseNumber: filtersBecome.licenseNumber == '' ? undefined : filtersBecome.licenseNumber,
        status: filtersBecome.status == 'all' ? undefined : filtersBecome.status,
      }
    }).then((res) => {
      const d: PagingT<DriverParams> = res.data.data;
      setReqBecome(d.result);
      setPaginationBecame(d);
    })
      .finally(() => {
        setAddItemOpen(false);
        setEditItemOpen(false);
        setDeleteItemOpen(false);
        setIsSubmitting(false);
      });
  };

  const getRe = () => {
    api.get(`${driverUrl}/pending-registration`, {
      params: {
        page: pageRe,
        size: size,
        firstName: filtersRe.firstName == '' ? undefined : filtersRe.firstName,
        lastName: filtersRe.lastName == '' ? undefined : filtersRe.lastName,
        email: filtersRe.email == '' ? undefined : filtersRe.email,
        phone: filtersRe.phone == '' ? undefined : filtersRe.phone,
        gender: filtersRe.gender == 'all' ? undefined : filtersRe.gender,
        approvalStatus: filtersRe.approvalStatus == 'all' || filtersRe.approvalStatus == '' ? undefined : filtersRe.approvalStatus,
      }
    }).then((res) => {
      const d: PagingT<Registration> = res.data.data;
      setPendingRegistration(d.result);
      setPaginationRe(d);
    })
      .finally(() => {
        setAddItemOpen(false);
        setEditItemOpen(false);
        setDeleteItemOpen(false);
        setIsSubmitting(false);
        setIsRefreshing(false);
      });
  };

  const getDriverList = () => {
    api.get(`${driverUrl}`, {
      params: {
        page: pageDriver,
        size,
        employeeCode: filters.employeeCode == '' ? undefined : filters.employeeCode,
        licenseNumber: filters.licenseNumber == '' ? undefined : filters.licenseNumber,
        driverStatus: filters.driverStatus == 'all' ? undefined : filters.driverStatus,
        driverType: filters.driverType == 'all' ? undefined : filters.driverType,
        licenseType: filters.licenseType == 'all' ? undefined : filters.licenseType,
        name: filters.name == '' ? undefined : filters.name,
      }
    }).then((res) => {
      const d: PagingT<DriverT> = res.data.data;
      setDriverList(d.result);
      setPaginationDriver(d)
    })
      .finally(() => {
        setAddItemOpen(false);
        setEditItemOpen(false);
        setDeleteItemOpen(false);
        setIsSubmitting(false);
      });
  };

  const updateMyrequest = (data: DriverParams) => {
    setIsSubmitting(true);
    api.put(`${isRegistered ? driverUrl : becomeUrl}/${selectedItem?.id}`, data).then((res) => {
      // getMyReqList();
    }).catch((err) => {
      setIsSubmitting(false);
      console.error("error::", err);
    });
  }

  const deleteMyrequest = (id: string) => {
    setIsSubmitting(true);
    api.delete(`${isRegistered ? driverUrl : becomeUrl}/${id}`).then((res) => {
      // getMyReqList();
    }).catch((err) => {
      setIsSubmitting(false);
      console.error("error::", err);
    });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget)
    const issue = formData.get("licenseIssueDate") as string;   // "2026-04-30T10:35"
    const expiry = formData.get("licenseExpiryDate") as string;
    const data: any = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    setIsSubmitting(true);
    const payload = {
      ...data,
      licenseIssueDate: new Date(issue).toISOString(),
      licenseExpiryDate: new Date(expiry).toISOString(),
    };
    api.post(`${isRegistered ? driverUrl : becomeUrl}`, payload)
      .then(() => getBecomeDriver())
      .catch((error) => {
        console.error("There was an error!", error);
      }).finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleStatus = async (
    action: "review" | "approve" | "reject"
  ) => {
    if (!selectedItem) return;
    if (note.length < 1) {
      toast({
        variant: "destructive",
        title: "Approval Decision",
        description: "Must have a reasonable note.",
      });
      return
    }
    try {
      setIsSubmitting(true);
      const becomePayload = { note, becomeDriverId: selectedItem.id, };
      const RegisterPayload = { note, id: selectedItem.id }

      await api.put(`${isRegistered ? driverUrl : becomeUrl}/${action}`, isRegistered ? RegisterPayload : becomePayload).then((res) => {
        if (isRegistered) {
          setSelectedItem(res.data.data)
          setPendingRegistration(pendingRegistration.map((v) =>
            v.id === res.data.data.id ? res.data.data : v
          ))
        }
        else {
          getById(selectedItem.id);
          setReqBecome(reqBecome.map((v) =>
            v.id === res.data.data.id ? res.data.data : v
          ))
        }
        toast({
          variant: "default",
          title: res.data.message,
          description: note,
        });
        setNote("");
      }).catch((err: any) => {
        setPopupMessage(
          err.response?.data?.message ??
          `Failed to ${action} the request.`
        );
        // setPopupOpen(true);
      });

      // Refresh list
      // getMyReqList();

      // Close dialog if desired
      // setViewDetailsOpen(false);

    } catch (err: any) {
      console.log("err::", err);

    } finally {
      getListByCase();
      setIsSubmitting(false);
      setViewDetailsOpen(false);
    }
  };

  const BtnReview = (status: string | undefined) => {
    return status == "APPROVED" || status == "REJECT";
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Driver
          </h1>
          <p className="text-muted-foreground">
            Monitor and manage driver options across all locations
          </p>
        </div>

        {/* Main Content */}
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as any)}
          className="w-full"
        >
          <div className="flex flex-col gap-4 md:flex-row xl:items-center md:justify-between">
            <TabsList className="flex flex-wrap gap-2 h-full sm:w-max justify-start" >
              <PermissionGuard permission={PERMISSIONS.DRIVER_READ}>
                <TabsTrigger value="DRIVER" onClick={() => setDiscText('View all approved drivers and manage their information.')} >Driver</TabsTrigger>
              </PermissionGuard>
              <PermissionGuard permission={PERMISSIONS.DRIVER_PENDING_REGISTRATION}>
                <TabsTrigger value="REGISTRATION" onClick={() => {
                  setIsRegistered(true)
                  setDiscText('View and review driver applications submitted through the Driver app.')
                }
                }>Driver Application
                </TabsTrigger>
              </PermissionGuard>
              <PermissionGuard permission={PERMISSIONS.BECOME_DRIVER_READ}>
                <TabsTrigger value="REQUEST" onClick={() => {
                  setIsRegistered(false)
                  setDiscText('View and review customer requests to become drivers from the Customer App.')
                }}>Request Become Driver</TabsTrigger>
              </PermissionGuard>
            </TabsList>
            <div className="flex items-center gap-2">
              <Dialog open={addItemOpen} onOpenChange={setAddItemOpen}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isRefreshing} >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
                {/* <DialogTrigger asChild>
                  <Button className="gap-1" size="sm" onClick={() => setAddItemOpen(true)}>
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Request Became Driver</span>
                  </Button>
                </DialogTrigger> */}
                <DialogContent className="sm:max-w-[600px] h-[90vh] sm:h-max overflow-y-auto">
                  <DialogTitle>Request Became Driver</DialogTitle>
                  <DialogHeader>
                    <DialogDescription>
                      Enter the details for the new driver item.
                      Click create when you're done.
                    </DialogDescription>
                  </DialogHeader>
                  <form id="item-form" onSubmit={onSubmit}>
                    <div className="grid gap-4 py-4 px-2">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="licenseNumber">License Number</Label>
                          <Input id="licenseNumber" required placeholder="Enter license number" name="licenseNumber" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="licenseIssueDate">License Issue Date</Label>
                          <Input id="licenseIssueDate" placeholder="Enter license issue date" type="datetime-local" name="licenseIssueDate" />
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="driverType">Driver Type</Label>
                          <Select defaultValue={driverParam?.driverType[0]} name="driverType" >
                            <SelectTrigger>
                              <SelectValue placeholder="Select driver type" />
                            </SelectTrigger>
                            <SelectContent>
                              {driverParam?.driverType.map((g) => (
                                <SelectItem key={g} value={g}>
                                  {g}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="licenseExpiryDate">License Expiry Date</Label>
                          <Input id="licenseExpiryDate" placeholder="Enter license expiry date" type="datetime-local" name="licenseExpiryDate" />
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="drivingExperience">Driving Experience</Label>
                          <Input id="drivingExperience" placeholder="Enter driving experience" name="drivingExperience" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="accidentCount">Accident Count</Label>
                          <Input id="accidentCount" placeholder="Enter accident count" name="accidentCount" type="number" />
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="violationCount">Violation Count</Label>
                          <Input id="violationCount" placeholder="Enter violation count" name="violationCount" type="number" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="vehicleCategoryId">Vehicle Category</Label>
                          <Select name="vehicleCategoryId">
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              {vehicleParam?.category.map((type) => (
                                <SelectItem key={type.id} value={type.id}>
                                  {type.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-1 gap-4">
                        <div className="grid gap-2" >
                          <Label htmlFor="licenseType">License Type</Label>
                          <RadioGroup
                            name="licenseType"
                            className="flex flex-wrap gap-2"
                          >
                            {driverParam?.licenseType.map((pt) => (
                              <div key={pt}>
                                <RadioGroupItem
                                  value={pt}
                                  id={`new-${pt}`}
                                  className="peer sr-only"
                                />

                                <Label
                                  htmlFor={`new-${pt}`}
                                  className="
                                    flex items-center justify-center
                                    rounded-md border px-4 py-2
                                    cursor-pointer
                                    hover:bg-muted
                                    peer-data-[state=checked]:bg-primary
                                    peer-data-[state=checked]:text-white
                                  "
                                >
                                  {pt}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
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

          <CardDescription>
            {discText}
          </CardDescription>

          {/*driver Table */}
          <TabsContent value="DRIVER" className="mt-0">

            {/* Filters and Search */}
            <DriverFiltersComponent
              filters={filters}
              params={driverParam}
              showFilters={showFilters}
              onFiltersChange={(newFilters) =>
                setFilters({ ...filters, ...newFilters })
              }
              onShowFiltersToggle={() => setShowFilters(!showFilters)}
              onClearFilters={clearFilters}
            />

            <Card className="mt-4">
              <CardContent>
                <Table className="whitespace-nowrap">
                  <DriverTableHeader
                    filters={filters}
                    params={driverParam}
                    onShowFiltersToggle={() => setShowFilters(!showFilters)}
                    onClearFilters={clearFilters}
                    showFilters={showFilters}
                    onFiltersChange={(newFilters) =>
                      setFilters({ ...filters, ...newFilters })
                    } />
                  <DriverTableBody driverList={driverList} pagination={paginationDriver}
                    onView={(driver) => {
                      setSelectedDriver(driver);
                      setDialogOpen(true);
                    }} />
                </Table>

                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogContent className="sm:max-w-[700px] max-h-[90vh] h-max overflow-y-scroll">
                    <DialogTitle>Driver Details</DialogTitle>
                    {selectedDriver && (
                      <DriverDetailView driver={selectedDriver} />
                    )}
                  </DialogContent>
                </Dialog>

                <div className="mt-4 flex flex-wrap gap-2 items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    <MyShowingItem pagination={paginationDriver} />
                    <Select defaultValue={size.toString()}
                      onValueChange={(value) => {
                        setPageDriver(0); // reset to first page
                        setSize(Number(value));
                      }} >
                      <MySelectContent />
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <MyPagination
                      currentPage={paginationDriver?.currentPage ?? 0}
                      totalPage={paginationDriver?.totalPage ?? 0}
                      onPageChange={setPageDriver} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/*driver registration Table */}
          <TabsContent value="REGISTRATION" className="mt-0">

            <div className="flex flex-wrap flex-col md:flex-row gap-2 md:gap-4 mb-4">
              <div className="relative flex-1">
                <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by first name"
                  className="pl-8"
                  value={filtersRe.firstName}
                  onChange={(e) => setFiltersRe({ ...filtersRe, firstName: e.target.value })}
                />
              </div>

              <div className="relative flex-1">
                <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by last name"
                  className="pl-8"
                  value={filtersRe.lastName}
                  onChange={(e) => setFiltersRe({ ...filtersRe, lastName: e.target.value })}
                />
              </div>

              <div className="relative flex-1">
                <Select value={filtersRe.approvalStatus} onValueChange={(value) => setFiltersRe({ ...filtersRe, approvalStatus: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Approval Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* <SelectItem value="all">Approval Status</SelectItem> */}
                    <SelectItem value="PENDING">PENDING</SelectItem>
                    <SelectItem value="REVIEW">REVIEW</SelectItem>
                    <SelectItem value="APPROVED">APPROVED</SelectItem>
                    <SelectItem value="REJECT">REJECT</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {showFilters && (<>
                <div className="relative flex-1">
                  <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search by email"
                    className="pl-8"
                    value={filtersRe.email}
                    onChange={(e) => setFiltersRe({ ...filtersRe, email: e.target.value })}
                  />
                </div>
                <div className="relative flex-1">
                  <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search by phone"
                    className="pl-8"
                    value={filtersRe.phone}
                    maxLength={10}
                    onChange={(e) => setFiltersRe({ ...filtersRe, phone: e.target.value })}
                  />
                </div>

                <div className="relative flex-1">
                  <Select value={filtersRe.gender} onValueChange={(value) => setFiltersRe({ ...filtersRe, gender: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Gender</SelectItem>
                      <SelectItem value="M">Male</SelectItem>
                      <SelectItem value="F">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div></>
              )}

              <div className="flex flex-wrap gap-2">
                <Button
                  variant={showFilters ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="h-10"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  {/* {showFilters && (
                    <Badge className="ml-2 bg-primary text-primary-foreground">{activeFiltersCount}</Badge>
                  )} */}
                </Button>
                {JSON.stringify(filtersRe) !== JSON.stringify(emptyFiltersRe) &&
                  <Button disabled={isRefreshing} variant="ghost" size="sm" onClick={() => {
                    setFiltersRe(emptyFiltersRe);
                    setShowFilters(false);
                  }} className="h-10">
                    <X className="h-4 w-4 mr-2" />
                    Clear
                  </Button>}
              </div>

            </div>

            <Card>
              <CardContent>
                <Table className="whitespace-nowrap">
                  <RegistrationTableHeader />
                  <RegistrationTableBody myReqList={pendingRegistration} pagination={paginationRe} handleItemAction={handleItemAction} />
                </Table>
                {/* Pagination */}
                <div className="mt-4 flex flex-wrap gap-2 items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    <MyShowingItem pagination={paginationRe} />
                    <Select defaultValue={size.toString()}
                      onValueChange={(value) => {
                        setPageRe(0); // reset to first page
                        setSize(Number(value));
                      }} >
                      <MySelectContent />
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <MyPagination
                      currentPage={paginationRe?.currentPage ?? 0}
                      totalPage={paginationRe?.totalPage ?? 1}
                      onPageChange={setPageRe} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/*driver request to become Table */}
          <TabsContent value="REQUEST" className="mt-0">

            <div className="flex flex-wrap flex-col md:flex-row gap-2 md:gap-4 justify-end">
              {isfiltersBecome &&
                (<>
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="ID. 36 Characters"
                      className="pl-8"
                      value={filtersBecome.id}
                      onChange={(e) => setFiltersBecome({ ...filtersBecome, id: e.target.value })}
                    />
                  </div>

                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="PersonId. 36 Characters"
                      className="pl-8"
                      value={filtersBecome.personId}
                      onChange={(e) => setFiltersBecome({ ...filtersBecome, personId: e.target.value })}
                    />
                  </div>

                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="License Number"
                      className="pl-8"
                      value={filtersBecome.licenseNumber}
                      onChange={(e) => setFiltersBecome({ ...filtersBecome, licenseNumber: e.target.value })}
                    />
                  </div>
                </>)}

              <div className="">
                <Select value={filtersBecome.status} onValueChange={(value) => setFiltersBecome({ ...filtersBecome, status: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {BecomeParamStatus.map((s: string) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant={isfiltersBecome ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setIsfiltersBecome(!isfiltersBecome)
                }}
                className="h-10"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>

              {JSON.stringify({
                id: '',
                personId: '',
                licenseNumber: '',
                status: 'PENDING',
              }) !== JSON.stringify(filtersBecome) &&
                <div className="flex flex-wrap gap-2">
                  <Button variant="ghost" size="sm"
                    disabled={isRefreshing}
                    onClick={() => setFiltersBecome({
                      id: '',
                      personId: '',
                      licenseNumber: '',
                      status: 'PENDING'
                    })} className="h-10">
                    <X className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>
              }
            </div>

            <Card className="mt-4">
              <CardContent>
                <Table className="whitespace-nowrap">
                  <RequestTableHeader />
                  {/* <MyNoItemTableRow key="no-driver-to-become-driver" name="Driver to become a driver" items={[reqBecome]} colSpan={11} /> */}
                  <RequestTableBody myReqList={reqBecome} pagination={paginationBecame} handleItemAction={handleItemAction} />
                </Table>
                {/* Pagination */}
                <div className="mt-4 flex flex-wrap gap-2 items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    <MyShowingItem pagination={paginationBecame} />
                    <Select defaultValue={size.toString()}
                      onValueChange={(value) => {
                        setPageBe(0); // reset to first page
                        setSize(Number(value));
                      }} >
                      <MySelectContent />
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <MyPagination
                      currentPage={paginationBecame?.currentPage ?? 0}
                      totalPage={paginationBecame?.totalPage ?? 1}
                      onPageChange={setPageBe} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Review Details Dialog */}
      <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] h-max overflow-y-scroll">
          <DialogTitle>{isRegistered ? "Driver Registration Details" : "Request Becoming Details"}</DialogTitle>
          <DialogHeader>
            <DialogDescription>
              Detailed information about the driver request. You can approve or reject the request from here.
              License number {selectedItem?.licenseNumber}
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-6 ">

              {isRegistered ? (
                <div className="space-y-6">
                  <DetailSection title="Basic Information">
                    <DetailRow label="ID" value={selectedItem.id} />
                    <DetailRow label="First Name" value={selectedItem.firstName} />
                    <DetailRow label="Last Name" value={selectedItem.lastName} />
                    <DetailRow label="Email" value={selectedItem.email} />
                    <DetailRow label="Phone" value={selectedItem.phone} />
                    <DetailRow label="Gender" value={selectedItem.gender} />
                    <DetailRow label="Date of Birth" value={selectedItem.dateOfBirth} />
                  </DetailSection>

                  <DetailSection title="Driver Information">
                    <DetailRow label="Driver Type" value={selectedItem.driverType} />
                    <DetailRow label="Employee Code" value={selectedItem.employeeCode} />
                    <DetailRow label="Bank Account" value={selectedItem.bankAccountNo} />
                    <DetailRow
                      label="Driving Experience"
                      value={selectedItem.drivingExperience}
                    />
                    <DetailRow
                      label="Accident Count"
                      value={selectedItem.accidentCount}
                    />
                    <DetailRow
                      label="Violation Count"
                      value={selectedItem.violationCount}
                    />
                  </DetailSection>

                  <DetailSection title="Verification">
                    <div >
                      <DetailRow
                        label="Approval Status"
                        value={<div className="flex"> <ShipmentStatusBadge status={selectedItem.approvalStatus} /> </div>}
                      />
                    </div>
                    <DetailRow
                      label="OTP Verified"
                      value={selectedItem.otpverified ? "✅ Yes" : "❌ No"}
                    />
                    <DetailRow
                      label="Confirmed"
                      value={selectedItem.confirmed ? "✅ Yes" : "❌ No"}
                    />
                  </DetailSection>

                  <DetailSection title="Audit Information">
                    <DetailRow
                      label="Created"
                      value={`${selectedItem.createdBy ?? '-'} • ${FormatTimestamp(
                        selectedItem.createdAt
                      )}`}
                    />

                    <DetailRow
                      label="Updated"
                      value={`${selectedItem.updatedBy ?? "-"} • ${selectedItem.updatedAt
                        ? FormatTimestamp(selectedItem.updatedAt)
                        : "-"
                        }`}
                    />
                  </DetailSection>
                </div>
              ) : (
                <div className="space-y-6">
                  <DetailSection title="Request Information">
                    <DetailRow label="Request ID" value={selectedItem.id} />

                    <DetailRow
                      label="Sumitted By"
                      value={selectedItem.createdBy}
                    />

                    <DetailRow
                      label="Submitted Form"
                      value={selectedItem.submittedFrom}
                    />

                    <DetailRow
                      label="Requested Date"
                      value={FormatTimestamp(selectedItem.createdAt)}
                    />

                    <DetailRow
                      label="Status"
                      value={<div className="flex"><ShipmentStatusBadge status={selectedItem.status} /></div>}
                    />
                  </DetailSection>

                  <DetailSection title="Applicant Information">
                    <DetailRow
                      label="Person ID"
                      value={
                        <div className="flex items-center gap-2">
                          <span>{selectedItem.personId}</span>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => MyHandleCopy(selectedItem.id)}
                          >
                            Copy
                          </Button>
                        </div>
                      }
                    />

                    <DetailRow
                      label="Full Name"
                      value={selectedItem?.person?.firstName + selectedItem?.person?.lastName}
                    />

                    <DetailRow
                      label="DOB"
                      value={selectedItem?.person?.dateOfBirth}
                    />

                    <DetailRow
                      label="Gender"
                      value={selectedItem?.person?.gender}
                    />

                    <DetailRow
                      label="Phone Number"
                      value={selectedItem?.person?.phone}
                    />

                    <DetailRow
                      label="Email"
                      value={selectedItem?.person?.email}
                    />

                    <DetailRow
                      label="Address"
                      value={selectedItem?.person?.address}
                    />

                  </DetailSection>

                  <DetailSection title="Driver Information">

                    <DetailRow
                      label="Driver Type"
                      value={selectedItem.driverType}
                    />

                    <DetailRow
                      label="Experience"
                      value={selectedItem.drivingExperience}
                    />

                    <DetailRow
                      label="Accident"
                      value={selectedItem.accidentCount}
                    />

                    <DetailRow
                      label="Violation"
                      value={selectedItem.violationCount}
                    />

                  </DetailSection>

                  <DetailSection title="License Information">
                    <DetailRow
                      label="License Type"
                      value={selectedItem.licenseType}
                    />

                    <DetailRow
                      label="License Number"
                      value={selectedItem.licenseNo || selectedItem.licenseNumber}
                    />

                    <DetailRow
                      label="Issue Date"
                      value={FormatTimestamp(selectedItem.licenseIssueDate)}
                    />

                    <DetailRow
                      label="Expiry Date"
                      value={FormatTimestamp(selectedItem.licenseExpiryDate)}
                    />
                  </DetailSection>

                  <DetailSection title="Vehicle Information">
                    <DetailRow
                      label="Plate Number"
                      value={selectedItem.plateNumber}
                    />

                    <DetailRow
                      label="Vehicle Type"
                      value={selectedItem.vehicleCategoryName}
                    />
                  </DetailSection>

                  <DetailSection title="Document Attachment">
                    <DetailRow
                      label="NIP"
                      value={'(Front & Back)'}
                    />

                    <DetailRow
                      label="Driver licence"
                      value={"(Front & Back)"}
                    />
                  </DetailSection>

                </div>
              )}

              <PermissionGuard permission={PERMISSIONS.BECOME_DRIVER_REVIEW || PERMISSIONS.BECOME_DRIVER_REJECT || PERMISSIONS.BECOME_DRIVER_APPROVE}>
                {/* Review Note */}
                {!BtnReview(selectedItem?.status) && (
                  <div>
                    <Label htmlFor="note">Approval Decision *</Label>

                    <textarea
                      id="note"
                      rows={4}
                      required
                      value={note}
                      minLength={1}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Enter approval/rejection note..."
                      className="mt-2 w-full rounded-md border p-3"
                    />
                  </div>
                )}
              </PermissionGuard>

            </div>
          )}

          <DialogFooter>
            {/* <Button
              variant="outline"
              onClick={() => setViewDetailsOpen(false)}
              disabled={isSubmitting}
            >
              Close
            </Button> */}

            {!BtnReview(selectedItem?.status) && (
              <>
                <PermissionGuard permission={isRegistered ? PERMISSIONS.PENDING_DRIVER_REGISTRATION_DETAIL_READ : PERMISSIONS.BECOME_DRIVER_REVIEW}>
                  {selectedItem?.status?.toLocaleLowerCase() != 'review' &&
                    <Button
                      variant="secondary"
                      onClick={() => handleStatus("review")}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Processing..." : "Review"}
                    </Button>
                  }
                </PermissionGuard>
                {(selectedItem?.status === "REVIEW" || selectedItem?.approvalStatus === "REVIEW") &&
                  (<>
                    <PermissionGuard permission={isRegistered ? PERMISSIONS.PENDING_DRIVER_REGISTRATION_DETAIL_READ : PERMISSIONS.BECOME_DRIVER_REJECT}>
                      <Button
                        className="bg-red-500 text-white hover:bg-red-600"
                        onClick={() => handleStatus("reject")}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Processing..." : "Reject"}
                      </Button>
                    </PermissionGuard>
                    <PermissionGuard permission={isRegistered ? PERMISSIONS.PENDING_DRIVER_REGISTRATION_DETAIL_READ : PERMISSIONS.BECOME_DRIVER_APPROVE}>
                      <Button
                        className="bg-green-500 text-white hover:bg-green-600"
                        onClick={() => handleStatus("approve")}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Processing..." : "Approve"}
                      </Button>
                    </PermissionGuard>
                  </>)
                }

              </>
            )}

          </DialogFooter>
          {statusLogs.length > 0 &&
            <div className="rounded-lg border">
              <div className="border-b px-4 py-3">
                <h3 className="font-semibold">Review History</h3>
              </div>
              <div className="space-y-4 pt-4 px-4">
                {!statusLogs || statusLogs.length === 0 && (
                  <p className="text-sm text-muted-foreground py-4">
                    No review history available.
                  </p>
                )}
                {selectedItem && statusLogs?.map((log) => (
                  <div
                    key={log.id}
                    className="relative border-l-2 border-muted pl-6 py-3"
                  >
                    <div className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-primary" />

                    <div className="flex items-start gap-2">
                      <ShipmentStatusBadge status={log.status} />
                      <div className="grid">
                        <span className="text-sm text-muted-foreground">
                          {log.createdBy} | {FormatDateTimestamp(log.createdAt)}
                        </span>

                        <p className="mt-2 text-sm  text-muted-foreground">Remark : {log.note}</p>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          }
        </DialogContent>
      </Dialog >

      {/* Edit Item Dialog */}
      < Dialog open={editItemOpen} onOpenChange={setEditItemOpen} >
        <DialogContent className="sm:max-w-[600px] h-[90vh] sm:h-max overflow-y-auto">
          <DialogTitle>Edit Request</DialogTitle>
          <DialogHeader>
            <DialogDescription>
              Update the details for
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <form
              onSubmit={(e) => handleSubmit(e, () => { })}
            >
              <div className="grid gap-4 py-4 px-2">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="editLicenseNumber">License Number</Label>
                    <Input id="editLicenseNumber" defaultValue={selectedItem.licenseNumber} required placeholder="Enter license number" name="licenseNumber" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="editLicenseIssueDate">License Issue Date</Label>
                    <Input id="editLicenseIssueDate" defaultValue={formatForInput(selectedItem.licenseIssueDate)} placeholder="Enter license issue date" type="datetime-local" name="licenseIssueDate" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="editDriverType">Driver Type</Label>
                    <Select defaultValue={selectedItem.driverType} name="driverType" >
                      <SelectTrigger>
                        <SelectValue placeholder="Select driver type" />
                      </SelectTrigger>
                      <SelectContent>
                        {driverParam?.driverType.map((g) => (
                          <SelectItem key={g} value={g}>
                            {g}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="editLicenseExpiryDate">License Expiry Date</Label>
                    <Input id="editLicenseExpiryDate" defaultValue={formatForInput(selectedItem.licenseExpiryDate)} placeholder="Enter license expiry date" type="datetime-local" name="licenseExpiryDate" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="editDrivingExperience">Driving Experience</Label>
                    <Input id="editDrivingExperience" defaultValue={selectedItem.drivingExperience} placeholder="Enter driving experience" name="drivingExperience" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="editAccidentCount">Accident Count</Label>
                    <Input id="editAccidentCount" defaultValue={selectedItem.accidentCount} placeholder="Enter accident count" name="accidentCount" type="number" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="editViolationCount">Violation Count</Label>
                    <Input id="editViolationCount" defaultValue={selectedItem.violationCount} placeholder="Enter violation count" name="violationCount" type="number" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="editVehicleCategoryId">Vehicle Category</Label>
                    <Select defaultValue={selectedItem.vehicleCategoryId} name="vehicleCategoryId" >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicleParam?.category.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-1 gap-4">
                  <div className="grid gap-2" ></div>
                  <Label htmlFor="licenseType">License Type</Label>
                  <RadioGroup
                    name="licenseType"
                    className="flex flex-wrap gap-2"
                    defaultValue={selectedItem.licenseType}
                  >
                    {driverParam?.licenseType.map((pt) => (
                      <div key={pt}>
                        <RadioGroupItem
                          value={pt}
                          id={`new-${pt}`}
                          className="peer sr-only"
                        />

                        <Label
                          htmlFor={`new-${pt}`}
                          className="
                              flex items-center justify-center
                              rounded-md border px-4 py-2
                              cursor-pointer
                              hover:bg-muted
                              peer-data-[state=checked]:bg-primary
                              peer-data-[state=checked]:text-white
                            "
                        >
                          {pt}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
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
          <DialogTitle>Delete Item</DialogTitle>
          <DialogHeader>
            <DialogDescription>
              Are you sure you want to delete {selectedItem?.driverType}, {selectedItem?.vehicleCategoryName}? This action
              cannot be undone.
            </DialogDescription>
            <DialogTitle className="text-sm text-red-600">
              This action is irreversible. Please proceed with caution.
            </DialogTitle>
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
                      person system. All associated history and data will be lost.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-lg border p-4">
                <h3 className="font-medium">Person Details</h3>
                <div className="mt-2 space-y-1 text-sm">
                  <div className="flex gap-2">
                    <span>ID:</span>
                    <span className="font-mono">{selectedItem.id}</span>
                  </div>
                  <div className="flex gap-2">
                    <span>Name:</span>
                    {/* <span>{selectedItem.firstName} {selectedItem.lastName}</span> */}
                  </div>
                  <div className="flex gap-2">
                    <span>Gender:</span>
                    {/* <span>{selectedItem.gender}</span> */}
                  </div>
                  <div className="flex gap-2">
                    <span>Date of Birth:</span>
                    {/* <span>{selectedItem.dateOfBirth}</span> */}
                  </div>
                  <div className="flex gap-2">
                    <span>Email:</span>
                    {/* <span>{selectedItem.email}</span> */}
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
      </Dialog >

      {/* Alert Dialog handler */}
      < PopupAlert title={''} description={popupMessage} open={popupOpen} close={() => setPopupOpen(false)
      } />

    </>
  );
}
