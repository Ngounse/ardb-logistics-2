"use client"

import React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Upload,
  X,
  Plus,
  Building2,
  User,
  FileText,
  Settings,
  MapPin,
  DollarSign,
  Shield,
  Truck,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "@/hooks/use-toast"

interface VendorFormData {
  // Basic Information
  companyName: string
  vendorId: string
  businessType: string
  category: string
  website: string
  description: string

  // Contact Information
  primaryContactName: string
  primaryContactTitle: string
  primaryContactEmail: string
  primaryContactPhone: string
  secondaryContactName: string
  secondaryContactEmail: string
  secondaryContactPhone: string

  // Address Information
  streetAddress: string
  city: string
  state: string
  zipCode: string
  country: string

  // Business Details
  taxId: string
  businessLicense: string
  yearEstablished: string
  employeeCount: string
  annualRevenue: string

  // Services & Capabilities
  services: string[]
  specializations: string[]
  coverage: string[]
  capacity: string

  // Contract & Financial
  paymentTerms: string
  currency: string
  creditLimit: string
  insuranceProvider: string
  insuranceCoverage: string

  // Compliance & Certifications
  certifications: string[]
  complianceStandards: string[]

  // Performance & Rating
  initialRating: string
  riskLevel: string

  // Additional Information
  notes: string
  tags: string[]
  preferredCommunication: string
  timeZone: string

  // Documents
  documents: File[]
}

const steps = [
  {
    id: 1,
    title: "Basic Information",
    description: "Company details and basic information",
    icon: Building2,
  },
  {
    id: 2,
    title: "Contact Details",
    description: "Primary and secondary contact information",
    icon: User,
  },
  {
    id: 3,
    title: "Address & Location",
    description: "Business address and location details",
    icon: MapPin,
  },
  {
    id: 4,
    title: "Business Details",
    description: "Legal and business information",
    icon: FileText,
  },
  {
    id: 5,
    title: "Services & Capabilities",
    description: "Services offered and capabilities",
    icon: Truck,
  },
  {
    id: 6,
    title: "Financial & Contract",
    description: "Payment terms and financial details",
    icon: DollarSign,
  },
  {
    id: 7,
    title: "Compliance & Certifications",
    description: "Certifications and compliance standards",
    icon: Shield,
  },
  {
    id: 8,
    title: "Final Details",
    description: "Additional information and documents",
    icon: Settings,
  },
]

const serviceOptions = [
  "Freight Transportation",
  "Warehousing",
  "Last Mile Delivery",
  "International Shipping",
  "Cold Chain Logistics",
  "Hazardous Materials",
  "Express Delivery",
  "Bulk Transportation",
  "Container Services",
  "Cross Docking",
  "Packaging Services",
  "Customs Clearance",
]

const specializationOptions = [
  "Automotive",
  "Electronics",
  "Pharmaceuticals",
  "Food & Beverage",
  "Textiles",
  "Chemicals",
  "Construction Materials",
  "Retail",
  "E-commerce",
  "Healthcare",
  "Agriculture",
  "Energy",
]

const coverageOptions = [
  "Local",
  "Regional",
  "National",
  "International",
  "North America",
  "Europe",
  "Asia Pacific",
  "Latin America",
  "Middle East",
  "Africa",
]

const certificationOptions = [
  "ISO 9001",
  "ISO 14001",
  "ISO 45001",
  "C-TPAT",
  "TAPA",
  "GDP",
  "HACCP",
  "DOT Certified",
  "IATA",
  "FIATA",
  "WCA",
  "NVOCC",
]

const complianceOptions = ["GDPR", "SOX", "HIPAA", "FDA", "DOT", "OSHA", "EPA", "TSA", "CBP", "FMC", "IMDG", "ADR"]

