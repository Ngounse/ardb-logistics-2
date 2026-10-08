import { MyRequired } from "@/components/myFunction";
import DateSelect from "@/components/SelectDate";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import UserSelect from "@/components/user/FindUser";
import api from '@/lib/axios';
import { Countries, normalizePhone } from "@/lib/models/contry";
import { Plus, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getCountryFromPhone, getLocalPhone } from "../page";
import { PersonT } from "../person";
import { MerchantFormData, MerchantParams } from "./utility";


type MerchantFormProps = {
    readonly mode: "create" | "edit";
    readonly initialData?: MerchantFormData;
    readonly onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    readonly agentparam?: MerchantParams | null;
    readonly onOpenChange: (open: boolean) => void;
};

export function MerchantForm({
    mode,
    initialData,
    onSubmit,
    agentparam,
    onOpenChange,
}: MerchantFormProps) {
    const [selectedPerson, setSelectedPerson] = useState<PersonT | null>(initialData?.person ?? null);
    const [personSearch, setPersonSearch] = useState("");
    const [personList, setPersonList] = useState<PersonT[]>([]);
    const [selectedItem, setSelectedItem] = useState<PersonT>();
    const initialCountry = getCountryFromPhone("");
    const [country, setCountry] = useState(initialCountry);
    const [phone, setPhone] = useState(
        getLocalPhone("", initialCountry)
    );
    const [date, setDate] = useState(new Date());

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
            <div className=" overflow-y-auto">

                <div className="grid pb-4 px-2 space-y-4 sm:h-[80vh] md:h-[60vh] overflow-y-auto">
                    {mode === "create" ?
                        <div className="grid gap-2">
                            <Label >Person</Label>
                            <UserSelect
                                value={selectedPerson}
                                onChange={setSelectedPerson}
                                name="personId"
                                placeholder="Import person info..."
                            />
                            <Button disabled={selectedPerson == null} variant={'outline'} type="button" onClick={() => setSelectedPerson(null)}>
                                Reset person
                            </Button>
                        </div>

                        : <Input name="id" type="hidden" defaultValue={initialData?.merchantId} />

                    }

                    <div className="grid sm:grid-cols-2 gap-4">

                        <div className="grid gap-2">
                            <Label htmlFor="firstName">First Name <MyRequired /></Label>
                            <Input
                                id="firstName"
                                name="firstName"
                                type="text"
                                defaultValue={initialData?.person?.firstName}
                                value={selectedPerson?.firstName ?? initialData?.person.firstName}
                            // onChange={(e) =>
                            //     setSelectedPerson((person) =>
                            //         person
                            //             ? { ...person, firstName: e.target.value }
                            //             : null
                            //     )
                            // }
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="lastName">Last Name <MyRequired /></Label>
                            <Input
                                id="lastName"
                                name="lastName"
                                defaultValue={initialData?.lastName}
                                value={selectedPerson?.lastName}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="gender">Gender <MyRequired /></Label>
                            <Select defaultValue={initialData?.gender} name="gender"
                                value={selectedPerson?.gender} required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    {["M", "F"].map((g) => (
                                        <SelectItem key={g} value={g}>
                                            {g}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="dateOfBirth">Date of Birth <MyRequired /></Label>
                            <DateSelect value={selectedPerson?.dateOfBirth ? new Date(selectedPerson.dateOfBirth) : date} onChange={setDate} />
                            <input type="hidden" name="dateOfBirth" value={date.toISOString()} />
                        </div>

                        {selectedItem &&
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

                                    <Input
                                        type="tel"
                                        name="phone"
                                        value={getLocalPhone(
                                            selectedPerson?.phone ?? selectedItem.phone,
                                            getCountryFromPhone(selectedItem.phone)
                                        )}
                                        required
                                        maxLength={9}
                                        minLength={8}
                                        onChange={(e) => {
                                            const currentCountry = getCountryFromPhone(selectedPerson?.phone ?? selectedItem.phone);
                                            const localPhone = normalizePhone(e.target.value.replace(/\D/g, ""), currentCountry.dialCode);

                                            setSelectedItem({
                                                ...selectedItem,
                                                phone: `${currentCountry.dialCode}${localPhone}`,
                                            });
                                        }}
                                        className="flex-1 px-4 py-2 w-[100px] border border-l-0 rounded-r-lg"
                                        placeholder="12345678"
                                    />

                                    {
                                        JSON.stringify(`${selectedPerson?.phone}${selectedItem.phone}`)
                                    }
                                </div>
                            </div>
                        }

                        <div className="grid gap-2 ">
                            <Label htmlFor="phone">Phone number <MyRequired /></Label>
                            <div className="flex">
                                <div  >
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
                                    // name="phone"
                                    value={getLocalPhone(
                                        selectedPerson?.phone ?? phone,
                                        getCountryFromPhone(selectedPerson?.phone ?? phone)
                                    )}
                                    required
                                    maxLength={9}
                                    minLength={8}
                                    onChange={(e) =>
                                        setPhone(normalizePhone(e.target.value.replace(/\D/g, ""), country.dialCode))
                                    }
                                    className="flex-1 px-4 py-2 w-[100px] border border-l-0 rounded-r-lg "
                                    placeholder="12345678"
                                />
                                <input name="phone" type="hidden" value={country.dialCode + getLocalPhone(
                                    selectedPerson?.phone ?? phone,
                                    getCountryFromPhone(selectedPerson?.phone ?? phone)
                                )} />

                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email <MyRequired /></Label>
                            <Input id="email" required
                                value={selectedPerson?.email}
                                placeholder="Enter email address" name="email" type="email"
                            />
                        </div>
                    </div>

                    <div  >
                        <Label htmlFor="shopName">Shop Name <MyRequired /></Label>
                        <Input
                            id="shopName"
                            name="shopName"
                            required
                            defaultValue={initialData?.shopName}
                            placeholder="Enter shop name"
                        />
                    </div>

                    <div  >
                        <Label>Business Type <MyRequired /></Label>
                        <Select
                            name="businessType"
                            defaultValue={initialData?.businessType}
                            required
                        >
                            <SelectTrigger >
                                <SelectValue placeholder="Select commission type" />
                            </SelectTrigger>

                            <SelectContent>
                                {agentparam?.businessType.map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {type}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

            </div>
            <DialogFooter className="flex justify-between  pt-4">
                <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                </Button>
                <Button type="submit" >
                    {mode === "create" ?
                        <> <Plus className="h-4 w-4 mr-1" />  <span >Create</span>  </> :
                        <> <Save className="h-4 w-4 mr-1" /> <span  >Save</span> </>}
                </Button>
            </DialogFooter>
        </form>
    );
}