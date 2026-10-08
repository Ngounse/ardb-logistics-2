import { Ban, CheckCircle, Clock, Wrench } from "lucide-react";
import { Badge } from "./ui/badge";

export const CStatusBadge = (status: string) => {
    if (!status) return
    const config = statusConfig[status.toLocaleLowerCase() as keyof typeof statusConfig];
    if (!config) return null;

    return (
        <Badge
            variant="outline"
            className={`flex items-center gap-1 ${config.bgColor}`
            }
        >
            <config.icon className={`h-3 w-3 ${config.color}`} />
            < span > {config.label} </span>
        </Badge>
    );
};

export const statusConfig = {
    active: {
        icon: CheckCircle,
        color: "text-green-500",
        bgColor: "bg-green-100 dark:bg-green-900",
        label: "Active",
    },
    repair: {
        icon: Wrench,
        color: "text-yellow-500",
        bgColor: "bg-yellow-100 dark:bg-yellow-900",
        label: "Repair",
    },
    available: {
        icon: Clock,
        color: "text-blue-500",
        bgColor: "bg-blue-100 dark:bg-blue-900",
        label: "Available",
    },
    inactive: {
        icon: Ban,
        color: "text-red-500",
        bgColor: "bg-red-100 dark:bg-red-900",
        label: "Inactive",
    },
};