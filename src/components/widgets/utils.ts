import { WorkflowNode } from './types';
import { CANVAS_BOUNDS, VIEWPORT_BOUNDS } from './constants';

// 获取标签颜色的工具函数
export const getTagColor = (tag: string): string => {
  switch (tag) {
    case "POLARION":
      return "bg-blue-500";
    case "EA":
      return "bg-green-500";
    case "SSP-MODELICA":
      return "bg-purple-500";
    case "M-WORKS":
      return "bg-purple-500";
    case "SSP":
      return "bg-teal-500";
    case "DOE":
      return "bg-emerald-500";
    case "TRACEABILITY":
      return "bg-orange-500";
    default:
      return "bg-gray-500";
  }
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

// 检查是否为架构转换节点
export const isArchConversionNode = (node: WorkflowNode): boolean => {
  return node.type === "arch-conversion" || 
         node.type === "arch-conversion-sim" ||
         node.type === "energy-ssp-conversion" ||
         node.type === "ssp-arch-conversion" ||
         node.type === "sysml-to-ssp" ||
         node.type === "ssp-modelica" ||
         (node.name && (node.name.includes("架构转换") || node.name.includes("SSP转换") || node.name.includes("SysML转SSP") || node.name.includes("架构同步")));
};

// 生成新节点ID
export const generateNodeId = (): string => {
  return `node-${Date.now()}`;
};

// 创建画布状态数据
export const createCanvasState = (nodes: WorkflowNode[], connections: any[], zoom: number, panX: number, panY: number) => {
  return {
    nodes: nodes.map(node => ({
      ...node,
      position: node.position,
      data: node.config
    })),
    connections: connections,
    viewport: {
      zoom: zoom,
      panX: panX,
      panY: panY
    }
  };
};

// 模拟仿真分析结果
export const createSimulationResults = (nodesLength: number, connectionsLength: number) => {
  return {
    status: "success",
    totalNodes: nodesLength,
    connections: connectionsLength,
    executionTime: "2.3s",
    coverage: "98.5%",
    errors: 0,
    warnings: 0
  };
};

// 根据节点状态获取连接线颜色
export const getConnectionColor = (fromStatus: string, toStatus: string): string => {
  // 完成状态的工作流节点之间的连线变成绿色
  if (fromStatus === 'completed' && toStatus === 'completed') {
    return '#22c55e'; // 绿色
  }
  
  // 完成的节点与进行中的节点之间用黄色线
  if (fromStatus === 'completed' && toStatus === 'running') {
    return '#eab308'; // 黄色
  }
  
  // 进行中的节点与等待的节点之间连线则是默认的灰色
  if (fromStatus === 'running' && toStatus === 'waiting') {
    return '#9CA3AF'; // 灰色
  }
  
  // 其他情况也使用默认灰色
  return '#9CA3AF'; // 灰色
};