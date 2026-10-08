"use client";
import { MockLogin } from "@/app/auth/login/mock";
import { MyCancel, MyCreate, MyDelete, MyHandleCopy, MyHashID, MyRequired, MySave } from "@/components/myFunction";
import { MyPagination } from "@/components/Pagination";
import PermissionGuard from "@/components/PermissionGuard";
import DateSelect from "@/components/SelectDate";
import { MySelectContent, MyShowingItem } from "@/components/Showing-item";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { toast } from "@/hooks/use-toast";
import api from '@/lib/axios';
import { FormatTimestamp } from "@/lib/function";
import { Countries, normalizePhone } from "@/lib/models/contry";
import { PagingT } from "@/lib/response";
import { PERMISSIONS } from "@/src/constants/permissions";
import {
  AlertTriangle,
  Edit,
  Eye,
  FileText,
  Loader2,
  MailIcon,
  MoreHorizontal,
  Phone,
  Plus,
  Printer,
  RefreshCw,
  Search,
  Trash2
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { PersonParams, PersonT } from "./person";

const personTypeOptions = [
  "CUSTOMER",
  "MERCHANT",
  "DRIVER",
  "AGENT",
  "OPERATOR"
];

export const getCountryFromPhone = (phone: string) => {
  return (
    Countries.find((c) => phone?.startsWith(c.dialCode)) ||
    Countries[0]
  );
};

export const getLocalPhone = (
  phone: string,
  country: { code: string; dialCode: string; flag: string; name?: string }
) => {
  if (!phone) return "";

  return phone.startsWith(country.dialCode)
    ? phone.slice(country.dialCode.length)
    : phone;
};

export default function InventoryLevelsPage() {
  // helper to format date strings (date of birth)
  // State for dialogs
  const url = 'person-service/api/v1/persons';

  const [activeTab, setActiveTab] = useState<'all-person' | 'CUSTOMER' | 'MERCHANT' | 'DRIVER' | 'AGENT' | 'OPERATOR'>('all-person');
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [editItemOpen, setEditItemOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteItemOpen, setDeleteItemOpen] = useState(false);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PersonT>();
  const [personItem, setPersonItem] = useState<PersonT[]>([]);
  const [page, setPage] = useState(0);
  const [pagination, setPagination] = useState<PagingT<PersonT> | null>(null);
  const [PersonTemplate, setPersonTemplate] = useState<PersonParams>();
  const [pageSize, setPageSize] = useState(process.env.NEXT_PUBLIC_PAGE_SIZE ? Number.parseInt(process.env.NEXT_PUBLIC_PAGE_SIZE) : 20);
  const [date, setDate] = useState(new Date());
  const [filters, setFilters] = useState<any>({
    name: null,
    email: null,
    phone: null,
  })
  // const [country, setCountry] = useState(Countries[0]);
  // const [phone, setPhone] = useState(normalizePhone(MockLogin?.phone || "", country.dialCode));

  const [debouncedSearch, setDebouncedSearch] = useState("");


  const initialCountry = getCountryFromPhone(MockLogin?.phone || "");
  const [country, setCountry] = useState(initialCountry);
  const [phone, setPhone] = useState(
    getLocalPhone(MockLogin?.phone || "", initialCountry)
  );
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
      case "deleteItem":
        setDeleteItemOpen(true);
        break;
      default:
        break;
    }
  };

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>,
    closeFunction: () => void
  ) => {
    e.preventDefault();

    if (editItemOpen) {
      const formData = new FormData(e.currentTarget);
      const values: any = {
        personType: []
      };

      formData.forEach((value, key) => {
        if (key === "personType") {
          values.personType.push(value);
        } else {
          values[key] = value;
        }
      });
      // values.dateOfBirth = date;
      values.dateOfBirth = date;
      values.phone = selectedItem?.phone;

      if (!Array.isArray(values.personType)) {
        values.personType = values.personType ? [values.personType] : [];
      }

      updatePerson(values);
      console.log("values::", values);

      // closeFunction();
    }

    if (deleteItemOpen && selectedItem) {
      deletePerson(selectedItem.id);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => { setDebouncedSearch(filters); }, 500);
    setPage(0);
    return () => clearTimeout(timer);
  }, [filters]);

  useEffect(() => {
    getPerson();
  }, [page, pageSize, debouncedSearch]);

  useEffect(() => {
    api.get(`${url}/param`, {
    }).then((res) => {
      const d: PersonParams = res.data.data;
      setPersonTemplate(d);
    })
  }, []);

  const handleRefresh = () => {
    getPerson();
  };

  const getPerson = () => {
    setIsRefreshing(true)
    api.get(`${url}?page=${page}&size=${pageSize}`, {
      params: filters
    }).then((res) => {
      const d: PagingT<PersonT> = res.data.data;
      setPersonItem(d.result);
      setPagination(d);
    })
      .finally(() => {
        setAddItemOpen(false);
        setEditItemOpen(false);
        setDeleteItemOpen(false);
        setIsSubmitting(false);
        setIsRefreshing(false);
      });
  };

  const updatePerson = (data: PersonT) => {
    setIsSubmitting(true);
    api.put(`${url}/${data.id}`, data).then((res) => {
      setEditItemOpen(false)
      getPerson();
    }).catch((err) => {
      console.error("error::", err);
    }).finally(() => {
      setIsSubmitting(false);
    });
  }

  const deletePerson = (id: string) => {
    setIsSubmitting(true);
    api.delete(`${url}/${id}`).then((res) => {
      getPerson();
    }).catch((err) => {
      setIsSubmitting(false);
      console.error("error::", err);
    });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget)
    const payload: any = {};
    const personTypes = new FormData(e.currentTarget).getAll("personType");

    if (personTypes.length === 0) {
      // show toast or error
      toast({
        title: "",
        description: "Person Type is require.",
        variant: "destructive",
      });
      return;
    }

    formData.forEach((value, key) => {
      if (key === "personType") {
        if (!payload.personType) {
          payload.personType = [];
        }
        payload.personType.push(value);
      } else {
        payload[key] = value;
      }
    });
    payload.dateOfBirth = date;
    payload.phone = `${country.dialCode}${payload.phone}`;
    console.log("payload::", payload);

    setIsSubmitting(true);
    api.post(`${url}`, payload)
      .then(() => getPerson())
      .catch((error) => {

      }).finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Person
          </h1>
          <p className="text-muted-foreground">
            Monitor and manage person options across all locations
          </p>
        </div> */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Person</h1>
            <p className="text-muted-foreground">
              Monitor and manage person options across all locations
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
            <PermissionGuard permission={PERMISSIONS.PERSON_CREATE}>
              <Button className="gap-1" size="sm" onClick={() => {
                setAddItemOpen(true)
                setPhone("")
              }}>
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Person</span>
              </Button>
            </PermissionGuard>
          </div>
        </div>

        {/* Main Content */}
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as any)}
          className="w-full"
        >
          <div className="flex flex-col gap-4  justify-end">
            {/* <TabsList className="flex flex-wrap gap-2 h-full sm:w-max justify-start" >
               <TabsTrigger value="all-person">All Person</TabsTrigger> 
               {personTypeOptions.map((pt) => (
                <TabsTrigger key={pt} value={pt}>
                  {pt}
                </TabsTrigger>
              ))} 
            </TabsList> */}
            <div className="flex items-center gap-2 justify-end">
              <Dialog open={addItemOpen} onOpenChange={setAddItemOpen}>
                <DialogTrigger asChild>

                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] h-[90vh] sm:h-max overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Person</DialogTitle>
                    <DialogDescription>
                      Enter the details for the new person details.
                      Click create when you're done.
                    </DialogDescription>
                  </DialogHeader>
                  <form id="item-form" onSubmit={onSubmit}>
                    <div className="grid gap-4 px-2 sm:h-max overflow-y-auto">
                      <div className="grid sm:grid-cols-1 gap-4 ">
                        <div className="grid gap-2 " >
                          <Label htmlFor="personType">Person Type <MyRequired /></Label>
                          <div className="flex flex-wrap gap-2">
                            {PersonTemplate?.personType.map((pt, index) => (
                              <div key={pt} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id={`new-${pt}`}
                                  name="personType"
                                  value={pt}
                                  className="h-4 w-4 rounded border-gray-300"
                                />
                                <Label htmlFor={`new-${pt}`}>{pt}</Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="firstName">First Name <MyRequired /></Label>
                          <Input id="firstName" placeholder="Enter first name" name="firstName"
                            required
                            pattern="[A-Za-z]+"
                            title="First name can only contain letters." />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="lastName">Last Name <MyRequired /></Label>
                          <Input id="lastName" placeholder="Enter last name" name="lastName"
                            required
                            pattern="[A-Za-z]+"
                            title="Last name can only contain letters." />
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="gender">Gender <MyRequired /></Label>
                          <Select defaultValue={PersonTemplate?.gender[0]} name="gender" required >
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              {PersonTemplate?.gender.map((g) => (
                                <SelectItem key={g} value={g}>
                                  {g}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="max-w-md ">
                          <Label htmlFor="dateOfBirth">Date of Birth <MyRequired /></Label>
                          <DateSelect value={date} onChange={setDate} />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="grid gap-2 ">
                          <Label htmlFor="phone">Phone number <MyRequired /></Label>
                          <div className="flex">
                            <div className="flex items-center ">
                              <Select
                                value={country.code}
                                onValueChange={(value) => {
                                  const selected = Countries.find((c) => c.code === value);
                                  if (selected) {
                                    setCountry(selected);
                                  }
                                }}
                              >
                                <SelectTrigger className="w-[100px] ">
                                  <div className="flex items-center gap-2">
                                    <span className={`fi fi-${country.code}`} />
                                    <span>{country.dialCode}</span>
                                  </div>
                                </SelectTrigger>

                                <SelectContent>
                                  {Countries.map((c) => (
                                    <SelectItem key={c.code} value={c.code}>
                                      <div className="flex items-center gap-2">
                                        <span className={`fi fi-${c.code}`} />
                                        <span>
                                          {c.code.toUpperCase()} ({c.dialCode})
                                        </span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <Input
                              type="tel"
                              name="phone"
                              value={phone}
                              required
                              maxLength={9}
                              minLength={8}
                              onChange={(e) =>
                                setPhone(normalizePhone(e.target.value.replace(/\D/g, ""), country.dialCode))
                              }
                              className="flex-1 px-4 py-2 w-[100px] border border-l-0 rounded-r-lg "
                              placeholder="12345678"
                            />
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="email">Email <MyRequired /></Label>
                          <Input id="email" required placeholder="Enter email address" name="email" type="email" />
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

          {/* Filters */}
          <div className="my-4 flex gap-4 flex-wrap 2xl:flex-nowrap ">
            <div className="relative  min-w-[260px] max-w-[500px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                value={filters.name}
                onChange={(e) => setFilters({ ...filters, name: e.currentTarget.value })}
                placeholder="Search Name..."
                className=" pl-8"
              />
            </div>
            <div className="relative min-w-[260px] max-w-[500px]">
              <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                maxLength={12}
                value={filters.phone}
                onChange={(e) => setFilters({ ...filters, phone: e.currentTarget.value })}
                placeholder="Search phone..."
                className=" pl-8"
              />
            </div>
            <div className="relative min-w-[280px] max-w-[500px]">
              <MailIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                value={filters.email}
                onChange={(e) => setFilters({ ...filters, email: e.currentTarget.value })}
                placeholder="Search email..."
                className=" pl-8"
              />
            </div>
          </div>

          {/*admin Table */}
          <TabsContent value="all-person" className="mt-0">
            <Card>
              <CardContent>
                <Table className="whitespace-nowrap">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">Nº</TableHead>
                      <TableHead className="w-[50px]">ID</TableHead>
                      <TableHead className="w-[100px]">First Name</TableHead>
                      <TableHead className="w-[100px]">Last Name</TableHead>
                      <TableHead>Phone Number</TableHead>
                      <TableHead className="text-right">Updated By</TableHead>
                      <TableHead className="text-right">Updated Date</TableHead>
                      <TableHead className="w-[70px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {personItem?.map((item, index) => (
                      <TableRow key={item.id} className="hover:bg-muted/50" onDoubleClick={() => handleItemAction("viewDetails", item)}>
                        <TableCell className="text-center">
                          {index + 1 + (pagination?.currentPage ?? 0) * (pagination?.pageSize ?? 1)}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {MyHashID(item.id)}
                        </TableCell>
                        <TableCell >
                          {item.firstName}
                        </TableCell>
                        <TableCell>
                          <div >
                            {item.lastName}</div>
                        </TableCell>
                        <TableCell>{item.phone}</TableCell>
                        <TableCell className="text-right">
                          {item.updatedBy}
                        </TableCell>
                        <TableCell className="text-right">
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
                              <PermissionGuard permission={PERMISSIONS.PERSON_UPDATE}>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleItemAction("editItem", item)
                                  }
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Person
                                </DropdownMenuItem>
                              </PermissionGuard>
                              <PermissionGuard permission={PERMISSIONS.PERSON_UPDATE}>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() =>
                                    handleItemAction("deleteItem", item)
                                  }
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete Person
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

      {/* Edit Item Dialog */}
      <Dialog open={editItemOpen} onOpenChange={setEditItemOpen}>
        <DialogContent className="sm:max-w-[600px] h-[90vh] sm:h-max overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Person</DialogTitle>
            <DialogDescription>
              Update the details for {selectedItem?.firstName.substring(0, 5)} {selectedItem && selectedItem.firstName.length > 5 ? "..." : ""}
              {selectedItem?.lastName.substring(0, 5)} {selectedItem && selectedItem.lastName.length > 5 ? "..." : ""}
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <form onSubmit={(e) => handleSubmit(e, () => { })} >
              <div className="grid gap-4  px-2 pb-4  overflow-y-auto">
                <div className="grid sm:grid-cols-1 gap-4">
                  <div className="grid gap-2" >
                    <Label htmlFor="personType">Person Type  <MyRequired /></Label>
                    <div className="flex flex-wrap gap-2">
                      {PersonTemplate?.personType.map((pt) => (
                        <div key={pt} className="flex items-center space-x-2">
                          <Checkbox value={pt} id={`new-${pt}`} name="personType" defaultChecked={selectedItem.personType.includes(pt)} />
                          <div className="flex-1">
                            <Label htmlFor={`new-${pt}`} className="text-sm font-medium"> {pt} </Label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Input type="hidden" name="id" value={selectedItem.id} />
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="firstName">First Name <MyRequired /></Label>
                    <Input id="firstName" required defaultValue={selectedItem.firstName} placeholder="Enter first name" name="firstName"
                      pattern="[A-Za-z]+"
                      title="First name can only contain letters." />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lastName">Last Name <MyRequired /></Label>
                    <Input id="lastName" defaultValue={selectedItem.lastName} placeholder="Enter last name" name="lastName"
                      required
                      pattern="[A-Za-z]+"
                      title="Last name can only contain letters." />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="gender">Gender <MyRequired /></Label>
                    <Select defaultValue={selectedItem.gender} name="gender" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        {PersonTemplate?.gender.map((g) => (
                          <SelectItem key={g} value={g}>
                            {g}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="dateOfBirth">Date of Birth <MyRequired /></Label>
                    <DateSelect value={selectedItem?.dateOfBirth ? new Date(selectedItem.dateOfBirth) : new Date()} onChange={(date) => {
                      setDate(date)
                      setSelectedItem({ ...selectedItem, dateOfBirth: date })
                    }} />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {selectedItem && (
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone number <MyRequired /></Label>

                      <div className="flex">
                        <Select
                          value={getCountryFromPhone(selectedItem.phone).code}
                          onValueChange={(value) => {
                            const selected = Countries.find((c) => c.code === value);

                            if (selected) {
                              const oldCountry = getCountryFromPhone(selectedItem.phone);
                              const localPhone = getLocalPhone(
                                selectedItem.phone,
                                oldCountry
                              );

                              setSelectedItem({
                                ...selectedItem,
                                phone: `${selected.dialCode}${localPhone}`,
                              });
                            }
                          }}
                        >
                          <SelectTrigger className="w-[100px]">
                            <div className="flex items-center gap-2">
                              <span className={`fi fi-${getCountryFromPhone(selectedItem.phone).code}`} />
                              <span>
                                {getCountryFromPhone(selectedItem.phone).dialCode}
                              </span>
                            </div>
                          </SelectTrigger>

                          <SelectContent>
                            {Countries.map((c) => (
                              <SelectItem key={c.code} value={c.code}>
                                <div className="flex items-center gap-2">
                                  <span className={`fi fi-${c.code}`} />
                                  <span>
                                    {c.code.toUpperCase()} ({c.dialCode})
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <input
                          type="tel"
                          name="phone"
                          value={getLocalPhone(
                            selectedItem.phone,
                            getCountryFromPhone(selectedItem.phone)
                          )}
                          required
                          maxLength={9}
                          minLength={8}
                          onChange={(e) => {
                            const currentCountry = getCountryFromPhone(selectedItem.phone);
                            const localPhone = normalizePhone(e.target.value.replace(/\D/g, ""), currentCountry.dialCode);

                            setSelectedItem({
                              ...selectedItem,
                              phone: `${currentCountry.dialCode}${localPhone}`,
                            });
                          }}
                          className="flex-1 px-4 py-2 w-[100px] border border-l-0 rounded-r-lg"
                          placeholder="12345678"
                        />
                      </div>
                    </div>
                  )}
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email <MyRequired /></Label>
                    <Input id="email" required defaultValue={selectedItem.email} placeholder="Enter email address" name="email" type="email" />
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

      {/* View Details Dialog */}
      <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] h-max overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Person Details</DialogTitle>
            <DialogDescription>
              Detailed information about {selectedItem?.firstName} {selectedItem?.lastName}
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
                  <thead className="sr-only">
                    <tr>  <th></th> <th></th>  </tr>
                  </thead>
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
                            onClick={() => MyHandleCopy(selectedItem.id)}
                          >
                            Copy
                          </Button>
                        </div>
                      </td>
                    </tr>

                    <tr className="border-b">
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
                    </tr>

                    <tr>
                      <td className="bg-muted/30 px-4 py-3 font-medium">
                        Date of Birth
                      </td>
                      <td className="px-4 py-3">
                        {selectedItem?.dateOfBirth
                          ? (selectedItem.dateOfBirth instanceof Date
                            ? selectedItem.dateOfBirth.toLocaleDateString()
                            : String(selectedItem.dateOfBirth))
                          : ""}
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
                  <thead className="sr-only">
                    <tr>   <th> </th>  <th> </th>  </tr>
                  </thead>
                  <tbody>
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
                  </tbody>
                </table>
              </div>

              {/* Employment Information */}
              <div className="rounded-lg border">
                <div className="border-b px-4 py-3">
                  <h3 className="font-semibold">Employment Information</h3>
                </div>

                <table className="w-full text-sm">
                  <thead><tr><th></th></tr><tr><th></th></tr></thead>
                  <tbody>
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
                  </tbody>
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


      {/* Delete Item Dialog */}
      <Dialog open={deleteItemOpen} onOpenChange={setDeleteItemOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Delete Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedItem?.firstName} {selectedItem?.lastName}? This action
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
                    <span>{selectedItem.firstName} {selectedItem.lastName}</span>
                  </div>
                  <div className="flex gap-2">
                    <span>Gender:</span>
                    <span>{selectedItem.gender}</span>
                  </div>
                  <div className="flex gap-2">
                    <span>Date of Birth:</span>
                    <span>{selectedItem?.dateOfBirth instanceof Date ? selectedItem.dateOfBirth.toLocaleDateString() : String(selectedItem?.dateOfBirth ?? '')}</span>
                  </div>
                  <div className="flex gap-2">
                    <span>Email:</span>
                    <span>{selectedItem.email}</span>
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
                <MyDelete />
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </>
  );
}
