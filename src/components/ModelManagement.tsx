import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import {
  Search,
  Filter,
  Upload,
  Settings,
  Download,
  Edit,
  Star,
  Calendar,
  User,
  Tag,
  FileText,
  ChevronDown,
  X,
  Grid,
  List,
  Plus,
  Eye,
  Copy,
  Archive,
  GripVertical,
  Columns,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  GitBranch,
  ArrowRightLeft,
  Trash2,
  Upload as PublishIcon,
  Globe,
  FolderOpen,
  LayoutGrid,
} from "lucide-react@0.487.0";
import { ModelReviewModal } from "./ModelReviewModal";
import { ModelUploadModal } from "./ModelUploadModal";
import { ModelPublishWorkflow } from "./ModelPublishWorkflow";
import { Switch } from "./ui/switch";
import { toast } from "sonner@2.0.3";
import ToolModelIntegrationService from "../services/ToolModelIntegrationService";

// 项目应用信息接口
interface ProjectApplication {
  id: number;
  name: string;
  status: "进行中" | "已完成" | "计划中";
  useCount: number;
  lastUsed: string;
  team: string;
  description: string;
}

interface Model {
  id: string;
  name: string;
  type: string;
  description: string;
  uploader: string;
  uploadTime: string;
  downloadTime?: string;
  version: string;
  project: string;
  status: "已发布" | "草稿" | "审核中";
  downloads: number;
  rating: number;
  tags: string[];
  isPublic: boolean;
  libraryType?: "personal" | "public" | "project"; // 模型库类型
  rflpCategory?:
    | "Requirements"
    | "Functions"
    | "Logical"
    | "Physical";
  dependencies?: {
    upstream: string[];
    downstream: string[];
  };
  // 镜像相关属性
  originalId?: string; // 原始模型ID（镜像模型使用）
  isMirror?: boolean; // 是否为镜像模型
  // 项目应用信息（仅项目库模型或已发布的个人库模型）
  projectApplications?: ProjectApplication[];
}

interface ModelManagementProps {
  onModelClick?: (model: Model) => void;
  userRole?: string;
}

