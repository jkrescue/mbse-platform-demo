import { CanvasBounds, ViewportBounds, ComponentLibrarySection } from './types';

// 画布边界配置 - 大幅放大以容纳更多节点
export const CANVAS_BOUNDS: CanvasBounds = {
  minX: -10000,
  maxX: 20000,
  minY: -10000,
  maxY: 15000,
};

export const VIEWPORT_BOUNDS: ViewportBounds = {
  minPanX: -5000,
  maxPanX: 5000,
  minPanY: -4000,
  maxPanY: 4000,
};

// 节点库数据 - 与原版相同
export const componentLibrary: ComponentLibrarySection[] = [
  {
    id: "requirement-management",
    title: "需求管理及同步",
    tag: "POLARION",
    tagColor: "bg-blue-500",
    isOpen: true,
    items: [
      {
        id: "req-creation",
        name: "需求创建",
        description: "创建和管理系统需求",
        action: "需求管理",
      },
    ],
  },
  {
    id: "function-architecture",
    title: "功能与架构设计",
    tag: "EA",
    tagColor: "bg-green-500",
    isOpen: true,
    items: [
      {
        id: "req-sync",
        name: "需求同步",
        description: "同步需求到架构设计",
        action: "需求同步",
      },
      {
        id: "func-system-design",
        name: "功能&系统设计",
        description: "进行功能与系统的详细设计",
        action: "功能设计",
      },
      {
        id: "arch-conversion",
        name: "架构转换",
        description: "转换架构到目标格式",
        action: "架构转换",
      },
      {
        id: "sysml-to-ssp",
        name: "SysML转SSP",
        description: "将SysML模型转换为SSP标准格式",
        action: "SysML到SSP转换",
      },
    ],
  },
  {
    id: "system-integration-sim",
    title: "系统集成仿真",
    tag: "SSP-MODELICA",
    tagColor: "bg-purple-500",
    isOpen: true,
    items: [
      {
        id: "arch-sync",
        name: "架构同步",
        description: "同步架构到仿真环境",
        action: "架构同步",
      },
      {
        id: "sim-config",
        name: "仿真配置",
        description: "配置仿真参数和环境",
        action: "仿真配置",
      },
      {
        id: "arch-conversion-sim",
        name: "架构转换",
        description: "转换架构用于仿真",
        action: "架构转换",
      },
    ],
  },
  {
    id: "design-traceability",
    title: "设计追溯",
    tag: "TRACEABILITY",
    tagColor: "bg-orange-500",
    isOpen: true,
    items: [
      {
        id: "data-closed-loop",
        name: "数据闭环",
        description: "建立设计数据的闭环追溯机制",
        action: "数据闭环",
      },
    ],
  },
];

// 默认打开的分类
export const DEFAULT_OPEN_SECTIONS = [
  "requirement-management",
  "function-architecture", 
  "system-integration-sim",
  "design-traceability",
];

// 节点默认配置
export const DEFAULT_NODE_CONFIG = {
  timeout: 300,
  retryCount: 1,
  autoRun: true,
  parameters: {},
};

// 节点默认尺寸
export const NODE_DIMENSIONS = {
  width: 360,
  height: 120,
};

// 端口位置配置
export const PORT_POSITIONS = {
  input: { x: 0, y: 60 },
  output: { x: 360, y: 60 },
};

// 缩放配置
export const ZOOM_CONFIG = {
  min: 25,
  max: 200,
  step: 25,
  default: 100,
};