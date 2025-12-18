import { WorkflowNode, Connection } from "./workflowEditorTypes";

// 预设的能源管理系统工作流节点
export const energyManagementNodes: WorkflowNode[] = [
  {
    id: "node-1",
    type: "requirement-creation",
    name: "创建需求",
    description: "定义和创建新能源汽车能量管理相关需求",
    tag: "POLARION",
    tagColor: "bg-blue-500",
    status: "completed",
    position: { x: 50, y: 50 },
    collapsed: false,
    ports: {
      input: { x: 0, y: 60 },
      output: { x: 360, y: 60 },
    },
    action: "• 创建需求",
    config: {
      timeout: 600,
      retryCount: 2,
      autoRun: true,
      parameters: {
        requirementType: "functional",
        syncMode: "remote",
        remoteSystem: "polarion",
      },
    },
  },
  {
    id: "node-2",
    type: "req-sync",
    name: "需求同步",
    description: "同步需求到架构设计",
    tag: "POLARION-EA",
    tagColor: "bg-green-500",
    status: "completed",
    position: { x: 470, y: 50 },
    collapsed: false,
    ports: {
      input: { x: 0, y: 60 },
      output: { x: 360, y: 60 },
    },
    action: "• 需求同步",
    config: {
      timeout: 600,
      retryCount: 2,
      autoRun: false,
      parameters: {
        mappingRules: "energy-management",
        validateSchema: true,
      },
    },
  },
  {
    id: "node-3",
    type: "battery-thermal-design",
    name: "电池热管理设计",
    description: "进行电池热管理系统详细设计",
    tag: "EA",
    tagColor: "bg-orange-500",
    status: "running",
    position: { x: 470, y: 200 },
    collapsed: false,
    ports: {
      input: { x: 0, y: 60 },
      output: { x: 360, y: 60 },
    },
    action: "• 功能&系统设计",
    config: {
      timeout: 900,
      retryCount: 2,
      autoRun: true,
      parameters: {
        designLevel: "thermal-system",
        includeTestCases: true,
      },
    },
  },
  {
    id: "node-4",
    type: "energy-ssp-conversion",
    name: "能量管理SSP转换",
    description: "将能量管理架构转换为SSP格式",
    tag: "SSP",
    tagColor: "bg-teal-500",
    status: "waiting",
    position: { x: 470, y: 350 },
    collapsed: false,
    ports: {
      input: { x: 0, y: 60 },
      output: { x: 360, y: 60 },
    },
    action: "• 架构转换",
    config: {
      timeout: 450,
      retryCount: 3,
      autoRun: true,
      parameters: {
        targetFormat: "energy-ssp",
        compression: true,
      },
      conversionConfig: {
        targetFormat: "SSP-2.1",
      },
    },
  },
  {
    id: "node-5",
    type: "energy-simulation",
    name: "能量流仿真验证",
    description: "进行整车能量流系统级仿真验证",
    tag: "SSP-MODELICA",
    tagColor: "bg-green-500",
    status: "completed",
    position: { x: 890, y: 50 },
    collapsed: false,
    ports: {
      input: { x: 0, y: 60 },
      output: { x: 360, y: 60 },
    },
    action: "• 架构同步",
    config: {
      timeout: 1200,
      retryCount: 1,
      autoRun: true,
      parameters: {
        simulationTime: 10,
        solver: "dassl",
      },
      modelConfig: {
        selectedModel: "energy_system_v2.ssp",
        simulationParameters: {
          simulationTime: 100,
          stepSize: 0.01,
          solver: "CVode"
        }
      },
    },
  },
  {
    id: "node-6",
    type: "battery-model-sim",
    name: "电池建模仿真",
    description: "进行电池系统建模与仿真分析",
    tag: "M-WORKS",
    tagColor: "bg-purple-500",
    status: "waiting",
    position: { x: 890, y: 200 },
    collapsed: false,
    ports: {
      input: { x: 0, y: 60 },
      output: { x: 360, y: 60 },
    },
    action: "• 仿真配置",
    config: {
      timeout: 1800,
      retryCount: 1,
      autoRun: true,
      parameters: {
        modelPath: "/models/battery-energy.mo",
        outputFormat: "csv",
      },
      modelConfig: {
        batteryModel: {
          selectedModel: "LiFePO4_Cell_Model",
        },
        simulationConfig: {
          analysisType: "thermal_electrical",
        }
      },
    },
  },
  {
    id: "node-7",
    type: "energy-doe-analysis",
    name: "能量管理DOE分析",
    description: "进行能量管理策略实验设计与优化",
    tag: "DOE",
    tagColor: "bg-emerald-500",
    status: "waiting",
    position: { x: 890, y: 350 },
    collapsed: false,
    ports: {
      input: { x: 0, y: 60 },
      output: { x: 360, y: 60 },
    },
    action: "• 实验分析",
    config: {
      timeout: 3600,
      retryCount: 1,
      autoRun: true,
      parameters: {
        designType: "energy-optimization",
        factors: 4,
        levels: 3,
      },
      doeConfig: {
        designType: "full_factorial",
      },
    },
  },
];

