"use client";
import LocationPicker from "@/components/MapPicker";
import { MyCancel, MyClose, MyDelete, MyHashID, MySave } from "@/components/myFunction";
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
  DialogTitle
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
  Select
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
import UserSelect from "@/components/user/FindUser";
import { toast } from "@/hooks/use-toast";
import api from '@/lib/axios';
import { FormatTimestamp } from "@/lib/function";
import { PagingT } from "@/lib/response";
import { PERMISSIONS } from "@/src/constants/permissions";
import {
  ArrowLeft,
  Eye,
  FileText,
  Loader2,
  MoreHorizontal,
  Printer,
  Search,
  Trash2
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { PersonT } from "../../person/person";
import { PersonAddress } from "../utility";

export default function AddressPage() {
  // State for dialogs
  const url = 'person-service/api/v1/address';
  const getBaseUrl = () => url;
  const [activeTab, setActiveTab] = useState<'new-address' | 'all-address' | 'edit-address'>('all-address');
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [editItemOpen, setEditItemOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteItemOpen, setDeleteItemOpen] = useState(false);
  const [viewHistoryOpen, setViewHistoryOpen] = useState(false);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PersonAddress>();
  const [addressItem, setAddressItem] = useState<PersonAddress[]>([]);
  const [pagination, setPagination] = useState<PagingT<PersonAddress> | null>(null);
  const [page, setPage] = useState(0);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState(process.env.NEXT_PUBLIC_PAGE_SIZE ? Number.parseInt(process.env.NEXT_PUBLIC_PAGE_SIZE) : 10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedPerson, setSelectedPerson] = useState<PersonT | null>(null);
  const [personSearch, setPersonSearch] = useState("");
  const [personList, setPersonList] = useState<PersonT[]>([]);

  // Function to handle opening dialogs for package items
  const handleItemAction = (action: string, item: any) => {
    setSelectedItem(item);

    switch (action) {
      case "viewDetails":
        setViewDetailsOpen(true);
        break;
      case "editItem":
        setActiveTab("edit-address");
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
    if (deleteItemOpen && selectedItem) {
      deleteAddress(selectedItem.id);
      return;
    }

    const formData = new FormData(e.currentTarget);
    const values: any = {};
    formData.forEach((value, key) => {
      values[key] = value;
    });
    updateAddress(selectedItem ? { ...selectedItem, ...values, latitude: latitude, longitude: longitude } : { ...values, latitude: latitude, longitude: longitude });
  };

  useEffect(() => {
    const timer = setTimeout(() => { setDebouncedSearch(search); }, 500);
    setPage(0);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    getList(debouncedSearch);
  }, [debouncedSearch, page, pageSize]);


  useEffect(() => {
    const timer = setTimeout(() => {
      findUser();
    }, 380);

    return () => clearTimeout(timer);
  }, [personSearch]);

  const findUser = async () => {
    try {
      const res = await api.get(
        "person-service/api/v1/persons?page=0&size=10",
        {
          params: { name: personSearch, },
        }
      );
      setPersonList(res.data.data.result);
    } catch (error) {
      console.error("Failed to find users:", error);
      setPersonList([]);
    }
  };

  const getList = (name = "") => {
    const url = getBaseUrl();
    api.get(url, {
      params: { page, size: pageSize, name: debouncedSearch, sort: "updatedAt,desc" }
    }).then((res) => {
      const d: PagingT<PersonAddress> = res.data.data;
      const dSelf: PersonAddress[] = res.data.data;

      setPagination(d);
      setAddressItem(d.result);
    })
      .finally(() => {
        setAddItemOpen(false);
        setEditItemOpen(false);
        setDeleteItemOpen(false);
        setIsSubmitting(false);
      });
  };

  const updateAddress = (data: PersonAddress) => {
    setIsSubmitting(true);
    api.put(`${getBaseUrl()}`, data).then((res) => {
      getList();
      setActiveTab("all-address");
    }).catch((err) => {
      setIsSubmitting(false);
      console.error("error::", err);
    });
  }

  const deleteAddress = (id: string) => {
    setIsSubmitting(true);
    api.delete(`${getBaseUrl()}/${id}`).then((res) => {
      getList();
    }).catch((err) => {
      setIsSubmitting(false);
      console.error("error::", err);
    });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget)
    const data: any = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    data.latitude = latitude;
    data.longitude = longitude;
    setIsSubmitting(true);
    api.post(`${getBaseUrl()}`, data)
      .then(() => {
        getList()
        setActiveTab("all-address");
      })
      .catch((error) => {
        console.error("There was an error!", error);
      }).finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {activeTab != "all-address" &&
              <Button variant={"outline"} onClick={() => setActiveTab("all-address")}>
                <ArrowLeft />
              </Button>
            }

            {activeTab == 'all-address' && "Address Management"}
          </h1>
          <p className="text-muted-foreground">
            {activeTab == 'all-address' && " Monitor and manage address options across all locations"}
          </p>
        </div>

        {/* Overview Cards */}
        {/* <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Address
                  </p>
                  <h3 className="text-2xl font-bold">
                    {pagination?.totalElements ?? 0}
                  </h3>
                </div>
                <div className="rounded-full bg-primary/10 p-3">
                  <Home className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div> */}

        {/* Main Content */}
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as any)}
          className="w-full"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* <TabsList className="flex flex-wrap gap-2 h-full sm:w-max justify-start" >
              <PermissionGuard permission={PERMISSIONS.ADDRESS_READ}>
                <TabsTrigger value="all-address">All Address</TabsTrigger>
              </PermissionGuard>
              <TabsTrigger value="new-address" >New Address</TabsTrigger>
              <TabsTrigger value="edit-address">Edit Address</TabsTrigger> 
            </TabsList> */}
            <div className="flex items-center gap-2">

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  {/* <Button variant="outline" size="sm" className="h-10" >
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

          {/*admin Table */}
          <TabsContent value="all-address" className="mt-0">

            {/* Filters */}
            <div className="my-4 flex gap-4 flex-wrap 2xl:flex-nowrap justify-between">
              <div className="relative w-full min-w-[280px] max-w-[500px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search Name..."
                  className="w-full pl-8"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* {activeTab === "all-address" && (
                <Button className="gap-1" size="sm" onClick={() => {
                  setActiveTab("new-address");
                  setSelectedPerson(null);
                  setLatitude(null);
                  setLongitude(null);
                  setAddress(null);
                }}>
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Add Address</span>
                </Button>
              )} */}
            </div>
            <Card>
              <CardContent>
                <Table className="whitespace-nowrap">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">Nº</TableHead>
                      <TableHead className="w-[50px]">User ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead className="text-right">Updated By</TableHead>
                      <TableHead className="text-right">Updated Date</TableHead>
                      <TableHead className="w-[70px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <MyNoItemTableRow colSpan={8} name="address" items={addressItem} />
                    {addressItem?.map((item, index) => (
                      <TableRow key={item.id} className="hover:bg-muted/50" onDoubleClick={() => handleItemAction("viewDetails", item)}>
                        <TableCell>{index + 1 + (pagination?.currentPage ?? 0) * (pagination?.pageSize ?? 1)}</TableCell>
                        <TableCell className="font-mono text-xs">
                          {MyHashID(item.id)}
                          <button onClick={() => {
                            navigator.clipboard?.writeText(item.personId);
                            toast({
                              title: "Copied to clipboard",
                              description: "User ID has been copied to the clipboard",
                              variant: "default",
                            });
                          }} className="ml-2 text-xs text-green-500 hover:underline"> Copy</button>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {item.name}</div>
                        </TableCell>
                        <TableCell>{item.address?.substring(0, 25)}{item.address && item.address.length > 25 ? "..." : ""}</TableCell>
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
                              {/* <DropdownMenuItem
                                onClick={() => { handleItemAction("editItem", item) }}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Address
                              </DropdownMenuItem> */}
                              <PermissionGuard permission={PERMISSIONS.ADDRESS_DELETE}>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() =>
                                    handleItemAction("deleteItem", item)
                                  }
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete Address
                                </DropdownMenuItem>
                              </PermissionGuard>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {/* Pagination */}
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

          {/* new address */}
          <TabsContent value="new-address" className="mt-0">
            <Card className="sm:max-w-[600px] m-auto">
              <CardContent>
                <div>
                  <h2 className="text-lg font-medium">Add New Address</h2>
                  <div className="text-sm text-muted-foreground"  >
                    Enter the details for the new address item.
                    Click create when you're done. ??
                  </div>
                </div>
                <form id="item-form" className=" overflow-y-auto" onSubmit={onSubmit}>
                  <div className="grid gap-4 py-4 px-2">
                    <div className="grid sm:grid-cols-1 gap-4">
                      <div className="space-y-2 ">
                        <Label htmlFor="driverName">Person *</Label>
                        <UserSelect
                          value={selectedPerson}
                          onChange={setSelectedPerson}
                          name="personId"
                          placeholder="Select person..."
                          required
                        />
                      </div>
                      <Input id="personId" readOnly type="text" placeholder="Person Id: ****-****-***-***" name="personId" value={selectedPerson?.id} required />
                    </div>
                    <div className="grid sm:grid-cols-1 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Title</Label>
                        <Input id="name" required placeholder="Enter address name" name="name" />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-1 gap-4">
                      <div className="grid gap-2" >
                        <Label htmlFor="description">Description</Label>
                        <Input id="description" placeholder="Enter address description" name="description" />
                      </div>
                    </div>

                    <div >
                      <LocationPicker
                        onSelect={(lat, lng) => {
                          setLatitude(lat);
                          setLongitude(lng);
                        }}
                      />

                      {latitude && longitude && (
                        <p className="text-sm text-muted-foreground">
                          Selected: {latitude.toFixed(6)}, {longitude.toFixed(6)}
                        </p>
                      )}
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="latitude">Latitude</Label>
                        <Input id="latitude" required placeholder="Enter latitude" name="latitude" type="number" step="0.000001" value={latitude?.toString() || ""} onChange={(e) => setLatitude(parseFloat(e.target.value))} />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="longitude">Longitude</Label>
                        <Input id="longitude" required placeholder="Enter longitude" name="longitude" type="number" step="0.000001" value={longitude?.toString() || ""} onChange={(e) => setLongitude(parseFloat(e.target.value))} />
                      </div>
                    </div>

                  </div>
                </form>
                <div className="flex gap-2 justify-end">
                  <Button variant="destructive" onClick={() => setActiveTab("all-address")}>Cancel</Button>
                  <Button form="item-form" type="submit">{isSubmitting ? "Saving..." : "Save"}</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Edit address  */}
          <TabsContent value="edit-address" className="mt-0">
            <Card className="sm:max-w-[600px] m-auto">
              <CardContent>
                <div>
                  <h2 className="text-lg font-medium">Edit Address</h2>
                  <div className="text-sm text-muted-foreground"  >
                    Enter the details for the address item.
                    Click save when you're done.
                  </div>
                </div>
                {selectedItem && (
                  <form className=""
                    onSubmit={(e) => handleSubmit(e, () => { })}
                  >

                    <div className="grid gap-4 py-4 px-2 sm:h-max overflow-y-auto">
                      <div className="grid sm:grid-cols-1 gap-4">
                        {/* <Input id="edit-id" defaultValue={selectedItem.id} type="hidden" name="id" />
                        <div className="grid gap-2">
                          <Label htmlFor="personId">Person Id</Label>
                          <Input id="personId" disabled defaultValue={selectedItem.personId} placeholder="Enter user id" name="personId" />
                        </div> */}

                        <div className="grid sm:grid-cols-1 gap-4">
                          <div className="space-y-2 ">
                            <Label htmlFor="driverName">Person *</Label>
                            <UserSelect
                              value={selectedPerson}
                              valueId={selectedItem.personId}
                              onChange={setSelectedPerson}
                              name="personId"
                              placeholder="Select person..."
                              required
                            />
                          </div>
                          <Input id="edit-personId" readOnly type="text" placeholder="Person Id: ****-****-***-***" defaultValue={selectedItem.id} value={selectedPerson?.id} required />
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-1 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="name">Title</Label>
                          <Input id="name" required defaultValue={selectedItem.name} placeholder="Enter address name" name="name" />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-1 gap-4">
                        <div className="grid gap-2" >
                          <Label htmlFor="description">Description</Label>
                          <Input id="description" defaultValue={selectedItem.description} placeholder="Enter address description" name="description" />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-1 ">
                        <LocationPicker
                          onSelect={(lat, lng, address) => {
                            setLatitude(lat);
                            setLongitude(lng);
                            setAddress(address);
                            // setSelectedItem((prev) => prev ? { ...prev, address: address } : prev);
                            setSelectedItem({ ...selectedItem, latitude: lat, longitude: lng, address: address });
                          }}
                          defaultValue={{ lat: selectedItem.latitude, lng: selectedItem.longitude, address: selectedItem.address }}
                        />

                        {selectedItem && (
                          <p className="text-sm text-muted-foreground">
                            Selected: {selectedItem.latitude?.toFixed(6)}, {selectedItem.longitude?.toFixed(6)}
                          </p>
                        )}
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="latitude">Latitude</Label>
                          <Input id="latitude" required placeholder="Enter latitude" name="latitude" type="number" step="0.000001" value={latitude?.toString() || selectedItem?.latitude?.toString() || ""} onChange={(e) => setLatitude(parseFloat(e.target.value))} />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="longitude">Longitude</Label>
                          <Input id="longitude" required placeholder="Enter longitude" name="longitude" type="number" step="0.000001" value={longitude?.toString() || selectedItem?.longitude?.toString() || ""} onChange={(e) => setLongitude(parseFloat(e.target.value))} />
                        </div>
                      </div>

                    </div>
                    <DialogFooter>
                      <Button
                        variant="destructive"
                        type="button"
                        onClick={() => setActiveTab("all-address")}
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* View Details Dialog */}
      <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] h-max overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Address Details</DialogTitle>
            <DialogDescription>
              Detailed information about {selectedItem?.name}
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-6 py-4">

              {/* Address Information */}
              <div className="rounded-lg border">
                <div className="border-b px-4 py-3">
                  <h3 className="font-semibold">Address Information</h3>
                </div>

                <table className="w-full text-sm">
                  <thead><tr><th></th><th></th></tr></thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="w-1/3 bg-muted/30 px-4 py-3 font-medium">
                        Address ID
                      </td>
                      <td className="px-4 py-3 break-all">
                        {selectedItem.id}
                      </td>
                    </tr>

                    <tr className="border-b">
                      <td className="bg-muted/30 px-4 py-3 font-medium">
                        User ID
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="break-all">{selectedItem.personId}</span>

                          <button
                            onClick={() => {
                              navigator.clipboard?.writeText(selectedItem.personId)
                              toast({
                                title: "Copied to clipboard",
                                description: "User ID has been copied to the clipboard",
                                variant: "default",
                              })
                            }}
                            className="rounded border px-2 py-1 text-xs hover:bg-muted"
                          >
                            Copy
                          </button>
                        </div>
                      </td>
                    </tr>

                    <tr className="border-b">
                      <td className="bg-muted/30 px-4 py-3 font-medium">
                        Address Title
                      </td>
                      <td className="px-4 py-3">
                        {selectedItem.name}
                      </td>
                    </tr>

                    <tr className="border-b">
                      <td className="bg-muted/30 px-4 py-3 font-medium">
                        Address
                      </td>
                      <td className="px-4 py-3 break-words">
                        {selectedItem.address}
                      </td>
                    </tr>

                    <tr>
                      <td className="bg-muted/30 px-4 py-3 font-medium">
                        Description
                      </td>
                      <td className="px-4 py-3 break-words">
                        {selectedItem.description || "-"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Location */}
              <div className="rounded-lg border">
                <div className="border-b px-4 py-3">
                  <h3 className="font-semibold">Location</h3>
                </div>

                <div className="p-4">
                  <LocationPicker
                    defaultValue={{
                      lat: selectedItem.latitude,
                      lng: selectedItem.longitude,
                      address: selectedItem.address
                    }}
                  />
                </div>
              </div>

              {/* Audit Information */}
              <div className="rounded-lg border">
                <div className="border-b px-4 py-3">
                  <h3 className="font-semibold">Audit Information</h3>
                </div>

                <table className="w-full text-sm">
                  <thead><tr><th></th><th></th></tr></thead>
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
              <MyClose />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Item Dialog */}
      <Dialog open={deleteItemOpen} onOpenChange={setDeleteItemOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Delete Address</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedItem?.name}? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <div className="">
              <div className="rounded-lg border p-4">
                <h3 className="font-medium">Address Details</h3>
                <div className="mt-2 space-y-1 text-sm">
                  <div className="flex gap-2 gap-2">
                    <span>ID:</span>
                    <span className="font-mono">{selectedItem.id}</span>
                  </div>
                  <div className="flex gap-2 gap-2">
                    <span>Name:</span>
                    <span>{selectedItem.name}</span>
                  </div>
                  <div className="flex gap-2 gap-2">
                    <span>Address:</span>
                    <span>{selectedItem.address}</span>
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

// Helper Components

// Mock Data

// Import File component for documents tab
