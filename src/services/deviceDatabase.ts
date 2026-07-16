import { DeviceSpec } from '../types';

export async function searchDevices(query: string): Promise<DeviceSpec[]> {
  if (!query) return [];
  
  try {
    const response = await fetch(`/api/devices/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Search failed');
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Error searching devices:', err);
    return [];
  }
}

export async function getDeviceModel(modelName: string): Promise<DeviceSpec | null> {
  const devices = await searchDevices(modelName);
  const lowerModelName = modelName.toLowerCase();
  
  return devices.find(device => 
    device.model.toLowerCase() === lowerModelName ||
    `${device.brand} ${device.model}`.toLowerCase() === lowerModelName
  ) || null;
}
