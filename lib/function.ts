import { format } from "date-fns";

export const FormatTimestamp = (timestamp: string | null) => {
    if (!timestamp) return
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString();
};

export function FormatDistance(meters: number): string {
    if (meters < 1000) {
        return `${meters} m`;
    }
    return `${(meters / 1000).toFixed(2)} Km`;
}

export function CalculatDistance(meters: number): string {
    if (meters < 1000) {
        return `${meters}`;
    }
    return `${(meters / 1000)}`;
}

export function FormatDuration(totalSeconds: number): string {
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const parts = [];

    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}min`);
    if (seconds > 0 || parts.length === 0) parts.push(`${seconds}sec`);

    return parts.join(" ");
}

export const FormatDateTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();

    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";

    return date.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
};

export const FormatDateTime = (time: string | null,) => {
    if (!time) return
    return format(time, "dd/MM/yyyy, HH:mm:ss")
}