// 预设的工作流节点（原始碰撞安全分析）
export const initialNodes: WorkflowNode[] = [
  {
    id: "node-1",
    type: "requirement-creation",
    name: "创建需求",
    description: "定义和创建系统需求，支持本地和远程同步",
    tag: "POLARION",
    tagColor: "bg-blue-500",
    status: "completed",
    position: { x: 50, y: 50 },
    collapsed: false,
    ports: {
      input: { x: 0, y: 60 },
      output: { x: 360, y: 60 },
    },
    action: "• 创建需求",
    config: {
      timeout: 600,
      retryCount: 2,
      autoRun: true,
      parameters: {
        requirementType: "functional",
        syncMode: "remote",
        remoteSystem: "polarion",
      },
    },
  },
  {
    id: "node-2",
    type: "req-sync",
    name: "需求同步",
    description: "同步需求到架构设计",
    tag: "POLARION-EA",
    tagColor: "bg-green-500",
    status: "completed",
    position: { x: 470, y: 50 },
    collapsed: false,
    ports: {
      input: { x: 0, y: 60 },
      output: { x: 360, y: 60 },
    },
    action: "• 需求同步",
    config: {
      timeout: 600,
      retryCount: 2,
      autoRun: false,
      parameters: {
        mappingRules: "default",
        validateSchema: true,
      },
    },
  },
  {
    id: "node-3",
    type: "vehicle-safety-arch",
    name: "整车安全架构设计",
    description: "进行功能与架构的详细设计",
    tag: "EA",
    tagColor: "bg-orange-500",
    status: "running",
    position: { x: 470, y: 200 },
    collapsed: false,
    ports: {
      input: { x: 0, y: 60 },
      output: { x: 360, y: 60 },
    },
    action: "• 功能&系统设计",
    config: {
      timeout: 900,
      retryCount: 2,
      autoRun: true,
      parameters: {
        designLevel: "system",
        includeTestCases: true,
      },
    },
  },
  {
    id: "node-4",
    type: "ssp-arch-conversion",
    name: "SSP架构转换",
    description: "架构转换为可信的管理",
    tag: "SSP",
    tagColor: "bg-teal-500",
    status: "waiting",
    position: { x: 470, y: 350 },
    collapsed: false,
    ports: {
      input: { x: 0, y: 60 },
      output: { x: 360, y: 60 },
    },
    action: "• 架构转换",
    config: {
      timeout: 450,
      retryCount: 3,
      autoRun: true,
      parameters: {
        targetFormat: "ssp",
        compression: true,
      },
      conversionConfig: {
        targetFormat: "SSP-1.0",
      },
    },
  },
  {
    id: "node-5",
    type: "ssp-modelica",
    name: "SSP-Modelica",
    description: "系统级综合仿真验证",
    tag: "SSP-MODELICA",
    tagColor: "bg-green-500",
    status: "completed",
    position: { x: 890, y: 50 },
    collapsed: false,
    ports: {
      input: { x: 0, y: 60 },
      output: { x: 360, y: 60 },
    },
    action: "• 架构同步",
    config: {
      timeout: 1200,
      retryCount: 1,
      autoRun: true,
      parameters: {
        simulationTime: 10,
        solver: "dassl",
      },
      modelConfig: {
        selectedModel: "vehicle_safety_system.ssp",
        simulationParameters: {
          simulationTime: 50,
          stepSize: 0.001,
          solver: "Radau"
        }
      },
    },
  },
  {
    id: "node-6",
    type: "m-works-sim",
    name: "M-works仿真",
    description: "进行仿真配置定义",
    tag: "M-WORKS",
    tagColor: "bg-purple-500",
    status: "waiting",
    position: { x: 890, y: 200 },
    collapsed: false,
    ports: {
      input: { x: 0, y: 60 },
      output: { x: 360, y: 60 },
    },
    action: "• 仿真配置",
    config: {
      timeout: 1800,
      retryCount: 1,
      autoRun: true,
      parameters: {
        modelPath: "/models/vehicle.mo",
        outputFormat: "csv",
      },
      simulationConfig: {
        modelPath: "/models/crash_simulation.mo",
      },
    },
  },

  {
    id: "node-7",
    type: "doe-experiment",
    name: "DOE实验设计",
    description: "实验设计与多元分析",
    tag: "DOE",
    tagColor: "bg-emerald-500",
    status: "waiting",
    position: { x: 890, y: 350 },
    collapsed: false,
    ports: {
      input: { x: 0, y: 60 },
      output: { x: 360, y: 60 },
    },
    action: "• 实验分析",
    config: {
      timeout: 3600,
      retryCount: 1,
      autoRun: true,
      parameters: {
        designType: "factorial",
        factors: 3,
        levels: 2,
      },
      doeConfig: {
        designType: "central_composite",
      },
    },
  },
];

