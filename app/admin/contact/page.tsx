"use client";

import type React from "react";

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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Users,
  Building2,
  Globe,
  Star,
  CheckCircle,
} from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import Image, { StaticImageData } from "next/image";

import user8 from "@/public/user8.png";
import user9 from "@/public/user9.png";
import user10 from "@/public/user10.png";
import user11 from "@/public/user11.png";

interface ContactForm {
  name: string;
  email: string;
  company: string;
  phone: string;
  subject: string;
  category: string;
  message: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  avatar: string | StaticImageData;
  status: "available" | "busy" | "away";
  rating: number;
  responseTime: string;
}

interface Office {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  hours: string;
  timezone: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactForm>({
    name: "",
    email: "",
    company: "",
    phone: "",
    subject: "",
    category: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const teamMembers: TeamMember[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      role: "Customer Success Manager",
      department: "Customer Support",
      email: "sarah.johnson@ardb.com",
      phone: "+1 (555) 123-4567",
      avatar: user11,
      status: "available",
      rating: 4.9,
      responseTime: "< 2 hours",
    },
    {
      id: "2",
      name: "Michael Chen",
      role: "Technical Support Lead",
      department: "Technical Support",
      email: "michael.chen@ardb.com",
      phone: "+1 (555) 234-5678",
      avatar: user10,
      status: "available",
      rating: 4.8,
      responseTime: "< 4 hours",
    },
    {
      id: "3",
      name: "Emily Rodriguez",
      role: "Sales Director",
      department: "Sales",
      email: "emily.rodriguez@ardb.com",
      phone: "+1 (555) 345-6789",
      avatar: user9,
      status: "busy",
      rating: 4.9,
      responseTime: "< 1 hour",
    },
    {
      id: "4",
      name: "David Kim",
      role: "Operations Manager",
      department: "Operations",
      email: "david.kim@ardb.com",
      phone: "+1 (555) 456-7890",
      avatar: user8,
      status: "available",
      rating: 4.7,
      responseTime: "< 3 hours",
    },
  ];

  const offices: Office[] = [
    {
      id: "1",
      name: "Headquarters",
      address: "123 Logistics Avenue",
      city: "New York, NY 10001",
      country: "United States",
      phone: "+1 (555) 123-4567",
      email: "headquarters@ardb.com",
      hours: "Mon-Fri: 8:00 AM - 6:00 PM EST",
      timezone: "EST",
    },
    {
      id: "2",
      name: "West Coast Office",
      address: "456 Shipping Boulevard",
      city: "Los Angeles, CA 90210",
      country: "United States",
      phone: "+1 (555) 987-6543",
      email: "westcoast@ardb.com",
      hours: "Mon-Fri: 8:00 AM - 6:00 PM PST",
      timezone: "PST",
    },
    {
      id: "3",
      name: "European Office",
      address: "789 ARDB Street",
      city: "London, UK SW1A 1AA",
      country: "United Kingdom",
      phone: "+44 20 7123 4567",
      email: "europe@ardb.com",
      hours: "Mon-Fri: 9:00 AM - 5:00 PM GMT",
      timezone: "GMT",
    },
  ];

  const handleInputChange = (field: keyof ContactForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: "",
        email: "",
        company: "",
        phone: "",
        subject: "",
        category: "",
        message: "",
      });
    }, 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "busy":
        return "bg-red-100 text-red-800";
      case "away":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < Math.floor(rating)
          ? "fill-yellow-400 text-yellow-400"
          : "text-gray-300"
          }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        pageTitle="Contact Us"
        pageDes="Get in touch with our team for support, sales inquiries, or general questions."
      />

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Contact Form */}
        <div className="xl:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Send us a Message
              </CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you as soon as
                possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-muted-foreground">
                    Thank you for contacting us. We'll get back to you within 24
                    hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        placeholder="Enter your email address"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) =>
                          handleInputChange("company", e.target.value)
                        }
                        placeholder="Enter your company name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          handleInputChange("category", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">
                            General Inquiry
                          </SelectItem>
                          <SelectItem value="sales">Sales</SelectItem>
                          <SelectItem value="support">
                            Technical Support
                          </SelectItem>
                          <SelectItem value="billing">Billing</SelectItem>
                          <SelectItem value="partnership">
                            Partnership
                          </SelectItem>
                          <SelectItem value="feedback">Feedback</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) =>
                          handleInputChange("subject", e.target.value)
                        }
                        placeholder="Enter message subject"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) =>
                        handleInputChange("message", e.target.value)
                      }
                      placeholder="Enter your message here..."
                      rows={6}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-6">
          {/* Quick Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Quick Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                  <Phone className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">Phone</div>
                  <div className="text-sm text-muted-foreground">
                    +1 (555) 123-4567
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                  <Mail className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium">Email</div>
                  <div className="text-sm text-muted-foreground">
                    support@ardb.com
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                  <Clock className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <div className="font-medium">Business Hours</div>
                  <div className="text-sm text-muted-foreground">
                    Mon-Fri: 8AM-6PM EST
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Emergency Support</CardTitle>
              <CardDescription>
                24/7 emergency support for critical shipments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Emergency Hotline</span>
                  <Badge variant="destructive">24/7</Badge>
                </div>
                <div className="text-lg font-bold text-red-600">
                  +1 (555) 911-ARDB
                </div>
                <p className="text-sm text-muted-foreground">
                  For urgent shipment issues, delays, or emergencies
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Team Members */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Our Team
          </CardTitle>
          <CardDescription>
            Meet our dedicated team members ready to assist you
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4">
            {teamMembers.map((member) => (
              <Card key={member.id} className="p-2 md:p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8 md:h-12 md:w-12">
                    <Image
                      src={member.avatar || "/placeholder.svg"}
                      alt={member.name}
                    />
                    <AvatarFallback>
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm truncate">
                        {member.name}
                      </h4>
                      <Badge className={`${getStatusColor(member.status)} hover:text-white dark:text-black duration-300`}>
                        {member.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {member.role}
                    </p>
                    <div className="flex items-center gap-1 mb-2">
                      {renderStars(member.rating)}
                      <span className="text-xs text-muted-foreground ml-1">
                        {member.rating}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground truncate">
                          {member.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {member.responseTime}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Office Locations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Office Locations
          </CardTitle>
          <CardDescription>
            Visit us at one of our global offices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
            {offices.map((office) => (
              <Card key={office.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <h4 className="font-medium">{office.name}</h4>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div>
                        <div>{office.address}</div>
                        <div>{office.city}</div>
                        <div>{office.country}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{office.phone}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{office.email}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{office.hours}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
