"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import {
  Calculator,
  CalendarIcon,
  CheckCircle,
  Info,
  MapPin,
  Minus,
  Package,
  Plus,
  Save,
  Send,
  Shield,
} from "lucide-react"
import { useState } from "react"

interface ShipmentItem {
  id: string
  description: string
  quantity: number
  weight: number
  dimensions: {
    length: number
    width: number
    height: number
  }
  value: number
  category: string
  hazardous: boolean
}

interface Address {
  company: string
  contactName: string
  address1: string
  address2: string
  city: string
  state: string
  zipCode: string
  country: string
  phone: string
  email: string
}

export default function CreateShipmentPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [shipmentType, setShipmentType] = useState("standard")
  const [priority, setPriority] = useState("standard")
  const [pickupDate, setPickupDate] = useState<Date>()
  const [deliveryDate, setDeliveryDate] = useState<Date>()
  const [items, setItems] = useState<ShipmentItem[]>([
    {
      id: "1",
      description: "",
      quantity: 1,
      weight: 0,
      dimensions: { length: 0, width: 0, height: 0 },
      value: 0,
      category: "general",
      hazardous: false,
    },
  ])
  const [originAddress, setOriginAddress] = useState<Address>({
    company: "",
    contactName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
    phone: "",
    email: "",
  })
  const [destinationAddress, setDestinationAddress] = useState<Address>({
    company: "",
    contactName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
    phone: "",
    email: "",
  })
  const [specialInstructions, setSpecialInstructions] = useState("")
  const [insuranceRequired, setInsuranceRequired] = useState(false)
  const [signatureRequired, setSignatureRequired] = useState(false)
  const [temperatureControlled, setTemperatureControlled] = useState(false)
  const [fragile, setFragile] = useState(false)
  const [estimatedCost, setEstimatedCost] = useState(0)
  const [carrier, setCarrier] = useState("")
  const [service, setService] = useState("")

  const totalSteps = 5
  const progress = (currentStep / totalSteps) * 100

  const addItem = () => {
    const newItem: ShipmentItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      weight: 0,
      dimensions: { length: 0, width: 0, height: 0 },
      value: 0,
      category: "general",
      hazardous: false,
    }
    setItems([...items, newItem])
  }

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id))
    }
  }

  const updateItem = (id: string, field: string, value: any) => {
    setItems(
      items.map((item) =>
        item.id === id
          ? {
            ...item,
            [field]: value,
          }
          : item,
      ),
    )
  }

  const calculateTotalWeight = () => {
    return items.reduce((total, item) => total + item.weight * item.quantity, 0)
  }

  const calculateTotalValue = () => {
    return items.reduce((total, item) => total + item.value * item.quantity, 0)
  }

  const calculateEstimate = () => {
    const baseRate = 2.5
    const totalWeight = calculateTotalWeight()
    const totalValue = calculateTotalValue()
    const priorityMultiplier = priority === "express" ? 2 : priority === "overnight" ? 3 : 1
    const insuranceRate = insuranceRequired ? totalValue * 0.01 : 0
    const estimate = totalWeight * baseRate * priorityMultiplier + insuranceRate + 15
    setEstimatedCost(estimate)
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    // Handle shipment creation
    console.log("Creating shipment...")
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Shipment Type & Priority
                </CardTitle>
                <CardDescription>Select the type of shipment and delivery priority</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Shipment Type</Label>
                  <RadioGroup value={shipmentType} onValueChange={setShipmentType}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="standard" id="standard" />
                      <Label htmlFor="standard">Standard Package</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="document" id="document" />
                      <Label htmlFor="document">Document Envelope</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="freight" id="freight" />
                      <Label htmlFor="freight">Freight/Pallet</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bulk" id="bulk" />
                      <Label htmlFor="bulk">Bulk ARDB</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>Delivery Priority</Label>
                  <RadioGroup value={priority} onValueChange={setPriority}>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="standard" id="priority-standard" />
                        <div>
                          <Label htmlFor="priority-standard" className="font-medium">
                            Standard
                          </Label>
                          <p className="text-sm text-muted-foreground">5-7 business days</p>
                        </div>
                      </div>
                      <Badge variant="secondary">$15.99</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="express" id="priority-express" />
                        <div>
                          <Label htmlFor="priority-express" className="font-medium">
                            Express
                          </Label>
                          <p className="text-sm text-muted-foreground">2-3 business days</p>
                        </div>
                      </div>
                      <Badge variant="secondary">$29.99</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="overnight" id="priority-overnight" />
                        <div>
                          <Label htmlFor="priority-overnight" className="font-medium">
                            Overnight
                          </Label>
                          <p className="text-sm text-muted-foreground">Next business day</p>
                        </div>
                      </div>
                      <Badge variant="secondary">$49.99</Badge>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Pickup Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !pickupDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {pickupDate ? format(pickupDate, "PPP") : "Select pickup date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={pickupDate} onSelect={setPickupDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>Preferred Delivery Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !deliveryDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {deliveryDate ? format(deliveryDate, "PPP") : "Select delivery date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={deliveryDate} onSelect={setDeliveryDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Origin Address
                </CardTitle>
                <CardDescription>Enter the pickup location details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="origin-company">Company Name</Label>
                    <Input
                      id="origin-company"
                      value={originAddress.company}
                      onChange={(e) => setOriginAddress({ ...originAddress, company: e.target.value })}
                      placeholder="Enter company name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="origin-contact">Contact Name</Label>
                    <Input
                      id="origin-contact"
                      value={originAddress.contactName}
                      onChange={(e) => setOriginAddress({ ...originAddress, contactName: e.target.value })}
                      placeholder="Enter contact name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="origin-address1">Address Line 1</Label>
                  <Input
                    id="origin-address1"
                    value={originAddress.address1}
                    onChange={(e) => setOriginAddress({ ...originAddress, address1: e.target.value })}
                    placeholder="Enter street address"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="origin-address2">Address Line 2 (Optional)</Label>
                  <Input
                    id="origin-address2"
                    value={originAddress.address2}
                    onChange={(e) => setOriginAddress({ ...originAddress, address2: e.target.value })}
                    placeholder="Apartment, suite, etc."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="origin-city">City</Label>
                    <Input
                      id="origin-city"
                      value={originAddress.city}
                      onChange={(e) => setOriginAddress({ ...originAddress, city: e.target.value })}
                      placeholder="Enter city"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="origin-state">State/Province</Label>
                    <Select
                      value={originAddress.state}
                      onValueChange={(value) => setOriginAddress({ ...originAddress, state: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CA">California</SelectItem>
                        <SelectItem value="NY">New York</SelectItem>
                        <SelectItem value="TX">Texas</SelectItem>
                        <SelectItem value="FL">Florida</SelectItem>
                        <SelectItem value="IL">Illinois</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="origin-zip">ZIP/Postal Code</Label>
                    <Input
                      id="origin-zip"
                      value={originAddress.zipCode}
                      onChange={(e) => setOriginAddress({ ...originAddress, zipCode: e.target.value })}
                      placeholder="Enter ZIP code"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="origin-phone">Phone Number</Label>
                    <Input
                      id="origin-phone"
                      value={originAddress.phone}
                      onChange={(e) => setOriginAddress({ ...originAddress, phone: e.target.value })}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="origin-email">Email Address</Label>
                    <Input
                      id="origin-email"
                      type="email"
                      value={originAddress.email}
                      onChange={(e) => setOriginAddress({ ...originAddress, email: e.target.value })}
                      placeholder="Enter email address"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Destination Address
                </CardTitle>
                <CardDescription>Enter the delivery location details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dest-company">Company Name</Label>
                    <Input
                      id="dest-company"
                      value={destinationAddress.company}
                      onChange={(e) => setDestinationAddress({ ...destinationAddress, company: e.target.value })}
                      placeholder="Enter company name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dest-contact">Contact Name</Label>
                    <Input
                      id="dest-contact"
                      value={destinationAddress.contactName}
                      onChange={(e) => setDestinationAddress({ ...destinationAddress, contactName: e.target.value })}
                      placeholder="Enter contact name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dest-address1">Address Line 1</Label>
                  <Input
                    id="dest-address1"
                    value={destinationAddress.address1}
                    onChange={(e) => setDestinationAddress({ ...destinationAddress, address1: e.target.value })}
                    placeholder="Enter street address"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dest-address2">Address Line 2 (Optional)</Label>
                  <Input
                    id="dest-address2"
                    value={destinationAddress.address2}
                    onChange={(e) => setDestinationAddress({ ...destinationAddress, address2: e.target.value })}
                    placeholder="Apartment, suite, etc."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dest-city">City</Label>
                    <Input
                      id="dest-city"
                      value={destinationAddress.city}
                      onChange={(e) => setDestinationAddress({ ...destinationAddress, city: e.target.value })}
                      placeholder="Enter city"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dest-state">State/Province</Label>
                    <Select
                      value={destinationAddress.state}
                      onValueChange={(value) => setDestinationAddress({ ...destinationAddress, state: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CA">California</SelectItem>
                        <SelectItem value="NY">New York</SelectItem>
                        <SelectItem value="TX">Texas</SelectItem>
                        <SelectItem value="FL">Florida</SelectItem>
                        <SelectItem value="IL">Illinois</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dest-zip">ZIP/Postal Code</Label>
                    <Input
                      id="dest-zip"
                      value={destinationAddress.zipCode}
                      onChange={(e) => setDestinationAddress({ ...destinationAddress, zipCode: e.target.value })}
                      placeholder="Enter ZIP code"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dest-phone">Phone Number</Label>
                    <Input
                      id="dest-phone"
                      value={destinationAddress.phone}
                      onChange={(e) => setDestinationAddress({ ...destinationAddress, phone: e.target.value })}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dest-email">Email Address</Label>
                    <Input
                      id="dest-email"
                      type="email"
                      value={destinationAddress.email}
                      onChange={(e) => setDestinationAddress({ ...destinationAddress, email: e.target.value })}
                      placeholder="Enter email address"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Package Details
                </CardTitle>
                <CardDescription>Add items to your shipment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {items.map((item, index) => (
                  <div key={item.id} className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Item {index + 1}</h4>
                      {items.length > 1 && (
                        <Button variant="outline" size="sm" onClick={() => removeItem(item.id)}>
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Input
                          value={item.description}
                          onChange={(e) => updateItem(item.id, "description", e.target.value)}
                          placeholder="Enter item description"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <Select value={item.category} onValueChange={(value) => updateItem(item.id, "category", value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General Merchandise</SelectItem>
                            <SelectItem value="electronics">Electronics</SelectItem>
                            <SelectItem value="clothing">Clothing</SelectItem>
                            <SelectItem value="books">Books</SelectItem>
                            <SelectItem value="food">Food & Beverages</SelectItem>
                            <SelectItem value="medical">Medical Supplies</SelectItem>
                            <SelectItem value="automotive">Automotive Parts</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, "quantity", Number.parseInt(e.target.value) || 1)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Weight (lbs)</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.1"
                          value={item.weight}
                          onChange={(e) => updateItem(item.id, "weight", Number.parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Value ($)</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.value}
                          onChange={(e) => updateItem(item.id, "value", Number.parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="flex items-center space-x-2 pt-6">
                        <Checkbox
                          id={`hazardous-${item.id}`}
                          checked={item.hazardous}
                          onCheckedChange={(checked) => updateItem(item.id, "hazardous", checked)}
                        />
                        <Label htmlFor={`hazardous-${item.id}`} className="text-sm">
                          Hazardous
                        </Label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Dimensions (inches)</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <Input
                          type="number"
                          min="0"
                          step="0.1"
                          placeholder="Length"
                          value={item.dimensions.length}
                          onChange={(e) =>
                            updateItem(item.id, "dimensions", {
                              ...item.dimensions,
                              length: Number.parseFloat(e.target.value) || 0,
                            })
                          }
                        />
                        <Input
                          type="number"
                          min="0"
                          step="0.1"
                          placeholder="Width"
                          value={item.dimensions.width}
                          onChange={(e) =>
                            updateItem(item.id, "dimensions", {
                              ...item.dimensions,
                              width: Number.parseFloat(e.target.value) || 0,
                            })
                          }
                        />
                        <Input
                          type="number"
                          min="0"
                          step="0.1"
                          placeholder="Height"
                          value={item.dimensions.height}
                          onChange={(e) =>
                            updateItem(item.id, "dimensions", {
                              ...item.dimensions,
                              height: Number.parseFloat(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <Button onClick={addItem} variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Item
                </Button>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{items.length}</div>
                    <div className="text-sm text-muted-foreground">Total Items</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{calculateTotalWeight().toFixed(1)} lbs</div>
                    <div className="text-sm text-muted-foreground">Total Weight</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">${calculateTotalValue().toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">Total Value</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Special Services & Options
                </CardTitle>
                <CardDescription>Configure additional services for your shipment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Insurance Coverage</Label>
                        <p className="text-sm text-muted-foreground">Protect your shipment against loss or damage</p>
                      </div>
                      <Switch checked={insuranceRequired} onCheckedChange={setInsuranceRequired} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Signature Required</Label>
                        <p className="text-sm text-muted-foreground">Require signature upon delivery</p>
                      </div>
                      <Switch checked={signatureRequired} onCheckedChange={setSignatureRequired} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Temperature Controlled</Label>
                        <p className="text-sm text-muted-foreground">Maintain specific temperature range</p>
                      </div>
                      <Switch checked={temperatureControlled} onCheckedChange={setTemperatureControlled} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Fragile Handling</Label>
                        <p className="text-sm text-muted-foreground">Special care for delicate items</p>
                      </div>
                      <Switch checked={fragile} onCheckedChange={setFragile} />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Preferred Carrier</Label>
                      <Select value={carrier} onValueChange={setCarrier}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select carrier" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fedex">FedEx</SelectItem>
                          <SelectItem value="ups">UPS</SelectItem>
                          <SelectItem value="dhl">DHL</SelectItem>
                          <SelectItem value="usps">USPS</SelectItem>
                          <SelectItem value="ardb">ARDB Fleet</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Service Level</Label>
                      <Select value={service} onValueChange={setService}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select service" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ground">Ground</SelectItem>
                          <SelectItem value="air">Air</SelectItem>
                          <SelectItem value="express">Express</SelectItem>
                          <SelectItem value="overnight">Overnight</SelectItem>
                          <SelectItem value="same-day">Same Day</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="special-instructions">Special Instructions</Label>
                  <Textarea
                    id="special-instructions"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="Enter any special handling instructions, delivery notes, or requirements..."
                    rows={4}
                  />
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Additional services may affect shipping cost and delivery time. Review the cost estimate in the next
                    step.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Review & Cost Estimate
                </CardTitle>
                <CardDescription>Review your shipment details and get a cost estimate</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Shipment Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Type:</span>
                          <span className="capitalize">{shipmentType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Priority:</span>
                          <span className="capitalize">{priority}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Items:</span>
                          <span>{items.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Weight:</span>
                          <span>{calculateTotalWeight().toFixed(1)} lbs</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Value:</span>
                          <span>${calculateTotalValue().toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium mb-2">Route</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">From:</span>
                          <p className="text-muted-foreground">
                            {originAddress.company || "Origin Company"}
                            <br />
                            {originAddress.city}, {originAddress.state} {originAddress.zipCode}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium">To:</span>
                          <p className="text-muted-foreground">
                            {destinationAddress.company || "Destination Company"}
                            <br />
                            {destinationAddress.city}, {destinationAddress.state} {destinationAddress.zipCode}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium mb-2">Special Services</h4>
                      <div className="space-y-1 text-sm">
                        {insuranceRequired && (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Insurance Coverage</span>
                          </div>
                        )}
                        {signatureRequired && (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Signature Required</span>
                          </div>
                        )}
                        {temperatureControlled && (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Temperature Controlled</span>
                          </div>
                        )}
                        {fragile && (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Fragile Handling</span>
                          </div>
                        )}
                        {!insuranceRequired && !signatureRequired && !temperatureControlled && !fragile && (
                          <span className="text-muted-foreground">No special services selected</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Cost Breakdown</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span>Base Shipping:</span>
                          <span>$15.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Weight Charge:</span>
                          <span>${(calculateTotalWeight() * 2.5).toFixed(2)}</span>
                        </div>
                        {priority === "express" && (
                          <div className="flex justify-between">
                            <span>Express Service:</span>
                            <span>$14.99</span>
                          </div>
                        )}
                        {priority === "overnight" && (
                          <div className="flex justify-between">
                            <span>Overnight Service:</span>
                            <span>$34.99</span>
                          </div>
                        )}
                        {insuranceRequired && (
                          <div className="flex justify-between">
                            <span>Insurance:</span>
                            <span>${(calculateTotalValue() * 0.01).toFixed(2)}</span>
                          </div>
                        )}
                        {signatureRequired && (
                          <div className="flex justify-between">
                            <span>Signature Service:</span>
                            <span>$5.00</span>
                          </div>
                        )}
                        {temperatureControlled && (
                          <div className="flex justify-between">
                            <span>Temperature Control:</span>
                            <span>$25.00</span>
                          </div>
                        )}
                        {fragile && (
                          <div className="flex justify-between">
                            <span>Fragile Handling:</span>
                            <span>$10.00</span>
                          </div>
                        )}
                        <Separator />
                        <div className="flex justify-between font-medium text-lg">
                          <span>Total Estimated Cost:</span>
                          <span>${estimatedCost.toFixed(2)}</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Button onClick={calculateEstimate} variant="outline" className="w-full">
                      <Calculator className="h-4 w-4 mr-2" />
                      Recalculate Estimate
                    </Button>

                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        This is an estimate. Final cost may vary based on actual dimensions and carrier rates.
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Create New Shipment</h1>
        <p className="text-muted-foreground mt-2">Follow the steps below to create and schedule your shipment</p>
      </div>

      {/* Progress Bar */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="mb-4" />
          <div className="flex flex-wrap gap-2 text-nowrap  sm:justify-between text-xs text-muted-foreground">
            <span className={currentStep >= 1 ? "text-primary font-medium" : ""}>Shipment Type</span>
            <span className={currentStep >= 2 ? "text-primary font-medium" : ""}>Addresses</span>
            <span className={currentStep >= 3 ? "text-primary font-medium" : ""}>Package Details</span>
            <span className={currentStep >= 4 ? "text-primary font-medium" : ""}>Services</span>
            <span className={currentStep >= 5 ? "text-primary font-medium" : ""}>Review</span>
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      {renderStepContent()}

      {/* Navigation Buttons */}
      <div className="flex flex-wrap gap-2 justify-between mt-8">
        <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
          Previous
        </Button>
        <div className="flex gap-2">
          <Button variant="outline">
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          {currentStep === totalSteps ? (
            <Button onClick={handleSubmit}>
              <Send className="h-4 w-4 mr-2" />
              Create Shipment
            </Button>
          ) : (
            <Button onClick={nextStep}>Next</Button>
          )}
        </div>
      </div>
    </div>
  )
}
