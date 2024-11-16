import { useEffect, useState } from 'react'
import { SensorCard } from './SensorCard'
import { SensorData, SensorDataPoint } from '@/types/sensors'
import { generateMockData } from '@/services/mockData'
import { StatusCard } from './StatusCard'
import { WeatherSummary } from './WeatherSummary'
import { AlertCard } from './AlertCard'
import Masonry from 'react-masonry-css';
import { GardenBackground } from './GardenBackground'

export function Dashboard() {
  const [sensorHistory, setSensorHistory] = useState<SensorData[]>([])
  
  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setSensorHistory(prev => {
        const newData = generateMockData()
        return [...prev, newData].slice(-30) // Keep last 30 readings
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const formatHistoryData = (key: keyof SensorData): SensorDataPoint[] => {
    return sensorHistory.map(data => ({
      value: data[key] as number,
      timestamp: data.timestamp
    }))
  }

  const mockAlerts = [
    {
      id: '1',
      type: 'warning' as const,
      message: 'Soil moisture levels are below recommended threshold',
      timestamp: new Date().toISOString()
    },
    {
      id: '2',
      type: 'info' as const,
      message: 'Laboris deserunt dolore incididunt officia non amet id commodo velit voluptate eu.',
      timestamp: new Date(Date.now() - 3600000).toISOString()
    }
  ]

  return (
    <>
      <GardenBackground />
      <div className="min-h-screen w-full">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8 text-center">Green Campus Garden</h1>
          
          {/* Status Cards */}
          <div className="max-w-6xl mx-auto mb-8">
            <Masonry
              breakpointCols={{
                default: 3,
                1024: 2,
                640: 1
              }}
              className="flex -ml-4 w-auto"
              columnClassName="pl-4 bg-clip-padding"
            >
              <div className="mb-4 backdrop-blur-sm bg-white/30 rounded-xl border border-white/20 shadow-lg p-4">
                <StatusCard
                  title="System Status"
                  status="online"
                  lastUpdate={new Date().toLocaleString()}
                />
              </div>
              <div className="mb-4 backdrop-blur-sm bg-white/30 rounded-xl border border-white/20 shadow-lg p-4">
                <StatusCard
                  title="Sensor Network"
                  status="online"
                  lastUpdate={new Date().toLocaleString()}
                />
              </div>
              <div className="mb-4 backdrop-blur-sm bg-white/30 rounded-xl border border-white/20 shadow-lg p-4">
                <WeatherSummary />
              </div>
              <div className="mb-4 backdrop-blur-sm bg-white/30 rounded-xl border border-white/20 shadow-lg p-4">
                <AlertCard alerts={mockAlerts} />
              </div>
            </Masonry>
          </div>

          {/* Sensor Cards */}
          <div className="max-w-6xl mx-auto">
            <Masonry
              breakpointCols={{
                default: 3,
                1024: 2,
                640: 1
              }}
              className="flex -ml-4 w-auto"
              columnClassName="pl-4 bg-clip-padding"
            >
              <div className="mb-4 backdrop-blur-sm bg-white/30 rounded-xl border border-white/20 shadow-lg p-4">
                <SensorCard
                  title="Soil Temperature"
                  value={sensorHistory[sensorHistory.length - 1]?.soil_temperature ?? 0}
                  unit="°C"
                  data={formatHistoryData('soil_temperature')}
                  color="#ef4444"
                />
              </div>
              
              <div className="mb-4 backdrop-blur-sm bg-white/30 rounded-xl border border-white/20 shadow-lg p-4">
                <SensorCard
                  title="Soil Moisture"
                  value={sensorHistory[sensorHistory.length - 1]?.soil_moisture ?? 0}
                  unit="raw"
                  data={formatHistoryData('soil_moisture')}
                  color="#3b82f6"
                />
              </div>
              
              <div className="mb-4 backdrop-blur-sm bg-white/30 rounded-xl border border-white/20 shadow-lg p-4">
                <SensorCard
                  title="Air Temperature"
                  value={sensorHistory[sensorHistory.length - 1]?.air_temperature ?? 0}
                  unit="°C"
                  data={formatHistoryData('air_temperature')}
                  color="#f97316"
                />
              </div>
              
              <div className="mb-4 backdrop-blur-sm bg-white/30 rounded-xl border border-white/20 shadow-lg p-4">
                <SensorCard
                  title="Humidity"
                  value={sensorHistory[sensorHistory.length - 1]?.humidity ?? 0}
                  unit="%"
                  data={formatHistoryData('humidity')}
                  color="#06b6d4"
                />
              </div>
              
              <div className="mb-4 backdrop-blur-sm bg-white/30 rounded-xl border border-white/20 shadow-lg p-4">
                <SensorCard
                  title="CO2 Levels"
                  value={sensorHistory[sensorHistory.length - 1]?.co2 ?? 0}
                  unit="ppm"
                  data={formatHistoryData('co2')}
                  color="#84cc16"
                />
              </div>
              
              <div className="mb-4 backdrop-blur-sm bg-white/30 rounded-xl border border-white/20 shadow-lg p-4">
                <SensorCard
                  title="TVOC"
                  value={sensorHistory[sensorHistory.length - 1]?.tvoc ?? 0}
                  unit="ppb"
                  data={formatHistoryData('tvoc')}
                  color="#8b5cf6"
                />
              </div>
            </Masonry>
          </div>
        </div>
      </div>
    </>
  )
}