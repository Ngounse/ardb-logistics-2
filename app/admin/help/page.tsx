"use client";

import { useState } from "react";
import {
  Search,
  Book,
  MessageCircle,
  Phone,
  Mail,
  Video,
  Users,
  Settings,
  Truck,
  Package,
  BarChart3,
  ChevronRight,
  ExternalLink,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PageHeader from "@/components/shared/PageHeader";
import Link from "next/link";
import user from "@/public/user11.png";
import user2 from "@/public/user2.png";
import user3 from "@/public/user3.png";
import Image from "next/image";

// Mock data for help content
const helpCategories = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "Learn the basics of ARDB",
    icon: Book,
    color: "bg-blue-500",
    articles: 12,
  },
  {
    id: "shipments",
    title: "Shipments",
    description: "Managing shipments and tracking",
    icon: Package,
    color: "bg-green-500",
    articles: 18,
  },
  {
    id: "fleet",
    title: "Fleet Management",
    description: "Vehicle and driver management",
    icon: Truck,
    color: "bg-orange-500",
    articles: 15,
  },
  {
    id: "reports",
    title: "Reports & Analytics",
    description: "Understanding your data",
    icon: BarChart3,
    color: "bg-purple-500",
    articles: 10,
  },
  {
    id: "settings",
    title: "Settings & Configuration",
    description: "Customize your experience",
    icon: Settings,
    color: "bg-gray-500",
    articles: 8,
  },
  {
    id: "account",
    title: "Account Management",
    description: "User accounts and permissions",
    icon: Users,
    color: "bg-indigo-500",
    articles: 6,
  },
];

const popularArticles = [
  {
    id: 1,
    title: "How to create your first shipment",
    category: "Getting Started",
    views: 2847,
    rating: 4.8,
    readTime: "5 min",
  },
  {
    id: 2,
    title: "Setting up vehicle tracking",
    category: "Fleet Management",
    views: 1923,
    rating: 4.6,
    readTime: "8 min",
  },
  {
    id: 3,
    title: "Understanding delivery reports",
    category: "Reports & Analytics",
    views: 1654,
    rating: 4.7,
    readTime: "6 min",
  },
  {
    id: 4,
    title: "Managing user roles and permissions",
    category: "Account Management",
    views: 1432,
    rating: 4.5,
    readTime: "7 min",
  },
  {
    id: 5,
    title: "Configuring notification settings",
    category: "Settings & Configuration",
    views: 1287,
    rating: 4.4,
    readTime: "4 min",
  },
];

const faqs = [
  {
    question: "How do I track a shipment?",
    answer:
      "You can track shipments by going to the Shipments page and clicking on the tracking number. You'll see real-time updates on location, status, and estimated delivery time.",
  },
  {
    question: "Can I add multiple drivers to a vehicle?",
    answer:
      "Yes, you can assign multiple drivers to a single vehicle. Go to Fleet > Vehicles, select your vehicle, and use the 'Assign Drivers' option to add or remove drivers.",
  },
  {
    question: "How do I generate delivery reports?",
    answer:
      "Navigate to Reports > Delivery to access comprehensive delivery analytics. You can filter by date range, status, and export data in various formats.",
  },
  {
    question: "What happens if a delivery is delayed?",
    answer:
      "The system automatically sends notifications to relevant parties. You can view delayed shipments in the Shipments > Delayed section and take appropriate action.",
  },
  {
    question: "How do I set up automated notifications?",
    answer:
      "Go to Settings > Notifications to configure email, SMS, and push notification preferences. You can set up rules for different events and user roles.",
  },
  {
    question: "Can I integrate with third-party services?",
    answer:
      "Yes, ARDB supports integrations with Google Maps, SendGrid, Twilio, and custom webhooks. Configure these in Settings > Integrations.",
  },
];

