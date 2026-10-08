"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Mail,
  Send,
  Inbox,
  FileText,
  Settings,
  Search,
  Plus,
  Trash2,
  Reply,
  Forward,
  Archive,
  Clock,
  Users,
  Truck,
  Package,
  Loader2,
  Edit,
  Copy,
  Eye,
} from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";

interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  category: string;
  lastUsed: string;
  body: string;
}

interface EmailData {
  to: string;
  cc: string;
  bcc: string;
  subject: string;
  body: string;
}

interface NewTemplate {
  name: string;
  subject: string;
  category: string;
  body: string;
}

interface RecentEmail {
  id: number;
  from: string;
  subject: string;
  preview: string;
  time: string;
  isRead: boolean;
  isStarred: boolean;
  category: string;
}

const emailTemplates: EmailTemplate[] = [
  {
    id: 1,
    name: "Shipment Confirmation",
    subject: "Your shipment has been confirmed - {{shipment_id}}",
    category: "Shipments",
    lastUsed: "2024-01-15",
    body: "Dear Customer,\n\nWe are pleased to confirm that your shipment has been processed and is now in transit.\n\nShipment Details:\n- Shipment ID: {{shipment_id}}\n- Tracking Number: {{tracking_number}}\n- Expected Delivery: {{delivery_date}}\n\nYou can track your shipment at any time using the tracking number provided.\n\nThank you for choosing CargoMax!\n\nBest regards,\nCargoMax Team",
  },
  {
    id: 2,
    name: "Delivery Notification",
    subject: "Your package has been delivered - {{tracking_number}}",
    category: "Deliveries",
    lastUsed: "2024-01-14",
    body: "Dear Customer,\n\nGreat news! Your package has been successfully delivered.\n\nDelivery Details:\n- Tracking Number: {{tracking_number}}\n- Delivered At: {{delivery_time}}\n- Delivered To: {{delivery_address}}\n- Received By: {{recipient_name}}\n\nThank you for choosing CargoMax for your shipping needs!\n\nBest regards,\nCargoMax Team",
  },
  {
    id: 3,
    name: "Delay Alert",
    subject: "Shipment Delay Notification - {{shipment_id}}",
    category: "Alerts",
    lastUsed: "2024-01-13",
    body: "Dear Customer,\n\nWe regret to inform you that there has been a delay with your shipment.\n\nShipment Details:\n- Shipment ID: {{shipment_id}}\n- Original Delivery Date: {{original_date}}\n- New Expected Delivery: {{new_date}}\n- Reason for Delay: {{delay_reason}}\n\nWe sincerely apologize for any inconvenience this may cause and are working to minimize the delay.\n\nBest regards,\nCargoMax Team",
  },
  {
    id: 4,
    name: "Invoice Reminder",
    subject: "Payment Reminder - Invoice {{invoice_number}}",
    category: "Billing",
    lastUsed: "2024-01-12",
    body: "Dear Customer,\n\nThis is a friendly reminder that payment for the following invoice is due:\n\nInvoice Details:\n- Invoice Number: {{invoice_number}}\n- Amount Due: {{amount}}\n- Due Date: {{due_date}}\n- Days Overdue: {{days_overdue}}\n\nPlease process payment at your earliest convenience to avoid any service interruptions.\n\nThank you for your prompt attention to this matter.\n\nBest regards,\nCargoMax Billing Team",
  },
  {
    id: 5,
    name: "Welcome New Client",
    subject: "Welcome to CargoMax - {{client_name}}",
    category: "Onboarding",
    lastUsed: "2024-01-10",
    body: "Dear {{client_name}},\n\nWelcome to CargoMax! We're excited to have you as our new client.\n\nYour account has been set up with the following details:\n- Account ID: {{account_id}}\n- Primary Contact: {{contact_name}}\n- Service Level: {{service_level}}\n\nOur team will be in touch within 24 hours to discuss your shipping needs and help you get started.\n\nWelcome aboard!\n\nBest regards,\nCargoMax Onboarding Team",
  },
  {
    id: 6,
    name: "Maintenance Complete",
    subject: "Vehicle Maintenance Completed - {{vehicle_id}}",
    category: "Maintenance",
    lastUsed: "2024-01-08",
    body: "Dear Team,\n\nThe scheduled maintenance for vehicle {{vehicle_id}} has been completed successfully.\n\nMaintenance Summary:\n- Vehicle: {{vehicle_id}}\n- Service Date: {{service_date}}\n- Services Performed: {{services_list}}\n- Next Service Due: {{next_service_date}}\n- Total Cost: {{maintenance_cost}}\n\nThe vehicle is now ready for service and has been returned to the fleet.\n\nBest regards,\nCargoMax Maintenance Team",
  },
];

