"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useMemo } from "react";

interface DateSelectProps {
    readonly value: Date;
    readonly onChange: (date: Date) => void;
    readonly startYear?: number;
    readonly endYear?: number;
}

export default function DateSelect({
    value,
    onChange,
    startYear = 1900,
    endYear = new Date().getFullYear(),
}: DateSelectProps) {
    const year = value.getFullYear();
    const month = value.getMonth() + 1;
    const day = value.getDate();

    const years = useMemo(() => {
        return Array.from(
            { length: endYear - startYear + 1 },
            (_, i) => endYear - i
        );
    }, [startYear, endYear]);

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const daysInMonth = new Date(year, month, 0).getDate();

    const updateDate = (
        newYear = year,
        newMonth = month,
        newDay = day
    ) => {
        const maxDay = new Date(newYear, newMonth, 0).getDate();

        onChange(
            new Date(
                newYear,
                newMonth - 1,
                Math.min(newDay, maxDay)
            )
        );
    };

    return (
        <div className="grid grid-cols-3 gap-1">
            {/* Day */}
            <Select
                value={String(day)}
                onValueChange={(v) => updateDate(year, month, Number(v))}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Day" />
                </SelectTrigger>

                <SelectContent>
                    {Array.from({ length: daysInMonth }, (_, i) => (
                        <SelectItem key={i + 1} value={String(i + 1)}>
                            {i + 1}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {/* Month */}
            <Select
                value={String(month)}
                onValueChange={(v) => updateDate(year, Number(v), day)}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Month" />
                </SelectTrigger>

                <SelectContent>
                    {months.map((m, i) => (
                        <SelectItem key={m} value={String(i + 1)}>
                            {m}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {/* Year */}
            <Select
                value={String(year)}
                onValueChange={(v) => updateDate(Number(v), month, day)}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Year" />
                </SelectTrigger>

                <SelectContent>
                    {years.map((y) => (
                        <SelectItem key={y} value={String(y)}>
                            {y}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}