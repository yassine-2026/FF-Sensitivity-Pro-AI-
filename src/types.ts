export interface DeviceSpec {
  id: string;
  brand: string;
  model: string;
  aliases: string[];
  languages_names: Record<string, string>;
  release_date: string;
  category: string;
  operating_system: string;
  cpu: string;
  cpu_cores: number;
  cpu_frequency: string;
  gpu: string;
  ram_options: number[];
  storage_options: number[];
  display_size: string;
  resolution: string;
  refresh_rate: number;
  touch_sampling_rate: number;
  battery_capacity: number;
  charging_speed: string;
  camera_info: string;
  performance_score: number;
  gaming_score: number;
}

export interface AnalysisResult {
  analysis: {
    cpu: string;
    gpu: string;
    performance: string;
    category?: string;
  };
  sensitivity: {
    general: number;
    redDot: number;
    scope2x: number;
    scope4x: number;
    sniperScope: number;
    freeLook: number;
  };
  recommendations: {
    dpi: string;
    fireButtonSize: string;
    graphics: string;
    fps: string;
    tips: string[];
  };
}
