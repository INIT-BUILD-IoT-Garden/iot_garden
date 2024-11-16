import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"
import { CheckCircle2, XCircle, WifiOff } from "lucide-react"

type Status = 'online' | 'offline' | 'error'

interface StatusCardProps {
  title: string
  status: Status
  lastUpdate?: string
  message?: string
}

const statusConfig = {
  online: { icon: CheckCircle2, color: "text-green-500", text: "Online" },
  offline: { icon: WifiOff, color: "text-gray-500", text: "Offline" },
  error: { icon: XCircle, color: "text-red-500", text: "Error" }
}

export function StatusCard({ title, status, lastUpdate, message }: StatusCardProps) {
  const { icon: Icon, color, text } = statusConfig[status]
  
  return (
    <div className="w-full">
      <h3 className="text-xl font-semibold mb-4 flex items-center justify-between">
        {title}
        <Icon className={`h-5 w-5 ${color}`} />
      </h3>
      <CardContent>
        <div className="space-y-2">
          <p className={`font-medium ${color}`}>{text}</p>
          {lastUpdate && (
            <p className="text-sm text-muted-foreground">
              Last Update: {lastUpdate}
            </p>
          )}
          {message && (
            <p className="text-sm text-muted-foreground">{message}</p>
          )}
        </div>
      </CardContent>
    </div>
  )
}