export default function AddVendorPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<VendorFormData>({
    companyName: "",
    vendorId: "",
    businessType: "",
    category: "",
    website: "",
    description: "",
    primaryContactName: "",
    primaryContactTitle: "",
    primaryContactEmail: "",
    primaryContactPhone: "",
    secondaryContactName: "",
    secondaryContactEmail: "",
    secondaryContactPhone: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    taxId: "",
    businessLicense: "",
    yearEstablished: "",
    employeeCount: "",
    annualRevenue: "",
    services: [],
    specializations: [],
    coverage: [],
    capacity: "",
    paymentTerms: "",
    currency: "USD",
    creditLimit: "",
    insuranceProvider: "",
    insuranceCoverage: "",
    certifications: [],
    complianceStandards: [],
    initialRating: "",
    riskLevel: "",
    notes: "",
    tags: [],
    preferredCommunication: "",
    timeZone: "",
    documents: [],
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const updateFormData = (field: keyof VendorFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const toggleArrayItem = (field: keyof VendorFormData, item: string) => {
    const currentArray = formData[field] as string[]
    const newArray = currentArray.includes(item) ? currentArray.filter((i) => i !== item) : [...currentArray, item]
    updateFormData(field, newArray)
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 1:
        if (!formData.companyName) newErrors.companyName = "Company name is required"
        if (!formData.businessType) newErrors.businessType = "Business type is required"
        if (!formData.category) newErrors.category = "Category is required"
        break
      case 2:
        if (!formData.primaryContactName) newErrors.primaryContactName = "Primary contact name is required"
        if (!formData.primaryContactEmail) newErrors.primaryContactEmail = "Primary contact email is required"
        if (!formData.primaryContactPhone) newErrors.primaryContactPhone = "Primary contact phone is required"
        break
      case 3:
        if (!formData.streetAddress) newErrors.streetAddress = "Street address is required"
        if (!formData.city) newErrors.city = "City is required"
        if (!formData.country) newErrors.country = "Country is required"
        break
      case 4:
        if (!formData.yearEstablished) newErrors.yearEstablished = "Year established is required"
        break
      case 5:
        if (formData.services.length === 0) newErrors.services = "At least one service must be selected"
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return

    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Vendor Added Successfully",
        description: `${formData.companyName} has been added to your vendor directory.`,
      })

      router.push("/vendors")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add vendor. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files)
      updateFormData("documents", [...formData.documents, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    const newFiles = formData.documents.filter((_, i) => i !== index)
    updateFormData("documents", newFiles)
  }

  const progress = (currentStep / steps.length) * 100

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => updateFormData("companyName", e.target.value)}
                  placeholder="Enter company name"
                  className={errors.companyName ? "border-red-500" : ""}
                />
                {errors.companyName && <p className="text-sm text-red-500">{errors.companyName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="vendorId">Vendor ID</Label>
                <Input
                  id="vendorId"
                  value={formData.vendorId}
                  onChange={(e) => updateFormData("vendorId", e.target.value)}
                  placeholder="Auto-generated or custom ID"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="businessType">Business Type *</Label>
                <Select value={formData.businessType} onValueChange={(value) => updateFormData("businessType", value)}>
                  <SelectTrigger className={errors.businessType ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="corporation">Corporation</SelectItem>
                    <SelectItem value="llc">LLC</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                    <SelectItem value="sole-proprietorship">Sole Proprietorship</SelectItem>
                    <SelectItem value="non-profit">Non-Profit</SelectItem>
                  </SelectContent>
                </Select>
                {errors.businessType && <p className="text-sm text-red-500">{errors.businessType}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => updateFormData("category", value)}>
                  <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="logistics">Logistics Provider</SelectItem>
                    <SelectItem value="carrier">Carrier</SelectItem>
                    <SelectItem value="warehouse">Warehouse</SelectItem>
                    <SelectItem value="freight-forwarder">Freight Forwarder</SelectItem>
                    <SelectItem value="customs-broker">Customs Broker</SelectItem>
                    <SelectItem value="technology">Technology Provider</SelectItem>
                    <SelectItem value="insurance">Insurance Provider</SelectItem>
                    <SelectItem value="fuel">Fuel Supplier</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => updateFormData("website", e.target.value)}
                placeholder="https://www.company.com"
                type="url"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Company Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateFormData("description", e.target.value)}
                placeholder="Brief description of the company and its services"
                rows={4}
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-5 w-5" />
                Primary Contact
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="primaryContactName">Full Name *</Label>
                  <Input
                    id="primaryContactName"
                    value={formData.primaryContactName}
                    onChange={(e) => updateFormData("primaryContactName", e.target.value)}
                    placeholder="Enter full name"
                    className={errors.primaryContactName ? "border-red-500" : ""}
                  />
                  {errors.primaryContactName && <p className="text-sm text-red-500">{errors.primaryContactName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primaryContactTitle">Job Title</Label>
                  <Input
                    id="primaryContactTitle"
                    value={formData.primaryContactTitle}
                    onChange={(e) => updateFormData("primaryContactTitle", e.target.value)}
                    placeholder="e.g., Sales Manager"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="primaryContactEmail">Email Address *</Label>
                  <Input
                    id="primaryContactEmail"
                    type="email"
                    value={formData.primaryContactEmail}
                    onChange={(e) => updateFormData("primaryContactEmail", e.target.value)}
                    placeholder="email@company.com"
                    className={errors.primaryContactEmail ? "border-red-500" : ""}
                  />
                  {errors.primaryContactEmail && <p className="text-sm text-red-500">{errors.primaryContactEmail}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primaryContactPhone">Phone Number *</Label>
                  <Input
                    id="primaryContactPhone"
                    value={formData.primaryContactPhone}
                    onChange={(e) => updateFormData("primaryContactPhone", e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className={errors.primaryContactPhone ? "border-red-500" : ""}
                  />
                  {errors.primaryContactPhone && <p className="text-sm text-red-500">{errors.primaryContactPhone}</p>}
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-5 w-5" />
                Secondary Contact (Optional)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="secondaryContactName">Full Name</Label>
                  <Input
                    id="secondaryContactName"
                    value={formData.secondaryContactName}
                    onChange={(e) => updateFormData("secondaryContactName", e.target.value)}
                    placeholder="Enter full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondaryContactEmail">Email Address</Label>
                  <Input
                    id="secondaryContactEmail"
                    type="email"
                    value={formData.secondaryContactEmail}
                    onChange={(e) => updateFormData("secondaryContactEmail", e.target.value)}
                    placeholder="email@company.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondaryContactPhone">Phone Number</Label>
                  <Input
                    id="secondaryContactPhone"
                    value={formData.secondaryContactPhone}
                    onChange={(e) => updateFormData("secondaryContactPhone", e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="streetAddress">Street Address *</Label>
              <Input
                id="streetAddress"
                value={formData.streetAddress}
                onChange={(e) => updateFormData("streetAddress", e.target.value)}
                placeholder="123 Main Street"
                className={errors.streetAddress ? "border-red-500" : ""}
              />
              {errors.streetAddress && <p className="text-sm text-red-500">{errors.streetAddress}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => updateFormData("city", e.target.value)}
                  placeholder="City"
                  className={errors.city ? "border-red-500" : ""}
                />
                {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State/Province</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => updateFormData("state", e.target.value)}
                  placeholder="State"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => updateFormData("zipCode", e.target.value)}
                  placeholder="12345"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Select value={formData.country} onValueChange={(value) => updateFormData("country", value)}>
                  <SelectTrigger className={errors.country ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="mx">Mexico</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="de">Germany</SelectItem>
                    <SelectItem value="fr">France</SelectItem>
                    <SelectItem value="jp">Japan</SelectItem>
                    <SelectItem value="cn">China</SelectItem>
                    <SelectItem value="au">Australia</SelectItem>
                    <SelectItem value="br">Brazil</SelectItem>
                  </SelectContent>
                </Select>
                {errors.country && <p className="text-sm text-red-500">{errors.country}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="preferredCommunication">Preferred Communication</Label>
                <Select
                  value={formData.preferredCommunication}
                  onValueChange={(value) => updateFormData("preferredCommunication", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeZone">Time Zone</Label>
                <Select value={formData.timeZone} onValueChange={(value) => updateFormData("timeZone", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time zone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="est">Eastern (EST)</SelectItem>
                    <SelectItem value="cst">Central (CST)</SelectItem>
                    <SelectItem value="mst">Mountain (MST)</SelectItem>
                    <SelectItem value="pst">Pacific (PST)</SelectItem>
                    <SelectItem value="utc">UTC</SelectItem>
                    <SelectItem value="gmt">GMT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="taxId">Tax ID/EIN</Label>
                <Input
                  id="taxId"
                  value={formData.taxId}
                  onChange={(e) => updateFormData("taxId", e.target.value)}
                  placeholder="XX-XXXXXXX"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessLicense">Business License Number</Label>
                <Input
                  id="businessLicense"
                  value={formData.businessLicense}
                  onChange={(e) => updateFormData("businessLicense", e.target.value)}
                  placeholder="License number"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="yearEstablished">Year Established *</Label>
                <Input
                  id="yearEstablished"
                  type="number"
                  value={formData.yearEstablished}
                  onChange={(e) => updateFormData("yearEstablished", e.target.value)}
                  placeholder="2020"
                  min="1900"
                  max={new Date().getFullYear()}
                  className={errors.yearEstablished ? "border-red-500" : ""}
                />
                {errors.yearEstablished && <p className="text-sm text-red-500">{errors.yearEstablished}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="employeeCount">Employee Count</Label>
                <Select
                  value={formData.employeeCount}
                  onValueChange={(value) => updateFormData("employeeCount", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1-10</SelectItem>
                    <SelectItem value="11-50">11-50</SelectItem>
                    <SelectItem value="51-200">51-200</SelectItem>
                    <SelectItem value="201-500">201-500</SelectItem>
                    <SelectItem value="501-1000">501-1000</SelectItem>
                    <SelectItem value="1000+">1000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="annualRevenue">Annual Revenue</Label>
                <Select
                  value={formData.annualRevenue}
                  onValueChange={(value) => updateFormData("annualRevenue", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-1m">Under $1M</SelectItem>
                    <SelectItem value="1m-5m">$1M - $5M</SelectItem>
                    <SelectItem value="5m-10m">$5M - $10M</SelectItem>
                    <SelectItem value="10m-50m">$10M - $50M</SelectItem>
                    <SelectItem value="50m-100m">$50M - $100M</SelectItem>
                    <SelectItem value="100m+">$100M+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Services Offered *</Label>
                {errors.services && <p className="text-sm text-red-500">{errors.services}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {serviceOptions.map((service) => (
                  <div key={service} className="flex items-center space-x-2">
                    <Checkbox
                      id={`service-${service}`}
                      checked={formData.services.includes(service)}
                      onCheckedChange={() => toggleArrayItem("services", service)}
                    />
                    <Label htmlFor={`service-${service}`} className="text-sm font-normal">
                      {service}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <Label>Industry Specializations</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {specializationOptions.map((specialization) => (
                  <div key={specialization} className="flex items-center space-x-2">
                    <Checkbox
                      id={`specialization-${specialization}`}
                      checked={formData.specializations.includes(specialization)}
                      onCheckedChange={() => toggleArrayItem("specializations", specialization)}
                    />
                    <Label htmlFor={`specialization-${specialization}`} className="text-sm font-normal">
                      {specialization}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <Label>Geographic Coverage</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {coverageOptions.map((coverage) => (
                  <div key={coverage} className="flex items-center space-x-2">
                    <Checkbox
                      id={`coverage-${coverage}`}
                      checked={formData.coverage.includes(coverage)}
                      onCheckedChange={() => toggleArrayItem("coverage", coverage)}
                    />
                    <Label htmlFor={`coverage-${coverage}`} className="text-sm font-normal">
                      {coverage}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity/Volume Handling</Label>
              <Textarea
                id="capacity"
                value={formData.capacity}
                onChange={(e) => updateFormData("capacity", e.target.value)}
                placeholder="Describe capacity, volume handling capabilities, fleet size, etc."
                rows={3}
              />
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="paymentTerms">Payment Terms</Label>
                <Select value={formData.paymentTerms} onValueChange={(value) => updateFormData("paymentTerms", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment terms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="net-15">Net 15</SelectItem>
                    <SelectItem value="net-30">Net 30</SelectItem>
                    <SelectItem value="net-45">Net 45</SelectItem>
                    <SelectItem value="net-60">Net 60</SelectItem>
                    <SelectItem value="cod">Cash on Delivery</SelectItem>
                    <SelectItem value="prepaid">Prepaid</SelectItem>
                    <SelectItem value="custom">Custom Terms</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Preferred Currency</Label>
                <Select value={formData.currency} onValueChange={(value) => updateFormData("currency", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                    <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                    <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                    <SelectItem value="CNY">CNY - Chinese Yuan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="creditLimit">Credit Limit</Label>
              <Input
                id="creditLimit"
                value={formData.creditLimit}
                onChange={(e) => updateFormData("creditLimit", e.target.value)}
                placeholder="$100,000"
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Insurance Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                  <Input
                    id="insuranceProvider"
                    value={formData.insuranceProvider}
                    onChange={(e) => updateFormData("insuranceProvider", e.target.value)}
                    placeholder="Insurance company name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="insuranceCoverage">Coverage Amount</Label>
                  <Input
                    id="insuranceCoverage"
                    value={formData.insuranceCoverage}
                    onChange={(e) => updateFormData("insuranceCoverage", e.target.value)}
                    placeholder="$1,000,000"
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 7:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>Certifications</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {certificationOptions.map((certification) => (
                  <div key={certification} className="flex items-center space-x-2">
                    <Checkbox
                      id={`certification-${certification}`}
                      checked={formData.certifications.includes(certification)}
                      onCheckedChange={() => toggleArrayItem("certifications", certification)}
                    />
                    <Label htmlFor={`certification-${certification}`} className="text-sm font-normal">
                      {certification}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <Label>Compliance Standards</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {complianceOptions.map((compliance) => (
                  <div key={compliance} className="flex items-center space-x-2">
                    <Checkbox
                      id={`compliance-${compliance}`}
                      checked={formData.complianceStandards.includes(compliance)}
                      onCheckedChange={() => toggleArrayItem("complianceStandards", compliance)}
                    />
                    <Label htmlFor={`compliance-${compliance}`} className="text-sm font-normal">
                      {compliance}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="initialRating">Initial Rating</Label>
                <Select
                  value={formData.initialRating}
                  onValueChange={(value) => updateFormData("initialRating", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">⭐⭐⭐⭐⭐ Excellent</SelectItem>
                    <SelectItem value="4">⭐⭐⭐⭐ Good</SelectItem>
                    <SelectItem value="3">⭐⭐⭐ Average</SelectItem>
                    <SelectItem value="2">⭐⭐ Below Average</SelectItem>
                    <SelectItem value="1">⭐ Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="riskLevel">Risk Level</Label>
                <Select value={formData.riskLevel} onValueChange={(value) => updateFormData("riskLevel", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select risk level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">🟢 Low Risk</SelectItem>
                    <SelectItem value="medium">🟡 Medium Risk</SelectItem>
                    <SelectItem value="high">🔴 High Risk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )

      case 8:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => updateFormData("notes", e.target.value)}
                placeholder="Any additional information, special requirements, or notes about this vendor"
                rows={4}
              />
            </div>

            <div className="space-y-4">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => {
                        const newTags = formData.tags.filter((_, i) => i !== index)
                        updateFormData("tags", newTags)
                      }}
                    />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      const input = e.target as HTMLInputElement
                      if (input.value.trim() && !formData.tags.includes(input.value.trim())) {
                        updateFormData("tags", [...formData.tags, input.value.trim()])
                        input.value = ""
                      }
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement
                    if (input.value.trim() && !formData.tags.includes(input.value.trim())) {
                      updateFormData("tags", [...formData.tags, input.value.trim()])
                      input.value = ""
                    }
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <Label>Documents</Label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Drag and drop files here, or click to select
                </p>
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                <Button type="button" variant="outline" onClick={() => document.getElementById("file-upload")?.click()}>
                  Select Files
                </Button>
              </div>

              {formData.documents.length > 0 && (
                <div className="space-y-2">
                  <Label>Uploaded Documents</Label>
                  <div className="space-y-2">
                    {formData.documents.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span className="text-sm">{file.name}</span>
                          <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                        </div>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please review all information before submitting. Once added, the vendor will be available in your
                directory and can be assigned to shipments and contracts.
              </AlertDescription>
            </Alert>
          </div>
        )

      default:
        return null
    }
  }

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex  items-center justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Add New Vendor</h1>
              <p className="text-muted-foreground">Add a new vendor to your directory with comprehensive details</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Step {currentStep} of {steps.length}
                </span>
                <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          </CardContent>
        </Card>

        {/* Steps Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 3xl:grid-cols-8 gap-2">
          {steps.map((step) => {
            const Icon = step.icon
            const isActive = currentStep === step.id
            const isCompleted = currentStep > step.id

            return (
              <Card
                key={step.id}
                className={`cursor-pointer transition-all ${
                  isActive
                    ? "border-primary bg-primary/5"
                    : isCompleted
                      ? "border-green-500 bg-green-50 dark:bg-green-950"
                      : "border-muted"
                }`}
                onClick={() => {
                  if (step.id < currentStep || validateStep(currentStep)) {
                    setCurrentStep(step.id)
                  }
                }}
              >
                <CardContent className="p-3 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={`p-2 rounded-full ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : isCompleted
                            ? "bg-green-500 text-white"
                            : "bg-muted"
                      }`}
                    >
                      {isCompleted ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium">{step.title}</p>
                      <p className="text-xs text-muted-foreground hidden md:block">{step.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Form Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {React.createElement(steps[currentStep - 1].icon, { className: "h-5 w-5" })}
              {steps[currentStep - 1].title}
            </CardTitle>
            <CardDescription>{steps[currentStep - 1].description}</CardDescription>
          </CardHeader>
          <CardContent className="p-3 md:p-6">{renderStepContent()}</CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={prevStep} disabled={currentStep === 1} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            {currentStep < steps.length ? (
              <Button onClick={nextStep} className="flex items-center gap-2">
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting} className="flex items-center gap-2">
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Adding Vendor...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Add Vendor
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
  )
}
