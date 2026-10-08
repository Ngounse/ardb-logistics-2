import { Ban, ShoppingBag, Utensils, Wrench } from "lucide-react";
import { MytoUpperCase } from "./myFunction";
import { Badge } from "./ui/badge";

export const MyBusinessTypeBadge = (status: string) => {
    if (!status) status = "other";
    const config = statusConfig[status.toLocaleLowerCase() as keyof typeof statusConfig];
    if (!config) return null;

    return (
        <Badge
            variant="outline"
            className={` items-center gap-1 ${config.bgColor}`}
        >
            <config.icon className={`h-3 w-3 ${config.color}`} />
            < span > {MytoUpperCase(status)} </span>
        </Badge>
    );
};

export const statusConfig = {
    restaurant: {
        icon: Utensils,
        color: "text-orange-500",
        bgColor: "bg-orange-100 dark:bg-orange-900",
    },
    retail: {
        icon: ShoppingBag,
        color: "text-green-500",
        bgColor: "bg-green-100 dark:bg-green-900",
    },
    grocery: {
        icon: ShoppingBag,
        color: "text-blue-500",
        bgColor: "bg-blue-100 dark:bg-blue-900",
    },
    service: {
        icon: Wrench,
        color: "text-yellow-500",
        bgColor: "bg-yellow-100 dark:bg-yellow-900",
    },
    other: {
        icon: Ban,
        color: "text-gray-500",
        bgColor: "bg-gray-100 dark:bg-gray-900",
    },
};