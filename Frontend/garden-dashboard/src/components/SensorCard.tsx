import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { SensorDataPoint } from "@/types/sensors"

interface SensorCardProps {
  title: string
  value: number
  unit: string
  data: SensorDataPoint[]
  color?: string
}

export function SensorCard({ title, value, unit, data, color = "#10b981" }: SensorCardProps) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xl font-bold">
          {value.toFixed(2)} {unit}
        </div>
        <div className="h-[150px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis 
                dataKey="timestamp" 
                tick={false}
                stroke="#888888"
              />
              <YAxis 
                stroke="#888888"
                tickLine={true}
                axisLine={true}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #ccc",
                }}
                labelFormatter={(label) => new Date(label).toLocaleTimeString()}
                wrapperStyle={{ zIndex: 1000 }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}