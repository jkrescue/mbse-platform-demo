export const DEFAULT_CONVERSION_RULES = [
  {
    id: "rule-1",
    from: "SysML Block",
    to: "SSP Component",
    rule: "将SysML Block定义转换为SSP Component实例",
    enabled: true
  },
  {
    id: "rule-2", 
    from: "SysML Port",
    to: "SSP Connector",
    rule: "将SysML端口映射为SSP连接器",
    enabled: true
  },
  {
    id: "rule-3",
    from: "SysML Parameter",
    to: "SSP Parameter",
    rule: "保持参数类型和约束条件",
    enabled: true
  }
];

export const DEFAULT_VALIDATION_RULES = [
  {
    id: "val-1",
    rule: "检查所有SysML Block是否有对应的SSP Component映射",
    level: "error",
    enabled: true
  },
  {
    id: "val-2",
    rule: "验证端口连接的类型兼容性",
    level: "warning", 
    enabled: true
  },
  {
    id: "val-3",
    rule: "检查参数单位和量纲一致性",
    level: "info",
    enabled: false
  }
];

export const DEFAULT_CONVERSION_HISTORY = [
  {
    id: "hist-1",
    timestamp: "2025-08-01 09:30:15",
    sourceModel: "vehicle_energy_management.sysml",
    targetPath: "energy_management_system.ssp",
    status: "success",
    duration: "2.3秒",
    details: "成功转换15个Block，23个Port，8个Parameter"
  },
  {
    id: "hist-2",
    timestamp: "2025-08-01 08:45:22", 
    sourceModel: "battery_thermal_model.sysml",
    targetPath: "battery_thermal.ssp",
    status: "failed",
    duration: "1.8秒",
    details: "转换失败：缺少必要的端口定义"
  }
];

export const DEFAULT_OPTIMIZATION_SETTINGS = {
  enablePortMapping: true,
  enableParameterInheritance: true,
  enableGeometryTransfer: false,
  enableBehaviorMapping: true,
  compressionLevel: "standard"
};

export const DEFAULT_SOURCE_MODEL_PATH = "/models/sysml/vehicle_energy_management.sysml";
export const DEFAULT_TARGET_SSP_PATH = "/output/ssp/energy_management_system.ssp";