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