// 模拟公共模型库数据 - 基于MBSE和RFLP架构
const initialPublicModels: Model[] = [
  {
    id: "1",
    name: "Vehicle_Dynamics_Model",
    type: "Simulink",
    description:
      "整车动力学模型，用于车辆运动学模拟和仿真分析。基于RFLP架构中的Physical层实现，涵盖悬架、转向、制动等子系统的物理建模。",
    uploader: "张一",
    uploadTime: "2024-01-10 08:00:00",
    downloadTime: "2024-01-15 08:00:00",
    version: "1.2",
    project: "Project_Omega",
    status: "已发布",
    downloads: 245,
    rating: 5,
    tags: [
      "Dynamic",
      "Simulink",
      "Vehicle",
    ],
    isPublic: true,
    libraryType: "public", // 公共库模型
    rflpCategory: "Physical",
    dependencies: {
      upstream: [
        "EngineControl_V2",
        "Logical_Architecture_Template",
      ],
      downstream: ["BatteryThermalModel"],
    },
  },
  {
    id: "2",
    name: "EngineControl_V2",
    type: "Simulink",
    description:
      "A model for controlling the engine fuel injection system. This is the second major version. 基于RFLP功能架构设计的发动机控制逻辑模型，实现燃油喷射的精确控制。",
    uploader: "王二",
    uploadTime: "2023-10-26 08:00:00",
    version: "2.1",
    project: "Project_Alpha",
    status: "已发布",
    downloads: 189,
    rating: 5,
    tags: [
      "Engine",
      "Control System",
      "Simulink",
    ],
    isPublic: true,
    libraryType: "project", // 项目库模型
    rflpCategory: "Functions",
    dependencies: {
      upstream: ["MBSE_Requirements_Traceability"],
      downstream: ["Vehicle_Dynamics_Model"],
    },
    projectApplications: [
      {
        id: 1,
        name: "混合动力系统开发项目",
        status: "进行中",
        useCount: 67,
        lastUsed: "2025-10-19",
        team: "动力系统研发部",
        description: "基于发动机控制模型进行混合动力系统的能量管理策略开发"
      },
      {
        id: 2,
        name: "燃油经济性提升项目",
        status: "进行中",
        useCount: 52,
        lastUsed: "2025-10-18",
        team: "动力总成优化组",
        description: "通过优化燃油喷射控制逻辑，提升车辆燃油经济性15%"
      },
      {
        id: 3,
        name: "排放标准合规验证",
        status: "已完成",
        useCount: 38,
        lastUsed: "2025-10-15",
        team: "排放控制团队",
        description: "验证发动机控制系统符合国六b排放标准要求"
      },
      {
        id: 4,
        name: "冷启动性能优化",
        status: "进行中",
        useCount: 24,
        lastUsed: "2025-10-17",
        team: "发动机标定组",
        description: "优化低温环境下的发动机冷启动燃油喷射策略"
      },
      {
        id: 5,
        name: "动力响应特性调校",
        status: "计划中",
        useCount: 8,
        lastUsed: "2025-10-10",
        team: "整车性能团队",
        description: "调校加速工况下的发动机控制响应特性"
      }
    ]
  },
  {
    id: "3",
    name: "MBSE_Requirements_Traceability",
    type: "SysML",
    description:
      "MBSE需求追踪模型，基于SysML建立需求、功能、逻辑、物理层的完整追踪关系，支持RFLP架构的需求管理。",
    uploader: "陈博士",
    uploadTime: "2024-02-05 14:30:00",
    version: "3.0",
    project: "MBSE_Framework",
    status: "已发布",
    downloads: 156,
    rating: 5,
    tags: ["requirements", "traceability", "sysml", "mbse"],
    isPublic: true,
    libraryType: "public", // 公共库模型
    rflpCategory: "Requirements",
    dependencies: {
      upstream: [],
      downstream: [
        "EngineControl_V2",
        "Logical_Architecture_Template",
      ],
    },
  },
  {
    id: "4",
    name: "Logical_Architecture_Template",
    type: "SysML",
    description:
      "逻辑架构设计模板，提供RFLP架构中逻辑层的标准建模模式，支持功能分解和接口定义。",
    uploader: "李三",
    uploadTime: "2024-01-20 11:15:00",
    version: "2.3",
    project: "Architecture_Patterns",
    status: "已发布",
    downloads: 92,
    rating: 4,
    tags: ["logical-architecture", "sysml", "interface-design"],
    isPublic: true,
    libraryType: "public", // 公共库模型
    rflpCategory: "Logical",
    dependencies: {
      upstream: ["MBSE_Requirements_Traceability"],
      downstream: ["Vehicle_Dynamics_Model"],
    },
  },
  // ========== 整车能耗场景模型 - 公共库 ==========
  // 类别1: 车辆动力学模型
  {
    id: "10",
    name: "Longitudinal_Dynamics_Model",
    type: "Simulink",
    description:
      "纵向动力学模型，专注于车辆纵向运动特性仿真，包括加速、制动、坡道行驶等工况下的纵向力分析和能量需求计算。",
    uploader: "赵工",
    uploadTime: "2024-03-15 09:20:00",
    version: "1.5",
    project: "EV_Energy_Consumption",
    status: "已发布",
    downloads: 178,
    rating: 5,
    tags: ["longitudinal", "dynamics", "energy", "simulink"],
    isPublic: true,
    libraryType: "public",
    rflpCategory: "Physical",
    dependencies: {
      upstream: ["Vehicle_Dynamics_Model"],
      downstream: ["Aerodynamic_Drag_Model", "EV_Motor_Model"],
    },
  },
  {
    id: "11",
    name: "Vehicle_Mass_Inertia_Model",
    type: "Modelica",
    description:
      "车辆质量惯性模型，考虑整车质量、载荷变化、转动惯量等因素对能耗的影响，支持不同载荷工况下的能耗评估。",
    uploader: "钱工",
    uploadTime: "2024-03-18 14:30:00",
    version: "1.2",
    project: "EV_Energy_Consumption",
    status: "已发布",
    downloads: 134,
    rating: 4,
    tags: ["mass", "inertia", "load", "modelica"],
    isPublic: true,
    libraryType: "public",
    rflpCategory: "Physical",
    dependencies: {
      upstream: ["Longitudinal_Dynamics_Model"],
      downstream: ["Road_Load_Model"],
    },
  },
  // 类别2: 阻力与环境模型
  {
    id: "12",
    name: "Aerodynamic_Drag_Model",
    type: "Simulink",
    description:
      "空气动力学阻力模型，基于车辆外形参数(Cd值、迎风面积)和环境条件(空气密度、风速风向)计算空气阻力功率需求。",
    uploader: "孙工",
    uploadTime: "2024-03-20 10:15:00",
    version: "2.0",
    project: "Aerodynamics_Analysis",
    status: "已发布",
    downloads: 203,
    rating: 5,
    tags: ["aerodynamic", "drag", "Cd", "wind"],
    isPublic: true,
    libraryType: "public",
    rflpCategory: "Physical",
    dependencies: {
      upstream: ["Longitudinal_Dynamics_Model"],
      downstream: ["Energy_Flow_Integration_Model"],
    },
  },
  {
    id: "13",
    name: "Rolling_Resistance_Model",
    type: "Modelica",
    description:
      "滚动阻力模型，模拟轮胎与路面接触产生的滚阻力，考虑轮胎类型、胎压、路面材质、温度等因素对滚阻系数的影响。",
    uploader: "李工",
    uploadTime: "2024-03-22 11:45:00",
    version: "1.3",
    project: "Tire_Energy_Loss",
    status: "已发布",
    downloads: 167,
    rating: 4,
    tags: ["rolling-resistance", "tire", "road-friction"],
    isPublic: true,
    libraryType: "public",
    rflpCategory: "Physical",
    dependencies: {
      upstream: ["Vehicle_Mass_Inertia_Model"],
      downstream: ["Road_Load_Model"],
    },
  },
  {
    id: "14",
    name: "Road_Grade_Slope_Model",
    type: "Simulink",
    description:
      "道路坡度模型，模拟车辆在不同坡度路况下的重力分量和额外能量需求，支持上坡、下坡和坡度变化工况仿真。",
    uploader: "周工",
    uploadTime: "2024-03-25 08:30:00",
    version: "1.1",
    project: "Road_Condition_Analysis",
    status: "已发布",
    downloads: 145,
    rating: 4,
    tags: ["slope", "grade", "gravity", "road"],
    isPublic: true,
    libraryType: "public",
    rflpCategory: "Physical",
    dependencies: {
      upstream: ["Longitudinal_Dynamics_Model"],
      downstream: ["Energy_Flow_Integration_Model"],
    },
  },
  {
    id: "15",
    name: "Road_Load_Model",
    type: "Modelica",
    description:
      "综合道路载荷模型，整合空气阻力、滚动阻力、坡道阻力和加速阻力，计算车辆在给定工况下的总阻力功率需求。",
    uploader: "吴工",
    uploadTime: "2024-03-28 13:20:00",
    version: "2.1",
    project: "Total_Road_Load",
    status: "已发布",
    downloads: 189,
    rating: 5,
    tags: ["road-load", "total-resistance", "power-demand"],
    isPublic: true,
    libraryType: "public",
    rflpCategory: "Physical",
    dependencies: {
      upstream: ["Aerodynamic_Drag_Model", "Rolling_Resistance_Model", "Road_Grade_Slope_Model"],
      downstream: ["EV_Motor_Model"],
    },
  },
  {
    id: "16",
    name: "Environment_Climate_Model",
    type: "Simulink",
    description:
      "环境气候模型，模拟环境温度、湿度、气压、风况等气候因素对车辆能耗的综合影响，支持不同气候区域和季节的能耗评估。",
    uploader: "郑工",
    uploadTime: "2024-04-01 09:00:00",
    version: "1.4",
    project: "Climate_Impact_Analysis",
    status: "已发布",
    downloads: 156,
    rating: 4,
    tags: ["climate", "environment", "temperature", "weather"],
    isPublic: true,
    libraryType: "public",
    rflpCategory: "Physical",
    dependencies: {
      upstream: [],
      downstream: ["Aerodynamic_Drag_Model", "Battery_Thermal_Management_Model"],
    },
  },
  // 类别3: 驱动系统模型
  {
    id: "17",
    name: "EV_Motor_Model",
    type: "Simulink",
    description:
      "电动机模型，模拟永磁同步电机或感应电机的电气和机械特性，包括效率MAP、损耗分析(铜损、铁损、机械损耗)和动态响应。",
    uploader: "王工",
    uploadTime: "2024-04-05 10:30:00",
    version: "2.3",
    project: "Motor_System",
    status: "已发布",
    downloads: 234,
    rating: 5,
    tags: ["motor", "PMSM", "efficiency", "electric-drive"],
    isPublic: true,
    libraryType: "public",
    rflpCategory: "Physical",
    dependencies: {
      upstream: ["Longitudinal_Dynamics_Model", "Road_Load_Model"],
      downstream: ["Powertrain_Transmission_Model", "Battery_Electric_Model"],
    },
  },
  {
    id: "18",
    name: "Motor_Efficiency_Map_Model",
    type: "Modelica",
    description:
      "电机效率MAP模型，基于实验数据建立电机在不同转速-扭矩工作点下的效率图谱，用于精确计算电机能量损耗。",
    uploader: "冯工",
    uploadTime: "2024-04-08 14:15:00",
    version: "1.6",
    project: "Motor_Efficiency_Analysis",
    status: "已发布",
    downloads: 198,
    rating: 5,
    tags: ["efficiency-map", "motor", "lookup-table"],
    isPublic: true,
    libraryType: "public",
    rflpCategory: "Physical",
    dependencies: {
      upstream: ["EV_Motor_Model"],
      downstream: ["Energy_Flow_Integration_Model"],
    },
  },
  {
    id: "19",
    name: "Powertrain_Transmission_Model",
    type: "Simulink",
    description:
      "传动系统模型，模拟减速器、差速器、半轴等传动部件的传动效率、齿轮损耗和动力传递特性。",
    uploader: "陈工",
    uploadTime: "2024-04-10 11:00:00",
    version: "1.7",
    project: "Transmission_System",
    status: "已发布",
    downloads: 176,
    rating: 4,
    tags: ["transmission", "gearbox", "differential", "efficiency"],
    isPublic: true,
    libraryType: "public",
    rflpCategory: "Physical",
    dependencies: {
      upstream: ["EV_Motor_Model"],
      downstream: ["Longitudinal_Dynamics_Model"],
    },
  },
  {
    id: "20",
    name: "Regenerative_Braking_Model",
    type: "Simulink",
    description:
      "再生制动模型，模拟制动工况下的能量回收过程，包括制动力分配、电机发电效率、电池充电接受能力等因素。",
    uploader: "褚工",
    uploadTime: "2024-04-12 15:45:00",
    version: "2.0",
    project: "Energy_Recovery_System",
    status: "已发布",
    downloads: 211,
    rating: 5,
    tags: ["regenerative-braking", "energy-recovery", "deceleration"],
    isPublic: true,
    libraryType: "public",
    rflpCategory: "Functions",
    dependencies: {
      upstream: ["EV_Motor_Model", "Brake_Control_Strategy"],
      downstream: ["Battery_Electric_Model"],
    },
  },
  {
    id: "21",
    name: "Dual_Motor_AWD_Model",
    type: "Modelica",
    description:
      "双电机四驱系统模型，模拟前后双电机配置的全轮驱动系统，包括扭矩分配、能量管理和不同驱动模式切换。",
    uploader: "卫工",
    uploadTime: "2024-04-15 09:30:00",
    version: "1.3",
    project: "AWD_Powertrain",
    status: "已发布",
    downloads: 143,
    rating: 4,
    tags: ["dual-motor", "AWD", "torque-split", "4WD"],
    isPublic: true,
    libraryType: "public",
    rflpCategory: "Logical",
    dependencies: {
      upstream: ["EV_Motor_Model"],
      downstream: ["Torque_Vectoring_Control"],
    },
  },
  // 类别4: 电池系统模型
  {
    id: "22",
    name: "Battery_Electric_Model",
    type: "Simulink",
    description:
      "电池电气模型，基于等效电路法(ECM)建模，包括开路电压、内阻、RC网络，模拟电池的电压、电流、功率和能量特性。",
    uploader: "蒋工",
    uploadTime: "2024-04-18 10:00:00",
    version: "2.2",
    project: "Battery_Management_System",
    status: "已发布",
    downloads: 267,
    rating: 5,
    tags: ["battery", "ECM", "voltage", "SOC"],
    isPublic: true,
    libraryType: "public",
    rflpCategory: "Physical",
    dependencies: {
      upstream: ["EV_Motor_Model", "Regenerative_Braking_Model"],
      downstream: ["SOC_Estimation_Model", "Battery_Thermal_Model"],
    },
  },
  {
    id: "23",
    name: "SOC_Estimation_Model",
    type: "Simulink",
    description:
      "SOC估算模型，采用安时积分法结合卡尔曼滤波算法，精确估算电池荷电状态(SOC)和剩余能量(SOE)。",
    uploader: "沈工",
    uploadTime: "2024-04-20 13:30:00",
    version: "1.8",
    project: "BMS_Algorithm",
    status: "已发布",
    downloads: 223,
    rating: 5,
    tags: ["SOC", "SOE", "kalman-filter", "state-estimation"],
    isPublic: true,
    libraryType: "public",
    rflpCategory: "Functions",
    dependencies: {
      upstream: ["Battery_Electric_Model"],
      downstream: ["Range_Prediction_Model"],
    },
  },
  {
    id: "24",
    name: "Battery_Thermal_Model",
    type: "Modelica",
    description:
      "电池热模型，模拟电池单体和电池包的温度分布、热产生(焦耳热、极化热、反应热)和热传导过程。",
    uploader: "韩工",
    uploadTime: "2024-04-22 11:15:00",
    version: "1.9",
    project: "Battery_Thermal_Analysis",
    status: "已发布",
    downloads: 201,
    rating: 5,
    tags: ["battery-thermal", "temperature", "heat-generation"],
    isPublic: true,
    libraryType: "public",
    rflpCategory: "Physical",
    dependencies: {
      upstream: ["Battery_Electric_Model"],
      downstream: ["Battery_Thermal_Management_Model"],
    },
  },
  {
    id: "25",
    name: "Battery_Aging_Model",
    type: "Simulink",
    description:
      "电池老化模型，模拟电池容量衰减和内阻增长过程，考虑循环老化、日历老化、温度和SOC范围对电池寿命的影响。",
    uploader: "杨工",
    uploadTime: "2024-04-25 14:45:00",
    version: "1.4",
    project: "Battery_Life_Prediction",
    status: "已发布",
    downloads: 178,
    rating: 4,
    tags: ["aging", "degradation", "lifetime", "capacity-fade"],
    isPublic: true,
    libraryType: "public",
    rflpCategory: "Physical",
    dependencies: {
      upstream: ["Battery_Electric_Model", "Battery_Thermal_Model"],
      downstream: ["Battery_Health_Monitor"],
    },
  },
  // 类别5: 热管理系统模型
  {
    id: "26",
    name: "Battery_Thermal_Management_Model",
    type: "Modelica",
    description:
      "电池热管理系统模型，模拟液冷/风冷系统对电池包的冷却和加热控制，包括冷却液循环、热交换器、冷却功率计算。",
    uploader: "朱工",
    uploadTime: "2024-04-28 09:00:00",
    version: "2.1",
    project: "Battery_Cooling_System",
    status: "已发布",
    downloads: 245,
    rating: 5,
    tags: ["thermal-management", "cooling", "BTMS", "liquid-cooling"],
    isPublic: true,
    libraryType: "public",
    rflpCategory: "Physical",
    dependencies: {
      upstream: ["Battery_Thermal_Model", "Environment_Climate_Model"],
      downstream: ["HVAC_System_Model"],
    },
  },
  {
    id: "27",
    name: "Motor_Cooling_Model",
    type: "Simulink",
    description:
      "电机冷却模型，模拟电机和功率电子器件的热管理系统，包括水冷散热器、风冷系统和热负荷计算。",
    uploader: "秦工",
    uploadTime: "2024-05-01 10:30:00",
    version: "1.5",
    project: "Motor_Thermal_System",
    status: "已发布",
    downloads: 167,
    rating: 4,
    tags: ["motor-cooling", "inverter", "thermal", "power-electronics"],
    isPublic: true,
    libraryType: "public",
    rflpCategory: "Physical",
    dependencies: {
      upstream: ["EV_Motor_Model"],
      downstream: ["HVAC_System_Model"],
    },
  },
  {
    id: "28",
    name: "HVAC_System_Model",
    type: "Modelica",
    description:
      "空调系统模型(HVAC)，模拟乘员舱空调制冷/制热功率需求，包括压缩机、蒸发器、冷凝器、PTC加热器和热泵系统。",
    uploader: "尤工",
    uploadTime: "2024-05-03 13:15:00",
    version: "2.0",
    project: "Cabin_Climate_Control",
    status: "已发布",
    downloads: 212,
    rating: 5,
    tags: ["HVAC", "air-conditioning", "cabin", "heat-pump"],
    isPublic: true,
    libraryType: "public",
    rflpCategory: "Physical",
    dependencies: {
      upstream: ["Battery_Thermal_Management_Model", "Motor_Cooling_Model", "Environment_Climate_Model"],
      downstream: ["Energy_Flow_Integration_Model"],
    },
  },
  {
    id: "29",
    name: "Heat_Pump_System_Model",
    type: "Simulink",
    description:
      "热泵系统模型，模拟热泵技术在低温环境下的高效加热性能，计算COP(性能系数)和能耗节约效果。",
    uploader: "许工",
    uploadTime: "2024-05-05 11:45:00",
    version: "1.3",
    project: "Heat_Pump_Technology",
    status: "已发布",
    downloads: 134,
    rating: 4,
    tags: ["heat-pump", "COP", "heating", "energy-saving"],
    isPublic: true,
    libraryType: "public",
    rflpCategory: "Physical",
    dependencies: {
      upstream: ["HVAC_System_Model"],
      downstream: ["Thermal_Management_Control"],
    },
  },
  // 类别6: 能量管理与控制策略
  {
    id: "30",
    name: "Energy_Management_Strategy_ECMS",
    type: "Simulink",
    description:
      "基于等效燃油消耗最小化策略(ECMS)的能量管理模型，实时优化功率分配以最小化等效能耗。",
    uploader: "何工",
    uploadTime: "2024-05-08 09:30:00",
    version: "2.2",
    project: "EMS_Optimization",
    status: "已发布",
    downloads: 189,
    rating: 5,
    tags: ["ECMS", "energy-management", "optimization", "real-time"],
    isPublic: true,
    libraryType: "public",
    rflpCategory: "Functions",
    dependencies: {
      upstream: ["EV_Motor_Model", "Battery_Electric_Model"],
      downstream: ["Energy_Flow_Integration_Model"],
    },
  },
  {
    id: "31",
    name: "MPC_Energy_Control",
    type: "Simulink",
    description:
      "模型预测控制(MPC)能量管理模型，基于预测时域优化未来一段时间的功率分配和能量使用策略。",
    uploader: "吕工",
    uploadTime: "2024-05-10 14:00:00",
    version: "1.7",
    project: "Advanced_EMS",
    status: "已发布",
    downloads: 156,
    rating: 5,
    tags: ["MPC", "predictive-control", "optimization", "energy"],
    isPublic: true,
    libraryType: "public",
    rflpCategory: "Functions",
    dependencies: {
      upstream: ["Energy_Management_Strategy_ECMS", "Driving_Cycle_Model"],
      downstream: ["Range_Prediction_Model"],
    },
  },
  {
    id: "32",
    name: "Brake_Control_Strategy",
    type: "Simulink",
    description:
      "制动控制策略模型，协调机械制动和再生制动，最大化能量回收的同时保证制动安全性和舒适性。",
    uploader: "施工",
    uploadTime: "2024-05-12 10:15:00",
    version: "1.6",
    project: "Brake_System_Control",
    status: "已发布",
    downloads: 178,
    rating: 4,
    tags: ["brake-control", "regen", "blending", "safety"],
    isPublic: true,
    libraryType: "public",
    rflpCategory: "Functions",
    dependencies: {
      upstream: ["Regenerative_Braking_Model"],
      downstream: ["Energy_Management_Strategy_ECMS"],
    },
  },
  {
    id: "33",
    name: "Thermal_Management_Control",
    type: "Modelica",
    description:
      "热管理控制策略模型，智能调节电池加热/冷却、电机冷却和乘员舱空调，平衡热舒适性和能效。",
    uploader: "张工",
    uploadTime: "2024-05-15 13:30:00",
    version: "1.8",
    project: "TMS_Control",
    status: "已发布",
    downloads: 145,
    rating: 4,
    tags: ["thermal-control", "TMS", "temperature-regulation"],
    isPublic: true,
    libraryType: "public",
    rflpCategory: "Functions",
    dependencies: {
      upstream: ["Battery_Thermal_Management_Model", "HVAC_System_Model", "Heat_Pump_System_Model"],
      downstream: ["Energy_Flow_Integration_Model"],
    },
  },
  {
    id: "34",
    name: "Torque_Vectoring_Control",
    type: "Simulink",
    description:
      "扭矩矢量控制模型，适用于双电机或多电机配置，动态分配前后轴或左右轮扭矩以优化操控性能和能效。",
    uploader: "孔工",
    uploadTime: "2024-05-18 11:00:00",
    version: "1.4",
    project: "AWD_Control_System",
    status: "已发布",
    downloads: 123,
    rating: 4,
    tags: ["torque-vectoring", "AWD-control", "handling", "stability"],
    isPublic: true,
    libraryType: "public",
    rflpCategory: "Functions",
    dependencies: {
      upstream: ["Dual_Motor_AWD_Model"],
      downstream: ["Energy_Management_Strategy_ECMS"],
    },
  },
  // 类别7: 驾驶工况模型
  {
    id: "35",
    name: "Driving_Cycle_Model",
    type: "Simulink",
    description:
      "驾驶循环工况模型，包含NEDC、WLTC、CLTC等标准测试循环和自定义工况的速度-时间曲线生成。",
    uploader: "曹工",
    uploadTime: "2024-05-20 09:45:00",
    version: "2.3",
    project: "Standard_Cycles",
    status: "已发布",
    downloads: 298,
    rating: 5,
    tags: ["driving-cycle", "WLTC", "CLTC", "NEDC"],
    isPublic: true,
    libraryType: "public",
    rflpCategory: "Physical",
    dependencies: {
      upstream: [],
      downstream: ["Longitudinal_Dynamics_Model", "MPC_Energy_Control"],
    },
  },
  {
    id: "36",
    name: "Urban_Driving_Scenario",
    type: "Simulink",
    description:
      "城市工况模型，模拟频繁启停、低速行驶、交通拥堵等典型城市驾驶场景，用于城市能耗评估。",
    uploader: "严工",
    uploadTime: "2024-05-22 14:20:00",
    version: "1.5",
    project: "Real_World_Scenarios",
    status: "已发布",
    downloads: 176,
    rating: 4,
    tags: ["urban", "city-driving", "stop-and-go", "congestion"],
    isPublic: true,
    libraryType: "public",
    rflpCategory: "Physical",
    dependencies: {
      upstream: ["Driving_Cycle_Model"],
      downstream: ["Energy_Flow_Integration_Model"],
    },
  },
  {
    id: "37",
    name: "Highway_Driving_Scenario",
    type: "Simulink",
    description:
      "高速公路工况模型，模拟高速匀速行驶、高速加减速等工况，评估高速巡航能耗和续航表现。",
    uploader: "华工",
    uploadTime: "2024-05-25 10:00:00",
    version: "1.4",
    project: "Real_World_Scenarios",
    status: "已发布",
    downloads: 167,
    rating: 4,
    tags: ["highway", "cruise", "high-speed", "long-distance"],
    isPublic: true,
    libraryType: "public",
    rflpCategory: "Physical",
    dependencies: {
      upstream: ["Driving_Cycle_Model"],
      downstream: ["Energy_Flow_Integration_Model"],
    },
  },
  {
    id: "38",
    name: "Mountain_Road_Scenario",
    type: "Modelica",
    description:
      "山区道路工况模型，模拟连续上下坡、弯道行驶等复杂路况，评估坡道对能耗和再生制动的影响。",
    uploader: "金工",
    uploadTime: "2024-05-28 11:30:00",
    version: "1.2",
    project: "Complex_Road_Conditions",
    status: "已发布",
    downloads: 134,
    rating: 4,
    tags: ["mountain", "slope", "elevation", "winding-road"],
    isPublic: true,
    libraryType: "public",
    rflpCategory: "Physical",
    dependencies: {
      upstream: ["Road_Grade_Slope_Model"],
      downstream: ["Energy_Flow_Integration_Model"],
    },
  },
  {
    id: "39",
    name: "Real_World_Traffic_Model",
    type: "Simulink",
    description:
      "真实交通流模型，基于实际道路数据和交通状态模拟随机性驾驶行为，用于更贴近实际的能耗预测。",
    uploader: "魏工",
    uploadTime: "2024-05-30 15:00:00",
    version: "1.3",
    project: "Traffic_Simulation",
    status: "已发布",
    downloads: 145,
    rating: 4,
    tags: ["real-world", "traffic", "stochastic", "data-driven"],
    isPublic: true,
    libraryType: "public",
    rflpCategory: "Physical",
    dependencies: {
      upstream: ["Driving_Cycle_Model"],
      downstream: ["Range_Prediction_Model"],
    },
  },
  // 类别8: 系统耦合与能量流模型
  {
    id: "40",
    name: "Energy_Flow_Integration_Model",
    type: "Modelica",
    description:
      "能量流整合模型，耦合车辆动力学、驱动系统、电池、热管理等所有子系统，跟踪全链路能量流动和损耗分布。",
    uploader: "陶工",
    uploadTime: "2024-06-02 09:15:00",
    version: "2.5",
    project: "System_Integration",
    status: "已发布",
    downloads: 312,
    rating: 5,
    tags: ["energy-flow", "system-integration", "co-simulation"],
    isPublic: true,
    libraryType: "public",
    rflpCategory: "Logical",
    dependencies: {
      upstream: ["Aerodynamic_Drag_Model", "EV_Motor_Model", "Battery_Electric_Model", "HVAC_System_Model", "Energy_Management_Strategy_ECMS", "Thermal_Management_Control"],
      downstream: ["Range_Prediction_Model"],
    },
  },
  {
    id: "41",
    name: "Forward_Simulation_Model",
    type: "Simulink",
    description:
      "前向仿真模型，从驾驶员输入出发，正向计算车辆响应和能量需求，适用于动力性能和能耗联合仿真。",
    uploader: "姜工",
    uploadTime: "2024-06-05 10:45:00",
    version: "1.9",
    project: "Simulation_Framework",
    status: "已发布",
    downloads: 234,
    rating: 5,
    tags: ["forward-simulation", "driver-model", "vehicle-response"],
    isPublic: true,
    libraryType: "public",
    rflpCategory: "Logical",
    dependencies: {
      upstream: ["Driving_Cycle_Model", "Energy_Flow_Integration_Model"],
      downstream: ["Range_Prediction_Model"],
    },
  },
  {
    id: "42",
    name: "Backward_Simulation_Model",
    type: "Simulink",
    description:
      "后向仿真模型，从车辆运动需求反推各部件功率和能量消耗，计算速度快，适用于快速能耗评估。",
    uploader: "戚工",
    uploadTime: "2024-06-08 13:00:00",
    version: "1.6",
    project: "Simulation_Framework",
    status: "已发布",
    downloads: 201,
    rating: 4,
    tags: ["backward-simulation", "quasi-static", "fast-computation"],
    isPublic: true,
    libraryType: "public",
    rflpCategory: "Logical",
    dependencies: {
      upstream: ["Driving_Cycle_Model", "Motor_Efficiency_Map_Model"],
      downstream: ["Range_Prediction_Model"],
    },
  },
  {
    id: "43",
    name: "Range_Prediction_Model",
    type: "Modelica",
    description:
      "续航预测模型，综合当前SOC、历史能耗、未来路况、驾驶习惯等因素，动态预测剩余续航里程。",
    uploader: "谢工",
    uploadTime: "2024-06-10 11:20:00",
    version: "2.0",
    project: "Range_Estimation",
    status: "已发布",
    downloads: 267,
    rating: 5,
    tags: ["range-prediction", "SOC", "remaining-range", "estimation"],
    isPublic: true,
    libraryType: "public",
    rflpCategory: "Functions",
    dependencies: {
      upstream: ["SOC_Estimation_Model", "Energy_Flow_Integration_Model", "MPC_Energy_Control", "Real_World_Traffic_Model"],
      downstream: [],
    },
  },
  // 类别9: 寿命与老化模型
  {
    id: "44",
    name: "Battery_Cycle_Aging_Model",
    type: "Simulink",
    description:
      "电池循环老化模型，基于充放电循环次数、DOD深度、C-rate倍率等因素模拟电池容量衰减过程。",
    uploader: "邹工",
    uploadTime: "2024-06-12 14:30:00",
    version: "1.5",
    project: "Battery_Degradation",
    status: "已发布",
    downloads: 189,
    rating: 4,
    tags: ["cycle-aging", "degradation", "DOD", "C-rate"],
    isPublic: true,
    libraryType: "public",
    rflpCategory: "Physical",
    dependencies: {
      upstream: ["Battery_Electric_Model", "Battery_Aging_Model"],
      downstream: ["Battery_Life_Prediction_Model"],
    },
  },
  {
    id: "45",
    name: "Battery_Calendar_Aging_Model",
    type: "Modelica",
    description:
      "电池日历老化模型，模拟电池在静置状态下随时间和温度的自然老化，考虑存储SOC和环境温度影响。",
    uploader: "屈工",
    uploadTime: "2024-06-15 09:00:00",
    version: "1.3",
    project: "Battery_Degradation",
    status: "已发布",
    downloads: 156,
    rating: 4,
    tags: ["calendar-aging", "storage", "time-degradation"],
    isPublic: true,
    libraryType: "public",
    rflpCategory: "Physical",
    dependencies: {
      upstream: ["Battery_Electric_Model", "Battery_Thermal_Model"],
      downstream: ["Battery_Life_Prediction_Model"],
    },
  },
  {
    id: "46",
    name: "Battery_Life_Prediction_Model",
    type: "Simulink",
    description:
      "电池寿命预测模型，综合循环老化和日历老化，预测电池剩余寿命(RUL)和容量衰减趋势。",
    uploader: "卞工",
    uploadTime: "2024-06-18 10:30:00",
    version: "1.7",
    project: "Battery_Prognostics",
    status: "已发布",
    downloads: 223,
    rating: 5,
    tags: ["life-prediction", "RUL", "prognostics", "SOH"],
    isPublic: true,
    libraryType: "public",
    rflpCategory: "Functions",
    dependencies: {
      upstream: ["Battery_Cycle_Aging_Model", "Battery_Calendar_Aging_Model"],
      downstream: [],
    },
  },
  {
    id: "47",
    name: "Battery_Health_Monitor",
    type: "Simulink",
    description:
      "电池健康监测模型，实时监测电池SOH(健康状态)、内阻增长、容量衰减等指标，用于电池状态评估。",
    uploader: "宫工",
    uploadTime: "2024-06-20 13:15:00",
    version: "1.4",
    project: "BMS_Diagnostics",
    status: "已发布",
    downloads: 198,
    rating: 4,
    tags: ["SOH", "health-monitoring", "diagnostics", "impedance"],
    isPublic: true,
    libraryType: "public",
    rflpCategory: "Functions",
    dependencies: {
      upstream: ["Battery_Aging_Model"],
      downstream: ["Battery_Life_Prediction_Model"],
    },
  },
];

