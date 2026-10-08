"use client";
import { PersonT } from "@/app/admin/person/person";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import api from '@/lib/axios';
import { NotificationT } from "@/lib/models/notifications";
import { PagingT } from "@/lib/response";
import {
  Bell,
  Building2,
  Calendar,
  Clock,
  Edit,
  Globe,
  LogOut,
  Mail,
  Menu,
  Package,
  Phone,
  Settings,
  User
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, } from "react";
import { ThemeToggle } from "./theme-toggle";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";

interface TopBarProps {
  readonly toggleSidebar: () => void;
  readonly sidebarOpen: boolean;
}

interface NotificationCount {
  total: number;
}

export function TopBar({ toggleSidebar, sidebarOpen }: TopBarProps) {
  const url = 'notification-service/api/v1/notification';
  const router = useRouter();

  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState<NotificationT[]>([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [person, setPerson] = useState<PersonT>();

  const handleLogout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    router.replace("/auth/login");
  };

  const getProfileInfo = () => {
    api.get(`person-service/api/v1/persons/profile`).then((res) => {
      setPerson(res.data.data);
    }).catch((error) => {
      console.error("Error fetching profile:", error);
    });
  }

  const handleViewProfile = () => {
    setIsProfileOpen(true);
  };

  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    async function loadImage() {
      if (!person?.photos?.length) return;
      const url = 'person-service/api/v1/files'
      const res = await api.get(`${url}/${person.photos[person?.photos?.length - 1]?.id}`, {
        // responseType: "blob",
        headers: {
          'Accept': 'application/octet-stream'
        }
      });


      const blob = new Blob([res.data], {
        type: typeof res.headers["content-type"] === "string"
          ? res.headers["content-type"]
          : undefined,
      });
      const base64String = res.data;
      const imageDataUrl = `data:image/png;base64,${base64String}`;
      const objectUrl = URL.createObjectURL(blob);
      setImageUrl(imageDataUrl);
    }

    loadImage();
  }, [person]);

  useEffect(() => {
    getSelfNotifications();
    getNotificationsCount();
    getProfileInfo();
  }, []);

  const getNotificationsCount = () => {
    api.get(`${url}/self?page=0&size=5`).then((res) => {
      const d: NotificationCount = res.data.data;
      setNotificationCount(d.total);
    }).catch((error) => {
      console.error("Error fetching notifications:", error);
    });
  }

  const getSelfNotifications = () => {
    api.get(`${url}?page=0&size=5`).then((res) => {
      const d: PagingT<NotificationT> = res.data.data;
      setNotifications(d.result);
    }).catch((error) => {
      console.error("Error fetching notifications:", error);
    });
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="block lg:hidden"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
        <div className="hidden sm:block md:w-[350px]">
          <div className=" w-[50px] bg-yellow-400 text-black px-3 py-1 rounded-md text-xs font-bold z-50">
            {process.env.NEXT_PUBLIC_APP_ENV}
          </div>
          {/* <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              disabled
              placeholder="Search shipments, clients, orders..."
              className="w-full bg-background pl-8 "
            />
          </div> */}
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="h-8 w-8 relative p-2 bg-primary/10 hover:bg-primary/5 rounded-full cursor-pointer">
              <Bell className="h-4 w-4 text-primary" />

              {notificationCount > 0 && (
                <Badge
                  className="absolute -right-1 -top-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
                  variant="destructive"
                >
                  {notificationCount}
                </Badge>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {
              notifications?.map((notification => (
                <DropdownMenuItem key={notification.id} className={notification.seen ? "text-muted-foreground" : "font-medium"}>
                  {notification.message}
                </DropdownMenuItem>
              )))
            }
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-muted-foreground" onClick={() => {
              // Navigate to notifications page
              router.push("/admin/settings/notifications");
            }}>
              View all
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="h-8 w-8 p-2 bg-primary/10 hover:bg-primary/5 rounded-full cursor-pointer">
              <Globe className="h-4 w-4 text-primary" />
              <span className="sr-only">Language</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="cursor-not-allowed">English</DropdownMenuItem>
            {/* <DropdownMenuItem disabled >Khmer</DropdownMenuItem>
            <DropdownMenuItem disabled >Spanish</DropdownMenuItem>
            <DropdownMenuItem disabled >French</DropdownMenuItem>
            <DropdownMenuItem disabled >German</DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
            >
              <Avatar className="h-8 w-8">
                {imageUrl &&
                  <Image src={imageUrl || 'user'}
                    width={48}
                    height={48} alt="User" />
                }
                <AvatarFallback>
                  {person?.email
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onSelect={() => {
              handleViewProfile();
            }}>
              <User className="h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onSelect={() => {
              router.push("/admin/settings");
            }}>
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onSelect={handleLogout}>
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/* Client Profile Dialog */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                {imageUrl ?
                  <Image
                    className="object-cover"
                    src={imageUrl}
                    alt={`${person?.firstName} ${person?.lastName}`}
                    width={88} height={88}
                  /> :
                  <AvatarFallback>
                    {person?.firstName} {person?.lastName ? person.lastName[0] : ""}
                  </AvatarFallback>
                }
              </Avatar>
              <div>
                <div className="text-xl font-bold">{person?.firstName} {person?.lastName}</div>
                <div className="text-sm text-muted-foreground">
                  {person?.id}
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>

          {person && (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                {person.personType?.map(
                  (service, index) => (
                    <Badge variant="outline" key={service}  >
                      {service}
                    </Badge>
                  )
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Client Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Type:</span>
                      <span>{person.personType?.map(
                        (service, index) => (
                          <Badge variant="outline" key={service}  >
                            {service}
                          </Badge>
                        )
                      )}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Joined:</span>
                      <span>
                        {new Date(
                          person.createdAt
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Last Updated:</span>
                      <span>
                        {new Date(
                          person.updatedAt
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-1">
                      <div>
                        <Label className="text-sm font-medium">Phone</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{person.phone}</span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">
                          Email
                        </Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{person.email}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Preferred Services
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {person.personType?.map(
                      (service, index) => (
                        <Badge key={service} variant="secondary">
                          {service}
                        </Badge>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>


              <div className="flex flex-wrap justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    router.push("/admin/settings");
                    setIsProfileOpen(false);
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsProfileOpen(false);
                  }}
                >
                  <Package className="mr-2 h-4 w-4" />
                  View Orders
                </Button>
                <Button>
                  <Mail className="mr-2 h-4 w-4" />
                  Contact Client
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </header>
  );
}
