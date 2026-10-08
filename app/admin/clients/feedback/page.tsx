"use client"

import { useReducer } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  BarChart,
  ChevronDown,
  Clock,
  Download,
  Filter,
  MessageCircle,
  MoreHorizontal,
  PieChart,
  Plus,
  Search,
  Star,
  ThumbsDown,
  ThumbsUp,
  Send,
  Users,
  FileText,
  FileTextIcon,
  Printer,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

// Define the state type
interface ClientFeedbackState {
  activeTab: string
  selectedFeedback: any
  viewDetailsOpen: boolean
  respondDialogOpen: boolean
  assignDialogOpen: boolean
  statusDialogOpen: boolean
  requestFeedbackOpen: boolean
  selectedClients: string[]
  feedbackRequest: {
    subject: string
    message: string
    category: string
    priority: string
    dueDate: Date | null
    includeRecentShipments: boolean
    sendReminder: boolean
  }
}

// Define the action types
type ClientFeedbackAction =
  | { type: "SET_ACTIVE_TAB"; payload: string }
  | { type: "SET_SELECTED_FEEDBACK"; payload: any }
  | { type: "SET_VIEW_DETAILS_OPEN"; payload: boolean }
  | { type: "SET_RESPOND_DIALOG_OPEN"; payload: boolean }
  | { type: "SET_ASSIGN_DIALOG_OPEN"; payload: boolean }
  | { type: "SET_STATUS_DIALOG_OPEN"; payload: boolean }
  | { type: "SET_REQUEST_FEEDBACK_OPEN"; payload: boolean }
  | { type: "SET_SELECTED_CLIENTS"; payload: string[] }
  | {
      type: "SET_FEEDBACK_REQUEST"
      payload: Partial<{
        subject: string
        message: string
        category: string
        priority: string
        dueDate: Date | null
        includeRecentShipments: boolean
        sendReminder: boolean
      }>
    }

// Define the reducer function
const clientFeedbackReducer = (state: ClientFeedbackState, action: ClientFeedbackAction): ClientFeedbackState => {
  switch (action.type) {
    case "SET_ACTIVE_TAB":
      return { ...state, activeTab: action.payload }
    case "SET_SELECTED_FEEDBACK":
      return { ...state, selectedFeedback: action.payload }
    case "SET_VIEW_DETAILS_OPEN":
      return { ...state, viewDetailsOpen: action.payload }
    case "SET_RESPOND_DIALOG_OPEN":
      return { ...state, respondDialogOpen: action.payload }
    case "SET_ASSIGN_DIALOG_OPEN":
      return { ...state, assignDialogOpen: action.payload }
    case "SET_STATUS_DIALOG_OPEN":
      return { ...state, statusDialogOpen: action.payload }
    case "SET_REQUEST_FEEDBACK_OPEN":
      return { ...state, requestFeedbackOpen: action.payload }
    case "SET_SELECTED_CLIENTS":
      return { ...state, selectedClients: action.payload }
    case "SET_FEEDBACK_REQUEST":
      return { ...state, feedbackRequest: { ...state.feedbackRequest, ...action.payload } }
    default:
      return state
  }
}