// 模拟个人模型库数据 - 包含已发布状态的模型
const initialPersonalModels: Model[] = [
  {
    id: "5",
    name: "Private_SysML_ClimateControl",
    type: "SysML",
    description:
      "电池热管理系统模型，用于电池热管理与气候控制系统的集成仿真。基于RFLP Physical层的详细物理建模。",
    uploader: "王五",
    uploadTime: "2024-01-01 08:00:00",
    version: "0.1",
    project: "N/A",
    status: "草稿",
    downloads: 0,
    rating: 0,
    tags: ["SysML", "HVAC", "Private"],
    isPublic: false,
    libraryType: "personal", // 个人库模型
    rflpCategory: "Physical",
    dependencies: {
      upstream: ["BatteryThermalModel"],
      downstream: [],
    },
  },
  {
    id: "6",
    name: "BatteryThermalModel",
    type: "Modelica",
    description:
      "Thermal model for the main battery pack. 基于Modelica的多物理域建模，实现电池热特性的精确仿真。",
    uploader: "王五",
    uploadTime: "2023-11-06 08:00:00",
    version: "1.0",
    project: "Project_Gamma",
    status: "审核中",
    downloads: 12,
    rating: 3,
    tags: ["Battery", "Thermal", "Modelica"],
    isPublic: false,
    libraryType: "personal", // 个人库模型
    rflpCategory: "Physical",
    dependencies: {
      upstream: ["Vehicle_Dynamics_Model"],
      downstream: ["Private_SysML_ClimateControl"],
    },
  },
  {
    id: "7",
    name: "Functional_Requirements_EV_Powertrain",
    type: "Requirements",
    description:
      "电动汽车动力总成功能需求模型，基于RFLP架构Requirements层的需求分析和管理。",
    uploader: "王五",
    uploadTime: "2024-02-12 09:30:00",
    version: "1.5",
    project: "EV_Development",
    status: "草稿",
    downloads: 3,
    rating: 0,
    tags: ["requirements", "powertrain", "ev", "functional"],
    isPublic: false,
    libraryType: "personal", // 个人库模型
    rflpCategory: "Requirements",
    dependencies: {
      upstream: [],
      downstream: ["BatteryThermalModel"],
    },
  },
  {
    id: "8",
    name: "Advanced_Battery_Controller",
    type: "Simulink",
    description:
      "先进电池控制器模型，实现电池管理系统的智能控制策略，包含SOC估算、热管理和安全保护功能。",
    uploader: "王五",
    uploadTime: "2024-01-20 15:45:00",
    version: "2.0",
    project: "Battery_Innovation",
    status: "已发布",
    downloads: 156,
    rating: 4,
    tags: ["battery", "controller", "simulink", "bms"],
    isPublic: false,
    libraryType: "personal", // 个人库模型
    rflpCategory: "Functions",
    dependencies: {
      upstream: ["BatteryThermalModel"],
      downstream: [],
    },
    projectApplications: [
      {
        id: 1,
        name: "新能源汽车动力系统开发",
        status: "进行中",
        useCount: 45,
        lastUsed: "2025-10-18",
        team: "动力系统组",
        description: "混合动力和纯电动汽车的动力总成系统设计与仿真"
      },
      {
        id: 2,
        name: "智能驾驶ADAS系统验证",
        status: "进行中",
        useCount: 32,
        lastUsed: "2025-10-17",
        team: "智能驾驶组",
        description: "L3级自动驾驶辅助系统的功能验证和测试"
      },
      {
        id: 3,
        name: "车身轻量化设计优化",
        status: "已完成",
        useCount: 28,
        lastUsed: "2025-10-15",
        team: "车身工程组",
        description: "采用先进材料实现车身轻量化目标"
      },
      {
        id: 4,
        name: "底盘悬挂系统调校",
        status: "进行中",
        useCount: 19,
        lastUsed: "2025-10-19",
        team: "底盘研发组",
        description: "悬挂系统参数优化，提升操控性能"
      },
      {
        id: 5,
        name: "电池热管理系统优化",
        status: "进行中",
        useCount: 17,
        lastUsed: "2025-10-16",
        team: "电池系统组",
        description: "提高电池包热管理效率和安全性"
      },
      {
        id: 6,
        name: "整车NVH性能提升",
        status: "计划中",
        useCount: 8,
        lastUsed: "2025-10-10",
        team: "NVH工程组",
        description: "降低车辆噪声、振动和声振粗糙度"
      },
      {
        id: 7,
        name: "碰撞安全性能优化",
        status: "进行中",
        useCount: 5,
        lastUsed: "2025-10-14",
        team: "安全工程组",
        description: "提升整车碰撞安全性能，满足五星标准"
      },
      {
        id: 8,
        name: "燃料电池系统集成",
        status: "计划中",
        useCount: 2,
        lastUsed: "2025-10-08",
        team: "新能源研发组",
        description: "氢燃料电池汽车动力系统的集成开发"
      }
    ]
  },
  {
    id: "9",
    name: "HybridPowertrain_SystemModel",
    type: "SysML",
    description:
      "混合动力总成系统模型，基于SysML建模的混合动力汽车动力总成架构设计和控制策略模型。",
    uploader: "王五",
    uploadTime: "2024-02-01 10:20:00",
    version: "1.3",
    project: "Hybrid_Development",
    status: "已发布",
    downloads: 89,
    rating: 5,
    tags: ["hybrid", "powertrain", "sysml", "architecture"],
    isPublic: false,
    libraryType: "personal", // 个人库模型
    rflpCategory: "Logical",
    dependencies: {
      upstream: ["Functional_Requirements_EV_Powertrain"],
      downstream: ["Advanced_Battery_Controller"],
    },
    projectApplications: [
      {
        id: 1,
        name: "插电式混动车型开发",
        status: "进行中",
        useCount: 34,
        lastUsed: "2025-10-19",
        team: "PHEV项目组",
        description: "新一代插电式混合动力车型的动力总成系统架构设计"
      },
      {
        id: 2,
        name: "混动控制策略优化",
        status: "进行中",
        useCount: 28,
        lastUsed: "2025-10-18",
        team: "混动标定团队",
        description: "优化混合动力模式切换策略，提升能量利用效率"
      },
      {
        id: 3,
        name: "电池寿命延长项目",
        status: "已完成",
        useCount: 15,
        lastUsed: "2025-10-12",
        team: "电池系统组",
        description: "通过优化功率分配策略延长动力电池使用寿命"
      },
      {
        id: 4,
        name: "混动系统NVH优化",
        status: "进行中",
        useCount: 12,
        lastUsed: "2025-10-16",
        team: "NVH优化组",
        description: "降低混动模式切换时的振动和噪声"
      }
    ]
  },
  // ========== 整车能耗场景模型 - 个人库 ==========
  {
    id: "48",
    name: "Custom_Energy_Consumption_Analysis",
    type: "Simulink",
    description:
      "定制化能耗分析模型，针对特定车型和使用场景的能耗评估工具，整合多个子系统模型进行综合分析。",
    uploader: "王五",
    uploadTime: "2024-06-25 10:00:00",
    version: "0.8",
    project: "Personal_EV_Project",
    status: "草稿",
    downloads: 0,
    rating: 0,
    tags: ["energy-analysis", "custom", "integration"],
    isPublic: false,
    libraryType: "personal",
    rflpCategory: "Logical",
    dependencies: {
      upstream: ["Energy_Flow_Integration_Model", "Battery_Electric_Model"],
      downstream: [],
    },
  },
  {
    id: "49",
    name: "Winter_Energy_Consumption_Model",
    type: "Modelica",
    description:
      "冬季能耗模型，专门研究低温环境下电池性能下降、加热功耗增加对整车能耗和续航的影响。",
    uploader: "王五",
    uploadTime: "2024-07-01 14:30:00",
    version: "1.1",
    project: "Winter_Performance",
    status: "审核中",
    downloads: 5,
    rating: 0,
    tags: ["winter", "cold-weather", "heating", "range-loss"],
    isPublic: false,
    libraryType: "personal",
    rflpCategory: "Physical",
    dependencies: {
      upstream: ["Environment_Climate_Model", "Battery_Thermal_Model", "Heat_Pump_System_Model"],
      downstream: [],
    },
  },
  {
    id: "50",
    name: "Fast_Charging_Thermal_Impact_Model",
    type: "Simulink",
    description:
      "快充热影响模型，研究大功率快充过程中的电池发热、温升和热管理需求，评估快充对电池寿命的影响。",
    uploader: "王五",
    uploadTime: "2024-07-05 11:15:00",
    version: "0.9",
    project: "Fast_Charging_Research",
    status: "草稿",
    downloads: 0,
    rating: 0,
    tags: ["fast-charging", "thermal", "battery-heating", "degradation"],
    isPublic: false,
    libraryType: "personal",
    rflpCategory: "Physical",
    dependencies: {
      upstream: ["Battery_Electric_Model", "Battery_Thermal_Model", "Battery_Aging_Model"],
      downstream: [],
    },
  },
  {
    id: "51",
    name: "Eco_Driving_Strategy_Optimization",
    type: "Simulink",
    description:
      "经济驾驶策略优化模型，基于实时路况和电池状态，优化驾驶策略以最大化续航里程。",
    uploader: "王五",
    uploadTime: "2024-07-10 09:45:00",
    version: "1.2",
    project: "Eco_Driving_Research",
    status: "已发布",
    downloads: 23,
    rating: 4,
    tags: ["eco-driving", "range-extension", "optimization", "driver-assistance"],
    isPublic: false,
    libraryType: "personal",
    rflpCategory: "Functions",
    dependencies: {
      upstream: ["MPC_Energy_Control", "Range_Prediction_Model"],
      downstream: [],
    },
    projectApplications: [
      {
        id: 1,
        name: "节能驾驶辅助系统开发",
        status: "进行中",
        useCount: 18,
        lastUsed: "2025-10-19",
        team: "智能驾驶辅助组",
        description: "开发基于MPC的实时节能驾驶建议系统"
      },
      {
        id: 2,
        name: "续航优化算法验证",
        status: "进行中",
        useCount: 12,
        lastUsed: "2025-10-17",
        team: "能量管理团队",
        description: "验证经济驾驶策略对续航里程的提升效果"
      }
    ]
  },
  {
    id: "52",
    name: "Multi_Motor_Efficiency_Optimization",
    type: "Modelica",
    description:
      "多电机效率优化模型，针对双电机或三电机配置，优化不同工况下的电机工作点选择和功率分配。",
    uploader: "王五",
    uploadTime: "2024-07-15 13:00:00",
    version: "0.7",
    project: "Multi_Motor_Control",
    status: "草稿",
    downloads: 0,
    rating: 0,
    tags: ["multi-motor", "efficiency", "power-distribution", "optimization"],
    isPublic: false,
    libraryType: "personal",
    rflpCategory: "Functions",
    dependencies: {
      upstream: ["Dual_Motor_AWD_Model", "Motor_Efficiency_Map_Model"],
      downstream: [],
    },
  },
  {
    id: "53",
    name: "Real_Time_Range_Estimator",
    type: "Simulink",
    description:
      "实时续航估算器，集成GPS、路况预测、驾驶习惯学习等功能，提供动态精确的剩余续航估计。",
    uploader: "王五",
    uploadTime: "2024-07-20 10:30:00",
    version: "1.0",
    project: "Range_Anxiety_Solution",
    status: "已发布",
    downloads: 34,
    rating: 5,
    tags: ["range-estimator", "real-time", "GPS", "machine-learning"],
    isPublic: false,
    libraryType: "personal",
    rflpCategory: "Functions",
    dependencies: {
      upstream: ["Range_Prediction_Model", "Real_World_Traffic_Model", "SOC_Estimation_Model"],
      downstream: [],
    },
    projectApplications: [
      {
        id: 1,
        name: "智能续航显示系统",
        status: "进行中",
        useCount: 27,
        lastUsed: "2025-10-18",
        team: "用户体验组",
        description: "开发更精准的续航显示和路径规划功能"
      },
      {
        id: 2,
        name: "充电站推荐算法",
        status: "已完成",
        useCount: 15,
        lastUsed: "2025-10-14",
        team: "车联网团队",
        description: "基于实时续航预测推荐最优充电站"
      },
      {
        id: 3,
        name: "里程焦虑缓解项目",
        status: "进行中",
        useCount: 9,
        lastUsed: "2025-10-16",
        team: "产品规划部",
        description: "通过精准续航预测降低用户里程焦虑"
      }
    ]
  },
  {
    id: "54",
    name: "Battery_Preconditioning_Strategy",
    type: "Simulink",
    description:
      "电池预调温策略模型，在充电前或驾驶前对电池进行预热或预冷，优化充电性能和驾驶能效。",
    uploader: "王五",
    uploadTime: "2024-07-25 15:20:00",
    version: "0.6",
    project: "Thermal_Preconditioning",
    status: "草稿",
    downloads: 0,
    rating: 0,
    tags: ["preconditioning", "thermal-prep", "charging-optimization"],
    isPublic: false,
    libraryType: "personal",
    rflpCategory: "Functions",
    dependencies: {
      upstream: ["Battery_Thermal_Management_Model", "Thermal_Management_Control"],
      downstream: [],
    },
  },
];

