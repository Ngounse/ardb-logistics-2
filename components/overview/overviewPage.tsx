"use client"
import {
  Truck,
  Package,
  Clock,
  DollarSign,
  TrendingUp,
  Users,
  Warehouse,
  AlertTriangle,
} from "lucide-react";
import { MetricCard } from "@/components/overview/metric-card";
import { ActivityFeed } from "@/components/overview/activity-feed";
import { ShipmentChart } from "@/components/overview/shipment-chart";
import { FleetStatus } from "@/components/overview/fleet-status";
import { QuickActions } from "@/components/overview/quick-actions";
import { DeliveryMap } from "@/components/overview/delivery-map";
import PageHeader from "@/components/shared/PageHeader";

export default function OverviewPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        pageTitle="Dashboard Overview (Sample not final)"
        pageDes="Welcome back! Here's what's happening with your logistics operations."
      />

      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        <MetricCard
          title="Active Shipments"
          value={42}
          change={12}
          changeType="increase"
          icon={Truck}
          description="Currently in transit"
          trend="up"
        />
        <MetricCard
          title="Delivered Today"
          value={28}
          change={8}
          changeType="increase"
          icon={Package}
          description="Successful deliveries"
          trend="up"
        />
        <MetricCard
          title="Pending Orders"
          value={156}
          change={-5}
          changeType="decrease"
          icon={Clock}
          description="Awaiting processing"
          trend="down"
        />
        <MetricCard
          title="Revenue (MTD)"
          value="$284,590"
          change={15}
          changeType="increase"
          icon={DollarSign}
          description="Month to date"
          trend="up"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        <MetricCard
          title="Fleet Utilization"
          value="87%"
          change={3}
          changeType="increase"
          icon={TrendingUp}
          description="Vehicle efficiency"
          trend="up"
        />
        <MetricCard
          title="Active Clients"
          value={1247}
          change={23}
          changeType="increase"
          icon={Users}
          description="Total active clients"
          trend="up"
        />
        <MetricCard
          title="Warehouse Capacity"
          value="73%"
          change={-2}
          changeType="decrease"
          icon={Warehouse}
          description="Average utilization"
          trend="down"
        />
        <MetricCard
          title="Delayed Shipments"
          value={7}
          change={-12}
          changeType="decrease"
          icon={AlertTriangle}
          description="Requiring attention"
          trend="down"
        />
      </div>

      {/* Charts and Analytics */}
      <div className="grid gap-6 md:grid-cols-2">
        <ShipmentChart />
        <FleetStatus />
      </div>

      {/* Activity and Map */}
      <div className="grid gap-6 grid-cols-12">
        <div className="col-span-12 md:col-span-6 2xl:col-span-8">
          <ActivityFeed />
        </div>
        <div className="col-span-12 md:col-span-6 2xl:col-span-4">
          <DeliveryMap />
        </div>
      </div>

      <QuickActions />

      {/* Additional Insights */}
      <div className="hidden md:grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Performance Highlights</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                On-time Delivery Rate
              </span>
              <span className="font-medium text-green-600">94.2%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Customer Satisfaction
              </span>
              <span className="font-medium text-green-600">4.8/5.0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Average Delivery Time
              </span>
              <span className="font-medium">2.3 days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Cost per Mile
              </span>
              <span className="font-medium">$1.85</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Top Routes</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">NY → LA</span>
              <span className="text-sm font-medium">24 shipments</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Chicago → Houston</span>
              <span className="text-sm font-medium">18 shipments</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Miami → Atlanta</span>
              <span className="text-sm font-medium">15 shipments</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Seattle → Portland</span>
              <span className="text-sm font-medium">12 shipments</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Alerts & Notifications</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Maintenance Due</p>
                <p className="text-xs text-muted-foreground">
                  3 vehicles require service
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Clock className="h-4 w-4 text-red-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Delayed Shipments</p>
                <p className="text-xs text-muted-foreground">
                  7 shipments behind schedule
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Package className="h-4 w-4 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Low Inventory</p>
                <p className="text-xs text-muted-foreground">
                  2 warehouses need restocking
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