export default function ClientFeedbackPage() {
  // Initialize the state using useReducer
  const [state, dispatch] = useReducer(clientFeedbackReducer, {
    activeTab: "all",
    selectedFeedback: null,
    viewDetailsOpen: false,
    respondDialogOpen: false,
    assignDialogOpen: false,
    statusDialogOpen: false,
    requestFeedbackOpen: false,
    selectedClients: [],
    feedbackRequest: {
      subject: "",
      message: "",
      category: "",
      priority: "medium",
      dueDate: null,
      includeRecentShipments: true,
      sendReminder: true,
    },
  })

  // Destructure the state for easier access
  const {
    activeTab,
    selectedFeedback,
    viewDetailsOpen,
    respondDialogOpen,
    assignDialogOpen,
    statusDialogOpen,
    requestFeedbackOpen,
    selectedClients,
    feedbackRequest,
  } = state

  // Mock data for feedback
  const feedbackData = [
    {
      id: "FB-2023-001",
      client: {
        name: "Acme Corporation",
        avatar: "/abstract-geometric-shapes.png",
        contact: "John Smith",
        email: "john@acmecorp.com",
      },
      content:
        "The delivery was completed ahead of schedule. Very impressed with the service quality and the driver was extremely professional.",
      sentiment: "positive",
      category: "Service Quality",
      date: "2023-05-15T10:30:00",
      status: "resolved",
      priority: "medium",
      rating: 5,
      responses: [
        {
          responder: "Michael Brown",
          date: "2023-05-15T14:22:00",
          content:
            "Thank you for your positive feedback! We're glad to hear that our service exceeded your expectations. We'll make sure to recognize the driver for their professionalism.",
        },
      ],
    },
    {
      id: "FB-2023-002",
      client: {
        name: "TechNova Inc.",
        avatar: "/javascript-code.png",
        contact: "Sarah Johnson",
        email: "sarah@technova.com",
      },
      content:
        "The shipment arrived with minor damage to the packaging. Contents were intact, but we would appreciate more careful handling in the future.",
      sentiment: "neutral",
      category: "Packaging",
      date: "2023-05-14T15:45:00",
      status: "in-progress",
      priority: "high",
      rating: 3,
      responses: [],
    },
    {
      id: "FB-2023-003",
      client: {
        name: "Global Traders Ltd.",
        avatar: "/stylized-letters-sj.png",
        contact: "Robert Chen",
        email: "robert@globaltraders.com",
      },
      content:
        "Shipment was delayed by two days without any notification. This caused significant disruption to our production schedule. Very disappointed with the lack of communication.",
      sentiment: "negative",
      category: "Delivery Time",
      date: "2023-05-13T09:15:00",
      status: "new",
      priority: "critical",
      rating: 1,
      responses: [],
    },
    {
      id: "FB-2023-004",
      client: {
        name: "Eco Solutions",
        avatar: "/monogram-mb.png",
        contact: "Emma Davis",
        email: "emma@ecosolutions.com",
      },
      content:
        "The online tracking system was very helpful and accurate. We could monitor our shipment at every stage. Great technology!",
      sentiment: "positive",
      category: "Technology",
      date: "2023-05-12T11:20:00",
      status: "resolved",
      priority: "low",
      rating: 5,
      responses: [
        {
          responder: "Michael Brown",
          date: "2023-05-12T13:45:00",
          content:
            "Thank you for your feedback! We've invested significantly in our tracking technology, and we're pleased to hear it's enhancing your experience with us.",
        },
      ],
    },
    {
      id: "FB-2023-005",
      client: {
        name: "Retail Giants",
        avatar: "/ed-initials-abstract.png",
        contact: "David Wilson",
        email: "david@retailgiants.com",
      },
      content:
        "Documentation was incomplete, which caused delays at customs. Please ensure all paperwork is properly completed for international shipments.",
      sentiment: "negative",
      category: "Documentation",
      date: "2023-05-11T14:30:00",
      status: "in-progress",
      priority: "high",
      rating: 2,
      responses: [
        {
          responder: "Lisa Taylor",
          date: "2023-05-11T16:20:00",
          content:
            "We apologize for the inconvenience caused. We're investigating what went wrong with the documentation process and will implement measures to prevent similar issues in the future.",
        },
      ],
    },
    {
      id: "FB-2023-006",
      client: {
        name: "Healthcare Plus",
        avatar: "/abstract-dw.png",
        contact: "Jennifer Lee",
        email: "jennifer@healthcareplus.com",
      },
      content:
        "The temperature-controlled shipping worked perfectly for our medical supplies. All items arrived in optimal condition.",
      sentiment: "positive",
      category: "Special Handling",
      date: "2023-05-10T09:45:00",
      status: "resolved",
      priority: "medium",
      rating: 5,
      responses: [
        {
          responder: "Michael Brown",
          date: "2023-05-10T11:30:00",
          content:
            "We're glad to hear that our temperature-controlled shipping solution met your requirements. We understand the critical nature of medical supplies and prioritize maintaining the required conditions throughout transit.",
        },
      ],
    },
    {
      id: "FB-2023-007",
      client: {
        name: "Fashion Forward",
        avatar: "/abstract-geometric-shapes.png",
        contact: "Olivia Martinez",
        email: "olivia@fashionforward.com",
      },
      content:
        "The customer service representative was not helpful when we called about our delayed shipment. More training is needed for your support staff.",
      sentiment: "negative",
      category: "Customer Service",
      date: "2023-05-09T16:15:00",
      status: "new",
      priority: "high",
      rating: 2,
      responses: [],
    },
    {
      id: "FB-2023-008",
      client: {
        name: "Construction Pros",
        avatar: "/javascript-code.png",
        contact: "Thomas Brown",
        email: "thomas@constructionpros.com",
      },
      content: "Pricing was higher than quoted initially. Please ensure accurate quotes are provided before shipment.",
      sentiment: "neutral",
      category: "Pricing",
      date: "2023-05-08T13:20:00",
      status: "in-progress",
      priority: "medium",
      rating: 3,
      responses: [
        {
          responder: "Financial Department",
          date: "2023-05-08T15:40:00",
          content:
            "We're reviewing the pricing discrepancy and will get back to you with a detailed explanation. We strive for transparency in our pricing and apologize for any confusion.",
        },
      ],
    },
  ]

  // Mock client data for feedback requests
  const clientsData = [
    {
      id: "1",
      name: "Acme Corporation",
      contact: "John Smith",
      email: "john@acmecorp.com",
      avatar: "/abstract-geometric-shapes.png",
      recentShipments: 5,
      lastFeedback: "2023-04-15",
    },
    {
      id: "2",
      name: "TechNova Inc.",
      contact: "Sarah Johnson",
      email: "sarah@technova.com",
      avatar: "/javascript-code.png",
      recentShipments: 3,
      lastFeedback: "2023-05-01",
    },
    {
      id: "3",
      name: "Global Traders Ltd.",
      contact: "Robert Chen",
      email: "robert@globaltraders.com",
      avatar: "/stylized-letters-sj.png",
      recentShipments: 8,
      lastFeedback: "2023-03-20",
    },
    {
      id: "4",
      name: "Eco Solutions",
      contact: "Emma Davis",
      email: "emma@ecosolutions.com",
      avatar: "/monogram-mb.png",
      recentShipments: 2,
      lastFeedback: "2023-05-10",
    },
    {
      id: "5",
      name: "Retail Giants",
      contact: "David Wilson",
      email: "david@retailgiants.com",
      avatar: "/ed-initials-abstract.png",
      recentShipments: 12,
      lastFeedback: "2023-04-28",
    },
  ]

  // Filter feedback based on active tab
  const filteredFeedback = feedbackData.filter((feedback) => {
    if (activeTab === "all") return true
    if (activeTab === "new") return feedback.status === "new"
    if (activeTab === "in-progress") return feedback.status === "in-progress"
    if (activeTab === "resolved") return feedback.status === "resolved"
    if (activeTab === "positive") return feedback.sentiment === "positive"
    if (activeTab === "neutral") return feedback.sentiment === "neutral"
    if (activeTab === "negative") return feedback.sentiment === "negative"
    return true
  })

  // Calculate metrics
  const metrics = {
    totalFeedback: feedbackData.length,
    averageRating: (feedbackData.reduce((sum, item) => sum + item.rating, 0) / feedbackData.length).toFixed(1),
    positivePercentage: Math.round(
      (feedbackData.filter((item) => item.sentiment === "positive").length / feedbackData.length) * 100,
    ),
    neutralPercentage: Math.round(
      (feedbackData.filter((item) => item.sentiment === "neutral").length / feedbackData.length) * 100,
    ),
    negativePercentage: Math.round(
      (feedbackData.filter((item) => item.sentiment === "negative").length / feedbackData.length) * 100,
    ),
    responseRate: "85%",
    avgResponseTime: "4.2 hours",
    newFeedback: feedbackData.filter((item) => item.status === "new").length,
    resolvedFeedback: feedbackData.filter((item) => item.status === "resolved").length,
  }

  // Function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-500 hover:bg-blue-600"
      case "in-progress":
        return "bg-amber-500 hover:bg-amber-600"
      case "resolved":
        return "bg-green-500 hover:bg-green-600"
      case "closed":
        return "bg-gray-500 hover:bg-gray-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  // Function to get sentiment icon and color
  const getSentimentDetails = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return {
          icon: <ThumbsUp className="h-5 w-5 text-green-500" />,
          color: "text-green-500",
          bgColor: "bg-green-100 dark:bg-green-900/20",
        }
      case "neutral":
        return {
          icon: <MessageCircle className="h-5 w-5 text-amber-500" />,
          color: "text-amber-500",
          bgColor: "bg-amber-100 dark:bg-amber-900/20",
        }
      case "negative":
        return {
          icon: <ThumbsDown className="h-5 w-5 text-red-500" />,
          color: "text-red-500",
          bgColor: "bg-red-100 dark:bg-red-900/20",
        }
      default:
        return {
          icon: <MessageCircle className="h-5 w-5 text-gray-500" />,
          color: "text-gray-500",
          bgColor: "bg-gray-100 dark:bg-gray-800",
        }
    }
  }

  // Function to get priority badge color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      case "medium":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // Function to render star rating
  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
        ))}
      </div>
    )
  }

  // Function to handle view details
  const handleViewDetails = (feedback: any) => {
    dispatch({ type: "SET_SELECTED_FEEDBACK", payload: feedback })
    dispatch({ type: "SET_VIEW_DETAILS_OPEN", payload: true })
  }

  // Function to handle respond
  const handleRespond = (feedback: any) => {
    dispatch({ type: "SET_SELECTED_FEEDBACK", payload: feedback })
    dispatch({ type: "SET_RESPOND_DIALOG_OPEN", payload: true })
  }

  // Function to handle assign
  const handleAssign = (feedback: any) => {
    dispatch({ type: "SET_SELECTED_FEEDBACK", payload: feedback })
    dispatch({ type: "SET_ASSIGN_DIALOG_OPEN", payload: true })
  }

  // Function to handle status change
  const handleStatusChange = (feedback: any) => {
    dispatch({ type: "SET_SELECTED_FEEDBACK", payload: feedback })
    dispatch({ type: "SET_STATUS_DIALOG_OPEN", payload: true })
  }

  // Function to handle request feedback
  const handleRequestFeedback = () => {
    dispatch({ type: "SET_REQUEST_FEEDBACK_OPEN", payload: true })
    dispatch({ type: "SET_SELECTED_CLIENTS", payload: [] })
    dispatch({
      type: "SET_FEEDBACK_REQUEST",
      payload: {
        subject: "",
        message: "",
        category: "",
        priority: "medium",
        dueDate: null,
        includeRecentShipments: true,
        sendReminder: true,
      },
    })
  }

  // Function to handle client selection
  const handleClientSelection = (clientId: string, checked: boolean) => {
    if (checked) {
      dispatch({ type: "SET_SELECTED_CLIENTS", payload: [...selectedClients, clientId] })
    } else {
      dispatch({ type: "SET_SELECTED_CLIENTS", payload: selectedClients.filter((id) => id !== clientId) })
    }
  }

  // Function to handle select all clients
  const handleSelectAllClients = (checked: boolean) => {
    if (checked) {
      dispatch({ type: "SET_SELECTED_CLIENTS", payload: clientsData.map((client) => client.id) })
    } else {
      dispatch({ type: "SET_SELECTED_CLIENTS", payload: [] })
    }
  }

  // Function to send feedback request
  const handleSendFeedbackRequest = () => {
    // Here you would typically send the request to your backend
    console.log("Sending feedback request:", {
      clients: selectedClients,
      request: feedbackRequest,
    })

    // Show success message (you can replace this with actual toast notification)
    alert(`Feedback request sent to ${selectedClients.length} client(s) successfully!`)

    // Close the modal
    dispatch({ type: "SET_REQUEST_FEEDBACK_OPEN", payload: false })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Client Feedback</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-10 bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Export
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <FileTextIcon className="h-4 w-4 mr-2" />
              Export as CSV
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FileText className="h-4 w-4 mr-2" />
              Export as Excel
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FileText className="h-4 w-4 mr-2" />
              Export as PDF
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Satisfaction</CardTitle>
            <div className="p-2 bg-yellow-100 rounded-full">
              <Star className="h-4 w-4 text-yellow-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline space-x-2">
              <div className="text-3xl font-bold">{metrics.averageRating}</div>
              <div className="text-sm text-muted-foreground">/ 5.0</div>
              <div className="rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                +0.3
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-2">
              {renderStarRating(Number.parseFloat(metrics.averageRating))}
              <span className="text-sm text-muted-foreground">from {metrics.totalFeedback} reviews</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sentiment Distribution</CardTitle>
            <div className="p-2 bg-green-100 rounded-full">
              <PieChart className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-2 h-3 w-3 rounded-full bg-green-500"></div>
                  <div className="text-sm">Positive</div>
                </div>
                <div className="font-medium">{metrics.positivePercentage}%</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-2 h-3 w-3 rounded-full bg-amber-500"></div>
                  <div className="text-sm">Neutral</div>
                </div>
                <div className="font-medium">{metrics.neutralPercentage}%</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-2 h-3 w-3 rounded-full bg-red-500"></div>
                  <div className="text-sm">Negative</div>
                </div>
                <div className="font-medium">{metrics.negativePercentage}%</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Metrics</CardTitle>
            <div className="p-2 bg-orange-100 rounded-full">
              <Clock className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm">Response Rate</div>
                <div className="font-medium">{metrics.responseRate}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm">Avg. Response Time</div>
                <div className="font-medium">{metrics.avgResponseTime}</div>
              </div>
              <div className="mt-4 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                <div className="h-2 rounded-full bg-green-500" style={{ width: metrics.responseRate }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Feedback Status</CardTitle>
            <div className="p-2 bg-blue-100 rounded-full">
              <BarChart className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-2 h-3 w-3 rounded-full bg-blue-500"></div>
                  <div className="text-sm">New</div>
                </div>
                <div className="font-medium">{metrics.newFeedback}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-2 h-3 w-3 rounded-full bg-amber-500"></div>
                  <div className="text-sm">In Progress</div>
                </div>
                <div className="font-medium">{feedbackData.filter((item) => item.status === "in-progress").length}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-2 h-3 w-3 rounded-full bg-green-500"></div>
                  <div className="text-sm">Resolved</div>
                </div>
                <div className="font-medium">{metrics.resolvedFeedback}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feedback Table */}
      <Card>
        <CardHeader>
          <CardTitle>Client Feedback</CardTitle>
          <CardDescription>Manage and respond to client feedback across all services.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search and Filter */}
            <div className="flex flex-wrap flex-col gap-2 md:flex-row md:items-center md:justify-between md:space-y-0">
              <div className="flex flex-wrap gap-2 items-center">
                <div className="relative md:max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search feedback..." className="pl-8" />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9 bg-transparent">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuItem>
                      <div className="flex w-full flex-col space-y-1">
                        <span className="text-sm font-medium">Date Range</span>
                        <Select defaultValue="all">
                          <SelectTrigger className="h-8">
                            <SelectValue placeholder="Select date range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Time</SelectItem>
                            <SelectItem value="today">Today</SelectItem>
                            <SelectItem value="yesterday">Yesterday</SelectItem>
                            <SelectItem value="week">This Week</SelectItem>
                            <SelectItem value="month">This Month</SelectItem>
                            <SelectItem value="quarter">This Quarter</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <div className="flex w-full flex-col space-y-1">
                        <span className="text-sm font-medium">Category</span>
                        <Select defaultValue="all">
                          <SelectTrigger className="h-8">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="service">Service Quality</SelectItem>
                            <SelectItem value="delivery">Delivery Time</SelectItem>
                            <SelectItem value="packaging">Packaging</SelectItem>
                            <SelectItem value="documentation">Documentation</SelectItem>
                            <SelectItem value="customer-service">Customer Service</SelectItem>
                            <SelectItem value="pricing">Pricing</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <div className="flex w-full flex-col space-y-1">
                        <span className="text-sm font-medium">Priority</span>
                        <Select defaultValue="all">
                          <SelectTrigger className="h-8">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Priorities</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Button className="w-full md:w-auto" onClick={handleRequestFeedback}>
                <Plus className="mr-2 h-4 w-4" />
                Request Feedback
              </Button>
            </div>

            {/* Tabs */}
            <Tabs
              defaultValue="all"
              className="w-full"
              onValueChange={(value) => dispatch({ type: "SET_ACTIVE_TAB", payload: value })}
            >
              <TabsList className="w-full md:w-max flex flex-wrap h-max">
                <TabsTrigger value="all" className="flex-1 md:flex-none">
                  All
                  <Badge variant="secondary" className="ml-2">
                    {feedbackData.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="new" className="flex-1 md:flex-none">
                  New
                  <Badge variant="secondary" className="ml-2">
                    {feedbackData.filter((item) => item.status === "new").length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="in-progress" className="flex-1 md:flex-none">
                  In Progress
                  <Badge variant="secondary" className="ml-2">
                    {feedbackData.filter((item) => item.status === "in-progress").length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="resolved" className="flex-1 md:flex-none">
                  Resolved
                  <Badge variant="secondary" className="ml-2">
                    {feedbackData.filter((item) => item.status === "resolved").length}
                  </Badge>
                </TabsTrigger>
              </TabsList>

              <div className="mt-4 overflow-hidden rounded-md border">
                <div className="overflow-x-auto">
                  <Table className="w-full text-sm">
                    <TableHeader>
                      <TableRow className="border-b bg-muted/50">
                        <TableHead className="px-4 py-3 text-left font-medium">Client</TableHead>
                        <TableHead className="px-4 py-3 text-left font-medium">Feedback</TableHead>
                        <TableHead className="px-4 py-3 text-left font-medium">Category</TableHead>
                        <TableHead className="px-4 py-3 text-left font-medium">Date</TableHead>
                        <TableHead className="px-4 py-3 text-left font-medium">Status</TableHead>
                        <TableHead className="px-4 py-3 text-left font-medium">Priority</TableHead>
                        <TableHead className="px-4 py-3 text-left font-medium">Rating</TableHead>
                        <TableHead className="px-4 py-3 text-right font-medium">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredFeedback.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                            No feedback found matching the current filters.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredFeedback.map((feedback) => {
                          const sentimentDetails = getSentimentDetails(feedback.sentiment)

                          return (
                            <TableRow key={feedback.id} className="border-b">
                              <TableCell className="px-4 py-3">
                                <div className="flex items-center space-x-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage
                                      src={
                                        feedback.client.avatar ||
                                        "/placeholder.svg" ||
                                        "/placeholder.svg" ||
                                        "/placeholder.svg"
                                      }
                                      alt={feedback.client.name}
                                    />
                                    <AvatarFallback>{feedback.client.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium text-nowrap">{feedback.client.name}</div>
                                    <div className="text-xs text-muted-foreground">{feedback.client.contact}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="max-w-[300px] px-4 py-3">
                                <div className="flex items-start space-x-2">
                                  <div className={`mt-0.5 rounded-full p-1 ${sentimentDetails.bgColor}`}>
                                    {sentimentDetails.icon}
                                  </div>
                                  <div>
                                    <div className="line-clamp-2">{feedback.content}</div>
                                    <div className="mt-1 text-xs text-muted-foreground">ID: {feedback.id}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="px-4 py-3 text-nowrap">
                                <Badge variant="outline">{feedback.category}</Badge>
                              </TableCell>
                              <TableCell className="px-4 py-3 text-muted-foreground text-nowrap">
                                {formatDate(feedback.date)}
                              </TableCell>
                              <TableCell className="px-4 py-3 text-nowrap">
                                <Badge className={getStatusColor(feedback.status)}>
                                  {feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1).replace("-", " ")}
                                </Badge>
                              </TableCell>
                              <TableCell className="px-4 py-3">
                                <Badge variant="outline" className={getPriorityColor(feedback.priority)}>
                                  {feedback.priority.charAt(0).toUpperCase() + feedback.priority.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell className="px-4 py-3">{renderStarRating(feedback.rating)}</TableCell>
                              <TableCell className="px-4 py-3 text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                      <span className="sr-only">Actions</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleViewDetails(feedback)}>
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleRespond(feedback)}>Respond</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleStatusChange(feedback)}>
                                      Change Status
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleAssign(feedback)}>Assign</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600 focus:text-red-600">
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          )
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Request Feedback Dialog */}
      <Dialog
        open={requestFeedbackOpen}
        onOpenChange={() => dispatch({ type: "SET_REQUEST_FEEDBACK_OPEN", payload: !requestFeedbackOpen })}
      >
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-blue-500" />
              Request Client Feedback
            </DialogTitle>
            <DialogDescription className="text-start">
              Send a feedback request to selected clients to gather their opinions about your services.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Feedback Request Details */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="e.g., We'd love your feedback on our service"
                    value={feedbackRequest.subject}
                    onChange={(e) => dispatch({ type: "SET_FEEDBACK_REQUEST", payload: { subject: e.target.value } })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={feedbackRequest.category}
                    onValueChange={(value) => dispatch({ type: "SET_FEEDBACK_REQUEST", payload: { category: value } })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Service</SelectItem>
                      <SelectItem value="delivery">Delivery Experience</SelectItem>
                      <SelectItem value="customer-service">Customer Service</SelectItem>
                      <SelectItem value="pricing">Pricing & Value</SelectItem>
                      <SelectItem value="technology">Technology & Tracking</SelectItem>
                      <SelectItem value="packaging">Packaging & Handling</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={feedbackRequest.priority}
                    onValueChange={(value) => dispatch({ type: "SET_FEEDBACK_REQUEST", payload: { priority: value } })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Response Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal ${
                          !feedbackRequest.dueDate && "text-muted-foreground"
                        }`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {feedbackRequest.dueDate ? format(feedbackRequest.dueDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <div className="p-3">
                        <div className="space-y-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full bg-transparent"
                            onClick={() => {
                              const date = new Date()
                              date.setDate(date.getDate() + 7)
                              dispatch({ type: "SET_FEEDBACK_REQUEST", payload: { dueDate: date } })
                            }}
                          >
                            1 Week
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full bg-transparent"
                            onClick={() => {
                              const date = new Date()
                              date.setDate(date.getDate() + 14)
                              dispatch({ type: "SET_FEEDBACK_REQUEST", payload: { dueDate: date } })
                            }}
                          >
                            2 Weeks
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full bg-transparent"
                            onClick={() => {
                              const date = new Date()
                              date.setMonth(date.getMonth() + 1)
                              dispatch({ type: "SET_FEEDBACK_REQUEST", payload: { dueDate: date } })
                            }}
                          >
                            1 Month
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Enter your feedback request message..."
                  className="min-h-[120px]"
                  value={feedbackRequest.message}
                  onChange={(e) => dispatch({ type: "SET_FEEDBACK_REQUEST", payload: { message: e.target.value } })}
                />
                <div className="text-xs text-muted-foreground">
                  This message will be included in the feedback request email sent to clients.
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-shipments"
                    checked={feedbackRequest.includeRecentShipments}
                    onCheckedChange={(checked) =>
                      dispatch({
                        type: "SET_FEEDBACK_REQUEST",
                        payload: { includeRecentShipments: checked as boolean },
                      })
                    }
                  />
                  <Label htmlFor="include-shipments" className="text-sm">
                    Include recent shipment details in the request
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="send-reminder"
                    checked={feedbackRequest.sendReminder}
                    onCheckedChange={(checked) =>
                      dispatch({ type: "SET_FEEDBACK_REQUEST", payload: { sendReminder: checked as boolean } })
                    }
                  />
                  <Label htmlFor="send-reminder" className="text-sm">
                    Send reminder if no response after 3 days
                  </Label>
                </div>
              </div>
            </div>

            {/* Preview */}
            {selectedClients.length > 0 && feedbackRequest.subject && (
              <div className="border rounded-lg p-4 bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span className="font-medium text-sm">Request Preview</span>
                </div>
                <div className="text-sm space-y-1">
                  <div>
                    <strong>To:</strong> {selectedClients.length} client(s)
                  </div>
                  <div>
                    <strong>Subject:</strong> {feedbackRequest.subject}
                  </div>
                  {feedbackRequest.category && (
                    <div>
                      <strong>Category:</strong> {feedbackRequest.category}
                    </div>
                  )}
                  {feedbackRequest.dueDate && (
                    <div>
                      <strong>Due:</strong> {format(feedbackRequest.dueDate, "PPP")}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => dispatch({ type: "SET_REQUEST_FEEDBACK_OPEN", payload: false })}>
              Cancel
            </Button>
            <Button
              onClick={handleSendFeedbackRequest}
              disabled={selectedClients.length === 0 || !feedbackRequest.subject}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="mr-2 h-4 w-4" />
              Send Request ({selectedClients.length})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog
        open={viewDetailsOpen}
        onOpenChange={() => dispatch({ type: "SET_VIEW_DETAILS_OPEN", payload: !viewDetailsOpen })}
      >
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] h-max overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Feedback Details</DialogTitle>
            <DialogDescription>View complete feedback information and response history.</DialogDescription>
          </DialogHeader>

          {selectedFeedback && (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2 items-center justify-between">
                <div className="flex flex-wrap items-center gap-2 md:gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={selectedFeedback.client.avatar || "/placeholder.svg"}
                      alt={selectedFeedback.client.name}
                    />
                    <AvatarFallback>{selectedFeedback.client.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{selectedFeedback.client.name}</h3>
                    <div className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
                      <span>{selectedFeedback.client.contact}</span>
                      <span>•</span>
                      <span>{selectedFeedback.client.email}</span>
                    </div>
                  </div>
                </div>
                <Badge className={getStatusColor(selectedFeedback.status)}>
                  {selectedFeedback.status.charAt(0).toUpperCase() + selectedFeedback.status.slice(1).replace("-", " ")}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap gap-2 items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{selectedFeedback.category}</Badge>
                    <Badge variant="outline" className={getPriorityColor(selectedFeedback.priority)}>
                      {selectedFeedback.priority.charAt(0).toUpperCase() + selectedFeedback.priority.slice(1)}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">{formatDate(selectedFeedback.date)}</div>
                </div>

                <div className="rounded-md border p-4">
                  <div className="flex items-center space-x-2">
                    <div className={`rounded-full p-1 ${getSentimentDetails(selectedFeedback.sentiment).bgColor}`}>
                      {getSentimentDetails(selectedFeedback.sentiment).icon}
                    </div>
                    <div className="font-medium">Feedback</div>
                    <div className="ml-auto">{renderStarRating(selectedFeedback.rating)}</div>
                  </div>
                  <p className="mt-2">{selectedFeedback.content}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Response History</h4>
                {selectedFeedback.responses.length === 0 ? (
                  <div className="rounded-md border border-dashed p-4 text-center text-muted-foreground">
                    No responses yet. Be the first to respond to this feedback.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedFeedback.responses.map((response: any, index: number) => (
                      <div key={index} className="rounded-md border p-4">
                        <div className="flex flex-wrap gap-1 items-center justify-between">
                          <div className="font-medium">{response.responder}</div>
                          <div className="text-sm text-muted-foreground">{formatDate(response.date)}</div>
                        </div>
                        <p className="mt-2">{response.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2 flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
            <Button variant="outline" onClick={() => dispatch({ type: "SET_VIEW_DETAILS_OPEN", payload: false })}>
              Close
            </Button>
            <div className="flex flex-col gap-2 sm:flex-row ">
              <Button
                onClick={() => {
                  dispatch({ type: "SET_VIEW_DETAILS_OPEN", payload: false })
                  handleRespond(selectedFeedback)
                }}
              >
                Respond
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  dispatch({ type: "SET_VIEW_DETAILS_OPEN", payload: false })
                  handleStatusChange(selectedFeedback)
                }}
              >
                Change Status
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Respond Dialog */}
      <Dialog
        open={respondDialogOpen}
        onOpenChange={() => dispatch({ type: "SET_RESPOND_DIALOG_OPEN", payload: !respondDialogOpen })}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Respond to Feedback</DialogTitle>
            <DialogDescription>Provide a response to the client's feedback.</DialogDescription>
          </DialogHeader>

          {selectedFeedback && (
            <div className="space-y-4">
              <div className="rounded-md border bg-muted/50 p-4">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={selectedFeedback.client.avatar || "/placeholder.svg"}
                      alt={selectedFeedback.client.name}
                    />
                    <AvatarFallback>{selectedFeedback.client.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{selectedFeedback.client.name}</div>
                    <div className="text-xs text-muted-foreground">{formatDate(selectedFeedback.date)}</div>
                  </div>
                </div>
                <p className="mt-2 text-sm">{selectedFeedback.content}</p>
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap gap-2 items-center justify-between">
                  <label htmlFor="response" className="text-sm font-medium">
                    Your Response
                  </label>
                  <Select defaultValue="custom">
                    <SelectTrigger className="h-8 w-[180px]">
                      <SelectValue placeholder="Select template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="custom">Custom Response</SelectItem>
                      <SelectItem value="positive">Positive Feedback</SelectItem>
                      <SelectItem value="apology">Apology Template</SelectItem>
                      <SelectItem value="followup">Follow-up Questions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Textarea
                  id="response"
                  placeholder="Type your response here..."
                  className="min-h-[150px]"
                  defaultValue={
                    selectedFeedback.sentiment === "positive"
                      ? "Thank you for your positive feedback! We're delighted to hear that our service met your expectations. Your satisfaction is our priority, and we appreciate you taking the time to share your experience."
                      : selectedFeedback.sentiment === "negative"
                        ? "Thank you for bringing this to our attention. We sincerely apologize for the inconvenience you experienced. We take your feedback seriously and are working to address the issues you've raised. A member of our team will follow up with you shortly to discuss this further."
                        : ""
                  }
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="update-status" />
                <label
                  htmlFor="update-status"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Update status to "In Progress" after responding
                </label>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => dispatch({ type: "SET_RESPOND_DIALOG_OPEN", payload: false })}>
              Cancel
            </Button>
            <Button onClick={() => dispatch({ type: "SET_RESPOND_DIALOG_OPEN", payload: false })}>Send Response</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Dialog */}
      <Dialog
        open={assignDialogOpen}
        onOpenChange={() => dispatch({ type: "SET_ASSIGN_DIALOG_OPEN", payload: !assignDialogOpen })}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Assign Feedback</DialogTitle>
            <DialogDescription>Assign this feedback to a team member for follow-up.</DialogDescription>
          </DialogHeader>

          {selectedFeedback && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Badge variant="outline">{selectedFeedback.id}</Badge>
                <span className="text-sm text-muted-foreground">from {selectedFeedback.client.name}</span>
              </div>

              <div className="space-y-2">
                <label htmlFor="assignee" className="text-sm font-medium">
                  Assign To
                </label>
                <Select defaultValue="michael">
                  <SelectTrigger id="assignee">
                    <SelectValue placeholder="Select team member" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="michael">Michael Brown</SelectItem>
                    <SelectItem value="lisa">Lisa Taylor</SelectItem>
                    <SelectItem value="david">David Wilson</SelectItem>
                    <SelectItem value="sarah">Sarah Johnson</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="priority" className="text-sm font-medium">
                  Priority
                </label>
                <Select defaultValue={selectedFeedback.priority}>
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="notes" className="text-sm font-medium">
                  Notes
                </label>
                <Textarea
                  id="notes"
                  placeholder="Add any additional notes or instructions..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="notify-assignee" defaultChecked />
                <label
                  htmlFor="notify-assignee"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Send email notification to assignee
                </label>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => dispatch({ type: "SET_ASSIGN_DIALOG_OPEN", payload: false })}>
              Cancel
            </Button>
            <Button onClick={() => dispatch({ type: "SET_ASSIGN_DIALOG_OPEN", payload: false })}>
              Assign Feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Change Dialog */}
      <Dialog
        open={statusDialogOpen}
        onOpenChange={() => dispatch({ type: "SET_STATUS_DIALOG_OPEN", payload: !statusDialogOpen })}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Update Status</DialogTitle>
            <DialogDescription>Change the status of this feedback item.</DialogDescription>
          </DialogHeader>

          {selectedFeedback && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Badge variant="outline">{selectedFeedback.id}</Badge>
                <span className="text-sm text-muted-foreground">from {selectedFeedback.client.name}</span>
              </div>

              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium">
                  Status
                </label>
                <Select defaultValue={selectedFeedback.status}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="resolution-notes" className="text-sm font-medium">
                  Resolution Notes
                </label>
                <Textarea
                  id="resolution-notes"
                  placeholder="Add notes about the resolution or status change..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="notify-client" />
                <label
                  htmlFor="notify-client"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Notify client about status change
                </label>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => dispatch({ type: "SET_STATUS_DIALOG_OPEN", payload: false })}>
              Cancel
            </Button>
            <Button onClick={() => dispatch({ type: "SET_STATUS_DIALOG_OPEN", payload: false })}>Update Status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

const initialClientFeedbackState: ClientFeedbackState = {
  activeTab: "all",
  selectedFeedback: null,
  viewDetailsOpen: false,
  respondDialogOpen: false,
  assignDialogOpen: false,
  statusDialogOpen: false,
  requestFeedbackOpen: false,
  selectedClients: [],
  feedbackRequest: {
    subject: "",
    message: "",
    category: "",
    priority: "medium",
    dueDate: null,
    includeRecentShipments: true,
    sendReminder: true,
  },
}
