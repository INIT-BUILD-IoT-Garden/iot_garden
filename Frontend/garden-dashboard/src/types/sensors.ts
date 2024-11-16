export interface SensorData {
    soil_temperature: number;
    soil_moisture: number;
    air_temperature: number;
    humidity: number;
    hydrogen_raw: number;
    hydrogen_voltage: number;
    co2: number;
    tvoc: number;
    target_count: number;
    target_speed: number;
    target_distance: number;
    target_energy: number;
    timestamp: string;
  }
  
  export interface SensorDataPoint {
    value: number;
    timestamp: string;
  }
  
  export interface ChartData {
    name: string;
    value: number;
  }