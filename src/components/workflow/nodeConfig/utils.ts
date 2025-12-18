export const getStatusColor = (status: string) => {
  switch (status) {
    case "success": return "bg-green-100 text-green-800";
    case "in-progress": return "bg-blue-100 text-blue-800";
    case "failed": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

export const getValidationLevelColor = (level: string) => {
  switch (level) {
    case "error": return "bg-red-100 text-red-800";
    case "warning": return "bg-yellow-100 text-yellow-800";
    case "info": return "bg-blue-100 text-blue-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case "success": return "CheckCircle";
    case "in-progress": return "PlayCircle";
    case "failed": return "AlertTriangle";
    default: return null;
  }
};

export const createInitialConfig = (node: any, isArchNode: boolean) => {
  const baseConfig = {
    nodeName: node?.name || "节点",
    nodeId: node?.id || "",
    description: node?.description || "",
    priority: node?.config?.priority || "中",
    creator: "系统管理员",
    createTime: new Date().toLocaleString('zh-CN').replace(/\//g, '-'),
    autoExecute: node?.config?.autoRun ?? true,
    timeout: node?.config?.timeout || 60,
    retryCount: node?.config?.retryCount || 3,
  };

  if (isArchNode) {
    return {
      ...baseConfig,
      sourceModelPath: node?.config?.archConversionConfig?.sourceModelPath || "/models/sysml/vehicle_energy_management.sysml",
      targetSSPPath: node?.config?.archConversionConfig?.targetSSPPath || "/output/ssp/energy_management_system.ssp",
      conversionRules: node?.config?.archConversionConfig?.conversionRules || [],
      validationRules: node?.config?.archConversionConfig?.validationRules || [],
      transformationProgress: node?.config?.archConversionConfig?.transformationProgress || 0,
      conversionHistory: node?.config?.archConversionConfig?.conversionHistory || [],
      optimizationSettings: node?.config?.archConversionConfig?.optimizationSettings || {
        enablePortMapping: true,
        enableParameterInheritance: true,
        enableGeometryTransfer: false,
        enableBehaviorMapping: true,
        compressionLevel: "standard"
      }
    };
  }

  return {
    ...baseConfig,
    sourceModelPath: "",
    targetSSPPath: "",
    conversionRules: [],
    validationRules: [],
    transformationProgress: 0,
    conversionHistory: [],
    optimizationSettings: {
      enablePortMapping: true,
      enableParameterInheritance: true,
      enableGeometryTransfer: false,
      enableBehaviorMapping: true,
      compressionLevel: "standard"
    }
  };
};