const modelTypes = [
  { id: "All Types", name: "All Types", count: 54 },
  { id: "Simulink", name: "Simulink", count: 29 },
  { id: "SysML", name: "SysML", count: 4 },
  { id: "Modelica", name: "Modelica", count: 19 },
  { id: "Requirements", name: "Requirements", count: 2 },
];

const rflpCategories = [
  {
    id: "Requirements",
    name: "需求层 (Requirements)",
    icon: FileText,
    color: "blue",
  },
  {
    id: "Functions",
    name: "功能层 (Functions)",
    icon: Settings,
    color: "green",
  },
  {
    id: "Logical",
    name: "逻辑层 (Logical)",
    icon: Grid,
    color: "purple",
  },
  {
    id: "Physical",
    name: "物理层 (Physical)",
    icon: Archive,
    color: "orange",
  },
];

const modelTags = [
  "#core-component",
  "#vehicle-dynamics",
  "#simulink",
  "#physical-layer",
  "#engine",
  "#control-logic",
  "#fuel-injection",
  "#functions",
  "#requirements",
  "#traceability",
  "#sysml",
  "#mbse",
  "#logical-architecture",
  "#interface-design",
  "#battery",
  "#thermal",
  "#climate-control",
  "#modelica",
  "#multi-physics",
  "#powertrain",
  "#ev",
  "#functional",
];