const recentEmails: RecentEmail[] = [
  {
    id: 1,
    from: "john.doe@acmecorp.com",
    subject: "Urgent: Shipment Delay for Order #12345",
    preview: "We need to discuss the delay in shipment for order #12345...",
    time: "2 hours ago",
    isRead: false,
    isStarred: true,
    category: "Client",
  },
  {
    id: 2,
    from: "support@fastdelivery.com",
    subject: "Weekly Fleet Performance Report",
    preview: "Here's your weekly fleet performance summary...",
    time: "5 hours ago",
    isRead: true,
    isStarred: false,
    category: "Reports",
  },
  {
    id: 3,
    from: "billing@ardb.com",
    subject: "Invoice #INV-2024-001 Generated",
    preview: "Your invoice has been generated and is ready for review...",
    time: "1 day ago",
    isRead: true,
    isStarred: false,
    category: "Billing",
  },
  {
    id: 4,
    from: "alerts@ardb.com",
    subject: "Vehicle Maintenance Due - Truck #TRK-456",
    preview: "Scheduled maintenance is due for Truck #TRK-456...",
    time: "2 days ago",
    isRead: false,
    isStarred: false,
    category: "Maintenance",
  },
];

export default function EmailPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [priority, setPriority] = useState<string>("normal");
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isNewTemplateOpen, setIsNewTemplateOpen] = useState<boolean>(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(
    null
  );
  const [templates, setTemplates] = useState<EmailTemplate[]>(emailTemplates);
  const { toast } = useToast();

  const [emailData, setEmailData] = useState<EmailData>({
    to: "",
    cc: "",
    bcc: "",
    subject: "",
    body: "",
  });

  const [newTemplate, setNewTemplate] = useState<NewTemplate>({
    name: "",
    subject: "",
    category: "",
    body: "",
  });

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find((t) => t.id.toString() === templateId);
    if (template) {
      setEmailData((prev) => ({
        ...prev,
        subject: template.subject,
        body: template.body,
      }));
      setSelectedTemplate(templateId);
    }
  };

  const handleSendEmail = async () => {
    // Validation
    if (!emailData.to.trim()) {
      toast({
        title: "Error",
        description: "Please enter a recipient email address.",
        variant: "destructive",
      });
      return;
    }

    if (!emailData.subject.trim()) {
      toast({
        title: "Error",
        description: "Please enter an email subject.",
        variant: "destructive",
      });
      return;
    }

    if (!emailData.body.trim()) {
      toast({
        title: "Error",
        description: "Please enter an email message.",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Show success message
      toast({
        title: "Email Sent Successfully!",
        description: `Your email has been sent to ${emailData.to}`,
      });

      // Clear form after successful send
      handleClearForm();
    } catch (error) {
      toast({
        title: "Failed to Send Email",
        description: "There was an error sending your email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleClearForm = () => {
    setEmailData({
      to: "",
      cc: "",
      bcc: "",
      subject: "",
      body: "",
    });
    setSelectedTemplate("");
    setPriority("normal");

    toast({
      title: "Form Cleared",
      description: "All email data has been cleared.",
    });
  };

  const handleSaveDraft = () => {
    toast({
      title: "Draft Saved",
      description: "Your email has been saved as a draft.",
    });
  };

  const handleCreateTemplate = () => {
    if (
      !newTemplate.name.trim() ||
      !newTemplate.subject.trim() ||
      !newTemplate.body.trim()
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const template: EmailTemplate = {
      id: templates.length + 1,
      name: newTemplate.name,
      subject: newTemplate.subject,
      category: newTemplate.category || "General",
      body: newTemplate.body,
      lastUsed: new Date().toISOString().split("T")[0],
    };

    setTemplates([...templates, template]);
    setNewTemplate({ name: "", subject: "", category: "", body: "" });
    setIsNewTemplateOpen(false);

    toast({
      title: "Template Created",
      description: `Template "${template.name}" has been created successfully.`,
    });
  };

  const handleDeleteTemplate = (templateId: number) => {
    setTemplates(templates.filter((t) => t.id !== templateId));
    toast({
      title: "Template Deleted",
      description: "The template has been deleted successfully.",
    });
  };

  const handlePreviewTemplate = (template: EmailTemplate) => {
    setPreviewTemplate(template);
    setIsPreviewOpen(true);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Client":
        return <Users className="h-4 w-4" />;
      case "Reports":
        return <FileText className="h-4 w-4" />;
      case "Billing":
        return <FileText className="h-4 w-4" />;
      case "Maintenance":
        return <Truck className="h-4 w-4" />;
      default:
        return <Mail className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Shipments":
        return "bg-blue-100 text-blue-800";
      case "Deliveries":
        return "bg-green-100 text-green-800";
      case "Alerts":
        return "bg-red-100 text-red-800";
      case "Billing":
        return "bg-yellow-100 text-yellow-800";
      case "Onboarding":
        return "bg-purple-100 text-purple-800";
      case "Maintenance":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleQuickAction = (templateName: string) => {
    const template = templates.find((t) => t.name === templateName);
    if (template) {
      handleTemplateSelect(template.id.toString());
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        pageTitle="Email Management"
        pageDes="Manage email communications, templates, and notifications"
      />

      <Tabs defaultValue="compose" className="space-y-6">
        <TabsList className="flex gap-4 flex-wrap justify-start h-max">
          <TabsTrigger value="compose" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Compose
          </TabsTrigger>
          <TabsTrigger value="inbox" className="flex items-center gap-2">
            <Inbox className="h-4 w-4" />
            Inbox
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="compose" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Compose Email
                  </CardTitle>
                  <CardDescription>
                    Create and send emails to clients, vendors, or team members
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="template">Email Template</Label>
                      <Select
                        value={selectedTemplate}
                        onValueChange={handleTemplateSelect}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a template (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          {templates.map((template) => (
                            <SelectItem
                              key={template.id}
                              value={template.id.toString()}
                            >
                              {template.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select value={priority} onValueChange={setPriority}>
                        <SelectTrigger>
                          <SelectValue placeholder="Normal" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="to">To *</Label>
                    <Input
                      id="to"
                      placeholder="recipient@example.com"
                      value={emailData.to}
                      onChange={(e) =>
                        setEmailData((prev) => ({
                          ...prev,
                          to: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cc">CC</Label>
                      <Input
                        id="cc"
                        placeholder="cc@example.com"
                        value={emailData.cc}
                        onChange={(e) =>
                          setEmailData((prev) => ({
                            ...prev,
                            cc: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bcc">BCC</Label>
                      <Input
                        id="bcc"
                        placeholder="bcc@example.com"
                        value={emailData.bcc}
                        onChange={(e) =>
                          setEmailData((prev) => ({
                            ...prev,
                            bcc: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      placeholder="Email subject"
                      value={emailData.subject}
                      onChange={(e) =>
                        setEmailData((prev) => ({
                          ...prev,
                          subject: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="body">Message *</Label>
                    <Textarea
                      id="body"
                      placeholder="Type your message here..."
                      className="min-h-[200px]"
                      value={emailData.body}
                      onChange={(e) =>
                        setEmailData((prev) => ({
                          ...prev,
                          body: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-4">
                    <Button
                      onClick={handleSendEmail}
                      disabled={isSending}
                      className="flex items-center gap-2"
                    >
                      {isSending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Send Email
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={handleSaveDraft}>
                      Save Draft
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={handleClearForm}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start bg-transparent"
                    onClick={() => handleQuickAction("Shipment Confirmation")}
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Shipment Update
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start bg-transparent"
                    onClick={() => handleQuickAction("Delivery Notification")}
                  >
                    <Truck className="h-4 w-4 mr-2" />
                    Delivery Notification
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start bg-transparent"
                    onClick={() => handleQuickAction("Delay Alert")}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Delay Alert
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start bg-transparent"
                    onClick={() => handleQuickAction("Invoice Reminder")}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Invoice Reminder
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Recent Templates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {templates.slice(0, 3).map((template) => (
                    <div
                      key={template.id}
                      className="p-2 border rounded-lg cursor-pointer hover:bg-muted transition-colors"
                      onClick={() =>
                        handleTemplateSelect(template.id.toString())
                      }
                    >
                      <div className="font-medium text-sm">{template.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {template.category}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="inbox" className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search emails..." className="pl-10" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Emails</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="starred">Starred</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Inbox className="h-5 w-5" />
                Inbox
                <Badge variant="secondary">4 unread</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-2">
                  {recentEmails.map((email, index) => (
                    <div key={email.id}>
                      <div
                        className={`p-4 rounded-lg border cursor-pointer hover:bg-muted transition-colors ${!email.isRead ? "bg-blue-50 border-blue-200" : ""
                          }`}
                      >
                        <div className="flex gap-4 flex-wrap items-start justify-between">
                          <div className="flex  items-start gap-3">
                            <div className="flex items-center gap-2 mt-1">
                              {getCategoryIcon(email.category)}
                            </div>
                            <div className="">
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <span
                                  className={`font-medium ${!email.isRead ? "text-blue-900" : ""
                                    }`}
                                >
                                  {email.from}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {email.category}
                                </Badge>
                              </div>
                              <div
                                className={`font-medium mb-1 ${!email.isRead ? "text-blue-900" : ""
                                  }`}
                              >
                                {email.subject}
                              </div>
                              <div className="text-sm text-muted-foreground line-clamp-2">
                                {email.preview}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {email.time}
                            </span>
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="sm">
                                <Reply className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Forward className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Archive className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      {index < recentEmails.length - 1 && (
                        <Separator className="my-2" />
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="flex flex-wrap gap-2 items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Email Templates</h3>
              <p className="text-sm text-muted-foreground">
                Manage and create email templates for common communications
              </p>
            </div>
            <Dialog
              open={isNewTemplateOpen}
              onOpenChange={setIsNewTemplateOpen}
            >
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  New Template
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Email Template</DialogTitle>
                  <DialogDescription>
                    Create a reusable email template for common communications.
                    Use variables like {`{{variable_name}}`} for dynamic
                    content.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="template-name">Template Name *</Label>
                      <Input
                        id="template-name"
                        placeholder="e.g., Shipment Confirmation"
                        value={newTemplate.name}
                        onChange={(e) =>
                          setNewTemplate((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="template-category">Category</Label>
                      <Select
                        value={newTemplate.category}
                        onValueChange={(value) =>
                          setNewTemplate((prev) => ({
                            ...prev,
                            category: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Shipments">Shipments</SelectItem>
                          <SelectItem value="Deliveries">Deliveries</SelectItem>
                          <SelectItem value="Alerts">Alerts</SelectItem>
                          <SelectItem value="Billing">Billing</SelectItem>
                          <SelectItem value="Onboarding">Onboarding</SelectItem>
                          <SelectItem value="Maintenance">
                            Maintenance
                          </SelectItem>
                          <SelectItem value="General">General</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="template-subject">Subject Line *</Label>
                    <Input
                      id="template-subject"
                      placeholder="e.g., Your shipment has been confirmed - {{shipment_id}}"
                      value={newTemplate.subject}
                      onChange={(e) =>
                        setNewTemplate((prev) => ({
                          ...prev,
                          subject: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="template-body">Email Body *</Label>
                    <Textarea
                      id="template-body"
                      placeholder="Enter your email template content here. Use {{variable_name}} for dynamic content."
                      className="min-h-[200px]"
                      value={newTemplate.body}
                      onChange={(e) =>
                        setNewTemplate((prev) => ({
                          ...prev,
                          body: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">
                      Available Variables:
                    </h4>
                    <div className="text-xs text-muted-foreground grid grid-cols-2 gap-1">
                      <span>• {`{{shipment_id}}`}</span>
                      <span>• {`{{tracking_number}}`}</span>
                      <span>• {`{{client_name}}`}</span>
                      <span>• {`{{delivery_date}}`}</span>
                      <span>• {`{{invoice_number}}`}</span>
                      <span>• {`{{amount}}`}</span>
                      <span>• {`{{vehicle_id}}`}</span>
                      <span>• {`{{contact_name}}`}</span>
                    </div>
                  </div>
                </div>
                <DialogFooter className="gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsNewTemplateOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreateTemplate}>
                    Create Template
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
            {templates.map((template) => (
              <Card
                key={template.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base">
                        {template.name}
                      </CardTitle>
                      <CardDescription className="mt-1 line-clamp-2">
                        {template.subject}
                      </CardDescription>
                    </div>
                    <Badge className={getCategoryColor(template.category)}>
                      {template.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground">
                      Last used: {template.lastUsed}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePreviewTemplate(template)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Preview
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleTemplateSelect(template.id.toString())
                          }
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Use
                        </Button>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Template Preview Dialog */}
          <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Template Preview</DialogTitle>
                <DialogDescription>
                  {previewTemplate
                    ? `Preview of "${previewTemplate.name}" template`
                    : "Template preview"}
                </DialogDescription>
              </DialogHeader>
              {previewTemplate && (
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Subject:</Label>
                    <div className="mt-1 p-2 bg-gray-50 rounded border text-sm">
                      {previewTemplate.subject}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Body:</Label>
                    <div className="mt-1 p-3 bg-gray-50 rounded border text-sm whitespace-pre-wrap max-h-60 overflow-y-auto">
                      {previewTemplate.body}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={getCategoryColor(previewTemplate.category)}
                    >
                      {previewTemplate.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Last used: {previewTemplate.lastUsed}
                    </span>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsPreviewOpen(false)}
                >
                  Close
                </Button>
                {previewTemplate && (
                  <Button
                    onClick={() => {
                      handleTemplateSelect(previewTemplate.id.toString());
                      setIsPreviewOpen(false);
                    }}
                  >
                    Use Template
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Configuration</CardTitle>
                <CardDescription>
                  Configure your email server settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="smtp-server">SMTP Server</Label>
                  <Input id="smtp-server" placeholder="smtp.example.com" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtp-port">Port</Label>
                    <Input id="smtp-port" placeholder="587" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="encryption">Encryption</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="TLS" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tls">TLS</SelectItem>
                        <SelectItem value="ssl">SSL</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" placeholder="your-email@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="••••••••" />
                </div>
                <Button>Save Configuration</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure automatic email notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Shipment Updates</div>
                      <div className="text-sm text-muted-foreground">
                        Send emails when shipment status changes
                      </div>
                    </div>
                    <input type="checkbox" className="toggle" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Delivery Confirmations</div>
                      <div className="text-sm text-muted-foreground">
                        Notify when deliveries are completed
                      </div>
                    </div>
                    <input type="checkbox" className="toggle" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Maintenance Alerts</div>
                      <div className="text-sm text-muted-foreground">
                        Send alerts for vehicle maintenance
                      </div>
                    </div>
                    <input type="checkbox" className="toggle" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Invoice Reminders</div>
                      <div className="text-sm text-muted-foreground">
                        Automatic payment reminders
                      </div>
                    </div>
                    <input type="checkbox" className="toggle" defaultChecked />
                  </div>
                </div>
                <Button>Save Settings</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
