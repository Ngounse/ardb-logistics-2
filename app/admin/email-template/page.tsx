"use client";

import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import api from '@/lib/axios';
import { FormatTimestamp } from "@/lib/function";
import {
  Copy,
  Edit,
  Eye,
  FileText,
  Loader2,
  Plus,
  Trash2
} from "lucide-react";
import { useEffect, useState } from "react";
import { EmailTemplate, NewTemplate, } from "./utility";


interface EmailData {
  to: string;
  cc: string;
  bcc: string;
  subject: string;
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
];

export default function EmailPage() {
  const url = 'notification-service/api/v1/mail-template'
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [isNewTemplateOpen, setIsNewTemplateOpen] = useState<boolean>(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(
    null
  );
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedItem, setSelectedItem] = useState<EmailTemplate>();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteItemOpen, setDeleteItemOpen] = useState(false);
  const [emailData, setEmailData] = useState<EmailData>({
    to: "",
    cc: "",
    bcc: "",
    subject: "",
    body: "",
  });

  const [newTemplate, setNewTemplate] = useState<NewTemplate>({
    id: "",
    description: "",
    template: "",
  });

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find((t) => t.id.toString() === templateId);
    if (template) {
      setEmailData((prev) => ({
        ...prev,
      }));
      setSelectedTemplate(templateId);
    }
  };

  useEffect(() => {
    getMailList();
  }, []);

  const getMailList = () => {
    api.get(url).then((res) => {
      const d: EmailTemplate[] = res.data.data.result;
      console.log('Templates fetched:', d);
      setTemplates(d);
    }).catch(() => {

    });
  };

  const handleCreateTemplate = () => {
    console.log('click::');
    getMailList();

    if (
      !newTemplate.id.trim() ||
      !newTemplate.description.trim() ||
      !newTemplate.template.trim()
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const template: EmailTemplate = {
      id: newTemplate.id, // Generate a unique ID for the template
      description: newTemplate.description,
      template: newTemplate.template,
      createdBy: "current_user", // Replace with actual user ID
      createdAt: new Date().toISOString(),
      updatedBy: "current_user", // Replace with actual user ID
      updatedAt: new Date().toISOString(),
    };

    setTemplates([...templates, template]);
    setNewTemplate({ id: "", description: "", template: "" });

    api.post(url, template).then((res) => {
      getMailList();
    }).catch(() => { });


    toast({
      title: "Template Created",
      description: `Template "${template.id}" has been created successfully.`,
    });

  };

  const handleDeleteTemplate = (template: EmailTemplate) => {
    setDeleteItemOpen(true);
    setSelectedItem(template);
  };

  const handlePreviewTemplate = (template: EmailTemplate) => {
    setPreviewTemplate(template);
    setIsPreviewOpen(true);
  };


  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>,
    closeFunction: () => void
  ) => {
    e.preventDefault();
    setIsSubmitting(true);
    api.delete(`${url}/${selectedItem?.id}`).then((res) => {
      setTemplates(templates.filter((t) => t.id !== selectedItem?.id));
      setIsSubmitting(false);
      setSelectedItem(undefined);
      setDeleteItemOpen(false);
    }).catch(() => {
      setIsSubmitting(false);
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        pageTitle="Email Management"
        pageDes="Manage email communications, templates, and notifications"
      />

      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList className="flex gap-4 flex-wrap justify-start h-max">
          {/* <TabsTrigger value="compose" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Compose
          </TabsTrigger> */}
          {/* <TabsTrigger value="inbox" className="flex items-center gap-2">
            <Inbox className="h-4 w-4" />
            Inbox
          </TabsTrigger> */}
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Templates
          </TabsTrigger>
          {/* <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger> */}
        </TabsList>

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
                <Button className="flex items-center gap-2" onClick={
                  () => {
                    setNewTemplate({
                      id: '',
                      description: '',
                      template: '',
                    });
                  }
                }>
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
                      <Label htmlFor="template-name">Template ID *</Label>
                      <Input
                        id="id"
                        name="id"
                        placeholder="e.g., Shipment Confirmation"
                        value={newTemplate.id}
                        onChange={(e) =>
                          setNewTemplate((prev) => ({
                            ...prev,
                            id: e.target.value,
                          }))
                        }
                      />
                    </div>

                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="template-description">Description *</Label>
                    <Input
                      id="template-description"
                      name="description"
                      placeholder="e.g., Your shipment has been confirmed - {{shipment_id}}"
                      value={newTemplate.description}
                      onChange={(e) =>
                        setNewTemplate((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="template-body">Email Body *</Label>
                    <Textarea
                      id="template-body"
                      name="template"
                      placeholder="Enter your email template content here. Use {{variable_name}} for dynamic content."
                      className="min-h-[200px]"
                      value={newTemplate.template}
                      onChange={(e) =>
                        setNewTemplate((prev) => ({
                          ...prev,
                          template: e.target.value,
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
                        {template.id}
                      </CardTitle>
                      <CardDescription className="mt-1 line-clamp-2">
                        {template.description}
                      </CardDescription>
                    </div>
                    {/* <Badge className={getCategoryColor(template.category)}>
                      {template.category}
                    </Badge> */}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground">
                      Last updated: {template.updatedBy}, {FormatTimestamp(template.updatedAt)}
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
                        <Button variant="ghost" size="sm" onClick={() => {
                          setNewTemplate({
                            id: template.id,
                            description: template.description,
                            template: template.template,
                          });
                          setIsNewTemplateOpen(true);
                        }}>
                          <Edit className="h-4 w-4" />

                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTemplate(template)}

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
                    ? `Preview of "${previewTemplate.id}" template`
                    : "Template preview"}
                </DialogDescription>
              </DialogHeader>
              {previewTemplate && (
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Description:</Label>
                    <div className="mt-1 p-2 bg-gray-50 rounded border text-sm">
                      {previewTemplate.description}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Template:</Label>
                    <div className="mt-1 p-3 bg-gray-50 rounded border text-sm whitespace-pre-wrap max-h-60 overflow-y-auto">
                      {previewTemplate.template}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* <Badge
                      className={getCategoryColor(previewTemplate.category)}
                    >
                      {previewTemplate.category}
                    </Badge> */}
                    <span className="text-xs text-muted-foreground">
                      Last updated: {previewTemplate.updatedBy}, {FormatTimestamp(previewTemplate.updatedAt)}
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

        <Dialog open={deleteItemOpen} onOpenChange={setDeleteItemOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Delete Item</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete {selectedItem?.id} {selectedItem?.description}? This action
                cannot be undone.
              </DialogDescription>
            </DialogHeader>

            {(
              <div className="space-y-4">

              </div>)}

            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteItemOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={(e) =>
                  handleSubmit(e as any, () => setDeleteItemOpen(false))
                }
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Item"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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
