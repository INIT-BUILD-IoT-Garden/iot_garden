import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"
import { AlertTriangle, Bell } from "lucide-react"

interface Alert {
  id: string
  type: 'warning' | 'critical' | 'info'
  message: string
  timestamp: string
}

interface AlertCardProps {
  alerts: Alert[]
}

const alertStyles = {
  warning: "text-yellow-500",
  critical: "text-red-500",
  info: "text-blue-500"
}

export function AlertCard({ alerts }: AlertCardProps) {
  return (
    <div className="w-full">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Bell className="h-5 w-5" />
        Recent Alerts
      </h3>
      <CardContent>
        <div className="space-y-4">
          {alerts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No active alerts</p>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start gap-2 rounded-lg border p-3"
              >
                <AlertTriangle className={`h-5 w-5 ${alertStyles[alert.type]}`} />
                <div className="space-y-1">
                  <p className="text-sm font-medium">{alert.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(alert.timestamp).toLocaleString(undefined, { hour: 'numeric', minute: 'numeric', year: 'numeric', month: 'numeric', day: 'numeric' })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </div>
  )
}