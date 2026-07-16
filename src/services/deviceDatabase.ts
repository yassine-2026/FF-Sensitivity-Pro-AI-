import { DeviceSpec } from '../types';

let devicesCache: DeviceSpec[] | null = null;

// Lazy load the devices database
export async function getDevices(): Promise<DeviceSpec[]> {
  if (devicesCache) return devicesCache;
  const data = await import('../data/devices.json');
  devicesCache = data.default as DeviceSpec[];
  return devicesCache;
}

export async function searchDevices(query: string): Promise<DeviceSpec[]> {
  const devices = await getDevices();
  if (!query) return [];
  
  const lowerQuery = query.toLowerCase();
  return devices.filter(device => 
    device.brand.toLowerCase().includes(lowerQuery) || 
    device.model.toLowerCase().includes(lowerQuery) ||
    `\${device.brand} \${device.model}`.toLowerCase().includes(lowerQuery)
  );
}

export async function getDeviceModel(modelName: string): Promise<DeviceSpec | null> {
  const devices = await getDevices();
  const lowerModelName = modelName.toLowerCase();
  
  return devices.find(device => 
    device.model.toLowerCase() === lowerModelName ||
    `\${device.brand} \${device.model}`.toLowerCase() === lowerModelName
  ) || null;
}
