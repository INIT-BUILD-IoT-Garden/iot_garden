import { useEffect, useState, useRef } from 'react'
import { SensorCard } from './SensorCard'
import { SensorData, SensorDataPoint } from '@/types/sensors'
import { generateMockData } from '@/services/mockData'
import { StatusCard } from './StatusCard'
import { WeatherSummary } from './WeatherSummary'
import { AlertCard } from './AlertCard'
import Masonry from 'react-masonry-css';

interface DashboardProps {
  activeSection: 'hero' | 'dashboard';
  setActiveSection: (section: 'hero' | 'dashboard') => void;
}

export function Dashboard({ activeSection, setActiveSection }: DashboardProps) {
  const dashboardRef = useRef<HTMLDivElement>(null);
  const lastScrollPosition = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!dashboardRef.current) return;
      
      const currentScroll = window.scrollY;
      const viewportHeight = window.innerHeight;
      const scrollingDown = currentScroll > lastScrollPosition.current;
      const scrollingUp = currentScroll < lastScrollPosition.current;
      
      // Get total scrollable height and footer height
      const totalHeight = document.documentElement.scrollHeight;
      const footerHeight = 130; // Match your footer height
      const footerThreshold = totalHeight - viewportHeight - footerHeight;
      
      // Don't trigger snapping if we're in the footer area
      if (currentScroll > footerThreshold) {
        lastScrollPosition.current = currentScroll;
        return;
      }
      
      // Thresholds for both directions
      const downThreshold = viewportHeight * 0.01;
      const upThreshold = viewportHeight * 0.99;
      
      // Snap to dashboard when scrolling down (but not into footer)
      if (scrollingDown && currentScroll > downThreshold && currentScroll < footerThreshold) {
        dashboardRef.current.scrollIntoView({ behavior: 'smooth' });
        setActiveSection('dashboard');
      }
      // Allow hero section to handle upward snap
      else if (scrollingUp && currentScroll < upThreshold) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setActiveSection('hero');
      }
      
      lastScrollPosition.current = currentScroll;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setActiveSection]);

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
    <div 
      ref={dashboardRef} 
      className="min-h-screen w-full pb-[130px]"
    >
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
  )
}