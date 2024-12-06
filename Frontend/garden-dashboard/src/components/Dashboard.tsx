import { useEffect, useState } from "react";
import Masonry from "react-masonry-css";

import { generateMockData } from "../services/mockData";
import { SensorData, SensorDataPoint } from "../types/sensors";
import { AlertCard } from "./AlertCard";
import { GardenBackground } from "./GardenBackground";
import { SensorCard } from "./SensorCard";
import { StatusCard } from "./StatusCard";
import { WeatherSummary } from "./WeatherSummary";

const SENSOR_CONFIGS = [
  {
    title: "Soil Temperature",
    key: "soil_temperature" as const,
    unit: "°C",
    color: "#ef4444",
  },
  {
    title: "Soil Moisture",
    key: "soil_moisture" as const,
    unit: "raw",
    color: "#3b82f6",
  },
  {
    title: "Air Temperature",
    key: "air_temperature" as const,
    unit: "°C",
    color: "#f97316",
  },
  {
    title: "Humidity",
    key: "humidity" as const,
    unit: "%",
    color: "#06b6d4",
  },
  {
    title: "CO2 Levels",
    key: "co2" as const,
    unit: "ppm",
    color: "#84cc16",
  },
  {
    title: "TVOC",
    key: "tvoc" as const,
    unit: "ppb",
    color: "#8b5cf6",
  },
];

export function Dashboard() {
  const [sensorHistory, setSensorHistory] = useState<SensorData[]>([]);

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setSensorHistory((prev) => {
        const newData = generateMockData();
        return [...prev, newData].slice(-10); // Keep last 10 readings
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const formatHistoryData = (key: keyof SensorData): SensorDataPoint[] => {
    return sensorHistory.map((data) => ({
      value: data[key] as number,
      timestamp: data.timestamp,
    }));
  };

  const mockAlerts = [
    {
      id: "1",
      type: "warning" as const,
      message: "Soil moisture levels are below recommended threshold",
      timestamp: new Date().toISOString(),
    },
    {
      id: "2",
      type: "info" as const,
      message:
        "Laboris deserunt dolore incididunt officia non amet id commodo velit voluptate eu.",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
  ];

  return (
    <div className="relative">
      {/* Full-width background */}
      <div className="sticky top-0 h-screen w-full">
        <GardenBackground />
      </div>

      {/* Content container with grid */}
      <div className="relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-5">
          {/* Left column - empty for nav */}
          <div className="hidden md:block" />

          {/* Main content column */}
          <div className="col-span-1 md:col-span-4 px-6 py-8">
            <h1 className="mb-8 text-center text-4xl font-bold">
              Green Campus Garden
            </h1>

            {/* Masonry grid */}
            <div className="-z-10 mx-auto mb-8 p-4">
              <Masonry
                breakpointCols={{
                  default: 2,
                  1024: 2,
                  640: 1,
                }}
                className="-ml-4 flex w-auto"
                columnClassName="pl-4 bg-clip-padding"
              >
                {[
                  <StatusCard
                    key="system"
                    title="System Status"
                    status="online"
                    lastUpdate={new Date().toLocaleString(undefined, {
                      hour: "numeric",
                      minute: "numeric",
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                    })}
                  />,
                  <StatusCard
                    key="network"
                    title="Sensor Network"
                    status="online"
                    lastUpdate={new Date().toLocaleString(undefined, {
                      hour: "numeric",
                      minute: "numeric",
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                    })}
                  />,
                  <WeatherSummary key="weather" />,
                  <AlertCard key="alerts" alerts={mockAlerts} />,
                ].map((card, index) => (
                  <div
                    key={index}
                    className="mb-4 rounded-xl border border-black/30 bg-white/30 p-4 shadow-lg backdrop-blur-sm"
                  >
                    {card}
                  </div>
                ))}

                {/* Sensor Cards */}
                {SENSOR_CONFIGS.map(({ title, key, unit, color }) => (
                  <div
                    key={key}
                    className="mb-4 rounded-xl border border-black/30 bg-white/30 p-4 shadow-lg backdrop-blur-sm"
                  >
                    <SensorCard
                      title={title}
                      value={
                        sensorHistory[sensorHistory.length - 1]?.[key] ?? 0
                      }
                      unit={unit}
                      data={formatHistoryData(key)}
                      color={color}
                    />
                  </div>
                ))}
              </Masonry>
            </div>
          </div>

          {/* Right column - empty */}
          <div className="hidden md:block" />
        </div>
      </div>
    </div>
  );
}
