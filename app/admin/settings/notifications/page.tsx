"use client";

import { MyPagination } from "@/components/Pagination";
import PageHeader from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import api from '@/lib/axios';
import { PagingT } from "@/lib/response";
import {
  AlertTriangle,
  Bell,
  Check,
  CheckCircle,
  Clock,
  Info,
  MoreVertical,
  Package,
  Search,
  Settings,
  Trash2,
  Truck,
  Users,
  X
} from "lucide-react";
import { useEffect, useState } from "react";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  category: "delivery" | "maintenance" | "order" | "system" | "user";
  timestamp: string;
  read: boolean;
  priority: "low" | "medium" | "high";
  actionRequired?: boolean;
}

export interface ResultNotification {
  createdBy?: string
  createdAt: string
  updatedBy?: string
  updatedAt?: string
  id: string
  message?: string
  seenAt?: string
  recipientUserId?: string
  recipient?: string
  actorUserId?: string
  actor?: string
  url?: string
  sentAt?: string
  sent: boolean
  seen: boolean
  actionRequired?: boolean
  category?: "delivery" | "maintenance" | "order" | "system" | "user"
  type?: "info" | "warning" | "success" | "error"
  priority?: "low" | "medium" | "high"
  timestamp?: string
}

export default function NotificationsPage() {
  const url = 'notification-service/api/v1/notification';
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>(
    []
  );
  const [notifications, setNotifications] = useState<ResultNotification[]>([]);


  useEffect(() => {
    getNotification();
  }, []);

  const getNotification = () => {
    api.get(`${url}?page=0&size=${process.env.NEXT_PUBLIC_PAGE_SIZE}`).then(response => {
      const d: PagingT<ResultNotification> = response.data.data;
      setNotifications(d.result);
    }).catch(() => {
      // setNotifications(mockNotifications);
    });
  }

  const getNotificationIcon = (type?: string, category?: string) => {
    if (category === "delivery") return <Truck className="h-4 w-4" />;
    if (category === "maintenance") return <Settings className="h-4 w-4" />;
    if (category === "order") return <Package className="h-4 w-4" />;
    if (category === "user") return <Users className="h-4 w-4" />;
    if (category === "system") return <Settings className="h-4 w-4" />;

    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "error":
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getTypeColor = (type?: string) => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-800 border-green-200";
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "error":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString();
  };

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.recipient?.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "unread") return matchesSearch && !notification.seen;
    if (activeTab === "action")
      return matchesSearch && notification.actionRequired;
    return matchesSearch && notification.category === activeTab;
  });

  const unreadCount = notifications.filter((n) => !n.seen).length;
  const actionRequiredCount = notifications.filter(
    (n) => n.actionRequired
  ).length;

  const handleMarkAsRead = (id: string) => {
    api.put(`${url}/self/read/${id}`,).then(response => {
      if (response.data.code === 200)
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, seen: true, seenAt: new Date().toISOString() } : n))
        );
    }).catch(console.error);
  };

  const markAllAsRead = () => {
    api.patch(`${url}`, {
      seen: true,
      seenAt: new Date().toISOString()
    }).then(response => {
      setNotifications((prev) => prev.map((n) => ({ ...n, seen: true, seenAt: new Date().toISOString() })));
    }).catch(console.error);
  };

  const deleteNotification = (id: string) => {
    api.delete(`${url}/${id}`, {
    }).then(response => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }).catch(console.error);
  };

  const toggleSelection = (id: string) => {
    setSelectedNotifications((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedNotifications(filteredNotifications.map((n) => n.id));
  };

  const clearSelection = () => {
    setSelectedNotifications([]);
  };

  const deleteSelected = () => {
    setNotifications((prev) =>
      prev.filter((n) => !selectedNotifications.includes(n.id))
    );
    setSelectedNotifications([]);
  };

  const markSelectedAsRead = () => {
    selectedNotifications.forEach((id) => {
      handleMarkAsRead(id);
    });

    setNotifications((prev) =>
      prev.map((n) =>
        selectedNotifications.includes(n.id) ? { ...n, read: true } : n
      )
    );
    setSelectedNotifications([]);
  };

  const handleRefresh = () => {
    getNotification();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        pageTitle="Notifications"
        pageDes="Stay updated with system alerts and important updates"
      />

      {/* Action Bar */}
      <div className="flex flex-wrap flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {selectedNotifications.length > 0 && (
            <>
              <Button variant="outline" size="sm" onClick={markSelectedAsRead}>
                <Check className="h-4 w-4 mr-2" />
                Mark Read ({selectedNotifications.length})
              </Button>
              <Button variant="outline" size="sm" onClick={deleteSelected}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete ({selectedNotifications.length})
              </Button>
              <Button variant="outline" size="sm" onClick={clearSelection}>
                Clear Selection
              </Button>
            </>
          )}
          <Button onClick={handleRefresh} size="sm">
            Refresh
          </Button>
          <Button onClick={markAllAsRead} size="sm">
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex flex-wrap gap-2 justify-start h-max">
          <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
          <TabsTrigger value="unread" className="relative">
            Unread
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="ml-2 h-5 w-5 p-0 text-xs flex items-center justify-center"
              >
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="action" className="relative">
            Action Required
            {actionRequiredCount > 0 && (
              <Badge
                variant="secondary"
                className="ml-2 h-5 w-5 p-0 text-xs flex items-center justify-center"
              >
                {actionRequiredCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="delivery">Delivery</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="order">Orders</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {/* Bulk Actions */}
          {filteredNotifications.length > 0 && (
            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
              <Checkbox
                checked={
                  selectedNotifications.length === filteredNotifications.length
                }
                onCheckedChange={(checked) => {
                  if (checked) {
                    selectAll();
                  } else {
                    clearSelection();
                  }
                }}
              />
              <span className="text-sm text-muted-foreground">
                {selectedNotifications.length > 0
                  ? `${selectedNotifications.length} selected`
                  : "Select all"}
              </span>
            </div>
          )}

          {/* Notifications List */}
          <div className="space-y-2">
            {filteredNotifications.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    No notifications found
                  </h3>
                  <p className="text-muted-foreground text-center">
                    {searchQuery
                      ? "Try adjusting your search terms or filters"
                      : "You're all caught up! No new notifications at this time."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`transition-all hover:shadow-md ${!notification.seen
                    ? "border-l-4 border-l-green-500 bg-green-50/30"
                    : ""
                    } ${selectedNotifications.includes(notification.id)
                      ? "ring-2 ring-green-500"
                      : ""
                    }`}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-wrap sm:flex-nowrap items-start gap-4">
                      <Checkbox
                        checked={selectedNotifications.includes(
                          notification.id
                        )}
                        onCheckedChange={() => toggleSelection(notification.id)}
                      />

                      <div className="flex gap-2 w-full">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(
                            notification.type,
                            notification.category
                          )}
                        </div>

                        <div className="w-full">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4
                                  className={`font-medium ${!notification.seen
                                    ? "text-foreground"
                                    : "text-muted-foreground"
                                    }`}
                                >
                                  {notification.message || "No title"}
                                </h4>
                                {!notification.seen && (
                                  <div className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0" />
                                )}
                              </div>

                              <p className="text-sm text-muted-foreground mb-3">
                                {notification.recipient || "No recipient"}
                              </p>

                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge
                                  variant="outline"
                                  className={getTypeColor(notification.type)}
                                >
                                  {notification.type}
                                </Badge>
                                <Badge
                                  variant="secondary"
                                  className={getPriorityColor(
                                    notification.priority
                                  )}
                                >
                                  {notification.priority} priority
                                </Badge>
                                {notification.actionRequired && (
                                  <Badge variant="destructive">
                                    Action Required
                                  </Badge>
                                )}
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  {formatTimestamp(notification.createdAt)}
                                </div>
                              </div>
                            </div>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {!notification.seen && (
                                  <DropdownMenuItem
                                    onClick={() => handleMarkAsRead(notification.id)}
                                  >
                                    <Check className="h-4 w-4 mr-2" />
                                    Mark as Read
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  onClick={() =>
                                    deleteNotification(notification.id)
                                  } className="text-red-600"     >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* <Pagination total={notifications.length} pageSize={parseInt(process.env.NEXT_PUBLIC_PAGE_SIZE || "10")} onPageChange={() => { }} /> */}

    </div>
  );
}