const tutorials = [
  {
    id: 1,
    title: "ARDB Overview - Getting Started",
    description: "Complete walkthrough of the ARDB platform",
    duration: "12:34",
    thumbnail: "/placeholder.svg?height=120&width=200",
    category: "Getting Started",
  },
  {
    id: 2,
    title: "Creating and Managing Shipments",
    description: "Learn how to create, track, and manage shipments",
    duration: "8:45",
    thumbnail: "/placeholder.svg?height=120&width=200",
    category: "Shipments",
  },
  {
    id: 3,
    title: "Fleet Management Best Practices",
    description: "Optimize your fleet operations and maintenance",
    duration: "15:22",
    thumbnail: "/placeholder.svg?height=120&width=200",
    category: "Fleet Management",
  },
  {
    id: 4,
    title: "Advanced Reporting and Analytics",
    description: "Generate insights from your logistics data",
    duration: "10:18",
    thumbnail: "/placeholder.svg?height=120&width=200",
    category: "Reports",
  },
];

const supportTeam = [
  {
    name: "Sarah Johnson",
    role: "Senior Support Specialist",
    avatar: user,
    rating: 4.9,
    responseTime: "< 2 hours",
  },
  {
    name: "Mike Chen",
    role: "Technical Support Lead",
    avatar: user2,
    rating: 4.8,
    responseTime: "< 1 hour",
  },
  {
    name: "Emily Rodriguez",
    role: "Customer Success Manager",
    avatar: user3,
    rating: 4.9,
    responseTime: "< 3 hours",
  },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredArticles = popularArticles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        pageTitle="Help Center"
        pageDes="Find answers, tutorials, and get support for ARDB"
      />

      <Tabs defaultValue="browse" className="space-y-6">
        <TabsList className="flex flex-wrap gap-2 sm:w-max h-max justify-start">
          <TabsTrigger value="browse">Browse</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
        </TabsList>

        {/* Browse Tab */}
        <TabsContent value="browse" className="space-y-6">
          {/* Help Categories */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Browse by Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
              {helpCategories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Card
                    key={category.id}
                    className="hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${category.color}`}>
                          <IconComponent className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">
                            {category.title}
                          </CardTitle>
                          <CardDescription>
                            {category.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Badge variant="secondary">
                        {category.articles} articles
                      </Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Popular Articles */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Popular Articles</h2>
            <div className="space-y-3">
              {filteredArticles.map((article) => (
                <Card
                  key={article.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                >
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">
                          {article.title}
                        </h3>
                        <div className="flex gap-2 flex-wrap items-center text-sm text-muted-foreground">
                          <Badge variant="outline">{article.category}</Badge>
                          <span>{article.views.toLocaleString()} views</span>
                          <span>{article.readTime} read</span>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{article.rating}</span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="space-y-2">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Options */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Get in Touch</h2>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <MessageCircle className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Live Chat</h3>
                      <p className="text-sm text-muted-foreground">
                        Available 24/7
                      </p>
                    </div>
                  </div>

                  <Link href="/admin/chat" className="w-full bg-black text-white text-center py-2 rounded-xl block">
                    Start Chat
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Mail className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Email Support</h3>
                      <p className="text-sm text-muted-foreground">
                        Response within 4 hours
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    Send Email
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Phone className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Phone Support</h3>
                      <p className="text-sm text-muted-foreground">
                        Mon-Fri, 9AM-6PM EST
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    Call +1 (555) 123-4567
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Support Team */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Our Support Team</h2>

              {supportTeam.map((member, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <Avatar>
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
                      <div className="flex-1">
                        <h3 className="font-semibold">{member.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {member.role}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{member.rating} rating</span>
                      </div>
                      <span className="text-muted-foreground">
                        {member.responseTime}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Community Tab */}
        <TabsContent value="community" className="space-y-6">
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Community Forum</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Connect with other ARDB users, share tips, and get help from
              the community.
            </p>
            <div className="space-y-4">
              <Link href='' className="bg-black text-white text-center py-2 px-3 flex items-center gap-1 w-max rounded-xl mx-auto">
                Join Community Forum
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <h3 className="font-semibold text-2xl">2,847</h3>
                    <p className="text-muted-foreground">Active Members</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <h3 className="font-semibold text-2xl">1,234</h3>
                    <p className="text-muted-foreground">Discussions</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <h3 className="font-semibold text-2xl">98%</h3>
                    <p className="text-muted-foreground">Questions Answered</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
