"use client"

import { MySave, MySaving } from "@/components/myFunction";
import PageHeader from "@/components/shared/PageHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import api from '@/lib/axios';
import {
  AlertCircle,
  Bell,
  Camera,
  Check,
  Mail,
  Phone,
  RefreshCw,
  Shield,
  Truck,
  User,
  X
} from "lucide-react";
import Image from "next/image";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Person } from "../person/driver/utility";

export default function SettingsPage() {
  const { toast } = useToast()
  const { user, userInfo } = useAuth();
  const urlPerson = 'person-service/api/v1/persons'
  const urlFiles = 'person-service/api/v1/files'
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [activeTab, setActiveTab] = useState("profile")
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [person, setPerson] = useState<Person>();
  const [fileId, setFileId] = useState<string | null>(null) // Default file ID for testing

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    deliveryAlerts: true,
    maintenanceAlerts: true,
    lowInventoryAlerts: false,
  })

  const [companySettings, setCompanySettings] = useState({
    companyName: "ARDB Logistics",
    email: "admin@ardb.com",
    phone: "+1 (555) 123-4567",
    address: "123 Logistics Ave, Transport City, TC 12345",
    website: "www.ardb.com",
    taxId: "TAX123456789",
  })

  const [pinPayload, setPinPayload] = useState({
    currentPin: "",
    newPin: "",
    confirmPin: "",
  })

  const [userProfile, setUserProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    department: "",
    gender: "",
    dateOfBirth: "",
  })


  useEffect(() => {
    if (userInfo) {
      setUserProfile({
        firstName: userInfo.firstName ?? "",
        lastName: userInfo.lastName ?? "",
        email: userInfo.email ?? "",
        phone: userInfo.phone ?? "",
        role: userInfo.roles?.[0]?.name ?? "",
        department: "",
        gender: userInfo.gender,
        dateOfBirth: userInfo.dateOfBirth ?? "",
      });
    }
  }, [userInfo]);

  const [systemSettings, setSystemSettings] = useState({
    theme: "system",
    language: "en",
    timezone: "UTC-5",
    dateFormat: "MM/DD/YYYY",
    currency: "USD",
    distanceUnit: "miles",
    weightUnit: "lbs",
  })

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }))
  }

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const validateFile = (file: File): string | null => {
    // Check file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"]
    if (!allowedTypes.includes(file.type)) {
      return "Please select a valid image file (JPG, PNG, or GIF)"
    }

    // Check file size (max 2MB)
    const maxSize = 2 * 1024 * 1024 // 2MB in bytes
    if (file.size > maxSize) {
      return "File size must be less than 2MB"
    }

    return null
  }

  const handleChangePin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Simulate password change operation
    setIsSaving(true)
    api.put(`auth-service/api/auth/change-pin`, pinPayload).then(() => {
      toast({
        title: "Password Updated",
        description: "Your PIN has been updated successfully",
      })
      setPinPayload({
        currentPin: "",
        newPin: "",
        confirmPin: "",
      });
    }).finally(() => {
      setIsSaving(false);
    });
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setUploadError(null)
    // Validate file
    const validationError = validateFile(file)
    if (validationError) {
      setUploadError(validationError)
      toast({
        title: "Upload Error",
        description: validationError,
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      const formData = new FormData()
      formData.append("file", file)
      // Simulate upload delay (replace with actual upload logic)
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Set the new profile image
      api.post(`${urlPerson}/profile/photo`, formData).then((res) => {
        setProfileImage(previewUrl)
        setFileId(res.data.data.id) // Assuming the response contains the uploaded file ID
        toast({
          title: "Success!",
          description: "Profile photo uploaded successfully",
        })
      })
    } catch (error) {
      setUploadError("Failed to upload image. Please try again.")
      toast({
        title: "Upload Failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleRemovePhoto = () => {
    if (!fileId) return
    api.delete(`${urlPerson}/profile/photo/${fileId}`).then(() => {
      if (profileImage) { URL.revokeObjectURL(profileImage) }
      // onSetFileId(person);
      handleViewProfile();
      setProfileImage(null)
      setUploadError(null)
      setImageUrl(null)
      toast({
        title: "Photo Removed",
        description: "Profile photo has been removed",
      })
    })
  }

  const handleViewProfile = () => {
    api.get(`person-service/api/v1/persons/profile`).then((res) => {
      setPerson(res.data.data);
      const p: Person = res.data.data;
      onSetFileId(p);
    }).catch((error) => {
      console.error("Error fetching profile:", error);
    });
  };

  const onSetFileId = (p: Person | undefined) => {
    setFileId(p?.photos?.[p.photos.length - 1]?.id ?? null);
  }

  const handleSave = () => {
    // Simulate save operation
    setIsSaving(true)
    api.put(`person-service/api/v1/persons/profile`, {
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      gender: userProfile.gender,
      dateOfBirth: userProfile.dateOfBirth,
      // Include the updated profile data here
    }).then(() => {
      toast({
        title: "Settings Saved",
        description: "Your settings have been saved successfully",
      })
    }).finally(() => {
      setIsSaving(false);
    });
  }

  useEffect(() => {
    getPersonParam()
    handleViewProfile()
  }, [])

  useEffect(() => {
    if (fileId) { getPersonFile(); }

    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [fileId]);

  const getPersonParam = () => {
    api.get(`${urlPerson}/param`).then((res) => {
      console.log("res::", res);
      const personData = res.data.data
    })
  }

  const getPersonFile = async () => {
    if (!fileId) return
    try {
      // const res = await api.get(`${mock}/${mockFileID}`, {
      const res = await api.get(`${urlFiles}/${fileId}`, {
        // responseType: "blob",
        headers: {
          'Accept': 'application/octet-stream'
        }
      },);

      const blob = new Blob([res.data], {
        type: typeof res.headers["content-type"] === "string"
          ? res.headers["content-type"]
          : undefined,
      });
      const base64String = res.data;
      const imageDataUrl = `data:image/png;base64,${base64String}`;
      const objectUrl = URL.createObjectURL(blob);
      setImageUrl(imageDataUrl);
    } catch (err) {
      console.error(err);
    }
  };

  const [isRefreshing, setIsRefreshing] = useState(false);
  const handleRefresh = () => {
    getPersonFile()
    handleViewProfile()
  };

  return (
    <div className="space-y-6">
      <PageHeader pageTitle="Settings" pageDes="Manage your account settings and preferences" />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="flex flex-wrap gap-2 justify-start h-max">
          {/* <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            General
          </TabsTrigger> */}
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>

          {/* <TabsTrigger value="system" className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            System
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Integrations
          </TabsTrigger> */}

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />     Refresh
          </Button>
        </TabsList>

        {/* General Settings */}
        {/* <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Company Information
              </CardTitle>
              <CardDescription>Update your company details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={companySettings.companyName}
                    onChange={(e) => setCompanySettings((prev) => ({ ...prev, companyName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxId">Tax ID</Label>
                  <Input
                    id="taxId"
                    value={companySettings.taxId}
                    onChange={(e) => setCompanySettings((prev) => ({ ...prev, taxId: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyEmail">Email</Label>
                  <Input
                    id="companyEmail"
                    type="email"
                    value={companySettings.email}
                    onChange={(e) => setCompanySettings((prev) => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyPhone">Phone</Label>
                  <Input
                    id="companyPhone"
                    value={companySettings.phone}
                    onChange={(e) => setCompanySettings((prev) => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={companySettings.website}
                    onChange={(e) => setCompanySettings((prev) => ({ ...prev, website: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={companySettings.address}
                  onChange={(e) => setCompanySettings((prev) => ({ ...prev, address: e.target.value }))}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent> */}

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>Manage your personal profile and account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                    {profileImage ? (
                      <>
                        <AvatarImage src={profileImage || imageUrl || "/user.jpg"} alt="Profile01" className="object-cover" />
                        <AvatarFallback className="text-xl font-semibold">
                          {userProfile.firstName[0]}
                          {userProfile.lastName[0]}
                        </AvatarFallback>
                      </>
                    ) : (
                      <>
                        {person?.photos && person.photos.length > 0 ?
                          <Image src={user?.googleId ? `https://www.google.com/s2/photos/public/${user.googleId}?sz=200` : imageUrl ?? "/user.jpg"}
                            alt="Locaing.. Profile02" className="object-cover" width={96} height={96} /> :
                          <AvatarFallback className="text-xl font-semibold">
                            {userProfile.firstName[0]}
                            {userProfile.lastName[0]}
                          </AvatarFallback>}
                      </>
                    )}
                  </Avatar>
                  {(profileImage || imageUrl) && (
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                      onClick={handleRemovePhoto}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>

                <div className="space-y-4 flex-1">
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 bg-transparent"
                      onClick={handleFileSelect}
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Camera className="h-4 w-4" />
                          {profileImage ? "Change Photo" : "Upload Photo"}
                        </>
                      )}
                    </Button>

                    {(profileImage || imageUrl) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRemovePhoto}
                        className="text-destructive hover:text-destructive bg-transparent"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-green-500" />
                      JPG, PNG or GIF formats supported
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-green-500" />
                      Maximum file size: 2MB
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-green-500" />
                      Recommended: Square aspect ratio (1:1)
                    </div>
                  </div>

                  {uploadError && (
                    <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                      <AlertCircle className="h-4 w-4" />
                      {uploadError}
                    </div>
                  )}
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif"
                onChange={handleFileChange}
                className="hidden"
              />

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={userProfile.firstName}
                    onChange={(e) => setUserProfile((prev) => ({ ...prev, firstName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={userProfile.lastName}
                    onChange={(e) => setUserProfile((prev) => ({ ...prev, lastName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={userProfile.gender} onValueChange={(value) => setUserProfile((prev) => ({ ...prev, gender: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Male</SelectItem>
                      <SelectItem value="F">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">DOB</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={userProfile.dateOfBirth}
                    onChange={(e) => setUserProfile((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="userEmail">Email</Label>
                  <Input
                    className="text-sm text-muted-foreground"
                    readOnly
                    id="userEmail"
                    type="email"
                    value={userProfile.email}
                    onChange={(e) => setUserProfile((prev) => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="userPhone">Phone</Label>
                  <Input
                    readOnly
                    className="text-sm text-muted-foreground"
                    id="userPhone"
                    value={userProfile.phone}
                    onChange={(e) => setUserProfile((prev) => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                {/* <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={userProfile.role}
                    onValueChange={(value) => setUserProfile((prev) => ({ ...prev, role: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fleet Manager">Fleet Manager</SelectItem>
                      <SelectItem value="Operations Manager">Operations Manager</SelectItem>
                      <SelectItem value="Dispatcher">Dispatcher</SelectItem>
                      <SelectItem value="Administrator">Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={userProfile.department}
                    onValueChange={(value) => setUserProfile((prev) => ({ ...prev, department: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Operations">Operations</SelectItem>
                      <SelectItem value="Logistics">Logistics</SelectItem>
                      <SelectItem value="Fleet Management">Fleet Management</SelectItem>
                      <SelectItem value="Customer Service">Customer Service</SelectItem>
                    </SelectContent>
                  </Select>
                </div> */}
              </div>
              <div className="space-y-2 flex flex-col sm:flex-row gap-2 justify-end">
                <Button onClick={handleSave} disabled={isSaving} >
                  {isSaving ? (
                    <MySaving />
                  ) : (
                    <MySave />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Configure how you want to receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Communication Channels</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={notifications.emailNotifications}
                      onCheckedChange={(checked) => handleNotificationChange("emailNotifications", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        SMS Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                    </div>
                    <Switch
                      checked={notifications.smsNotifications}
                      onCheckedChange={(checked) => handleNotificationChange("smsNotifications", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive push notifications in your browser</p>
                    </div>
                    <Switch
                      checked={notifications.pushNotifications}
                      onCheckedChange={(checked) => handleNotificationChange("pushNotifications", checked)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Alert Types</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        Delivery Alerts
                      </Label>
                      <p className="text-sm text-muted-foreground">Notifications about delivery status changes</p>
                    </div>
                    <Switch
                      checked={notifications.deliveryAlerts}
                      onCheckedChange={(checked) => handleNotificationChange("deliveryAlerts", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Maintenance Alerts</Label>
                      <p className="text-sm text-muted-foreground">Notifications about vehicle maintenance schedules</p>
                    </div>
                    <Switch
                      checked={notifications.maintenanceAlerts}
                      onCheckedChange={(checked) => handleNotificationChange("maintenanceAlerts", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Low Inventory Alerts</Label>
                      <p className="text-sm text-muted-foreground">Notifications when inventory levels are low</p>
                    </div>
                    <Switch
                      checked={notifications.lowInventoryAlerts}
                      onCheckedChange={(checked) => handleNotificationChange("lowInventoryAlerts", checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>Manage your account security and authentication</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2 items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-medium">PIN</h4>
                    <p className="text-sm text-muted-foreground">PIN code</p>
                  </div>
                  <Button variant="outline" onClick={() => {
                    setIsPasswordDialogOpen(true)
                    setPinPayload({
                      currentPin: "",
                      newPin: "",
                      confirmPin: "",
                    })
                  }}
                  >
                    Change
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Disabled</Badge>
                    <Button variant="outline" disabled>Enable</Button>
                  </div>
                </div>

                {/* <div className="flex flex-wrap gap-2 items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-medium">API Keys</h4>
                    <p className="text-sm text-muted-foreground">Manage API keys for integrations</p>
                  </div>
                  <Button variant="outline" className="flex items-center gap-2 bg-transparent" disabled>
                    <Key className="h-4 w-4" />
                    Manage Keys
                  </Button>
                </div> */}

                <div className="flex flex-wrap gap-2 items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-medium">Active Sessions</h4>
                    <p className="text-sm text-muted-foreground">View and manage your active sessions</p>
                  </div>
                  <Button variant="outline" disabled>
                    View Sessions
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings */}
        {/* <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                System Preferences
              </CardTitle>
              <CardDescription>Configure system-wide settings and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Appearance
                  </h4>
                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <Select
                      value={systemSettings.theme}
                      onValueChange={(value) => setSystemSettings((prev) => ({ ...prev, theme: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">
                          <div className="flex items-center gap-2">
                            <Sun className="h-4 w-4" />
                            Light
                          </div>
                        </SelectItem>
                        <SelectItem value="dark">
                          <div className="flex items-center gap-2">
                            <Moon className="h-4 w-4" />
                            Dark
                          </div>
                        </SelectItem>
                        <SelectItem value="system">
                          <div className="flex items-center gap-2">
                            <Monitor className="h-4 w-4" />
                            System
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Localization
                  </h4>
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select
                      value={systemSettings.language}
                      onValueChange={(value) => setSystemSettings((prev) => ({ ...prev, language: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <Select
                      value={systemSettings.timezone}
                      onValueChange={(value) => setSystemSettings((prev) => ({ ...prev, timezone: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                        <SelectItem value="UTC-7">Mountain Time (UTC-7)</SelectItem>
                        <SelectItem value="UTC-6">Central Time (UTC-6)</SelectItem>
                        <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Date & Currency</h4>
                  <div className="space-y-2">
                    <Label>Date Format</Label>
                    <Select
                      value={systemSettings.dateFormat}
                      onValueChange={(value) => setSystemSettings((prev) => ({ ...prev, dateFormat: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <Select
                      value={systemSettings.currency}
                      onValueChange={(value) => setSystemSettings((prev) => ({ ...prev, currency: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="CAD">CAD (C$)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Units</h4>
                  <div className="space-y-2">
                    <Label>Distance Unit</Label>
                    <Select
                      value={systemSettings.distanceUnit}
                      onValueChange={(value) => setSystemSettings((prev) => ({ ...prev, distanceUnit: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="miles">Miles</SelectItem>
                        <SelectItem value="kilometers">Kilometers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Weight Unit</Label>
                    <Select
                      value={systemSettings.weightUnit}
                      onValueChange={(value) => setSystemSettings((prev) => ({ ...prev, weightUnit: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lbs">Pounds (lbs)</SelectItem>
                        <SelectItem value="kg">Kilograms (kg)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent> */}

        {/* Integrations Settings */}
        {/* <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Third-Party Integrations
              </CardTitle>
              <CardDescription>Manage connections to external services and APIs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2 items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Globe className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Google Maps API</h4>
                      <p className="text-sm text-muted-foreground">Route optimization and tracking</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default">Connected</Badge>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Mail className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">SendGrid</h4>
                      <p className="text-sm text-muted-foreground">Email notifications and alerts</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default">Connected</Badge>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Phone className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Twilio</h4>
                      <p className="text-sm text-muted-foreground">SMS notifications and alerts</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Disconnected</Badge>
                    <Button variant="outline" size="sm">
                      Connect
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Database className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Webhook Endpoints</h4>
                      <p className="text-sm text-muted-foreground">Custom webhook integrations</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent> */}
      </Tabs>

      {/* Save Button */}
      {/* <div className="flex justify-end" >
        <Button onClick={handleSave} className="flex items-center gap-2" >
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div> */}

      {/* change password dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent>

          <DialogHeader>
            <DialogTitle>Change PIN</DialogTitle>
            <p>PIN Requirements</p>
            <DialogDescription >
              <p>✅ Must be 6 digits.</p>
              <p>✅ Must be different from your current PIN. </p>
              <p>✅ Cannot contain sequential numbers (e.g.123456).</p>
              <p>✅ Cannot contain repeated numbers (e.g.111111).</p>
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleChangePin}>
            <div className="grid gap-4 pb-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="current-password" className="text-right">
                  Current PIN
                </Label>
                <Input
                  id="current-password"
                  type="password"
                  autoComplete="off"
                  required
                  value={pinPayload.currentPin}
                  inputMode="numeric"
                  pattern="[0-9]{6,8}"
                  minLength={6}
                  maxLength={8}
                  onChange={(e) => setPinPayload((prev) => ({ ...prev, currentPin: e.target.value.replace(/\D/g, "") }))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-password" className="text-right">
                  New PIN
                </Label>
                <Input
                  id="new-password"
                  type="password"
                  autoComplete="off"
                  required
                  value={pinPayload.newPin}
                  inputMode="numeric"
                  pattern="[0-9]{6,8}"
                  minLength={6}
                  maxLength={8}
                  onChange={(e) => setPinPayload((prev) => ({ ...prev, newPin: e.target.value.replace(/\D/g, "") }))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="confirm-password" className="text-right">
                  Confirm PIN
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  autoComplete="off"
                  required
                  value={pinPayload.confirmPin}
                  inputMode="numeric"
                  pattern="[0-9]{6,8}"
                  minLength={6}
                  maxLength={8}
                  onChange={(e) => setPinPayload((prev) => ({ ...prev, confirmPin: e.target.value.replace(/\D/g, "") }))}
                  className="col-span-3"
                />

              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isSaving || pinPayload.newPin !== pinPayload.confirmPin} className="flex items-center gap-2">
                {isSaving ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Requesting...
                  </>
                ) : (
                  <>
                    Confirm
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  )
}
