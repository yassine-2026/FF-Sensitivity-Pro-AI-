export interface DeviceSpec {
  brand: string;
  model: string;
  category: string;
  release_year: number;
  operating_system: string;
  ram_variants: number[];
  storage_variants: number[];
  processor: string;
  cpu_cores: number;
  cpu_frequency: string;
  gpu: string;
  display_size: number;
  resolution: string;
  refresh_rate: number;
  touch_sampling_rate: number;
  battery_capacity: number;
  charging_speed: number;
  performance_score: number;
  gaming_rating: string;
}

export interface AnalysisResult {
  analysis: {
    cpu: string;
    gpu: string;
    performance: string;
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