// 能源管理系统工作流连接线
export const energyManagementConnections: Connection[] = [
  {
    id: "conn-1",
    from: "node-1",
    to: "node-2",
    fromPort: "output",
    toPort: "input",
  },
  {
    id: "conn-2",
    from: "node-2",
    to: "node-3",
    fromPort: "output",
    toPort: "input",
  },
  {
    id: "conn-3",
    from: "node-3",
    to: "node-4",
    fromPort: "output",
    toPort: "input",
  },
  {
    id: "conn-4",
    from: "node-4",
    to: "node-5",
    fromPort: "output",
    toPort: "input",
  },
  {
    id: "conn-5",
    from: "node-5",
    to: "node-6",
    fromPort: "output",
    toPort: "input",
  },
  {
    id: "conn-6",
    from: "node-6",
    to: "node-7",
    fromPort: "output",
    toPort: "input",
  },
];

// 预设的连接线（原始碰撞安全分析）
export const initialConnections: Connection[] = [
  {
    id: "conn-1",
    from: "node-1",
    to: "node-2",
    fromPort: "output",
    toPort: "input",
  },
  {
    id: "conn-2",
    from: "node-2",
    to: "node-3",
    fromPort: "output",
    toPort: "input",
  },
  {
    id: "conn-3",
    from: "node-3",
    to: "node-4",
    fromPort: "output",
    toPort: "input",
  },
  {
    id: "conn-4",
    from: "node-4",
    to: "node-5",
    fromPort: "output",
    toPort: "input",
  },
  {
    id: "conn-5",
    from: "node-5",
    to: "node-6",
    fromPort: "output",
    toPort: "input",
  },
  {
    id: "conn-6",
    from: "node-6",
    to: "node-7",
    fromPort: "output",
    toPort: "input",
  },
];