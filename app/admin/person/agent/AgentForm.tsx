import { MyCancel, MyCreate, MySave } from "@/components/myFunction";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import UserSelect from "@/components/user/FindUser";
import api from '@/lib/axios';
import { useEffect, useState } from "react";
import { PersonT } from "../person";
import { AgentFormData } from "./utility";


type AgentFormProps = {
    readonly mode: "create" | "edit";
    readonly initialData?: AgentFormData;
    readonly onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    readonly agentparam?: {
        status: string[];
        commissionType: string[];
    } | null;
    readonly onOpenChange: (open: boolean) => void;
};

export function AgentForm({
    mode,
    initialData,
    onSubmit,
    agentparam,
    onOpenChange,
}: AgentFormProps) {
    const [selectedPerson, setSelectedPerson] = useState<PersonT | null>(null);
    const [personSearch, setPersonSearch] = useState("");
    const [personList, setPersonList] = useState<PersonT[]>([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            findUser();
        }, 380);

        return () => clearTimeout(timer);
    }, [personSearch]);

    const findUser = async () => {
        try {
            const res = await api.get(
                "person-service/api/v1/persons?page=0&size=5",
                {
                    params: {
                        name: personSearch,
                    },
                }
            );
            setPersonList(res.data.data.result);
        } catch (error) {
            console.error("Failed to find users:", error);
            setPersonList([]);
        }
    };

    return (
        <form onSubmit={onSubmit} >
            <div className=" h-[70vh] overflow-y-auto">

                <div className="grid gap-2 pb-4 px-2 space-y-4  sm:h-max overflow-y-auto">

                    {/* Agent Code */}
                    <div className="grid gap-2">
                        <Label htmlFor="driverName">Person *</Label>

                        <UserSelect
                            value={selectedPerson}
                            onChange={setSelectedPerson}
                            name="id"
                            placeholder="Select person..."
                            required
                        />
                        {/* <Input id="driverId" name="driverId" placeholder="e.g., DRV-001" value={selectedPerson?.id} type="hidden" required /> */}
                        {/* <Input id="driverName" name="driverName" placeholder="e.g.,Phirom" value={`${selectedPerson?.firstName} ${selectedPerson?.lastName}`} type="hidden" required /> */}
                        {/* <Input id="agentId" name="person" placeholder="e.g., " value={selectedPerson?.id} type="hidden" required /> */}

                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="agentCode">Agent Code</Label>
                        <Input
                            id="agentCode"
                            name="agentCode"
                            defaultValue={initialData?.agentCode}
                            placeholder="Enter agent code"
                        />
                    </div>


                    {/* Status / Commission Type */}
                    <div className="grid sm:grid-cols-2 gap-4">

                        <div className="grid gap-2">
                            <Label>Commission Type</Label>
                            <Select
                                name="commissionType"
                                defaultValue={initialData?.commissionType}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select commission type" />
                                </SelectTrigger>

                                <SelectContent>
                                    {agentparam?.commissionType.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="commisionAmount">Commission Amount</Label>
                            <Input
                                id="commisionAmount"
                                name="commisionAmount"
                                type="number"
                                step="0.01"
                                defaultValue={initialData?.commisionAmount}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="accountName">Account Name</Label>
                            <Input
                                id="accountName"
                                name="accountName"
                                defaultValue={initialData?.accountName}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="bankName">Bank Name</Label>
                            <Input
                                id="bankName"
                                name="bankName"
                                defaultValue={initialData?.bankName}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="accountNumber">Account Number</Label>
                            <Input
                                id="accountNumber"
                                name="accountNumber"
                                defaultValue={initialData?.accountNumber}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Status</Label>
                            <Select
                                name="status"
                                defaultValue={initialData?.status}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>

                                <SelectContent>
                                    {agentparam?.status.map((status) => (
                                        <SelectItem key={status} value={status}>
                                            {status}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                    </div>


                    {/* Address */}
                    <div className="grid gap-2">
                        <Label htmlFor="physicalAddress">Physical Address</Label>
                        <Input
                            id="physicalAddress"
                            name="physicalAddress"
                            defaultValue={initialData?.physicalAddress}
                            placeholder="Enter address"
                        />
                    </div>

                    {/* City / Province */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="city">City</Label>
                            <Input
                                id="city"
                                name="city"
                                defaultValue={initialData?.city}
                                placeholder="Enter city"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="province">Province</Label>
                            <Input
                                id="province"
                                name="province"
                                defaultValue={initialData?.province}
                                placeholder="Enter province"
                            />
                        </div>
                    </div>

                    {/* Postal Code / Country */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="postalCode">Postal Code</Label>
                            <Input
                                id="postalCode"
                                name="postalCode"
                                defaultValue={initialData?.postalCode}
                                placeholder="Postal code"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="country">Country</Label>
                            <Input
                                id="country"
                                name="country"
                                defaultValue={initialData?.country}
                                placeholder="Country"
                            />
                        </div>
                    </div>

                    {/* Coordinates */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="latitude">Latitude</Label>
                            <Input
                                id="latitude"
                                name="latitude"
                                type="number"
                                step="any"
                                defaultValue={initialData?.latitude}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="longitude">Longitude</Label>
                            <Input
                                id="longitude"
                                name="longitude"
                                type="number"
                                step="any"
                                defaultValue={initialData?.longitude}
                            />
                        </div>
                    </div>

                    {/* Deposit */}
                    <div className="grid gap-2">
                        <Label htmlFor="securityDeposit">Security Deposit</Label>
                        <Input
                            id="securityDeposit"
                            name="securityDeposit"
                            type="number"
                            step="0.01"
                            defaultValue={initialData?.securityDeposit}
                        />
                    </div>

                </div>

            </div>
            <DialogFooter className="flex justify-between border-t pt-4">
                <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                    <MyCancel />
                </Button>
                <Button type="submit">
                    {mode === "create" ? <MyCreate /> : <MySave />}
                </Button>
            </DialogFooter>
        </form>
    );
}