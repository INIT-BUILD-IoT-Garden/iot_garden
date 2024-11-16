import { SensorData } from '../types/sensors';

export const generateMockData = (): SensorData => ({
  soil_temperature: 20 + Math.random() * 5,
  soil_moisture: 300 + Math.random() * 100,
  air_temperature: 22 + Math.random() * 5,
  humidity: 45 + Math.random() * 20,
  hydrogen_raw: 1000 + Math.random() * 500,
  hydrogen_voltage: 2.5 + Math.random(),
  co2: 400 + Math.random() * 200,
  tvoc: 100 + Math.random() * 50,
  target_count: Math.floor(Math.random() * 3),
  target_speed: Math.random() * 2,
  target_distance: 0.5 + Math.random() * 2,
  target_energy: Math.floor(Math.random() * 1000),
  timestamp: new Date().toISOString()
});