// 表格列配置
interface TableColumn {
  id: string;
  label: string;
  width: number;
  visible: boolean;
  resizable: boolean;
}

const defaultColumns: TableColumn[] = [
  {
    id: "checkbox",
    label: "",
    width: 60,
    visible: true,
    resizable: false,
  },
  {
    id: "name",
    label: "模型名称",
    width: 250,
    visible: true,
    resizable: true,
  },
  {
    id: "type",
    label: "类型",
    width: 120,
    visible: true,
    resizable: true,
  },
  {
    id: "description",
    label: "描述",
    width: 300,
    visible: true,
    resizable: true,
  },
  {
    id: "dependencies",
    label: "依赖关系",
    width: 180,
    visible: true,
    resizable: true,
  },
  {
    id: "uploader",
    label: "上传者",
    width: 120,
    visible: true,
    resizable: true,
  },
  {
    id: "uploadTime",
    label: "上传时间",
    width: 150,
    visible: true,
    resizable: true,
  },
  {
    id: "status",
    label: "状态",
    width: 120,
    visible: true,
    resizable: true,
  },
  {
    id: "version",
    label: "版本",
    width: 100,
    visible: true,
    resizable: true,
  },
  {
    id: "project",
    label: "所属项目",
    width: 150,
    visible: true,
    resizable: true,
  },
  {
    id: "rating",
    label: "评级",
    width: 120,
    visible: true,
    resizable: true,
  },
  {
    id: "actions",
    label: "操作",
    width: 180,
    visible: true,
    resizable: false,
  },
];

