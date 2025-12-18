export interface ConversionRule {
  id: string;
  from: string;
  to: string;
  rule: string;
  enabled: boolean;
}

export interface ValidationRule {
  id: string;
  rule: string;
  level: "error" | "warning" | "info";
  enabled: boolean;
}

export interface ConversionHistoryRecord {
  id: string;
  timestamp: string;
  sourceModel: string;
  targetPath: string;
  status: "success" | "failed" | "in-progress";
  duration: string;
  details: string;
}

export interface OptimizationSettings {
  enablePortMapping: boolean;
  enableParameterInheritance: boolean;
  enableGeometryTransfer: boolean;
  enableBehaviorMapping: boolean;
  compressionLevel: string;
}

export interface NodeConfig {
  nodeName: string;
  nodeId: string;
  description: string;
  priority: string;
  creator: string;
  createTime: string;
  autoExecute: boolean;
  timeout: number;
  retryCount: number;
  sourceModelPath: string;
  targetSSPPath: string;
  conversionRules: ConversionRule[];
  validationRules: ValidationRule[];
  transformationProgress: number;
  conversionHistory: ConversionHistoryRecord[];
  optimizationSettings: OptimizationSettings;
}

export interface NodeConfigPanelProps {
  node: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: any) => void;
}