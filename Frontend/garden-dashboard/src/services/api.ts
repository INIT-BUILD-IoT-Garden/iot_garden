const API_URL = import.meta.env.VITE_API_URL || "http://10.108.43.201:3001";

export async function fetchSensorData() {
  const response = await fetch(`${API_URL}/api/sensor-data`);
  if (!response.ok) {
    throw new Error("Failed to fetch sensor data");
  }
  return response.json();
}
