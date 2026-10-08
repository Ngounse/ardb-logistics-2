"use client";

import { PersonT } from "@/app/admin/person/person";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import api from "@/lib/axios";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";

interface UserSelectProps {
    readonly value?: PersonT | null;
    readonly valueId?: string;
    readonly onChange: (person: PersonT | null) => void;
    readonly placeholder?: string;
    readonly name?: string;
    readonly required?: boolean;
}

export default function UserSelect({
    value,
    valueId,
    onChange,
    placeholder = "Select user...",
    name = "userId",
    required = false,
}: UserSelectProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState<PersonT[]>([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            findUsers();
        }, 380);

        return () => clearTimeout(timer);
    }, [search]);

    const findUsers = async () => {
        try {
            const res = await api.get(
                "person-service/api/v1/persons?page=0&size=10",
                { params: { name: search, }, }
            );

            setUsers(res.data.data.result);
        } catch (error) {
            console.error("Failed to find users:", error);
            setUsers([]);
        }
    };

    useEffect(() => {
        if (!valueId) {
            return;
        }

        const getUser = async () => {
            try {
                const res = await api.get(
                    `person-service/api/v1/persons/${valueId}`
                );

                const person = res.data.data;

                onChange(person);
            } catch (error) {
                console.error("Failed to get user:", error);
            }
        };

        getUser();
    }, [valueId]);

    return (
        <>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                    >
                        {value ? `${value.firstName} ${value.lastName}` : placeholder}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent
                    align="start"
                    className="w-[var(--radix-popover-trigger-width)] p-0"
                >
                    <Command shouldFilter={false}>
                        <CommandInput
                            placeholder="Search user..."
                            value={search}
                            onValueChange={setSearch}
                        />

                        <CommandList>
                            <CommandEmpty>
                                {search ? "No user found." : "Type to search user..."}
                            </CommandEmpty>

                            <CommandGroup>
                                {users.map((user) => {
                                    const fullName = `${user.firstName} ${user.lastName}`;

                                    return (
                                        <CommandItem
                                            key={user.id}
                                            value={user.id}
                                            onSelect={() => {
                                                onChange(user);
                                                setOpen(false);
                                            }}
                                        >
                                            <Check
                                                className={`mr-2 h-4 w-4 ${value?.id === user.id ? "opacity-100" : "opacity-0"
                                                    }`}
                                            />

                                            <div className="flex flex-col">
                                                <span className="font-medium">
                                                    {fullName}
                                                </span>

                                                {user.phone && (
                                                    <span className="text-xs text-muted-foreground">
                                                        {user.phone}
                                                    </span>
                                                )}

                                                {user.email && (
                                                    <span className="text-xs text-muted-foreground">
                                                        {user.email}
                                                    </span>
                                                )}
                                            </div>
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {/* Important: allows normal FormData to receive the ID */}
            <input
                type="hidden"
                name={name}
                value={value?.id ?? ""}
                required={required}
            />
        </>
    );
}