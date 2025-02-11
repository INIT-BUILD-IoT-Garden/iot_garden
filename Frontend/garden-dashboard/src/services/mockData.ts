import { SensorData } from '../types/sensors';

export const generateMockData = (): SensorData => ({
  soil_temperature: parseFloat((20 + Math.random() * 5).toFixed(2)),
  soil_moisture: parseFloat((300 + Math.random() * 100).toFixed(2)),
  air_temperature: parseFloat((22 + Math.random() * 5).toFixed(2)),
  humidity: parseFloat((45 + Math.random() * 20).toFixed(2)),
  hydrogen_raw: parseFloat((1000 + Math.random() * 500).toFixed(2)),
  hydrogen_voltage: parseFloat((2.5 + Math.random()).toFixed(2)),
  co2: parseFloat((400 + Math.random() * 200).toFixed(2)),
  tvoc: parseFloat((100 + Math.random() * 50).toFixed(2)),
  target_count: Math.floor(40 + Math.random() * 53),
  target_speed: parseFloat((Math.random() * 2).toFixed(2)),
  target_distance: parseFloat((0.5 + Math.random() * 2).toFixed(2)),
  target_energy: Math.floor(Math.random() * 1000),
  timestamp: new Date().toISOString()
});