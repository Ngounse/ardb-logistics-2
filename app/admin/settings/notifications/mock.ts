import { Notification } from "./page";

export const mockNotifications: Notification[] = [
    {
        id: "1",
        title: "Delivery Completed",
        message:
            "Shipment #SH-2024-001 has been successfully delivered to customer John Smith at 123 Main St.",
        type: "success",
        category: "delivery",
        timestamp: "2024-01-15T10:30:00Z",
        read: false,
        priority: "medium",
    },
    {
        id: "2",
        title: "Vehicle Maintenance Due",
        message:
            "Vehicle VH-001 (License: ABC-123) is due for scheduled maintenance in 2 days.",
        type: "warning",
        category: "maintenance",
        timestamp: "2024-01-15T09:15:00Z",
        read: false,
        priority: "high",
        actionRequired: true,
    },
    {
        id: "3",
        title: "New Order Received",
        message:
            "New order #ORD-2024-045 received from ARDBTech Industries for 15 packages.",
        type: "info",
        category: "order",
        timestamp: "2024-01-15T08:45:00Z",
        read: true,
        priority: "medium",
    },
    {
        id: "4",
        title: "System Update Complete",
        message:
            "Fleet management system has been successfully updated to version 2.1.3.",
        type: "success",
        category: "system",
        timestamp: "2024-01-15T07:00:00Z",
        read: true,
        priority: "low",
    },
    {
        id: "5",
        title: "Delivery Delayed",
        message:
            "Shipment #SH-2024-002 is experiencing delays due to traffic conditions. New ETA: 3:30 PM.",
        type: "warning",
        category: "delivery",
        timestamp: "2024-01-15T06:20:00Z",
        read: false,
        priority: "high",
        actionRequired: true,
    },
    {
        id: "6",
        title: "Driver Check-in",
        message:
            "Driver Mike Johnson has checked in at warehouse location WH-003.",
        type: "info",
        category: "user",
        timestamp: "2024-01-15T05:45:00Z",
        read: true,
        priority: "low",
    },
    {
        id: "7",
        title: "Low Fuel Alert",
        message:
            "Vehicle VH-005 has low fuel level (15% remaining). Refueling recommended.",
        type: "warning",
        category: "maintenance",
        timestamp: "2024-01-15T04:30:00Z",
        read: false,
        priority: "medium",
        actionRequired: true,
    },
    {
        id: "8",
        title: "Route Optimization Complete",
        message:
            "Daily route optimization has been completed. 12% efficiency improvement achieved.",
        type: "success",
        category: "system",
        timestamp: "2024-01-15T03:00:00Z",
        read: true,
        priority: "low",
    },
];