export function ModelManagement({
  onModelClick,
  userRole,
}: ModelManagementProps) {
  const [activeTab, setActiveTab] = useState<
    "public" | "personal" | "project"
  >("public");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([
    "All Types",
  ]);
  const [selectedTags, setSelectedTags] = useState<string[]>(
    [],
  );
  const [selectedRFLPCategory, setSelectedRFLPCategory] =
    useState<string>("");
  const [viewMode, setViewMode] = useState<"list" | "grid">(
    "list",
  );
  
  // 项目库视角切换状态 - 默认为项目视角
  const [projectLibraryView, setProjectLibraryView] = useState<"project" | "model">("project");

  // 模型数据状态管理
  const [publicModels, setPublicModels] = useState<Model[]>(initialPublicModels);
  const [personalModels, setPersonalModels] = useState<Model[]>(initialPersonalModels);
  const [projectModels, setProjectModels] = useState<Model[]>([
    // 项目库初始数据 - 只有EngineControl_V2是项目库模型
    {
      ...(initialPublicModels.find(m => m.id === "2") as Model),
      libraryType: "project" as const,
      // 添加项目应用信息
      projectApplications: [
        {
          id: 1,
          name: "发动机控制系统集成项目",
          status: "进行中",
          useCount: 28,
          lastUsed: "2025-10-19",
          team: "发动机控制组",
          description: "集成燃油喷射控制算法到整车控制系统"
        },
        {
          id: 2,
          name: "排放优化验证项目",
          status: "进行中",
          useCount: 15,
          lastUsed: "2025-10-18",
          team: "排放测试组",
          description: "优化燃油喷射策略以降低排放"
        },
        {
          id: 3,
          name: "国六B标准适配",
          status: "已完成",
          useCount: 42,
          lastUsed: "2025-10-15",
          team: "法规合规组",
          description: "完成国六B排放标准的适配工作"
        }
      ]
    }
  ].filter(Boolean));

  // 使用 ref 来跟踪是否正在同步，防止无限循环
  const isSyncingRef = useRef(false);

  // 同步个人库已发布模型到项目库
  useEffect(() => {
    if (isSyncingRef.current) return;
    
    // 找出所有个人库中已发布的模型
    const publishedPersonalModels = personalModels.filter(
      model => model.status === "已发布" && model.libraryType === "personal"
    );

    // 更新项目库：保留原有项目库模型，并添加个人库已发布模型的镜像
    setProjectModels(prevProjectModels => {
      // 保留原始的项目库模型（非镜像且非来自个人库）
      const originalProjectModels = prevProjectModels.filter(
        model => !model.isMirror && model.id === "2" // 只保留原始的EngineControl_V2
      );

      // 创建个人库已发布模型的镜像，并保留原有的projectApplications数据
      const mirroredModels = publishedPersonalModels.map(model => {
        // 查找之前的镜像模型，保留其projectApplications数据
        const existingMirror = prevProjectModels.find(
          m => m.isMirror && m.originalId === model.id
        );
        
        return {
          ...model,
          id: `mirror-${model.id}`, // 添加镜像标识
          libraryType: "project" as const,
          originalId: model.id, // 保存原始模型ID
          isMirror: true, // 标记为镜像模型
          // 保留项目库镜像中的projectApplications数据
          projectApplications: existingMirror?.projectApplications || model.projectApplications || [],
        };
      });

      // 合并原始项目库模型和镜像模型
      return [...originalProjectModels, ...mirroredModels];
    });
  }, [personalModels]);

  // 获取模型的完整信息（包括从镜像获取的projectApplications）
  const getEnrichedModel = useCallback((model: Model) => {
    // 如果是个人库的已发布模型，尝试从项目库镜像获取projectApplications
    if (model.libraryType === "personal" && model.status === "已发布") {
      const mirrorModel = projectModels.find(
        m => m.isMirror && m.originalId === model.id
      );
      
      if (mirrorModel && mirrorModel.projectApplications) {
        return {
          ...model,
          projectApplications: mirrorModel.projectApplications,
        };
      }
    }
    
    return model;
  }, [projectModels]);

  // 审核相关状态
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [currentReviewModel, setCurrentReviewModel] = useState<Model | null>(null);

  // 模型发布流程状态
  const [showPublishWorkflow, setShowPublishWorkflow] = useState(false);
  const [currentPublishModel, setCurrentPublishModel] = useState<Model | null>(null);

  // 上传相关状态 - 更新为使用新的模态框
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 表格列管理状态
  const [columns, setColumns] =
    useState<TableColumn[]>(defaultColumns);
  const [isResizing, setIsResizing] = useState(false);
  const [resizingColumn, setResizingColumn] =
    useState<string>("");
  const [showColumnSettings, setShowColumnSettings] =
    useState(false);
  const tableRef = useRef<HTMLTableElement>(null);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const bottomScrollbarRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(0);

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showPageSizeOptions, setShowPageSizeOptions] =
    useState(false);

  const pageSizeOptions = [5, 10, 20, 50, 100];

  // 监听工具模型保存事件
  useEffect(() => {
    const handleToolModelSaved = (event: CustomEvent) => {
      const { modelData } = event.detail;
      
      // 将工具创建的模型转换为ModelManagement的Model格式
      const newModel: Model = {
        id: modelData.id,
        name: modelData.name,
        type: modelData.type,
        description: modelData.description,
        uploader: modelData.metadata.author,
        uploadTime: modelData.metadata.createdTime,
        version: modelData.version,
        project: modelData.project,
        status: "草稿",
        downloads: 0,
        rating: 0,
        tags: modelData.tags,
        isPublic: false, // 工具创建的模型默认为私有
        rflpCategory: modelData.rflpCategory,
        dependencies: {
          upstream: modelData.metadata.dependencies || [],
          downstream: [],
        },
      };
      
      // 添加到个人模型库状态
      setPersonalModels(prevModels => [newModel, ...prevModels]);
      
      // 如果当前在个人模型库页面，显示成功提示并高亮新模型
      if (activeTab === "personal") {
        toast.success(`来自${modelData.source}的模型 "${modelData.name}" 已添加到个人模型库！`, {
          duration: 5000,
          action: {
            label: "查看",
            onClick: () => {
              // 滚动到新添加的模型
              setTimeout(() => {
                const modelElement = document.getElementById(`model-${modelData.id}`);
                if (modelElement) {
                  modelElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  // 添加高亮效果
                  modelElement.classList.add('navigation-highlight');
                  setTimeout(() => {
                    modelElement.classList.remove('navigation-highlight');
                  }, 3000);
                }
              }, 100);
            }
          }
        });
      } else {
        // 如果在公共模型库页面，提示用户切换到个人模型库查看
        toast.success(`来自${modelData.source}的模型 "${modelData.name}" 已保存到个人模型库`, {
          duration: 5000,
          action: {
            label: "查看",
            onClick: () => {
              setActiveTab("personal");
              setTimeout(() => {
                const modelElement = document.getElementById(`model-${modelData.id}`);
                if (modelElement) {
                  modelElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  modelElement.classList.add('navigation-highlight');
                  setTimeout(() => {
                    modelElement.classList.remove('navigation-highlight');
                  }, 3000);
                }
              }, 100);
            }
          }
        });
      }
    };

    // 监听工具模型保存事件
    window.addEventListener('toolModelSaved', handleToolModelSaved as EventListener);

    // 清理监听���
    return () => {
      window.removeEventListener('toolModelSaved', handleToolModelSaved as EventListener);
    };
  }, [activeTab]);

  // 获取工具模型集成服务
  const integrationService = ToolModelIntegrationService.getInstance();

  // 模型上传功能 - 简化为打开模态框
  const handleUploadClick = () => {
    if (activeTab === "public" && userRole !== 'admin') {
      toast.warning("只有管理员可以上传模型到公共库");
      return;
    }
    
    setShowUploadModal(true);
  };

  // 处理模型上传完成
  const handleModelUpload = (modelData: any) => {
    // 创建新模型记录
    const newModel: Model = {
      id: Date.now().toString(),
      name: modelData.name,
      type: modelData.type,
      description: modelData.description,
      uploader: modelData.metadata.author || "当前用户",
      uploadTime: new Date().toLocaleString('zh-CN'),
      version: modelData.version,
      project: modelData.project || "用户上传",
      status: "草稿", // 新上传的模型默认为草稿状态
      downloads: 0,
      rating: 0,
      tags: modelData.tags,
      isPublic: modelData.isPublic,
      rflpCategory: modelData.rflpCategory as any,
      dependencies: {
        upstream: modelData.metadata.dependencies || [],
        downstream: [],
      },
    };

    // 根据activeTab添加到相应的模型列表
    if (activeTab === "public" && userRole === 'admin') {
      setPublicModels(prevModels => [newModel, ...prevModels]);
    } else {
      setPersonalModels(prevModels => [newModel, ...prevModels]);
    }

    toast.success(`模型 "${newModel.name}" 上传成功！`);
    
    // 关闭上传模态框
    setShowUploadModal(false);
  };

  const getModelTypeFromFile = (filename: string): string => {
    const extension = filename.substring(filename.lastIndexOf('.')).toLowerCase();
    switch (extension) {
      case '.slx':
      case '.mdl':
        return 'Simulink';
      case '.mo':
        return 'Modelica';
      case '.sysml':
      case '.xmi':
      case '.xml':
        return 'SysML';
      default:
        return 'Unknown';
    }
  };

  // 操作处理函数
  const handleCopyModel = (model: Model) => {
    console.log("复制模型:", model.name);
    toast.success(`模型 "${model.name}" 已复制到剪贴板`);
  };

  const handlePublishModel = (model: Model) => {
    if (model.status === "已发布") {
      toast.warning("模型已经是发布状态");
      return;
    }
    
    // 使用新的发布流程系统
    setCurrentPublishModel(model);
    setShowPublishWorkflow(true);
  };

  // 处理发布成功
  const handlePublishSuccess = () => {
    if (currentPublishModel) {
      // 1. 更新个人库模型状态为"审核中"
      setPersonalModels(prevModels => 
        prevModels.map(model => 
          model.id === currentPublishModel.id 
            ? { ...model, status: "审核中" as const }
            : model
        )
      );
      
      // 2. 将模型镜像到项目库（状态为审核中）
      const projectModel = {
        ...currentPublishModel,
        status: "审核中" as const,
        libraryType: "project" as const,
        uploadTime: new Date().toLocaleString('zh-CN'),
      };
      
      setProjectModels(prevModels => {
        const exists = prevModels.some(m => m.id === projectModel.id);
        if (exists) {
          // 如果已存在，更新它
          return prevModels.map(m => 
            m.id === projectModel.id ? projectModel : m
          );
        } else {
          // 如果不存在，添加镜像
          return [...prevModels, projectModel];
        }
      });
      
      // 3. 关闭发布对话框
      setShowPublishWorkflow(false);
      setCurrentPublishModel(null);
    }
  };

  const handleDeleteModel = (model: Model) => {
    if (confirm(`确定要删除模型 "${model.name}" 吗？此操作不可撤销。`)) {
      // 从个人模型库状态中删除模型
      setPersonalModels(prevModels => 
        prevModels.filter(m => m.id !== model.id)
      );
      toast.success(`模型 "${model.name}" 已删除`);
    }
  };

  const handleSubmitReview = (reviewData: any) => {
    console.log("提交审核:", reviewData);
    toast.success(`审核请求已提交，模型 "${currentReviewModel?.name}" 进入审核流程`);
    
    // 这里可以更新模型状态为"审核中"
    // 实际项目中应该调用API更新状态
  };

  // 处理模型公开/私有状态切换
  const handlePublicToggle = (model: Model, isPublic: boolean) => {
    // 更新个人库中的模型状态
    setPersonalModels(prevModels =>
      prevModels.map(m =>
        m.id === model.id ? { ...m, isPublic } : m
      )
    );

    if (isPublic) {
      // 切换为公共：将模型镜像到公共库
      const publicModel = {
        ...model,
        isPublic: true,
        libraryType: "public" as const,
        uploadTime: new Date().toLocaleString('zh-CN'),
      };
      
      setPublicModels(prevModels => {
        const exists = prevModels.some(m => m.id === publicModel.id);
        if (exists) {
          // 如果已存在，更新它
          return prevModels.map(m =>
            m.id === publicModel.id ? publicModel : m
          );
        } else {
          // 如果不存在，添加镜像
          return [...prevModels, publicModel];
        }
      });
      
      toast.success(`模型 "${model.name}" 已设置为公共，已镜像到公共库`);
    } else {
      // 切换为私有：从公共库移除镜像
      setPublicModels(prevModels =>
        prevModels.filter(m => m.id !== model.id)
      );
      
      toast.success(`模型 "${model.name}" 已设置为私有，已从公共库移除`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "已发布":
        return "bg-green-100 text-green-800 border-green-200";
      case "草稿":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "审核中":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleTypeSelection = (typeId: string) => {
    if (typeId === "All Types") {
      setSelectedTypes(["All Types"]);
    } else {
      const newSelection = selectedTypes.filter(
        (t) => t !== "All Types",
      );
      if (newSelection.includes(typeId)) {
        const filtered = newSelection.filter(
          (t) => t !== typeId,
        );
        setSelectedTypes(
          filtered.length === 0 ? ["All Types"] : filtered,
        );
      } else {
        setSelectedTypes([...newSelection, typeId]);
      }
    }
  };

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const getFilteredModels = (models: Model[]) => {
    return models.filter((model) => {
      const matchesKeyword =
        searchKeyword === "" ||
        model.name
          .toLowerCase()
          .includes(searchKeyword.toLowerCase()) ||
        model.description
          .toLowerCase()
          .includes(searchKeyword.toLowerCase());

      const matchesType =
        selectedTypes.includes("All Types") ||
        selectedTypes.includes(model.type);

      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.some((tag) =>
          model.tags.some((modelTag) =>
            modelTag.includes(tag.substring(1)),
          ),
        );

      const matchesRFLP =
        selectedRFLPCategory === "" ||
        model.rflpCategory === selectedRFLPCategory;

      return (
        matchesKeyword &&
        matchesType &&
        matchesTags &&
        matchesRFLP
      );
    });
  };

  const currentModels =
    activeTab === "public" ? publicModels : 
    activeTab === "personal" ? personalModels : 
    projectModels;
  const filteredModels = getFilteredModels(currentModels);

  // 项目视角：按项目分组模型
  const projectGroupedModels = useMemo(() => {
    if (activeTab !== "project") return {};
    
    const grouped: Record<string, Model[]> = {};
    
    filteredModels.forEach(model => {
      // 获取所有项目应用
      const applications = model.projectApplications || [];
      
      if (applications.length === 0) {
        // 如果没有项目应用，放入"未分配项目"组
        if (!grouped["未分配项目"]) {
          grouped["未分配项目"] = [];
        }
        grouped["未分配项目"].push(model);
      } else {
        // 将模型添加到每个项目组中
        applications.forEach(app => {
          if (!grouped[app.name]) {
            grouped[app.name] = [];
          }
          // 检查是否已经添加（避免重复）
          if (!grouped[app.name].some(m => m.id === model.id)) {
            grouped[app.name].push(model);
          }
        });
      }
    });
    
    return grouped;
  }, [activeTab, filteredModels]);

  // 获取项目统计信息
  const getProjectStats = (projectName: string) => {
    const models = projectGroupedModels[projectName] || [];
    const totalUseCount = models.reduce((sum, model) => {
      const app = model.projectApplications?.find(a => a.name === projectName);
      return sum + (app?.useCount || 0);
    }, 0);
    
    const projectApp = models[0]?.projectApplications?.find(a => a.name === projectName);
    
    return {
      modelCount: models.length,
      totalUseCount,
      status: projectApp?.status || "未知",
      team: projectApp?.team || "未知",
      lastUsed: projectApp?.lastUsed || "未知",
      description: projectApp?.description || "",
    };
  };

  // 分页计算 - 根据视角不同处理
  const totalPages = useMemo(() => {
    if (activeTab === "project" && projectLibraryView === "project") {
      // 项目视角：计算项目数量的分页
      return Math.ceil(Object.keys(projectGroupedModels).length / pageSize);
    } else {
      // 模型视角：计算模型数量的分页
      return Math.ceil(filteredModels.length / pageSize);
    }
  }, [activeTab, projectLibraryView, projectGroupedModels, filteredModels.length, pageSize]);
  
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  
  // 分页数据 - 根据视角不同处理
  const paginatedModels = useMemo(() => {
    if (activeTab === "project" && projectLibraryView === "project") {
      // 项目视角：不需要分页模型，而是分页项目
      return [];
    } else {
      // 模型视角：返回分页后的模型
      return filteredModels.slice(startIndex, endIndex);
    }
  }, [activeTab, projectLibraryView, filteredModels, startIndex, endIndex]);
  
  // 获取分页后的项目列表（项目视角使用）
  const paginatedProjects = useMemo(() => {
    if (activeTab !== "project" || projectLibraryView !== "project") return [];
    
    const projectNames = Object.keys(projectGroupedModels).sort((a, b) => {
      // "未分配项目"排在最后
      if (a === "未分配项目") return 1;
      if (b === "未分配项目") return -1;
      return a.localeCompare(b, 'zh-CN');
    });
    
    return projectNames.slice(startIndex, endIndex);
  }, [activeTab, projectLibraryView, projectGroupedModels, startIndex, endIndex]);

  // 分页处理函数
  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
    setShowPageSizeOptions(false);
  };

  const goToFirstPage = () => setCurrentPage(1);
  const goToPrevPage = () => setCurrentPage(Math.max(1, currentPage - 1));
  const goToNextPage = () => setCurrentPage(Math.min(totalPages, currentPage + 1));
  const goToLastPage = () => setCurrentPage(totalPages);

  const getPageNumbers = () => {
    const pageNumbers = [];
    const delta = 2; // 当前页前后显示的页数
    const start = Math.max(1, currentPage - delta);
    const end = Math.min(totalPages, currentPage + delta);

    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  // 确保当前页不超过总页数
  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // 筛选条件变化时重置到第一页
  React.useEffect(() => {
    setCurrentPage(1);
  }, [
    searchKeyword,
    selectedTypes,
    selectedTags,
    selectedRFLPCategory,
    activeTab,
  ]);

  // 获取依赖关系显示
  const getDependenciesDisplay = (dependencies?: { upstream: string[]; downstream: string[] }) => {
    if (!dependencies) return <span className="text-gray-400 text-sm">无依赖</span>;
    
    const upstreamCount = dependencies.upstream?.length || 0;
    const downstreamCount = dependencies.downstream?.length || 0;
    
    if (upstreamCount === 0 && downstreamCount === 0) {
      return <span className="text-gray-400 text-sm">无依赖</span>;
    }
    
    return (
      <div className="flex items-center gap-1 flex-nowrap">
        {upstreamCount > 0 && (
          <span className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full border border-blue-200 whitespace-nowrap">
            <ArrowRightLeft className="w-3 h-3 mr-1" />
            上游: {upstreamCount}
          </span>
        )}
        {downstreamCount > 0 && (
          <span className="inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full border border-green-200 whitespace-nowrap">
            <GitBranch className="w-3 h-3 mr-1" />
            下游: {downstreamCount}
          </span>
        )}
      </div>
    );
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ));
  };

  const getRFLPCategoryBadge = (category?: string) => {
    const rflpCategory = rflpCategories.find(
      (c) => c.id === category,
    );
    if (!rflpCategory) return null;

    const colorClasses = {
      blue: "bg-blue-100 text-blue-800 border-blue-200",
      green: "bg-green-100 text-green-800 border-green-200",
      purple: "bg-purple-100 text-purple-800 border-purple-200",
      orange: "bg-orange-100 text-orange-800 border-orange-200",
    };

    return (
      <span
        className={`inline-flex items-center px-2 py-1 text-xs rounded-full border ${colorClasses[rflpCategory.color as keyof typeof colorClasses]}`}
      >
        <rflpCategory.icon className="w-3 h-3 mr-1" />
        {rflpCategory.id}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* 标题区域 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">模型管理</h1>
          <p className="text-gray-600 mt-1">
            管理和浏览MBSE模型库，支持Simulink、SysML、Modelica等多种格式
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {/* 上传按钮 - 更新为使用模态框 */}
          <button
            onClick={handleUploadClick}
            disabled={isUploading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>上传模型</span>
          </button>
          
          {/* 视图切换 */}
          <div className="flex border border-gray-200 rounded-lg">
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 ${
                viewMode === "list"
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 ${
                viewMode === "grid"
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 模型上传模态框 */}
      <ModelUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleModelUpload}
        userRole={userRole}
      />

      {/* Tab切换和搜索区域 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          {/* Tab切换 */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab("public")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "public"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4" />
                <span>公共模型库 ({publicModels.length})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("personal")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "personal"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>个人模型库 ({personalModels.length})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("project")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "project"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center space-x-2">
                <Archive className="w-4 h-4" />
                <span>项目模型库 ({projectModels.length})</span>
              </div>
            </button>
          </div>

          {/* 搜索框 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="搜索模型名称或描述..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            />
          </div>
        </div>

        {/* 库类型说明 */}
        <div className="mb-6">
          {activeTab === "personal" && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <User className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">个人模型库</h4>
                  <p className="text-sm text-blue-800">
                    零审批、零门禁。模型上传后仅进行自动核验并给出参考报告，不会阻止使用。
                    您可以将个人模型设置为公共或发布至项目库。
                  </p>
                </div>
              </div>
            </div>
          )}
          {activeTab === "public" && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Globe className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-green-900 mb-1">公共模型库</h4>
                  <p className="text-sm text-green-800">
                    无审批、无门禁，但比个人库信息更完整、可见性更高。
                    公共模型经过自动核验并授予质量徽章（金/银/铜等级），适合对外复用。
                  </p>
                </div>
              </div>
            </div>
          )}
          {activeTab === "project" && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <Archive className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-medium text-purple-900 mb-1">项目模型库</h4>
                    <p className="text-sm text-purple-800">
                      <strong>唯一需要审核的场景</strong>。启用门禁与审批流程，包括自动验证、研发经理审核、项目经理批准。
                      确保进入项目的模型在性能、稳定性、接口一致性等方面达到工程要求。
                    </p>
                    <div className="mt-2 flex items-center space-x-2 text-xs text-purple-700">
                      <span className="px-2 py-1 bg-purple-100 rounded">构建检查</span>
                      <span className="px-2 py-1 bg-purple-100 rounded">性能测试</span>
                      <span className="px-2 py-1 bg-purple-100 rounded">接口验证</span>
                      <span className="px-2 py-1 bg-purple-100 rounded">文档审核</span>
                    </div>
                  </div>
                </div>
                
                {/* 视角切换按钮 */}
                <div className="ml-4 flex-shrink-0">
                  <div className="flex items-center space-x-2 bg-white rounded-lg p-1 border border-purple-200">
                    <button
                      onClick={() => setProjectLibraryView("project")}
                      className={`flex items-center space-x-1 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                        projectLibraryView === "project"
                          ? "bg-purple-600 text-white shadow-sm"
                          : "text-purple-700 hover:bg-purple-100"
                      }`}
                      title="按项目分组显示模型"
                    >
                      <FolderOpen className="w-3.5 h-3.5" />
                      <span>项目视角</span>
                    </button>
                    <button
                      onClick={() => setProjectLibraryView("model")}
                      className={`flex items-center space-x-1 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                        projectLibraryView === "model"
                          ? "bg-purple-600 text-white shadow-sm"
                          : "text-purple-700 hover:bg-purple-100"
                      }`}
                      title="按模型列表显示"
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span>模型视角</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 筛选区域 */}
        <div className="space-y-4">
          {/* 模型类型筛选 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              模型类型
            </label>
            <div className="flex flex-wrap gap-2">
              {modelTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleTypeSelection(type.id)}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    selectedTypes.includes(type.id)
                      ? "bg-blue-100 text-blue-800 border-blue-200"
                      : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                  }`}
                >
                  {type.name} ({type.count})
                </button>
              ))}
            </div>
          </div>

          {/* RFLP分类筛选 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              RFLP架构分类
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedRFLPCategory("")}
                className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                  selectedRFLPCategory === ""
                    ? "bg-blue-100 text-blue-800 border-blue-200"
                    : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                }`}
              >
                全部分类
              </button>
              {rflpCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedRFLPCategory(category.id)}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors flex items-center space-x-1 ${
                    selectedRFLPCategory === category.id
                      ? "bg-blue-100 text-blue-800 border-blue-200"
                      : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                  }`}
                >
                  <category.icon className="w-3 h-3" />
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 标签筛选 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              标签筛选
            </label>
            <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
              {modelTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`px-2 py-1 text-xs rounded border transition-colors ${
                    selectedTags.includes(tag)
                      ? "bg-blue-100 text-blue-800 border-blue-200"
                      : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 模型列表/网格 */}
      <div className="bg-white rounded-lg border border-gray-200">
        {/* 项目库的项目视角 */}
        {activeTab === "project" && projectLibraryView === "project" ? (
          <div>
            {paginatedProjects.map((projectName) => {
              const models = projectGroupedModels[projectName] || [];
              const stats = getProjectStats(projectName);
              
              return (
                <div key={projectName} className="border-b border-gray-200 last:border-b-0">
                  {/* 项目信息行 */}
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200">
                    <div className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FolderOpen className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-1">
                              <h3 className="font-semibold text-gray-900">{projectName}</h3>
                              <span className={`px-2 py-0.5 text-xs rounded-full ${
                                stats.status === "进行中" ? "bg-green-100 text-green-800" :
                                stats.status === "已完成" ? "bg-blue-100 text-blue-800" :
                                stats.status === "计划中" ? "bg-yellow-100 text-yellow-800" :
                                "bg-gray-100 text-gray-800"
                              }`}>
                                {stats.status}
                              </span>
                            </div>
                            {stats.description && (
                              <p className="text-sm text-gray-600 mb-2">{stats.description}</p>
                            )}
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span className="flex items-center space-x-1">
                                <Archive className="w-3.5 h-3.5" />
                                <span>{stats.modelCount} 个模型</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <User className="w-3.5 h-3.5" />
                                <span>{stats.team}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>最后使用: {stats.lastUsed}</span>
                              </span>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="text-xs text-gray-500 mb-1">总使用次数</div>
                            <div className="text-2xl font-bold text-purple-600">{stats.totalUseCount}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 项目下的模型表格 */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            模型名称
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            类型
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            依赖关系
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            上传者
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            上传时间
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            状态
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            版本
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            项目使用次数
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            操作
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {models.map((model) => {
                          const projectApp = model.projectApplications?.find(a => a.name === projectName);
                          
                          return (
                            <tr key={`${projectName}-${model.id}`} className="hover:bg-gray-50">
                              <td className="px-6 py-4">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center mr-3">
                                    <FileText className="w-4 h-4 text-blue-600" />
                                  </div>
                                  <div 
                                    className="cursor-pointer hover:text-blue-600 transition-colors"
                                    onClick={() => onModelClick?.(getEnrichedModel(model))}
                                  >
                                    <div className="font-medium text-gray-900">{model.name}</div>
                                    <div className="text-sm text-gray-500 truncate max-w-xs">
                                      {model.description}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex flex-col space-y-1">
                                  <span className="text-sm text-gray-900">{model.type}</span>
                                  {model.rflpCategory && (
                                    getRFLPCategoryBadge(model.rflpCategory)
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                {getDependenciesDisplay(model.dependencies)}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center">
                                  <User className="w-4 h-4 text-gray-400 mr-2" />
                                  <span className="text-sm text-gray-900">{model.uploader}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center">
                                  <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                                  <span className="text-sm text-gray-500">{model.uploadTime}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-1 text-xs rounded ${getStatusColor(model.status)}`}>
                                  {model.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">
                                v{model.version}
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-center">
                                  <span className="inline-flex items-center px-2 py-1 text-sm font-medium text-purple-800 bg-purple-100 rounded border border-purple-200">
                                    {projectApp?.useCount || 0} 次
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm font-medium">
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => onModelClick?.(getEnrichedModel(model))}
                                    className="text-blue-600 hover:text-blue-900"
                                    title="查看详情"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleCopyModel(model)}
                                    className="text-gray-600 hover:text-gray-900"
                                    title="复制模型"
                                  >
                                    <Copy className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        ) : viewMode === "grid" ? (
          // 网格视图
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedModels.map((model) => (
                <div
                  key={model.id}
                  id={`model-${model.id}`}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => onModelClick?.(getEnrichedModel(model))}
                >
                  {/* 模型图标和状态 */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex items-center space-x-1">
                      {activeTab === "personal" && (
                        <div 
                          className="flex items-center space-x-1 px-2 py-1 bg-gray-50 rounded"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePublicToggle(model, !model.isPublic);
                          }}
                          title={model.isPublic ? "点击设为私有" : "点击设为公开"}
                        >
                          {model.isPublic ? (
                            <Globe className="w-3 h-3 text-green-600" />
                          ) : (
                            <User className="w-3 h-3 text-gray-500" />
                          )}
                        </div>
                      )}
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <Eye className="w-4 h-4" />
                      </button>
                      {model.rating > 0 && (
                        <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
                      )}
                    </div>
                  </div>

                  {/* 模型标题 */}
                  <h3 className="font-medium text-gray-900 mb-1 truncate">{model.name}</h3>
                  
                  {/* 模型类型 */}
                  <p className="text-sm text-gray-500 mb-3">{model.type}</p>

                  {/* RFLP分类徽章 */}
                  {model.rflpCategory && (
                    <div className="mb-3">
                      {getRFLPCategoryBadge(model.rflpCategory)}
                    </div>
                  )}

                  {/* 评级 */}
                  {model.rating > 0 && (
                    <div className="flex items-center mb-3">
                      {getRatingStars(model.rating)}
                    </div>
                  )}

                  {/* 标签 */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {model.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {model.tags.length > 3 && (
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                        +{model.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* 状态徽章 */}
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 text-xs rounded ${getStatusColor(model.status)}`}>
                      {model.status}
                    </span>
                    <span className="text-xs text-gray-500">
                      v{model.version}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // 列表视图
          <div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      模型名称
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      类型
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      依赖关系
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      上传者
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      上传时间
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      状态
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      版本
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      所属项目
                    </th>
                    {activeTab === "personal" && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        可见性
                      </th>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedModels.map((model) => (
                    <tr key={model.id} id={`model-${model.id}`} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center mr-3">
                            <FileText className="w-4 h-4 text-blue-600" />
                          </div>
                          <div 
                            className="cursor-pointer hover:text-blue-600 transition-colors"
                            onClick={() => onModelClick?.(getEnrichedModel(model))}
                          >
                            <div className="font-medium text-gray-900">{model.name}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {model.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col space-y-1">
                          <span className="text-sm text-gray-900">{model.type}</span>
                          {model.rflpCategory && (
                            getRFLPCategoryBadge(model.rflpCategory)
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getDependenciesDisplay(model.dependencies)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <User className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{model.uploader}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-500">{model.uploadTime}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded ${getStatusColor(model.status)}`}>
                          {model.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        v{model.version}
                      </td>
                      <td className="px-6 py-4">
                        {model.projectApplications && model.projectApplications.length > 0 ? (
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {model.projectApplications.slice(0, 2).map((app) => (
                              <span
                                key={app.id}
                                className="inline-flex items-center px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded border border-purple-200"
                                title={`${app.name} - ${app.description}`}
                              >
                                {app.name}
                              </span>
                            ))}
                            {model.projectApplications.length > 2 && (
                              <span 
                                className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded border border-gray-200"
                                title={model.projectApplications.slice(2).map(app => app.name).join(', ')}
                              >
                                +{model.projectApplications.length - 2}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">未分配项目</span>
                        )}
                      </td>
                      {activeTab === "personal" && (
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={model.isPublic}
                              onCheckedChange={(checked) => handlePublicToggle(model, checked)}
                            />
                            <span className="text-xs text-gray-600">
                              {model.isPublic ? (
                                <span className="flex items-center space-x-1 text-green-600">
                                  <Globe className="w-3 h-3" />
                                  <span>公开</span>
                                </span>
                              ) : (
                                <span className="flex items-center space-x-1 text-gray-500">
                                  <User className="w-3 h-3" />
                                  <span>私有</span>
                                </span>
                              )}
                            </span>
                          </div>
                        </td>
                      )}
                      <td className="px-6 py-4 text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => onModelClick?.(getEnrichedModel(model))}
                            className="text-blue-600 hover:text-blue-900"
                            title="查看详情"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleCopyModel(model)}
                            className="text-gray-600 hover:text-gray-900"
                            title="复制模型"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          {activeTab === "personal" && (
                            <>
                              <button
                                onClick={() => handlePublishModel(model)}
                                className="text-green-600 hover:text-green-900"
                                title="发布模型"
                              >
                                <PublishIcon className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteModel(model)}
                                className="text-red-600 hover:text-red-900"
                                title="删除模型"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 分页控件 */}
        {(activeTab === "project" && projectLibraryView === "project" ? Object.keys(projectGroupedModels).length > 0 : filteredModels.length > 0) && (
          <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
            {/* 左侧：显示信息和每页大小选择 */}
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                {activeTab === "project" && projectLibraryView === "project" ? (
                  <>
                    显示 {startIndex + 1} - {Math.min(endIndex, Object.keys(projectGroupedModels).length)} 个项目，
                    共 {Object.keys(projectGroupedModels).length} 个项目
                  </>
                ) : (
                  <>
                    显示 {startIndex + 1} - {Math.min(endIndex, filteredModels.length)} 条，
                    共 {filteredModels.length} 条记录
                  </>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowPageSizeOptions(!showPageSizeOptions)}
                  className="flex items-center space-x-1 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  <span>{pageSize} 条/页</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {showPageSizeOptions && (
                  <div className="absolute bottom-full left-0 mb-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    {pageSizeOptions.map((size) => (
                      <button
                        key={size}
                        onClick={() => handlePageSizeChange(size)}
                        className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${
                          size === pageSize
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-700"
                        }`}
                      >
                        {size} 条/页
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 右侧：分页导航 */}
            <div className="flex items-center space-x-2">
              {/* 跳转到首页 */}
              <button
                onClick={goToFirstPage}
                disabled={currentPage === 1}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="首页"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>

              {/* 上一页 */}
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="上一页"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* 页码 */}
              <div className="flex items-center space-x-1">
                {getPageNumbers().map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 text-sm rounded ${
                      pageNum === currentPage
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              {/* 下一页 */}
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="下一页"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* 跳转到尾页 */}
              <button
                onClick={goToLastPage}
                disabled={currentPage === totalPages}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="尾页"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* 空状态 */}
        {(activeTab === "project" && projectLibraryView === "project" ? Object.keys(projectGroupedModels).length === 0 : filteredModels.length === 0) && (
          <div className="text-center py-12">
            {activeTab === "project" && projectLibraryView === "project" ? (
              <>
                <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  没有找到匹配的项目
                </h3>
                <p className="text-gray-500">
                  请尝试调整筛选条件或搜索关键词
                </p>
              </>
            ) : (
              <>
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  没有找到匹配的模型
                </h3>
                <p className="text-gray-500">
                  请尝试调整筛选条件或搜索关键词
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {/* 审核模态框 */}
      {showReviewModal && currentReviewModel && (
        <ModelReviewModal
          model={currentReviewModel}
          onClose={() => {
            setShowReviewModal(false);
            setCurrentReviewModel(null);
          }}
          onSubmit={handleSubmitReview}
        />
      )}

      {/* 模型发布流程对话框 */}
      {showPublishWorkflow && currentPublishModel && (
        <ModelPublishWorkflow
          model={currentPublishModel}
          open={showPublishWorkflow}
          onOpenChange={setShowPublishWorkflow}
          onPublishSuccess={handlePublishSuccess}
        />
      )}
    </div>
  );
}