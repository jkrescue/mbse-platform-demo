import { WorkflowNode, NodeStatus } from "./workflowEditorTypes";
import { CANVAS_BOUNDS, VIEWPORT_BOUNDS } from "./workflowEditorConstants";

// 检查节点类型的辅助函数
export const isArchConversionNode = (node: WorkflowNode | null) => {
  if (!node) return false;
  return (
    node.type === "arch-conversion" ||
    node.type === "arch-conversion-sim" ||
    node.type === "ssp-arch-conversion" ||
    node.type === "sysml-to-ssp" ||
    (node.name &&
      (node.name.includes("架构转换") ||
        node.name.includes("SysML转SSP") ||
        node.name.includes("SysML转换"))) ||
    (node.description &&
      node.description.includes("SysML") &&
      node.description.includes("SSP"))
  );
};

export const isEnergyRequirementSyncNode = (node: WorkflowNode | null) => {
  if (!node) return false;
  return (
    node.type === "energy-requirement-sync" &&
    node.name === "能量管理需求同步"
  );
};

export const isEnergySSPConversionNode = (node: WorkflowNode | null) => {
  if (!node) return false;
  return (
    node.type === "energy-ssp-conversion" &&
    node.name === "能量管理SSP转换"
  );
};

export const isRequirementSyncNode = (node: WorkflowNode | null) => {
  if (!node) return false;
  return node.type === "req-sync" && node.name === "需求同步";
};

export const isFunctionSystemDesignNode = (node: WorkflowNode | null) => {
  if (!node) return false;
  return (
    node.type === "func-system-design" ||
    node.type === "vehicle-safety-arch" ||
    node.type === "battery-thermal-design" ||
    (node.name &&
      (node.name.includes("功能&系统设计") ||
        node.name.includes("架构设计") ||
        node.name.includes("热管理设计")))
  );
};

export const isBatteryThermalDesignNode = (node: WorkflowNode | null) => {
  if (!node) return false;
  return (
    node.type === "battery-thermal-design" &&
    node.name === "电池热管理设计"
  );
};

export const isVehicleSafetyArchNode = (node: WorkflowNode | null) => {
  if (!node) return false;
  return (
    node.type === "vehicle-safety-arch" &&
    node.name === "整车安全架构设计"
  );
};

export const isSSPArchConversionNode = (node: WorkflowNode | null) => {
  if (!node) return false;
  return (
    node.type === "ssp-arch-conversion" &&
    node.name === "SSP架构转换"
  );
};

export const isSSPModelicaNode = (node: WorkflowNode | null) => {
  if (!node) return false;
  return (
    node.type === "ssp-modelica" ||
    node.name?.includes("架构同步") ||
    node.name?.includes("SSP-Modelica") ||
    node.name?.includes("SSP") && node.name?.includes("Modelica")
  );
};

export const isMWorksSimNode = (node: WorkflowNode | null) => {
  if (!node) return false;
  return (
    node.type === "m-works-sim" &&
    node.name === "M-works仿真"
  );
};

export const isEnergySimulationNode = (node: WorkflowNode | null) => {
  if (!node) return false;
  return (
    node.type === "energy-simulation" &&
    node.name === "能量流仿真验证"
  );
};

export const isBatteryModelSimNode = (node: WorkflowNode | null) => {
  if (!node) return false;
  return (
    node.type === "battery-model-sim" &&
    node.name === "电池建模仿真"
  );
};

export const isSimulationNode = (node: WorkflowNode | null) => {
  if (!node) return false;
  return (
    node.type === "simulation" ||
    node.type === "sim-config" ||
    (node.name && node.name.includes("仿真配置"))
  );
};

export const isDOEAnalysisNode = (node: WorkflowNode | null) => {
  if (!node) return false;
  return (
    node.type === "doe-analysis" ||
    node.type === "doe-experiment" ||
    node.type === "energy-doe-analysis" ||
    (node.name &&
      (node.name.includes("DOE") ||
        node.name.includes("实验设计") ||
        node.name.includes("实验分析")))
  );
};

// 约束坐标到画布边界
export const constrainPosition = (
  x: number,
  y: number,
  width: number = 360,
  height: number = 120,
) => {
  return {
    x: Math.max(
      CANVAS_BOUNDS.minX,
      Math.min(CANVAS_BOUNDS.maxX - width, x),
    ),
    y: Math.max(
      CANVAS_BOUNDS.minY,
      Math.min(CANVAS_BOUNDS.maxY - height, y),
    ),
  };
};

// 约束视图平移到边界
export const constrainPan = (panX: number, panY: number) => {
  return {
    x: Math.max(
      VIEWPORT_BOUNDS.minPanX,
      Math.min(VIEWPORT_BOUNDS.maxPanX, panX),
    ),
    y: Math.max(
      VIEWPORT_BOUNDS.minPanY,
      Math.min(VIEWPORT_BOUNDS.maxPanY, panY),
    ),
  };
};

// 获取节点状态样式
export const getNodeStatusStyle = (status: NodeStatus) => {
  switch (status) {
    case "completed":
      return "border-green-500";
    case "running":
      return "border-yellow-500";
    case "waiting":
      return "border-gray-400";
    default:
      return "border-gray-300";
  }
};

// 获取连接线颜色
export const getConnectionColor = (
  fromNodeStatus: NodeStatus,
  toNodeStatus: NodeStatus,
) => {
  // 完成状态的工作流节点之间的连线变成绿色
  if (fromNodeStatus === "completed" && toNodeStatus === "completed") {
    return "#22c55e"; // 绿色
  } 
  // 完成的节点与进行中的节点之间用黄色线
  else if (fromNodeStatus === "completed" && toNodeStatus === "running") {
    return "#eab308"; // 黄色
  } 
  // 进行中的节点与等待的节点之间连线则是默认的灰色
  else if (fromNodeStatus === "running" && toNodeStatus === "waiting") {
    return "#9CA3AF"; // 灰色
  } 
  else {
    return "#9CA3AF"; // 默认灰色
  }
};