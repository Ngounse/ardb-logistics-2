import { Badge } from "@/components/ui/badge"

interface ShipmentPriorityBadgeProps {
  readonly priority: string
}

export function ShipmentPriorityBadge({ priority }: ShipmentPriorityBadgeProps) {
  switch (priority) {
    case "EXPRESS":
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
          Express
        </Badge>
      )

    case "STANDARD":
      return (
        <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
          Standard
        </Badge>
      )

    case "ECONOMY":
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
          Economy
        </Badge>
      )

    case "INSTANT":
      return (
        <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
          Instant
        </Badge>
      )

    case "TAXI":
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
          Taxi
        </Badge>
      )

    case "TAXIPAYASYOUGO":
      return (
        <Badge variant="outline" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
          Taxi Pay As You Go
        </Badge>
      )

    case "AGENT":
      return (
        <Badge variant="outline" className="bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300">
          Agent
        </Badge>
      )

    case "GONOW":
      return (
        <Badge variant="outline" className="bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300">
          Go Now
        </Badge>
      )

    case "MERCHANT":
      return (
        <Badge variant="outline" className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300">
          Merchant
        </Badge>
      )

    default:
      return (
        <Badge variant="outline">
          {priority}
        </Badge>
      )
  }
}
