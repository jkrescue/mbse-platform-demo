import React, { useState, useCallback } from "react";
import {
  ArrowLeft,
  Calendar,
  User,
  FileText,
  Download,
  Edit,
  Share,
  Star,
  Tag,
  Globe,
  Lock,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Activity,
  File,
  Archive,
  X,
  AlertTriangle,
  CheckCircle2,
  Target,
  BarChart3,
  Info,
  Award,
  Shield,
  GitBranch,
  FileCheck,
  Zap,
  Medal,
  GitCompare,
  ArrowLeftRight,
  Plus,
  Minus,
} from "lucide-react@0.487.0";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { toast } from "sonner@2.0.3";
import { Progress } from "./ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface ModelDetailProps {
  model: any;
  onBack: () => void;
  userRole?: string;
}

export function ModelDetail({
  model,
  onBack,
  userRole,
}: ModelDetailProps) {
  // 从model中获取库类型，默认为个人库
  const libraryType = model.libraryType || "personal";

  const [activeTab, setActiveTab] = useState(
    libraryType === "personal"
      ? "autoValidation"
      : libraryType === "public"
        ? "qualityBadge"
        : "approvalProcess",
  );
  const [showMetricDetail, setShowMetricDetail] =
    useState(false);
  const [selectedMetric, setSelectedMetric] =
    useState<any>(null);

  // 版本对比相关状态
  const [showVersionComparison, setShowVersionComparison] =
    useState(false);
  const [compareVersion1, setCompareVersion1] =
    useState<string>("");
  const [compareVersion2, setCompareVersion2] =
    useState<string>("");

  // 完整历史相关状态
  const [showVersionHistory, setShowVersionHistory] =
    useState(false);
  const [historyStatusFilter, setHistoryStatusFilter] =
    useState<string>("all");

  // 变更详情相关状态
  const [showChangeDetails, setShowChangeDetails] =
    useState(false);
  const [selectedVersionChange, setSelectedVersionChange] =
    useState<any>(null);

  // 检查是否为Vehicle_Dynamics_Model
  const isVehicleDynamicsModel =
    model.name === "Vehicle_Dynamics_Model";

  // 从模型管理系统获取真实的依赖关系数据
  const getModelLineageData = () => {
    if (isVehicleDynamicsModel) {
      return {
        nodes: [
          {
            id: "battery_thermal",
            type: "upstream",
            position: { x: 100, y: 100 },
            data: {
              label: "BatteryThermalModel",
              version: "v1.0",
              type: "电池热管理",
              status: "active",
            },
          },
          {
            id: "suspension_dynamics",
            type: "upstream",
            position: { x: 100, y: 250 },
            data: {
              label: "Suspension_Dynamics",
              version: "v1.0",
              type: "悬架动力学",
              status: "active",
            },
          },
          {
            id: "engine_control_v2",
            type: "current",
            position: { x: 400, y: 175 },
            data: {
              label: "EngineControl_V2",
              version: "v2.1",
              type: "发动机控制",
              status: "current",
              description: "(当前模型)",
            },
          },
          {
            id: "fuel_efficiency",
            type: "downstream",
            position: { x: 700, y: 100 },
            data: {
              label: "FuelEfficiency_Model",
              version: "v1.5",
              type: "燃油效率",
              status: "active",
            },
          },
          {
            id: "emission_control",
            type: "downstream",
            position: { x: 700, y: 250 },
            data: {
              label: "EmissionControl_Model",
              version: "v2.0",
              type: "排放控制",
              status: "active",
            },
          },
        ],
        edges: [
          {
            id: "battery_thermal-engine_control_v2",
            source: "battery_thermal",
            target: "engine_control_v2",
            type: "smoothstep",
            style: {
              stroke: "#10b981",
              strokeWidth: 3,
              strokeDasharray: "8,4",
            },
            label: "热管理数据",
            labelStyle: {
              fontSize: 12,
              fill: "#10b981",
              fontWeight: 500,
            },
            labelBgStyle: { fill: "#ffffff", fillOpacity: 0.9 },
            animated: true,
          },
          {
            id: "suspension_dynamics-engine_control_v2",
            source: "suspension_dynamics",
            target: "engine_control_v2",
            type: "smoothstep",
            style: {
              stroke: "#10b981",
              strokeWidth: 3,
              strokeDasharray: "8,4",
            },
            label: "动力学参数",
            labelStyle: {
              fontSize: 12,
              fill: "#10b981",
              fontWeight: 500,
            },
            labelBgStyle: { fill: "#ffffff", fillOpacity: 0.9 },
            animated: true,
          },
          {
            id: "engine_control_v2-fuel_efficiency",
            source: "engine_control_v2",
            target: "fuel_efficiency",
            type: "smoothstep",
            style: {
              stroke: "#f59e0b",
              strokeWidth: 3,
              strokeDasharray: "8,4",
            },
            label: "控制信号",
            labelStyle: {
              fontSize: 12,
              fill: "#f59e0b",
              fontWeight: 500,
            },
            labelBgStyle: { fill: "#ffffff", fillOpacity: 0.9 },
            animated: true,
          },
          {
            id: "engine_control_v2-emission_control",
            source: "engine_control_v2",
            target: "emission_control",
            type: "smoothstep",
            style: {
              stroke: "#f59e0b",
              strokeWidth: 3,
              strokeDasharray: "8,4",
            },
            label: "排放数据",
            labelStyle: {
              fontSize: 12,
              fill: "#f59e0b",
              fontWeight: 500,
            },
            labelBgStyle: { fill: "#ffffff", fillOpacity: 0.9 },
            animated: true,
          },
        ],
      };
    } else {
      return {
        nodes: [
          {
            id: "base_model",
            type: "upstream",
            position: { x: 150, y: 150 },
            data: {
              label: "Base_Model",
              version: "v1.0",
              type: "基础模型",
              status: "active",
            },
          },
          {
            id: "current_model",
            type: "current",
            position: { x: 400, y: 150 },
            data: {
              label: model.name,
              version: model.version || "v1.0",
              type: "当前模型",
              status: "current",
              description: "(当前模型)",
            },
          },
          {
            id: "analysis_model",
            type: "downstream",
            position: { x: 650, y: 150 },
            data: {
              label: "Analysis_Model",
              version: "v1.0",
              type: "分析模型",
              status: "active",
            },
          },
        ],
        edges: [
          {
            id: "base_model-current_model",
            source: "base_model",
            target: "current_model",
            type: "smoothstep",
            style: {
              stroke: "#10b981",
              strokeWidth: 3,
              strokeDasharray: "8,4",
            },
            label: "基础依赖",
            labelStyle: {
              fontSize: 12,
              fill: "#10b981",
              fontWeight: 500,
            },
            labelBgStyle: { fill: "#ffffff", fillOpacity: 0.9 },
            animated: true,
          },
          {
            id: "current_model-analysis_model",
            source: "current_model",
            target: "analysis_model",
            type: "smoothstep",
            style: {
              stroke: "#f59e0b",
              strokeWidth: 3,
              strokeDasharray: "8,4",
            },
            label: "数据输出",
            labelStyle: {
              fontSize: 12,
              fill: "#f59e0b",
              fontWeight: 500,
            },
            labelBgStyle: { fill: "#ffffff", fillOpacity: 0.9 },
            animated: true,
          },
        ],
      };
    }
  };

  const lineageData = getModelLineageData();

  // 获取指标详细信息的函数
  const getMetricDetailInfo = (
    metricName: string,
    value: number,
  ) => {
    const metricDetails: { [key: string]: any } = {
      算法检验分: {
        name: "算法检验分",
        value: value,
        description: "MBSE模型中算法逻辑的正确性和完整性评估",
        category: "算法质量",
        details: {
          overview:
            "该指标评估模型中控制算法的数学逻辑正确性、边界条件处理和异常情况响应能力。",
          analysisItems: [
            {
              item: "算法逻辑验证",
              score: 99,
              status: "excellent",
              description:
                "控制算法逻辑完全符合MBSE设计规范，状态转换和决策树结构清晰",
            },
            {
              item: "边界条件处理",
              score: 98,
              status: "excellent",
              description:
                "在极值输入和异常情况下，算法表现稳定，边界保护机制完善",
            },
            {
              item: "数值计算精度",
              score: 97,
              status: "excellent",
              description:
                "浮点数运算精度满足工程要求，累积误差控制在可接受范围内",
            },
            {
              item: "实时性能",
              score: 96,
              status: "excellent",
              description:
                "算法执行时间满足实时控制要求，CPU占用率优化良好",
            },
          ],
          recommendations: [
            "建议定期进行算法回归测试，确保版本迭代时算法正确性",
            "考虑增加更多边界测试用例，提升鲁棒性验证覆盖度",
            "建议建立算法性能基准，监控不同工况下的执行效率",
          ],
          mbseContext:
            "在MBSE框架下，该算法验证遵循V模型验证流程，从需求分析到系统验证的全链路质量保证。",
        },
      },
      测试覆盖率: {
        name: "测试覆盖率",
        value: value,
        description: "模型测试用例对代码和功能的覆盖程度分析",
        category: "测试质量",
        details: {
          overview:
            "评估MBSE模型的测试完整性，包括功能覆盖、代码覆盖和场景覆盖等多个维度。",
          analysisItems: [
            {
              item: "功能覆盖率",
              score: 96,
              status: "excellent",
              description:
                "所有定义的功能需求均有对应测试用例，功能验证完整",
            },
            {
              item: "代码覆盖率",
              score: 94,
              status: "good",
              description:
                "语句覆盖率94%，分支覆盖率91%，关键路径全覆盖",
            },
            {
              item: "场景覆盖率",
              score: 93,
              status: "good",
              description:
                "涵盖正常工况、边界工况和故障工况，场景设计合理",
            },
            {
              item: "集成测试覆盖",
              score: 97,
              status: "excellent",
              description:
                "子系统间接口测试完整，数据流和控制流验证充分",
            },
          ],
          recommendations: [
            "建议提升代码覆盖率至98%以上，重点关注异常处理分支",
            "增加更多极端工况的测试场景，提升系统鲁棒性验证",
            "建立自动化测试流水线，实现持续集成验证",
          ],
          mbseContext:
            "基于SysML需求模型自动生成测试用例，确保需求到测试的双向追踪。",
        },
      },
      文档完整度: {
        name: "文档完整度",
        value: value,
        description: "MBSE模型文档化程度和规范性评估",
        category: "文档质量",
        details: {
          overview:
            "评估模型文档的完整性、准确性和维护性，确保模型的可理解性和可维护性。",
          analysisItems: [
            {
              item: "需求文档",
              score: 92,
              status: "good",
              description:
                "系统需求、功能需求和性能需求文档完整，需求追踪矩阵清晰",
            },
            {
              item: "设计文档",
              score: 88,
              status: "good",
              description:
                "架构设计、详细设计文档齐全，SysML模型图表规范",
            },
            {
              item: "测试文档",
              score: 90,
              status: "good",
              description:
                "测试计划、测试用例和测试报告完整，测试策略明确",
            },
            {
              item: "用户手册",
              score: 87,
              status: "good",
              description:
                "操作手册和维护指南完整，但需要更新至最新版本",
            },
          ],
          recommendations: [
            "建议完善用户手册，增加更多操作示例和故障诊断指南",
            "建立文档版本管理机制，确保文档与模型版本同步更新",
            "考虑引入文档自动生成工具，提升文档维护效率",
          ],
          mbseContext:
            "文档与MBSE模型保持一致性，支持从模型自动生成部分文档内容。",
        },
      },
      健康度: {
        name: "健康度",
        value: value,
        description: "模型整体运行状态和系统稳定性综合评估",
        category: "系统健康",
        details: {
          overview:
            "综合评估MBSE模型的运行稳定性、资源使用效率和潜在风险点。",
          analysisItems: [
            {
              item: "运行稳定性",
              score: 100,
              status: "excellent",
              description:
                "模型运行稳定，无异常崩溃或内存泄漏问题",
            },
            {
              item: "资源使用效率",
              score: 100,
              status: "excellent",
              description: "CPU和内存使用合理，仿真计算效率高",
            },
            {
              item: "错误处理能力",
              score: 100,
              status: "excellent",
              description:
                "异常情况下能够优雅降级，错误恢复机制完善",
            },
            {
              item: "可维护性",
              score: 100,
              status: "excellent",
              description:
                "代码结构清晰，模块化程度高，便于后续维护和扩展",
            },
          ],
          recommendations: [
            "保持当前优秀状态，建议建立持续监控机制",
            "定期进行性能基准测试，确保长期稳定运行",
            "建立预防性维护计划，及时发现和处理潜在问题",
          ],
          mbseContext:
            "健康度指标反映了MBSE模型在实际应用中的可靠性和可持续性。",
        },
      },
      模型完整度: {
        name: "模型完整度",
        value: value,
        description: "MBSE模型结构完整性和逻辑一致性评估",
        category: "模型质量",
        details: {
          overview:
            "评估模型是否包含所有必要的组件、接口和约束，确保模型的完整性和一致性。",
          analysisItems: [
            {
              item: "模型结构完整性",
              score: 87,
              status: "good",
              description:
                "主要功能模块齐全，但部分辅助模块待完善",
            },
            {
              item: "接口定义完整性",
              score: 84,
              status: "good",
              description:
                "主要接口定义清晰，部分内部接口需要补充文档",
            },
            {
              item: "约束条件完整性",
              score: 83,
              status: "good",
              description:
                "物理约束和性能约束基本完整，安全约束需要加强",
            },
            {
              item: "数据模型完整性",
              score: 86,
              status: "good",
              description:
                "数据结构和数据流定义较为完整，需要优化数据验证机制",
            },
          ],
          recommendations: [
            "完善辅助功能模块，提升模型功能完整性",
            "补充接口文档，明确所有内外部接口规范",
            "加强安全约束建模，确保系统安全性要求满足",
          ],
          mbseContext:
            "模型完整度是MBSE成功实施的基础，确保模型能够准确反映真实系统。",
        },
      },
    };

    return (
      metricDetails[metricName] || {
        name: metricName,
        value: value,
        description: "该指标的详细信息",
        category: "通用指标",
        details: {
          overview: "该指标的详细分析信息。",
          analysisItems: [],
          recommendations: [],
          mbseContext: "在MBSE框架下的相关说明。",
        },
      }
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "excellent":
        return (
          <CheckCircle2 className="w-4 h-4 text-green-600" />
        );
      case "good":
        return <Target className="w-4 h-4 text-blue-600" />;
      case "warning":
        return (
          <AlertTriangle className="w-4 h-4 text-yellow-600" />
        );
      default:
        return <Info className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "text-green-600 bg-green-50 border-green-200";
      case "good":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "warning":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  // 模型解析结果数据（从ModelUploadModal中获取的示例数据）
  const modelParseData = {
    modelType: model.type || "Simulink",
    version: model.version || "1.0.0",
    dependencies: [
      "Control System Toolbox",
      "Powertrain Blockset",
      "Vehicle Dynamics Blockset",
    ],
    interfaces: [
      "Engine_Torque_In",
      "Vehicle_Speed_Out",
      "Battery_SOC_In",
      "Motor_Power_Out",
    ],
    parameters: [
      {
        name: "Engine_Max_Power",
        value: "120",
        type: "double",
        unit: "kW",
      },
      {
        name: "Vehicle_Mass",
        value: "1500",
        type: "double",
        unit: "kg",
      },
      {
        name: "Battery_Capacity",
        value: "60",
        type: "double",
        unit: "kWh",
      },
      {
        name: "Motor_Efficiency",
        value: "0.95",
        type: "double",
        unit: "-",
      },
    ],
    components: [
      "Engine Block",
      "Battery Pack",
      "Electric Motor",
      "Vehicle Body",
      "Control Unit",
    ],
  };

  // Vehicle Dynamics Model的详细数据
  const vehicleDynamicsData = {
    reviewSteps: [
      {
        id: "draft",
        name: "草稿",
        status: "completed",
        date: "2023/10/24 10:00:00",
        description: "初始版本已创建。",
      },
      {
        id: "static-check",
        name: "静态检查",
        status: "completed",
        date: "2023/10/25 11:00:00",
        description: "MAAB合规性: 98%, 覆盖率: 95%",
      },
      {
        id: "technical-review",
        name: "技术评审",
        status: "completed",
        date: "2023/10/27 09:30:00",
        description: "架构良好，已批准进入质量测试。",
      },
      {
        id: "qa-testing",
        name: "质量测试",
        status: "completed",
        date: "2023/10/27 14:00:00",
        description: "所有测试用例已通过。",
      },
      {
        id: "published",
        name: "已发布",
        status: "completed",
        date: "2023/10/27 16:00:00",
        description: "模型发布成功。",
      },
    ],
    qualityMetrics: [
      {
        name: "算法检验分",
        value: 98,
        color: "text-green-600",
      },
      {
        name: "测试覆盖率",
        value: 95,
        color: "text-green-600",
      },
      {
        name: "文档完整度",
        value: 90,
        color: "text-green-600",
      },
      {
        name: "健康度",
        value: 100,
        color: "text-green-600",
        icon: "💚",
      },
    ],
    versionHistory: [
      {
        version: "2.1.2",
        date: "2024-01-20",
        author: "张一",
        status: "已发布",
        description:
          "修复了高速工况下的稳定性问题，优化了轮胎模型参数。",
      },
      {
        version: "2.1.1",
        date: "2024-01-15",
        author: "李工",
        status: "已发布",
        description:
          "更新了ABS系统的控制逻辑，提升了制动性能。",
      },
      {
        version: "2.1.0",
        date: "2024-01-10",
        author: "张一",
        status: "已发布",
        description:
          "【基线版本】更新了车辆动力学参数并改进了悬架模型，增加了ESC电子稳定控制功能。",
      },
      {
        version: "2.0.3",
        date: "2023-12-28",
        author: "王工",
        status: "已归档",
        description: "修复了转向系统的数值计算误差。",
      },
      {
        version: "2.0.2",
        date: "2023-12-20",
        author: "张一",
        status: "已归档",
        description: "优化了仿真性能，减少了计算时间约15%。",
      },
      {
        version: "2.0.1",
        date: "2023-12-15",
        author: "张一",
        status: "已归档",
        description: "修复了低速工况下的抖动问题。",
      },
      {
        version: "2.0.0",
        date: "2023-12-10",
        author: "李工",
        status: "已归档",
        description:
          "【基线版本】重大更新：添加了制动系统集成，重构了动力总成接口。",
      },
      {
        version: "1.5.1",
        date: "2023-12-01",
        author: "王工",
        status: "已归档",
        description: "增强了模型文档，添加了更多使用示例。",
      },
      {
        version: "1.5.0",
        date: "2023-11-25",
        author: "张一",
        status: "已归档",
        description:
          "【基线版本】集成了电池热管理模块，支持混合动力仿真。",
      },
      {
        version: "1.0.0",
        date: "2023-11-20",
        author: "张一",
        status: "已归档",
        description:
          "【基线版本】车辆动力学模型的初始发布版本，包含基础的纵向和横向动力学。",
      },
    ],
    relatedFiles: [
      { name: "Vehicle_Dynamics_Model.slx", size: "3.2 MB" },
      { name: "Vehicle_Parameters.mat", size: "1.1 MB" },
      { name: "Suspension_Spec.pdf", size: "850 KB" },
    ],
    inputPorts: [
      { name: "throttle_input", type: "real", unit: "%" },
      { name: "brake_pressure", type: "real", unit: "bar" },
      { name: "steering_angle", type: "real", unit: "deg" },
    ],
    outputPorts: [
      { name: "vehicle_speed", type: "real", unit: "m/s" },
      { name: "acceleration", type: "real", unit: "m/s²" },
      { name: "wheel_torque", type: "real", unit: "Nm" },
    ],
  };

  // 默认模板数据
  const defaultData = {
    reviewSteps: [
      {
        id: "draft",
        name: "草稿",
        status: "completed",
        date: model.uploadTime,
        description: "初始版本已创建。",
      },
      {
        id: "published",
        name: "已发布",
        status:
          model.status === "已发布" ? "completed" : "pending",
        date:
          model.status === "已发布" ? model.uploadTime : "待定",
        description:
          model.status === "已发布"
            ? "模型发布成功。"
            : "等待发布",
      },
    ],
    qualityMetrics: [
      {
        name: "模型完整度",
        value: 85,
        color: "text-green-600",
      },
      {
        name: "文档完整度",
        value: 75,
        color: "text-yellow-600",
      },
      {
        name: "测试覆盖率",
        value: 60,
        color: "text-yellow-600",
      },
      {
        name: "健康度",
        value: 80,
        color: "text-green-600",
        icon: "💚",
      },
    ],
    versionHistory: [
      {
        version: model.version,
        date: model.uploadTime.split(" ")[0],
        author: model.uploader,
        status:
          model.status === "已发布" ? "已发布" : model.status,
        description: `${model.name}的当前版本，包含最新的模型更新和优化。`,
      },
      {
        version: `${parseFloat(model.version) - 0.1}`,
        date: new Date(
          new Date(model.uploadTime).getTime() -
            7 * 24 * 60 * 60 * 1000,
        )
          .toLocaleDateString("zh-CN")
          .replace(/\//g, "-"),
        author: model.uploader,
        status: "已归档",
        description: "修复了模型中的若干问题，提升了稳定性。",
      },
      {
        version: `${Math.floor(parseFloat(model.version))}.0.0`,
        date: new Date(
          new Date(model.uploadTime).getTime() -
            30 * 24 * 60 * 60 * 1000,
        )
          .toLocaleDateString("zh-CN")
          .replace(/\//g, "-"),
        author: model.uploader,
        status: "已归档",
        description: `【基线版本】${model.name}的初始发布版本，实现了核心功能。`,
      },
    ],
    relatedFiles: [
      {
        name: `${model.name}.${model.type.toLowerCase()}`,
        size: "1.5 MB",
      },
      { name: "Model_Documentation.pdf", size: "500 KB" },
    ],
    inputPorts: [
      { name: "input_signal", type: "real", unit: "V" },
    ],
    outputPorts: [
      { name: "output_signal", type: "real", unit: "V" },
    ],
  };

  // 根据模型选择数据
  const modelData = isVehicleDynamicsModel
    ? vehicleDynamicsData
    : defaultData;

  const getStepStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <CheckCircle className="w-5 h-5 text-green-600" />
        );
      case "in-progress":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case "pending":
        return (
          <AlertCircle className="w-5 h-5 text-gray-400" />
        );
      default:
        return (
          <AlertCircle className="w-5 h-5 text-gray-400" />
        );
    }
  };

  const CircularProgress = ({
    value,
    name,
    color,
    icon,
  }: any) => {
    const circumference = 2 * Math.PI * 45;
    const strokeDasharray = circumference;
    const strokeDashoffset =
      circumference - (value / 100) * circumference;

    const handleMetricClick = (metricName: string) => {
      const metricDetail = getMetricDetailInfo(
        metricName,
        value,
      );
      setSelectedMetric(metricDetail);
      setShowMetricDetail(true);
    };

    return (
      <div
        className="flex flex-col items-center cursor-pointer group transition-all duration-300 hover:scale-105 hover:shadow-lg rounded-lg p-4 hover:bg-white"
        onClick={() => handleMetricClick(name)}
      >
        <div className="relative w-24 h-24 group-hover:scale-110 transition-transform duration-300">
          <svg
            className="w-24 h-24 transform -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className={`transition-all duration-300 ${
                value >= 90
                  ? "text-green-500 group-hover:text-green-600"
                  : value >= 70
                    ? "text-yellow-500 group-hover:text-yellow-600"
                    : "text-red-500 group-hover:text-red-600"
              }`}
              style={{
                filter:
                  "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            {icon ? (
              <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                {icon}
              </span>
            ) : (
              <span
                className={`text-xl font-medium transition-all duration-300 group-hover:scale-110 ${color}`}
              >
                {value}%
              </span>
            )}
          </div>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <svg
              className="w-24 h-24 transform -rotate-90"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="47"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeDasharray="8,4"
                className="text-blue-400 animate-spin"
                style={{ animationDuration: "3s" }}
              />
            </svg>
          </div>
        </div>
        <span className="mt-2 text-sm text-gray-700 group-hover:text-gray-900 group-hover:font-medium transition-all duration-300">
          {name}
        </span>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1">
          <span className="text-xs text-blue-600">
            点击查看详情
          </span>
        </div>
      </div>
    );
  };

  const CustomNodeComponent = ({ data }: any) => {
    const getNodeStyle = (type: string) => {
      switch (type) {
        case "current":
          return {
            background:
              "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
            color: "white",
            border: "2px solid #1e40af",
            boxShadow: "0 8px 16px rgba(59, 130, 246, 0.3)",
          };
        case "upstream":
          return {
            background:
              "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            color: "white",
            border: "2px solid #059669",
            boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
          };
        case "downstream":
          return {
            background:
              "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
            color: "white",
            border: "2px solid #d97706",
            boxShadow: "0 4px 12px rgba(245, 158, 11, 0.3)",
          };
        default:
          return {
            background: "#ffffff",
            color: "#374151",
            border: "2px solid #d1d5db",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          };
      }
    };

    return (
      <div
        style={{
          ...getNodeStyle(data.nodeType),
          padding: "12px 16px",
          borderRadius: "8px",
          minWidth: "180px",
          textAlign: "center",
          transition: "all 0.3s ease",
        }}
        className="hover:scale-105 cursor-pointer"
      >
        <div className="font-medium text-sm">{data.label}</div>
        <div className="text-xs opacity-90 mt-1">
          {data.type}
        </div>
        <div className="text-xs opacity-75 mt-1">
          v{data.version}
        </div>
        {data.description && (
          <div className="text-xs opacity-75 mt-1">
            {data.description}
          </div>
        )}
      </div>
    );
  };

  const nodeTypes = {
    upstream: CustomNodeComponent,
    current: CustomNodeComponent,
    downstream: CustomNodeComponent,
  };

  // 处理模型操作
  const handleDownload = () => {
    toast.success(`开始下载模型: ${model.name}`);
  };

  const handleEdit = () => {
    toast.info(`编辑模型: ${model.name}`);
  };

  const handleShare = () => {
    toast.success(`模型分享链接已复制到剪贴板`);
  };

  // 质量徽章组件 - 公共库专用
  const QualityBadge = ({
    level,
    score,
  }: {
    level: string;
    score: number;
  }) => {
    const getBadgeStyle = (level: string) => {
      switch (level) {
        case "gold":
          return {
            bg: "bg-gradient-to-r from-yellow-400 to-yellow-600",
            icon: "🥇",
            text: "金牌模型",
            color: "text-yellow-900",
          };
        case "silver":
          return {
            bg: "bg-gradient-to-r from-gray-300 to-gray-500",
            icon: "🥈",
            text: "银牌模型",
            color: "text-gray-900",
          };
        case "bronze":
          return {
            bg: "bg-gradient-to-r from-orange-400 to-orange-600",
            icon: "🥉",
            text: "铜牌模型",
            color: "text-orange-900",
          };
        default:
          return {
            bg: "bg-gradient-to-r from-blue-400 to-blue-600",
            icon: "🏅",
            text: "认证模型",
            color: "text-blue-900",
          };
      }
    };

    const style = getBadgeStyle(level);
  };

  // 门槛检查组件 - 项目库专用
  const GateCheckItem = ({
    name,
    status,
    details,
    score,
  }: any) => {
    const getStatusStyle = (status: string) => {
      switch (status) {
        case "passed":
          return {
            icon: (
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            ),
            bg: "bg-green-50",
            border: "border-green-200",
          };
        case "warning":
          return {
            icon: (
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            ),
            bg: "bg-yellow-50",
            border: "border-yellow-200",
          };
        case "failed":
          return {
            icon: <X className="w-5 h-5 text-red-600" />,
            bg: "bg-red-50",
            border: "border-red-200",
          };
        default:
          return {
            icon: <Clock className="w-5 h-5 text-gray-600" />,
            bg: "bg-gray-50",
            border: "border-gray-200",
          };
      }
    };

    const style = getStatusStyle(status);

    return (
      <div
        className={`${style.bg} ${style.border} border rounded-lg p-4`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            {style.icon}
            <h4 className="font-medium text-gray-900">
              {name}
            </h4>
          </div>
          {score !== undefined && (
            <Badge
              variant={
                score >= 90
                  ? "default"
                  : score >= 70
                    ? "secondary"
                    : "destructive"
              }
            >
              {score}分
            </Badge>
          )}
        </div>
        <p className="text-sm text-gray-700">{details}</p>
      </div>
    );
  };

  // 自动核验报告组件 - 个人库和公共库共用
  const AutoValidationReport = ({
    isDetailed = false,
  }: {
    isDetailed?: boolean;
  }) => {
    const validationItems = [
      {
        name: "语法检查",
        status: "passed",
        message: "模型语法正确，无错误",
        details: isDetailed
          ? "已完成所有Modelica/Simulink语法规则检查，模型结构符合标准"
          : undefined,
      },
      {
        name: "依赖完整性",
        status: "passed",
        message: "所有依赖项已就绪",
        details: isDetailed
          ? "已验证所有外部库和工具箱依赖，版本兼容性良好"
          : undefined,
      },
      {
        name: "格式规范",
        status: "passed",
        message: "模型格式符合规范",
        details: isDetailed
          ? "命名规范、文件结构、注释完整性均符合团队标准"
          : undefined,
      },
      {
        name: "接口验证",
        status: "warning",
        message: "发现1个接口命名建议",
        details: isDetailed
          ? '建议将"output1"重命名为更具描述性的名称，提高可读性'
          : undefined,
      },
    ];

    return (
      <div className="space-y-4">
        {isDetailed && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <FileCheck className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">
                  公共库增强核验
                </h4>
                <p className="text-sm text-blue-800">
                  公共库模型经过更严格的自动核验流程，包括代码规范、文档完整性、性能基准等多维度检查，
                  确保模型质量达到对外复用标准。
                </p>
              </div>
            </div>
          </div>
        )}

        {validationItems.map((item, index) => (
          <div
            key={index}
            className={`border rounded-lg p-4 ${
              item.status === "passed"
                ? "bg-green-50 border-green-200"
                : item.status === "warning"
                  ? "bg-yellow-50 border-yellow-200"
                  : "bg-red-50 border-red-200"
            }`}
          >
            <div className="flex items-start space-x-3">
              {item.status === "passed" ? (
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              ) : item.status === "warning" ? (
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              ) : (
                <X className="w-5 h-5 text-red-600 mt-0.5" />
              )}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-gray-900">
                    {item.name}
                  </h4>
                  <Badge
                    variant={
                      item.status === "passed"
                        ? "default"
                        : item.status === "warning"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {item.status === "passed"
                      ? "通过"
                      : item.status === "warning"
                        ? "建议"
                        : "失败"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-700">
                  {item.message}
                </p>
                {isDetailed && item.details && (
                  <p className="text-xs text-gray-600 mt-2 pl-4 border-l-2 border-gray-300">
                    {item.details}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}

        {!isDetailed && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-gray-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900 mb-1">
                  个人库说明
                </h4>
                <p className="text-sm text-gray-700">
                  个人库模型自动核验仅提供参考建议，不会阻止模型的上传和使用。
                  建议根据核验报告优化模型质量，为后续发布到公共库或项目库做准备。
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // 获取库类型标签
  const getLibraryTypeLabel = () => {
    switch (libraryType) {
      case "personal":
        return {
          text: "个人库",
          color: "bg-blue-100 text-blue-800",
          icon: <User className="w-4 h-4" />,
        };
      case "public":
        return {
          text: "公共库",
          color: "bg-green-100 text-green-800",
          icon: <Globe className="w-4 h-4" />,
        };
      case "project":
        return {
          text: "项目库",
          color: "bg-purple-100 text-purple-800",
          icon: <Shield className="w-4 h-4" />,
        };
      default:
        return {
          text: "未知",
          color: "bg-gray-100 text-gray-800",
          icon: <Info className="w-4 h-4" />,
        };
    }
  };

  const libraryLabel = getLibraryTypeLabel();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部导航 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={onBack}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <div className="flex items-center space-x-3">
                  <h1 className="text-2xl font-semibold text-gray-900">
                    {model.name}
                  </h1>
                  <Badge
                    className={`${libraryLabel.color} flex items-center space-x-1`}
                  >
                    {libraryLabel.icon}
                    <span>{libraryLabel.text}</span>
                  </Badge>
                </div>
                <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                  <span className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{model.uploader}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {model.uploadTime.split(" ")[0]}
                    </span>
                  </span>
                  <Badge
                    variant={
                      model.status === "已发布"
                        ? "default"
                        : "secondary"
                    }
                    className={
                      model.status === "已发布"
                        ? "bg-green-100 text-green-800"
                        : model.status === "DRAFT"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-yellow-100 text-yellow-800"
                    }
                  >
                    {model.status === "已发布"
                      ? "已发布"
                      : model.status}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={handleDownload}
                className="flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>下载</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleEdit}
                className="flex items-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>编辑</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleShare}
                className="flex items-center space-x-2"
              >
                <Share className="w-4 h-4" />
                <span>分享</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* 模型描述 */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <p className="text-gray-700">{model.description}</p>
          </CardContent>
        </Card>

        {/* 标签页导航 - 根据��类型显示不同的Tab */}
        <Card>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <CardHeader>
              {libraryType === "personal" ? (
                <TabsList
                  className={`grid w-full ${model.status === "已发布" ? "grid-cols-5" : "grid-cols-4"}`}
                >
                  <TabsTrigger value="autoValidation">
                    <FileCheck className="w-4 h-4 mr-2" />
                    自动核验
                  </TabsTrigger>
                  <TabsTrigger value="quality">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    质量仪表盘
                  </TabsTrigger>
                  <TabsTrigger value="details">
                    <FileText className="w-4 h-4 mr-2" />
                    模型详情
                  </TabsTrigger>
                  <TabsTrigger value="lineage">
                    <GitBranch className="w-4 h-4 mr-2" />
                    依赖关系
                  </TabsTrigger>
                  {model.status === "已发布" && (
                    <TabsTrigger value="projectUsage">
                      <Target className="w-4 h-4 mr-2" />
                      项目应用
                    </TabsTrigger>
                  )}
                </TabsList>
              ) : libraryType === "public" ? (
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="qualityBadge">
                    <Medal className="w-4 h-4 mr-2" />
                    质量徽章
                  </TabsTrigger>
                  <TabsTrigger value="validationReport">
                    <FileCheck className="w-4 h-4 mr-2" />
                    核验报告
                  </TabsTrigger>
                  <TabsTrigger value="quality">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    质量仪表盘
                  </TabsTrigger>
                  <TabsTrigger value="details">
                    <FileText className="w-4 h-4 mr-2" />
                    模型详情
                  </TabsTrigger>
                  <TabsTrigger value="lineage">
                    <GitBranch className="w-4 h-4 mr-2" />
                    依赖关系
                  </TabsTrigger>
                </TabsList>
              ) : (
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="approvalProcess">
                    <Shield className="w-4 h-4 mr-2" />
                    审批流程
                  </TabsTrigger>
                  <TabsTrigger value="gateCheck">
                    <Zap className="w-4 h-4 mr-2" />
                    门槛检查
                  </TabsTrigger>
                  <TabsTrigger value="quality">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    质量仪表盘
                  </TabsTrigger>
                  <TabsTrigger value="details">
                    <FileText className="w-4 h-4 mr-2" />
                    模型详情
                  </TabsTrigger>
                  <TabsTrigger value="projectUsage">
                    <Target className="w-4 h-4 mr-2" />
                    项目应用
                  </TabsTrigger>
                  <TabsTrigger value="lineage">
                    <GitBranch className="w-4 h-4 mr-2" />
                    依赖关系
                  </TabsTrigger>
                </TabsList>
              )}
            </CardHeader>

            <CardContent className="p-6">
              {/* 个人库：自动核验 */}
              {libraryType === "personal" && (
                <TabsContent
                  value="autoValidation"
                  className="space-y-6"
                >
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      自动核验报告
                    </h3>
                    <p className="text-sm text-gray-600">
                      个人库模型已完成基础自动核验，以下为核验结果参考（不阻止使用）
                    </p>
                  </div>
                  <AutoValidationReport isDetailed={false} />
                </TabsContent>
              )}

              {/* 公共库：质量徽章 */}
              {libraryType === "public" && (
                <TabsContent
                  value="qualityBadge"
                  className="space-y-6"
                >
                  <QualityBadge level="gold" score={92} />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <Award className="w-8 h-8 text-yellow-600" />
                          <div>
                            <div className="text-sm text-gray-600">
                              质量等级
                            </div>
                            <div className="text-lg font-bold text-yellow-600">
                              金牌
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <Star className="w-8 h-8 text-blue-600" />
                          <div>
                            <div className="text-sm text-gray-600">
                              综合评分
                            </div>
                            <div className="text-lg font-bold text-blue-600">
                              92 / 100
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <TrendingUp className="w-8 h-8 text-green-600" />
                          <div>
                            <div className="text-sm text-gray-600">
                              推荐指数
                            </div>
                            <div className="text-lg font-bold text-green-600">
                              优秀
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>质量徽章说明</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm text-gray-700">
                        <div className="flex items-start space-x-2">
                          <span className="text-yellow-600 text-lg">
                            🥇
                          </span>
                          <div>
                            <span className="font-medium">
                              金牌模型 (90-100分)：
                            </span>
                            <span className="ml-2">
                              质量优秀，推荐优先使用，适合作为团队标准模型
                            </span>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <span className="text-gray-600 text-lg">
                            🥈
                          </span>
                          <div>
                            <span className="font-medium">
                              银牌模型 (75-89分)：
                            </span>
                            <span className="ml-2">
                              质量良好，可放心使用，部分指标有提升空间
                            </span>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <span className="text-orange-600 text-lg">
                            🥉
                          </span>
                          <div>
                            <span className="font-medium">
                              铜牌模型 (60-74分)：
                            </span>
                            <span className="ml-2">
                              基本可用，建议在使用前仔细评估和测试
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}

              {/* 公共库：核验报告（增强版） */}
              {libraryType === "public" && (
                <TabsContent
                  value="validationReport"
                  className="space-y-6"
                >
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      公共库增强核验报告
                    </h3>
                    <p className="text-sm text-gray-600">
                      公共库模型经过严格的自动核验流程，确保模型质量达到对外复用标准
                    </p>
                  </div>
                  <AutoValidationReport isDetailed={true} />
                </TabsContent>
              )}

              {/* 项目库：审批流程 */}
              {libraryType === "project" && (
                <TabsContent
                  value="approvalProcess"
                  className="space-y-6"
                >
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      项目库审批流程
                    </h3>
                    <p className="text-sm text-gray-600">
                      项目库是唯一需要审批的场景，确保进入项目的模型达到工程要求
                    </p>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        id: 1,
                        name: "提交发布",
                        status: "completed",
                        date: "2025-10-15 10:00",
                        description:
                          "模型已从个人库提交到项目库审批流程",
                        reviewer: "系统自动",
                      },
                      {
                        id: 2,
                        name: "自动验证（强化版）",
                        status: "completed",
                        date: "2025-10-15 10:05",
                        description:
                          "已完成构建检查、可运行性验证、性能基准测试",
                        reviewer: "自动化系统",
                      },
                      {
                        id: 3,
                        name: "研发经理审核",
                        status: "completed",
                        date: "2025-10-16 14:30",
                        description:
                          "技术审核通过，代码质量和设计架构符合要求",
                        reviewer: "张经理",
                      },
                      {
                        id: 4,
                        name: "项目经理批准",
                        status: "in-progress",
                        date: "待处理",
                        description: "等待项目经理最终批准",
                        reviewer: "李经理",
                      },
                      {
                        id: 5,
                        name: "发布到项目",
                        status: "pending",
                        date: "待定",
                        description:
                          "审批完成后将自动发布到项目库",
                        reviewer: "系统自动",
                      },
                    ].map((step) => (
                      <div
                        key={step.id}
                        className="flex items-start space-x-4"
                      >
                        <div className="flex-shrink-0">
                          {getStepStatusIcon(step.status)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900">
                              {step.name}
                            </h4>
                            <span className="text-sm text-gray-500">
                              {step.date}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {step.description}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <User className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              审核人: {step.reviewer}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                    <div className="flex items-start space-x-3">
                      <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900 mb-1">
                          例外机制
                        </h4>
                        <p className="text-sm text-blue-800">
                          项目Owner可以"带理由放行"未完全通过门槛的模型，所有放行操作将自动记录到审计日志中，
                          确保决策可追溯。
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              )}

              {/* 项目库：门槛检查 */}
              {libraryType === "project" && (
                <TabsContent
                  value="gateCheck"
                  className="space-y-6"
                >
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      门槛检查结果
                    </h3>
                    <p className="text-sm text-gray-600">
                      以下为项目库强化门槛检查项，确保模型性能、稳定性和接口一致性达标
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <GateCheckItem
                      name="构建/语法检查"
                      status="passed"
                      details="Error = 0, 关键Warning已全部在白名单内"
                      score={100}
                    />
                    <GateCheckItem
                      name="可运行性验证"
                      status="passed"
                      details="标准工况（短/中）全部通过，长跑稳定无崩溃"
                      score={100}
                    />
                    <GateCheckItem
                      name="性能/稳定性"
                      status="passed"
                      details="P95 ≤ 基线×1.08, 内存峰值 ≤ 基线×1.12, 长跑无NaN"
                      score={96}
                    />
                    <GateCheckItem
                      name="接口一致性"
                      status="passed"
                      details="端口、单位、速率与规范一致性达到95分"
                      score={95}
                    />
                    <GateCheckItem
                      name="文档完整性"
                      status="passed"
                      details="README、变更日志、复现脚本等最小集齐全"
                      score={92}
                    />
                  </div>

                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>门槛配置说明</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">
                          1. 构建/语法门槛
                        </h4>
                        <ul className="text-sm text-gray-700 space-y-1 ml-4">
                          <li>
                            • Error = 0：不允许任何编译错误
                          </li>
                          <li>
                            •
                            关键Warning白名单内：严重警告必须在预定义白名单中
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">
                          2. 可运行性门槛
                        </h4>
                        <ul className="text-sm text-gray-700 space-y-1 ml-4">
                          <li>
                            •
                            标准工况全部通过：短时和中时仿真必须成功完成
                          </li>
                          <li>
                            •
                            长跑无崩溃：长时间运行测试无异常终止
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">
                          3. 性能/稳定性门槛（可配置）
                        </h4>
                        <ul className="text-sm text-gray-700 space-y-1 ml-4">
                          <li>• P95性能 ≤ 基线×(1+10%)</li>
                          <li>• 内存峰值 ≤ 基线×(1+15%)</li>
                          <li>• 长跑无NaN/崩溃</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">
                          4. 接口一致性门槛
                        </h4>
                        <ul className="text-sm text-gray-700 space-y-1 ml-4">
                          <li>
                            • 端口/单位/速率与规范一致性 ≥ 90分
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">
                          5. 文档门槛
                        </h4>
                        <ul className="text-sm text-gray-700 space-y-1 ml-4">
                          <li>
                            •
                            最小集齐全：README、变更日志、复现脚本必须提供
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}

              {/* 质量仪表盘 - 所有库类型共用 */}
              <TabsContent
                value="quality"
                className="space-y-6"
              >
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {modelData.qualityMetrics.map(
                    (metric, index) => (
                      <CircularProgress
                        key={index}
                        value={metric.value}
                        name={metric.name}
                        color={metric.color}
                        icon={metric.icon}
                      />
                    ),
                  )}
                </div>
              </TabsContent>

              {/* 模型详情 - 所有库类型共用 */}
              <TabsContent
                value="details"
                className="space-y-6"
              >
                {/* 解析结果 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span>模型解析结果</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* 左侧：表格信息 */}
                      <div className="space-y-4">
                        {/* 基本信息表格 */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">
                            基本信息
                          </h4>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-1/3">
                                  属性
                                </TableHead>
                                <TableHead>值</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell className="font-medium">
                                  模型类型
                                </TableCell>
                                <TableCell>
                                  {modelParseData.modelType}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">
                                  版本
                                </TableCell>
                                <TableCell>
                                  {modelParseData.version}
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>

                        {/* 依赖项表格 */}
                        {modelParseData.dependencies.length >
                          0 && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">
                              依赖项
                            </h4>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-12">
                                    #
                                  </TableHead>
                                  <TableHead>
                                    依赖项名称
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {modelParseData.dependencies.map(
                                  (dep, index) => (
                                    <TableRow key={index}>
                                      <TableCell>
                                        {index + 1}
                                      </TableCell>
                                      <TableCell>
                                        {dep}
                                      </TableCell>
                                    </TableRow>
                                  ),
                                )}
                              </TableBody>
                            </Table>
                          </div>
                        )}

                        {/* 接口表格 */}
                        {modelParseData.interfaces.length >
                          0 && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">
                              输入/输出接口
                            </h4>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-12">
                                    #
                                  </TableHead>
                                  <TableHead>
                                    接口名称
                                  </TableHead>
                                  <TableHead>类型</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {modelParseData.interfaces.map(
                                  (intf, index) => (
                                    <TableRow key={index}>
                                      <TableCell>
                                        {index + 1}
                                      </TableCell>
                                      <TableCell>
                                        {intf}
                                      </TableCell>
                                      <TableCell>
                                        <Badge
                                          variant={
                                            intf.includes("In")
                                              ? "destructive"
                                              : "default"
                                          }
                                        >
                                          {intf.includes("In")
                                            ? "输入"
                                            : "输出"}
                                        </Badge>
                                      </TableCell>
                                    </TableRow>
                                  ),
                                )}
                              </TableBody>
                            </Table>
                          </div>
                        )}
                      </div>

                      {/* 右侧：Simulink模型预览图 */}
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">
                            SysML模型预览图
                          </h4>
                          <div className="border border-gray-200 rounded-lg p-4 bg-white">
                            <img
                              src="figma:asset/a1810cd2b5972458d52e688d2e86d229d732248f.png"
                              alt="sysml模型预览"
                              className="w-full h-auto object-contain"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 组件表格 - 全宽显示 */}
                    {modelParseData.components.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                          模型组件
                        </h4>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-12">
                                #
                              </TableHead>
                              <TableHead>组件名称</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {modelParseData.components.map(
                              (comp, index) => (
                                <TableRow key={index}>
                                  <TableCell>
                                    {index + 1}
                                  </TableCell>
                                  <TableCell>{comp}</TableCell>
                                </TableRow>
                              ),
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    )}

                    {/* 参数表格 - 全宽显示 */}
                    {modelParseData.parameters.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                          模型参数
                        </h4>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>参数名</TableHead>
                              <TableHead>值</TableHead>
                              <TableHead>类型</TableHead>
                              <TableHead>单位</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {modelParseData.parameters.map(
                              (param, index) => (
                                <TableRow key={index}>
                                  <TableCell className="font-medium">
                                    {param.name}
                                  </TableCell>
                                  <TableCell>
                                    {param.value}
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant="outline">
                                      {param.type}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    {param.unit || "-"}
                                  </TableCell>
                                </TableRow>
                              ),
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* 版本历史 */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          <GitBranch className="w-5 h-5 text-blue-600" />
                          <span>版本历史</span>
                        </CardTitle>
                        <CardDescription className="mt-1">
                          共 {modelData.versionHistory.length}{" "}
                          个版本提交
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setShowVersionComparison(true)
                          }
                        >
                          <BarChart3 className="w-4 h-4 mr-1" />
                          对比版本
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setShowVersionHistory(true)
                          }
                        >
                          <Clock className="w-4 h-4 mr-1" />
                          完整历史
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* 版本统计概览 */}
                    <div className="grid grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="text-center">
                        <div className="text-2xl font-semibold text-blue-600">
                          {modelData.versionHistory.length}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          总提交数
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-semibold text-green-600">
                          {
                            modelData.versionHistory.filter(
                              (v) => v.status === "已发布",
                            ).length
                          }
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          已发布
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-semibold text-yellow-600">
                          {
                            modelData.versionHistory.filter(
                              (v) => v.status === "审核中",
                            ).length
                          }
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          审核中
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-semibold text-gray-600">
                          {
                            modelData.versionHistory.filter(
                              (v) => v.status === "已归档",
                            ).length
                          }
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          已归档
                        </div>
                      </div>
                    </div>

                    {/* 版本时间线 */}
                    <div className="space-y-3">
                      {(() => {
                        const totalVersions =
                          modelData.versionHistory.length;
                        let displayVersions: any[] = [];
                        let showEllipsis = false;

                        // 如果总数小于等于5，显示全部
                        if (totalVersions <= 5) {
                          displayVersions =
                            modelData.versionHistory;
                        } else {
                          // 否则显示最近的4个和最初的1个
                          const recentVersions =
                            modelData.versionHistory.slice(
                              0,
                              4,
                            ); // 最近的4个
                          const firstVersion = [
                            modelData.versionHistory[
                              totalVersions - 1
                            ],
                          ]; // 最初的1个
                          displayVersions = [
                            ...recentVersions,
                            ...firstVersion,
                          ];
                          showEllipsis = true;
                        }

                        return displayVersions.map(
                          (version, displayIndex) => {
                            // 找到版本在原始列表中的索引
                            const originalIndex =
                              modelData.versionHistory.findIndex(
                                (v: any) =>
                                  v.version === version.version,
                              );
                            const isLatest =
                              originalIndex === 0;
                            const isFirst =
                              originalIndex ===
                              totalVersions - 1; // 是否是初始版本
                            const isBaseline =
                              version.version.endsWith(".0");
                            const versionType = isBaseline
                              ? "基线版本"
                              : "修订版本";

                            // 计算文件变更统计（模拟数据）
                            const changes = {
                              added:
                                Math.floor(Math.random() * 50) +
                                10,
                              modified:
                                Math.floor(Math.random() * 30) +
                                5,
                              deleted: Math.floor(
                                Math.random() * 20,
                              ),
                            };

                            return (
                              <React.Fragment
                                key={displayIndex}
                              >
                                {/* 在最近4个版本之后和最初版本之前显示省略号 */}
                                {showEllipsis &&
                                  displayIndex === 4 && (
                                    <div className="relative pl-8 pb-3">
                                      <div className="flex items-center space-x-3 py-4">
                                        <div className="flex flex-col items-center space-y-1">
                                          <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                                          <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                                          <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                                        </div>
                                        <span className="text-sm text-gray-500">
                                          隐藏{" "}
                                          {totalVersions - 5}{" "}
                                          个历史版本
                                        </span>
                                      </div>
                                    </div>
                                  )}

                                <div
                                  className={`relative pl-8 pb-3 border-l-2 ${
                                    isLatest
                                      ? "border-blue-500"
                                      : isFirst
                                        ? "border-amber-500"
                                        : "border-gray-300"
                                  } ${displayIndex === displayVersions.length - 1 ? "border-l-0" : ""}`}
                                >
                                  {/* 版本节点图标 */}
                                  <div
                                    className={`absolute left-0 -translate-x-1/2 w-4 h-4 rounded-full border-2 ${
                                      isLatest
                                        ? "bg-blue-500 border-blue-600"
                                        : isFirst
                                          ? "bg-amber-500 border-amber-600"
                                          : isBaseline
                                            ? "bg-green-500 border-green-600"
                                            : "bg-gray-400 border-gray-500"
                                    }`}
                                  />

                                  {/* 版本卡片 */}
                                  <div
                                    className={`bg-white rounded-lg border p-4 hover:shadow-md transition-shadow ${
                                      isLatest
                                        ? "border-blue-200 bg-blue-50/30"
                                        : isFirst
                                          ? "border-amber-200 bg-amber-50/30"
                                          : "border-gray-200"
                                    }`}
                                  >
                                    {/* 版本头部 */}
                                    <div className="flex items-start justify-between mb-3">
                                      <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-1">
                                          <h4 className="font-semibold text-lg">
                                            v{version.version}
                                          </h4>
                                          {isLatest && (
                                            <Badge
                                              variant="default"
                                              className="bg-blue-600"
                                            >
                                              <Zap className="w-3 h-3 mr-1" />
                                              最新版本
                                            </Badge>
                                          )}
                                          {isFirst && (
                                            <Badge
                                              variant="default"
                                              className="bg-amber-600"
                                            >
                                              <Medal className="w-3 h-3 mr-1" />
                                              初始版本
                                            </Badge>
                                          )}
                                          <Badge
                                            variant={
                                              isBaseline
                                                ? "default"
                                                : "outline"
                                            }
                                            className={
                                              isBaseline
                                                ? "bg-green-600"
                                                : ""
                                            }
                                          >
                                            <Tag className="w-3 h-3 mr-1" />
                                            {versionType}
                                          </Badge>
                                          <Badge
                                            variant={
                                              version.status ===
                                              "已发布"
                                                ? "default"
                                                : version.status ===
                                                    "审核中"
                                                  ? "secondary"
                                                  : "outline"
                                            }
                                          >
                                            {version.status}
                                          </Badge>
                                        </div>

                                        {/* 版本描述 */}
                                        <p className="text-sm text-gray-700 mb-2">
                                          {version.description}
                                        </p>

                                        {/* 作者和时间 */}
                                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                                          <div className="flex items-center space-x-1">
                                            <User className="w-3 h-3" />
                                            <span>
                                              {version.author}
                                            </span>
                                          </div>
                                          <div className="flex items-center space-x-1">
                                            <Calendar className="w-3 h-3" />
                                            <span>
                                              {version.date}
                                            </span>
                                          </div>
                                        </div>
                                      </div>

                                      {/* 操作按钮 */}
                                      <div className="flex items-center space-x-1 ml-4">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() =>
                                            toast.info(
                                              `查看 v${version.version} 详情`,
                                            )
                                          }
                                          title="查看详情"
                                        >
                                          <FileText className="w-4 h-4" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() =>
                                            toast.info(
                                              `下载 v${version.version}`,
                                            )
                                          }
                                          title="下载版本"
                                        >
                                          <Download className="w-4 h-4" />
                                        </Button>
                                        {!isLatest && (
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                              toast.info(
                                                `回滚到 v${version.version}`,
                                              )
                                            }
                                            title="回滚到此���本"
                                          >
                                            <Activity className="w-4 h-4" />
                                          </Button>
                                        )}
                                      </div>
                                    </div>

                                    {/* 文件变更统计 */}
                                    <div className="flex items-center space-x-4 pt-3 border-t border-gray-200">
                                      <div className="flex items-center space-x-1 text-xs">
                                        <div className="w-2 h-2 rounded-full bg-green-500" />
                                        <span className="text-green-600 font-medium">
                                          +{changes.added}
                                        </span>
                                        <span className="text-gray-500">
                                          新增
                                        </span>
                                      </div>
                                      <div className="flex items-center space-x-1 text-xs">
                                        <div className="w-2 h-2 rounded-full bg-yellow-500" />
                                        <span className="text-yellow-600 font-medium">
                                          ~{changes.modified}
                                        </span>
                                        <span className="text-gray-500">
                                          修改
                                        </span>
                                      </div>
                                      {changes.deleted > 0 && (
                                        <div className="flex items-center space-x-1 text-xs">
                                          <div className="w-2 h-2 rounded-full bg-red-500" />
                                          <span className="text-red-600 font-medium">
                                            -{changes.deleted}
                                          </span>
                                          <span className="text-gray-500">
                                            删除
                                          </span>
                                        </div>
                                      )}
                                      <div className="flex-1" />
                                      <Button
                                        variant="link"
                                        size="sm"
                                        className="text-xs h-auto p-0"
                                        onClick={() => {
                                          setSelectedVersionChange(
                                            {
                                              ...version,
                                              changes,
                                            },
                                          );
                                          setShowChangeDetails(
                                            true,
                                          );
                                        }}
                                      >
                                        查看变更详情 →
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </React.Fragment>
                            );
                          },
                        );
                      })()}
                    </div>

                    {/* 底部操作 */}
                    <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        最早版本于{" "}
                        {
                          modelData.versionHistory[
                            modelData.versionHistory.length - 1
                          ]?.date
                        }{" "}
                        创建
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toast.info("创建新版本")}
                      >
                        <GitBranch className="w-4 h-4 mr-1" />
                        创建新版本
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* 相关文件 */}
                <Card>
                  <CardHeader>
                    <CardTitle>相关文件</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {modelData.relatedFiles.map(
                        (file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <File className="w-5 h-5 text-gray-400" />
                              <span className="font-medium">
                                {file.name}
                              </span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className="text-sm text-gray-500">
                                {file.size}
                              </span>
                              <Button
                                size="sm"
                                variant="outline"
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 项目库：项目应用Tab */}
              {libraryType === "project" && (
                <TabsContent
                  value="projectUsage"
                  className="space-y-6"
                >
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      项目应用统计
                    </h3>
                    <p className="text-sm text-gray-600">
                      此模型在项目库中的实际应用情况统计
                    </p>
                  </div>

                  {/* 使用统计卡片 */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <Target className="w-8 h-8 text-blue-600" />
                          <div>
                            <div className="text-sm text-gray-600">
                              应用项目数
                            </div>
                            <div className="text-2xl font-bold text-blue-600">
                              {model.projectApplications
                                ?.length || 0}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <Activity className="w-8 h-8 text-green-600" />
                          <div>
                            <div className="text-sm text-gray-600">
                              总应用次数
                            </div>
                            <div className="text-2xl font-bold text-green-600">
                              {model.projectApplications?.reduce(
                                (sum, proj) =>
                                  sum + proj.useCount,
                                0,
                              ) || 0}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <TrendingUp className="w-8 h-8 text-purple-600" />
                          <div>
                            <div className="text-sm text-gray-600">
                              活跃项目数
                            </div>
                            <div className="text-2xl font-bold text-purple-600">
                              {model.projectApplications?.filter(
                                (p) => p.status === "进行中",
                              ).length || 0}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* 项目应用列表 */}
                  <Card>
                    <CardHeader>
                      <CardTitle>应用此模型的项目</CardTitle>
                      <CardDescription>
                        按应用频次排序，显示该模型在项目中的实际应用情况
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {model.projectApplications &&
                      model.projectApplications.length > 0 ? (
                        <div className="space-y-4">
                          {model.projectApplications
                            .sort(
                              (a, b) => b.useCount - a.useCount,
                            )
                            .map((project) => (
                              <div
                                key={project.id}
                                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-1">
                                      <h4 className="font-medium text-gray-900">
                                        {project.name}
                                      </h4>
                                      <Badge
                                        variant={
                                          project.status ===
                                          "进行中"
                                            ? "default"
                                            : project.status ===
                                                "已完成"
                                              ? "secondary"
                                              : "outline"
                                        }
                                        className={
                                          project.status ===
                                          "进行中"
                                            ? "bg-blue-100 text-blue-800"
                                            : project.status ===
                                                "已完成"
                                              ? "bg-green-100 text-green-800"
                                              : "bg-gray-100 text-gray-800"
                                        }
                                      >
                                        {project.status}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">
                                      {project.description}
                                    </p>
                                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                                      <span className="flex items-center space-x-1">
                                        <User className="w-3 h-3" />
                                        <span>
                                          {project.team}
                                        </span>
                                      </span>
                                      <span className="flex items-center space-x-1">
                                        <Calendar className="w-3 h-3" />
                                        <span>
                                          最后使用:{" "}
                                          {project.lastUsed}
                                        </span>
                                      </span>
                                    </div>
                                  </div>
                                  <div className="ml-4 text-right">
                                    <div className="text-2xl font-bold text-blue-600">
                                      {project.useCount}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      使用次数
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            暂无项目应用记录
                          </h3>
                          <p className="text-sm text-gray-500">
                            该模型尚未被任何项目使用
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* 应用趋势图 */}
                  <Card>
                    <CardHeader>
                      <CardTitle>应用趋势</CardTitle>
                      <CardDescription>
                        过去7天该模型在项目中的应用趋势
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* 活跃项目统计 */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-blue-700">
                                活跃项目
                              </span>
                              <TrendingUp className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="text-2xl font-bold text-blue-900">
                              {model.projectApplications
                                ?.length || 0}
                            </div>
                            <div className="text-xs text-blue-600 mt-1">
                              正在使用此模型
                            </div>
                          </div>

                          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-green-700">
                                总使用次数
                              </span>
                              <Activity className="w-4 h-4 text-green-600" />
                            </div>
                            <div className="text-2xl font-bold text-green-900">
                              {model.projectApplications?.reduce(
                                (sum, app) =>
                                  sum + (app.useCount || 0),
                                0,
                              ) || 0}
                            </div>
                            <div className="text-xs text-green-600 mt-1">
                              跨所有项目
                            </div>
                          </div>

                          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-orange-700">
                                最近使用
                              </span>
                              <Clock className="w-4 h-4 text-orange-600" />
                            </div>
                            <div className="text-lg font-bold text-orange-900">
                              {model.projectApplications?.[0]
                                ?.lastUsed || "未知"}
                            </div>
                            <div className="text-xs text-orange-600 mt-1">
                              最后活动时间
                            </div>
                          </div>
                        </div>

                        {/* 简化的趋势图表 */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                          <h4 className="font-medium text-gray-900 mb-4">
                            应用趋势分析
                          </h4>

                          {/* 趋势数据表格 */}
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead>
                                <tr className="border-b border-gray-200">
                                  <th className="text-left py-2 px-3 text-xs text-gray-600">
                                    日期
                                  </th>
                                  <th className="text-left py-2 px-3 text-xs text-gray-600">
                                    周
                                  </th>
                                  <th className="text-left py-2 px-3 text-xs text-gray-600">
                                    应用次数
                                  </th>
                                  <th className="text-left py-2 px-3 text-xs text-gray-600">
                                    趋势
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b border-gray-100 hover:bg-purple-50">
                                  <td className="py-2 px-3 text-sm text-gray-900">
                                    10-14
                                  </td>
                                  <td className="py-2 px-3 text-sm text-gray-600">
                                    周一
                                  </td>
                                  <td className="py-2 px-3 text-sm font-medium text-purple-600">
                                    12 次
                                  </td>
                                  <td className="py-2 px-3">
                                    <div className="w-24 bg-gray-200 rounded-full h-2">
                                      <div
                                        className="bg-purple-500 h-2 rounded-full"
                                        style={{ width: "40%" }}
                                      ></div>
                                    </div>
                                  </td>
                                </tr>
                                <tr className="border-b border-gray-100 hover:bg-purple-50">
                                  <td className="py-2 px-3 text-sm text-gray-900">
                                    10-15
                                  </td>
                                  <td className="py-2 px-3 text-sm text-gray-600">
                                    周二
                                  </td>
                                  <td className="py-2 px-3 text-sm font-medium text-purple-600">
                                    18 次
                                  </td>
                                  <td className="py-2 px-3">
                                    <div className="w-24 bg-gray-200 rounded-full h-2">
                                      <div
                                        className="bg-purple-500 h-2 rounded-full"
                                        style={{ width: "60%" }}
                                      ></div>
                                    </div>
                                  </td>
                                </tr>
                                <tr className="border-b border-gray-100 hover:bg-purple-50">
                                  <td className="py-2 px-3 text-sm text-gray-900">
                                    10-16
                                  </td>
                                  <td className="py-2 px-3 text-sm text-gray-600">
                                    周三
                                  </td>
                                  <td className="py-2 px-3 text-sm font-medium text-purple-600">
                                    15 次
                                  </td>
                                  <td className="py-2 px-3">
                                    <div className="w-24 bg-gray-200 rounded-full h-2">
                                      <div
                                        className="bg-purple-500 h-2 rounded-full"
                                        style={{ width: "50%" }}
                                      ></div>
                                    </div>
                                  </td>
                                </tr>
                                <tr className="border-b border-gray-100 hover:bg-purple-50">
                                  <td className="py-2 px-3 text-sm text-gray-900">
                                    10-17
                                  </td>
                                  <td className="py-2 px-3 text-sm text-gray-600">
                                    周四
                                  </td>
                                  <td className="py-2 px-3 text-sm font-medium text-purple-600">
                                    22 次
                                  </td>
                                  <td className="py-2 px-3">
                                    <div className="w-24 bg-gray-200 rounded-full h-2">
                                      <div
                                        className="bg-purple-500 h-2 rounded-full"
                                        style={{ width: "73%" }}
                                      ></div>
                                    </div>
                                  </td>
                                </tr>
                                <tr className="border-b border-gray-100 hover:bg-purple-50">
                                  <td className="py-2 px-3 text-sm text-gray-900">
                                    10-18
                                  </td>
                                  <td className="py-2 px-3 text-sm text-gray-600">
                                    周五
                                  </td>
                                  <td className="py-2 px-3 text-sm font-medium text-purple-600">
                                    28 次
                                  </td>
                                  <td className="py-2 px-3">
                                    <div className="w-24 bg-gray-200 rounded-full h-2">
                                      <div
                                        className="bg-purple-500 h-2 rounded-full"
                                        style={{ width: "93%" }}
                                      ></div>
                                    </div>
                                  </td>
                                </tr>
                                <tr className="border-b border-gray-100 hover:bg-purple-50">
                                  <td className="py-2 px-3 text-sm text-gray-900">
                                    10-19
                                  </td>
                                  <td className="py-2 px-3 text-sm text-gray-600">
                                    周六
                                  </td>
                                  <td className="py-2 px-3 text-sm font-medium text-purple-600">
                                    25 次
                                  </td>
                                  <td className="py-2 px-3">
                                    <div className="w-24 bg-gray-200 rounded-full h-2">
                                      <div
                                        className="bg-purple-500 h-2 rounded-full"
                                        style={{ width: "83%" }}
                                      ></div>
                                    </div>
                                  </td>
                                </tr>
                                <tr className="hover:bg-purple-50">
                                  <td className="py-2 px-3 text-sm text-gray-900">
                                    10-20
                                  </td>
                                  <td className="py-2 px-3 text-sm text-gray-600">
                                    今日
                                  </td>
                                  <td className="py-2 px-3 text-sm font-medium text-purple-600">
                                    20 次
                                  </td>
                                  <td className="py-2 px-3">
                                    <div className="w-24 bg-gray-200 rounded-full h-2">
                                      <div
                                        className="bg-purple-500 h-2 rounded-full"
                                        style={{ width: "67%" }}
                                      ></div>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          {/* 统计总结 */}
                          <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-purple-500 rounded"></div>
                              <span className="text-gray-600">
                                应用次数
                              </span>
                            </div>
                            <div className="text-gray-500">
                              本周总计:{" "}
                              <span className="font-medium text-purple-600">
                                140次
                              </span>
                            </div>
                            <div className="text-gray-500">
                              日均:{" "}
                              <span className="font-medium text-purple-600">
                                20次
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 应用场景分析 */}
                  <Card className="border-2 border-blue-200 bg-blue-50/30">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Info className="w-5 h-5 text-blue-600" />
                        <span>应用场景分析</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="p-3 bg-white rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">
                          主要应用领域
                        </h4>
                        <ul className="space-y-1 text-sm text-gray-700">
                          <li className="flex items-start space-x-2">
                            <span className="text-blue-600 mt-1">
                              •
                            </span>
                            <span>
                              发动机控制策略开发与验证
                            </span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <span className="text-blue-600 mt-1">
                              •
                            </span>
                            <span>排放标准合规性测试</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <span className="text-blue-600 mt-1">
                              •
                            </span>
                            <span>整车动力系统集成验证</span>
                          </li>
                        </ul>
                      </div>

                      <div className="p-3 bg-white rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">
                          应用反馈
                        </h4>
                        <ul className="space-y-1 text-sm text-gray-700">
                          <li className="flex items-start space-x-2">
                            <span className="text-green-600 mt-1">
                              ✓
                            </span>
                            <span>
                              模型精度高，仿真结果与实测数据吻合度达92%以上
                            </span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <span className="text-green-600 mt-1">
                              ✓
                            </span>
                            <span>
                              接口设计合理，易于与整车系统集成
                            </span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <span className="text-green-600 mt-1">
                              ✓
                            </span>
                            <span>
                              文档详细��降低了团队的学习成本
                            </span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <span className="text-blue-600 mt-1">
                              •
                            </span>
                            <span>
                              建议增加更多边界条件的测试用例
                            </span>
                          </li>
                        </ul>
                      </div>

                      <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg text-white">
                        <h4 className="font-medium mb-2">
                          综合评价
                        </h4>
                        <p className="text-sm text-blue-50">
                          该模型在项目库中表现优秀，被多个关键项目广泛应用，获得了团队的一致好评。
                          建议继续保持高质量标准，并根据项目反馈进行持续优化。
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}

              {/* 依赖关系 - 所有库类型共用 */}
              <TabsContent
                value="lineage"
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>模型依赖关系图</CardTitle>
                    <CardDescription>
                      显示当前模型与其他模型之间的依赖关系
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div style={{ height: "500px" }}>
                      <ReactFlow
                        nodes={lineageData.nodes.map(
                          (node) => ({
                            ...node,
                            data: {
                              ...node.data,
                              nodeType: node.type,
                            },
                          }),
                        )}
                        edges={lineageData.edges}
                        nodeTypes={nodeTypes}
                        fitView
                        attributionPosition="bottom-left"
                      >
                        <Background />
                        <Controls />
                        <MiniMap />
                      </ReactFlow>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 个人库：项目应用Tab - 仅当模型已发布时显示 */}
              {libraryType === "personal" &&
                model.status === "已发布" && (
                  <TabsContent
                    value="projectUsage"
                    className="space-y-6"
                  >
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        项目应用统计
                      </h3>
                      <p className="text-sm text-gray-600">
                        此模型已发布到项目库，以下是该模型镜像在项目中的实际应用情况统计
                      </p>
                    </div>

                    {/* 使用统计卡片 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <Target className="w-8 h-8 text-blue-600" />
                            <div>
                              <div className="text-sm text-gray-600">
                                应用项目数
                              </div>
                              <div className="text-2xl font-bold text-blue-600">
                                {model.projectApplications
                                  ?.length || 0}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <Activity className="w-8 h-8 text-green-600" />
                            <div>
                              <div className="text-sm text-gray-600">
                                总应用次数
                              </div>
                              <div className="text-2xl font-bold text-green-600">
                                {model.projectApplications?.reduce(
                                  (sum, proj) =>
                                    sum + proj.useCount,
                                  0,
                                ) || 0}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <TrendingUp className="w-8 h-8 text-purple-600" />
                            <div>
                              <div className="text-sm text-gray-600">
                                活跃项目数
                              </div>
                              <div className="text-2xl font-bold text-purple-600">
                                {model.projectApplications?.filter(
                                  (p) => p.status === "进行中",
                                ).length || 0}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* 项目应用列表 */}
                    <Card>
                      <CardHeader>
                        <CardTitle>应用此模型的项目</CardTitle>
                        <CardDescription>
                          按应用频次排序，显示项目库中该模型镜像的实际应用情况
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {model.projectApplications &&
                        model.projectApplications.length > 0 ? (
                          <div className="space-y-4">
                            {model.projectApplications
                              .sort(
                                (a, b) =>
                                  b.useCount - a.useCount,
                              )
                              .map((project) => (
                                <div
                                  key={project.id}
                                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                                >
                                  <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                      <div className="flex items-center space-x-3 mb-1">
                                        <h4 className="font-medium text-gray-900">
                                          {project.name}
                                        </h4>
                                        <Badge
                                          variant={
                                            project.status ===
                                            "进行中"
                                              ? "default"
                                              : project.status ===
                                                  "已完成"
                                                ? "secondary"
                                                : "outline"
                                          }
                                          className={
                                            project.status ===
                                            "进行中"
                                              ? "bg-blue-100 text-blue-800"
                                              : project.status ===
                                                  "已完成"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-gray-100 text-gray-800"
                                          }
                                        >
                                          {project.status}
                                        </Badge>
                                      </div>
                                      <p className="text-sm text-gray-600 mb-2">
                                        {project.description}
                                      </p>
                                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                                        <span className="flex items-center space-x-1">
                                          <User className="w-3 h-3" />
                                          <span>
                                            {project.team}
                                          </span>
                                        </span>
                                        <span className="flex items-center space-x-1">
                                          <Calendar className="w-3 h-3" />
                                          <span>
                                            最后使用:{" "}
                                            {project.lastUsed}
                                          </span>
                                        </span>
                                      </div>
                                    </div>
                                    <div className="ml-4 text-right">
                                      <div className="text-2xl font-bold text-blue-600">
                                        {project.useCount}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        使用次数
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                              暂无项目应用记录
                            </h3>
                            <p className="text-sm text-gray-500">
                              该模型已发布到项目库，但尚未被任何项目使用
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* 应用趋势图 */}
                    <Card>
                      <CardHeader>
                        <CardTitle>应用趋势</CardTitle>
                        <CardDescription>
                          过去30天项目库中该模型镜像的应用趋势
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                          <div className="text-center space-y-2">
                            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto" />
                            <p className="text-sm text-gray-500">
                              应用趋势图表（可视化数据）
                            </p>
                            <p className="text-xs text-gray-400">
                              显示每日应用次数、活跃项目数等统计信息
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* 应用场景分析 */}
                    <Card className="border-2 border-blue-200 bg-blue-50/30">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Info className="w-5 h-5 text-blue-600" />
                          <span>应用场景分析</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="p-3 bg-white rounded-lg">
                          <h4 className="font-medium text-blue-900 mb-2">
                            主要应用领域
                          </h4>
                          <ul className="space-y-1 text-sm text-gray-700">
                            <li className="flex items-start space-x-2">
                              <span className="text-blue-600 mt-1">
                                •
                              </span>
                              <span>
                                电池管理系统(BMS)控制策略开发与验证
                              </span>
                            </li>
                            <li className="flex items-start space-x-2">
                              <span className="text-blue-600 mt-1">
                                •
                              </span>
                              <span>
                                混合动力系统能量管理优化
                              </span>
                            </li>
                            <li className="flex items-start space-x-2">
                              <span className="text-blue-600 mt-1">
                                •
                              </span>
                              <span>车辆安全系统集成测试</span>
                            </li>
                          </ul>
                        </div>

                        <div className="p-3 bg-white rounded-lg">
                          <h4 className="font-medium text-blue-900 mb-2">
                            应用反馈
                          </h4>
                          <ul className="space-y-1 text-sm text-gray-700">
                            <li className="flex items-start space-x-2">
                              <span className="text-green-600 mt-1">
                                ✓
                              </span>
                              <span>
                                模型精度高，仿真结果与实测数据吻合度达95%以上
                              </span>
                            </li>
                            <li className="flex items-start space-x-2">
                              <span className="text-green-600 mt-1">
                                ✓
                              </span>
                              <span>
                                接口设计合理，易于与其他系统集成
                              </span>
                            </li>
                            <li className="flex items-start space-x-2">
                              <span className="text-green-600 mt-1">
                                ✓
                              </span>
                              <span>
                                文档完善，降低了团队的学习成本
                              </span>
                            </li>
                            <li className="flex items-start space-x-2">
                              <span className="text-blue-600 mt-1">
                                •
                              </span>
                              <span>
                                建议增加更多参数可配置性，以适应不同车型需求
                              </span>
                            </li>
                          </ul>
                        </div>

                        <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg text-white">
                          <h4 className="font-medium mb-2">
                            综合评价
                          </h4>
                          <p className="text-sm text-blue-50">
                            该模型在项目库中表现优秀，被广泛应用于多个关键项目，获得了团队的一致好评。
                            建议继续保持高质量标准，并根据项目反馈进行持续优化。
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                )}
            </CardContent>
          </Tabs>
        </Card>
      </div>

      {/* 指标详情弹窗 */}
      {showMetricDetail && selectedMetric && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedMetric.name}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedMetric.description}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMetricDetail(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-6">
                {/* 指标概览 */}
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
                    {selectedMetric.value}%
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {selectedMetric.category}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedMetric.details.overview}
                    </p>
                  </div>
                </div>

                {/* 详细分析 */}
                {selectedMetric.details.analysisItems.length >
                  0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">
                      详细分析
                    </h4>
                    <div className="space-y-3">
                      {selectedMetric.details.analysisItems.map(
                        (item: any, index: number) => (
                          <div
                            key={index}
                            className={`p-4 rounded-lg border ${getStatusColor(item.status)}`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                {getStatusIcon(item.status)}
                                <span className="font-medium">
                                  {item.item}
                                </span>
                              </div>
                              <span className="font-bold">
                                {item.score}%
                              </span>
                            </div>
                            <p className="text-sm">
                              {item.description}
                            </p>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {/* MBSE上下文 */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">
                    MBSE上下文
                  </h4>
                  <p className="text-blue-800 text-sm">
                    {selectedMetric.details.mbseContext}
                  </p>
                </div>

                {/* 改进建议 */}
                {selectedMetric.details.recommendations.length >
                  0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">
                      改进建议
                    </h4>
                    <ul className="space-y-2">
                      {selectedMetric.details.recommendations.map(
                        (rec: string, index: number) => (
                          <li
                            key={index}
                            className="flex items-start space-x-2"
                          >
                            <span className="text-blue-600 mt-1">
                              •
                            </span>
                            <span className="text-sm text-gray-700">
                              {rec}
                            </span>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 版本对比Dialog */}
      <Dialog
        open={showVersionComparison}
        onOpenChange={setShowVersionComparison}
      >
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <GitCompare className="w-5 h-5 text-blue-600" />
              <span>版本对比</span>
            </DialogTitle>
            <DialogDescription>
              对比两个版本的差异，了解模型的变更历史
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-6">
            {/* 版本选择区域 */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  基准版本
                </label>
                <Select
                  value={compareVersion1}
                  onValueChange={setCompareVersion1}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择基准版本" />
                  </SelectTrigger>
                  <SelectContent>
                    {modelData.versionHistory.map(
                      (version: any, index: number) => (
                        <SelectItem
                          key={index}
                          value={version.version}
                        >
                          v{version.version} - {version.date}
                          {index === 0 && " (最新)"}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  对比版本
                </label>
                <Select
                  value={compareVersion2}
                  onValueChange={setCompareVersion2}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择对比版本" />
                  </SelectTrigger>
                  <SelectContent>
                    {modelData.versionHistory.map(
                      (version: any, index: number) => (
                        <SelectItem
                          key={index}
                          value={version.version}
                        >
                          v{version.version} - {version.date}
                          {index === 0 && " (最新)"}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 对比结果展示 */}
            {compareVersion1 &&
              compareVersion2 &&
              compareVersion1 !== compareVersion2 && (
                <div className="space-y-6">
                  {/* 基本信息对比 */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Info className="w-5 h-5 text-blue-600" />
                        <span>基本信息对比</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-1/3">
                              属性
                            </TableHead>
                            <TableHead className="w-1/3">
                              v{compareVersion1}
                            </TableHead>
                            <TableHead className="w-1/3">
                              v{compareVersion2}
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {(() => {
                            const v1 =
                              modelData.versionHistory.find(
                                (v: any) =>
                                  v.version === compareVersion1,
                              );
                            const v2 =
                              modelData.versionHistory.find(
                                (v: any) =>
                                  v.version === compareVersion2,
                              );

                            return (
                              <>
                                <TableRow>
                                  <TableCell className="font-medium">
                                    版本号
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant="outline">
                                      v{v1?.version}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant="outline">
                                      v{v2?.version}
                                    </Badge>
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">
                                    发布日期
                                  </TableCell>
                                  <TableCell>
                                    {v1?.date}
                                  </TableCell>
                                  <TableCell>
                                    {v2?.date}
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">
                                    提交人员
                                  </TableCell>
                                  <TableCell>
                                    {v1?.author}
                                  </TableCell>
                                  <TableCell>
                                    {v2?.author}
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">
                                    版本状态
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      variant={
                                        v1?.status === "已发布"
                                          ? "default"
                                          : "outline"
                                      }
                                    >
                                      {v1?.status}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      variant={
                                        v2?.status === "已发布"
                                          ? "default"
                                          : "outline"
                                      }
                                    >
                                      {v2?.status}
                                    </Badge>
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">
                                    版本描述
                                  </TableCell>
                                  <TableCell className="text-sm">
                                    {v1?.description}
                                  </TableCell>
                                  <TableCell className="text-sm">
                                    {v2?.description}
                                  </TableCell>
                                </TableRow>
                              </>
                            );
                          })()}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>

                  {/* 模型详细对比 */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <FileCheck className="w-5 h-5 text-green-600" />
                        <span>模型详细对比</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* 参数对比 */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                          <Target className="w-4 h-4 text-blue-600" />
                          <span>模型参数对比</span>
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          {modelParseData.parameters
                            .slice(0, 2)
                            .map((param, index) => {
                              const oldValue = parseFloat(
                                param.value,
                              );
                              const newValue =
                                oldValue *
                                (1 +
                                  (Math.random() * 0.2 - 0.1));
                              const change = (
                                ((newValue - oldValue) /
                                  oldValue) *
                                100
                              ).toFixed(1);

                              return (
                                <div
                                  key={index}
                                  className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                                >
                                  <div className="font-medium text-sm text-gray-900 mb-2">
                                    {param.name}
                                  </div>
                                  <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center space-x-2">
                                      <Minus className="w-3 h-3 text-red-500" />
                                      <span className="text-gray-600">
                                        {oldValue.toFixed(2)}{" "}
                                        {param.unit}
                                      </span>
                                    </div>
                                    <ArrowLeftRight className="w-4 h-4 text-gray-400" />
                                    <div className="flex items-center space-x-2">
                                      <Plus className="w-3 h-3 text-green-500" />
                                      <span className="text-gray-900 font-medium">
                                        {newValue.toFixed(2)}{" "}
                                        {param.unit}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="mt-2 text-xs">
                                    <Badge
                                      variant={
                                        parseFloat(change) > 0
                                          ? "default"
                                          : "destructive"
                                      }
                                      className="text-xs"
                                    >
                                      {parseFloat(change) > 0
                                        ? "+"
                                        : ""}
                                      {change}%
                                    </Badge>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </div>

                      {/* 接口对比 */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                          <GitBranch className="w-4 h-4 text-purple-600" />
                          <span>接口变更</span>
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 p-2 bg-green-50 rounded border border-green-200">
                            <Plus className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-green-900">
                              新增接口: Motor_Torque_Out
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 p-2 bg-yellow-50 rounded border border-yellow-200">
                            <ArrowLeftRight className="w-4 h-4 text-yellow-600" />
                            <span className="text-sm text-yellow-900">
                              修改接口: Battery_SOC_In (类型从
                              int 改为 double)
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 组件对比 */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                          <Archive className="w-4 h-4 text-orange-600" />
                          <span>组件变更</span>
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-gray-600 mb-2">
                              v{compareVersion1}
                            </div>
                            <div className="space-y-1">
                              {modelParseData.components
                                .slice(0, 4)
                                .map((comp, idx) => (
                                  <div
                                    key={idx}
                                    className="text-sm text-gray-700 py-1 px-2 bg-gray-100 rounded"
                                  >
                                    {comp}
                                  </div>
                                ))}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600 mb-2">
                              v{compareVersion2}
                            </div>
                            <div className="space-y-1">
                              {modelParseData.components.map(
                                (comp, idx) => (
                                  <div
                                    key={idx}
                                    className={`text-sm py-1 px-2 rounded ${
                                      idx === 4
                                        ? "bg-green-100 text-green-900 font-medium"
                                        : "text-gray-700 bg-gray-100"
                                    }`}
                                  >
                                    {comp}
                                    {idx === 4 && (
                                      <Badge className="ml-2 bg-green-600 text-xs">
                                        新增
                                      </Badge>
                                    )}
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 依赖项对比 */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                          <Shield className="w-4 h-4 text-indigo-600" />
                          <span>依赖项对比</span>
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-gray-600 mb-2">
                              v{compareVersion1}
                            </div>
                            <div className="space-y-1">
                              {modelParseData.dependencies
                                .slice(0, 2)
                                .map((dep, idx) => (
                                  <div
                                    key={idx}
                                    className="text-sm text-gray-700 py-1 px-2 bg-gray-100 rounded flex items-center justify-between"
                                  >
                                    <span>{dep}</span>
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      v1.0
                                    </Badge>
                                  </div>
                                ))}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600 mb-2">
                              v{compareVersion2}
                            </div>
                            <div className="space-y-1">
                              {modelParseData.dependencies.map(
                                (dep, idx) => (
                                  <div
                                    key={idx}
                                    className={`text-sm py-1 px-2 rounded flex items-center justify-between ${
                                      idx < 2
                                        ? "bg-yellow-100 text-yellow-900"
                                        : "bg-green-100 text-green-900"
                                    }`}
                                  >
                                    <span>{dep}</span>
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {idx < 2
                                        ? "v1.2 ↑"
                                        : "v1.0"}
                                    </Badge>
                                    {idx >= 2 && (
                                      <Badge className="ml-2 bg-green-600 text-xs">
                                        新增
                                      </Badge>
                                    )}
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* AI生成的对比结论 */}
                  <Card className="border-2 border-blue-200 bg-blue-50/30">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Award className="w-5 h-5 text-blue-600" />
                        <span>AI对比分析结论</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-white rounded-lg border border-blue-200">
                        <h4 className="font-medium text-blue-900 mb-2 flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4" />
                          <span>主要变更总结</span>
                        </h4>
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li className="flex items-start space-x-2">
                            <span className="text-blue-600 mt-1">
                              •
                            </span>
                            <span>
                              v{compareVersion2} 相比 v
                              {compareVersion1} 新增了{" "}
                              {modelParseData.components
                                .length - 4}{" "}
                              个关键组件，提升了系统功能完整性
                            </span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <span className="text-blue-600 mt-1">
                              •
                            </span>
                            <span>
                              接口设计更加合理，新增了输出接口以支持更多下游系统集成
                            </span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <span className="text-blue-600 mt-1">
                              •
                            </span>
                            <span>
                              依赖库版本得到更新，修复了已知问题并提升了性能
                            </span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <span className="text-blue-600 mt-1">
                              •
                            </span>
                            <span>
                              关键参数（如发动机功率、电池容量）经过优化调整，更符合实际工程需求
                            </span>
                          </li>
                        </ul>
                      </div>

                      <div className="p-4 bg-white rounded-lg border border-green-200">
                        <h4 className="font-medium text-green-900 mb-2 flex items-center space-x-2">
                          <TrendingUp className="w-4 h-4" />
                          <span>改进亮点</span>
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-green-50 rounded-lg">
                            <div className="font-medium text-sm text-green-900 mb-1">
                              功能增强
                            </div>
                            <div className="text-xs text-gray-700">
                              新增控制单元组件，增强系统控制能力
                            </div>
                          </div>
                          <div className="p-3 bg-green-50 rounded-lg">
                            <div className="font-medium text-sm text-green-900 mb-1">
                              性能提升
                            </div>
                            <div className="text-xs text-gray-700">
                              关键参数优化使系统效率提升约10%
                            </div>
                          </div>
                          <div className="p-3 bg-green-50 rounded-lg">
                            <div className="font-medium text-sm text-green-900 mb-1">
                              兼容性改善
                            </div>
                            <div className="text-xs text-gray-700">
                              接口类型调整提升了系统间的兼容性
                            </div>
                          </div>
                          <div className="p-3 bg-green-50 rounded-lg">
                            <div className="font-medium text-sm text-green-900 mb-1">
                              稳定性增强
                            </div>
                            <div className="text-xs text-gray-700">
                              依赖库更新修复了潜在的稳定性问题
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-white rounded-lg border border-yellow-200">
                        <h4 className="font-medium text-yellow-900 mb-2 flex items-center space-x-2">
                          <AlertCircle className="w-4 h-4" />
                          <span>建议与注意事项</span>
                        </h4>
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li className="flex items-start space-x-2">
                            <span className="text-yellow-600 mt-1">
                              •
                            </span>
                            <span>
                              升级到新版本时，请注意接口类型变更可能影响已有的集成代码
                            </span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <span className="text-yellow-600 mt-1">
                              •
                            </span>
                            <span>
                              新增组件需要额外的配置，建议参考最新的配置文档
                            </span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <span className="text-yellow-600 mt-1">
                              •
                            </span>
                            <span>
                              参数调整后应进行全面的回归测试，确保系统功能正常
                            </span>
                          </li>
                        </ul>
                      </div>

                      <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg text-white">
                        <h4 className="font-medium mb-2 flex items-center space-x-2">
                          <Medal className="w-4 h-4" />
                          <span>综合评估</span>
                        </h4>
                        <p className="text-sm text-blue-50">
                          v{compareVersion2}{" "}
                          是一个重要的升级版本，在功能性、性能和稳定性方面都有显著提升。
                          建议在充分测试后进行版本升级。总体而言，此次版本迭代质量较高，符合MBSE工程标准。
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

            {/* 未选择版本提示 */}
            {(!compareVersion1 || !compareVersion2) && (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <GitCompare className="w-16 h-16 mb-4 text-gray-300" />
                <p className="text-lg">
                  请选择两个版本进行对比
                </p>
                <p className="text-sm mt-2">
                  选择不同的版本以查看详细的差异分析
                </p>
              </div>
            )}

            {/* 相同版本提示 */}
            {compareVersion1 &&
              compareVersion2 &&
              compareVersion1 === compareVersion2 && (
                <div className="flex flex-col items-center justify-center py-12 text-yellow-600">
                  <AlertCircle className="w-16 h-16 mb-4" />
                  <p className="text-lg">
                    请选择不同的版本进行对比
                  </p>
                  <p className="text-sm mt-2">
                    当前选择的两个版本相同
                  </p>
                </div>
              )}
          </div>

          <div className="flex items-center justify-end space-x-2 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => setShowVersionComparison(false)}
            >
              关闭
            </Button>
            {compareVersion1 &&
              compareVersion2 &&
              compareVersion1 !== compareVersion2 && (
                <Button
                  onClick={() => {
                    toast.success("对比报告已导出");
                    setShowVersionComparison(false);
                  }}
                >
                  <Download className="w-4 h-4 mr-1" />
                  导出报告
                </Button>
              )}
          </div>
        </DialogContent>
      </Dialog>

      {/* 完整历史Dialog */}
      <Dialog
        open={showVersionHistory}
        onOpenChange={setShowVersionHistory}
      >
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span>版本完整历史</span>
            </DialogTitle>
            <DialogDescription>
              查看模型的所有版本历史记录和演进轨迹
            </DialogDescription>
          </DialogHeader>

          {/* 筛选区域 */}
          <div className="flex items-center space-x-2 pb-4 border-b border-gray-200">
            <span className="text-sm text-gray-600">
              筛选状态：
            </span>
            <div className="flex space-x-1">
              <Button
                variant={
                  historyStatusFilter === "all"
                    ? "default"
                    : "outline"
                }
                size="sm"
                onClick={() => setHistoryStatusFilter("all")}
              >
                全部 ({modelData.versionHistory.length})
              </Button>
              <Button
                variant={
                  historyStatusFilter === "已发布"
                    ? "default"
                    : "outline"
                }
                size="sm"
                onClick={() => setHistoryStatusFilter("已发布")}
              >
                已发布 (
                {
                  modelData.versionHistory.filter(
                    (v: any) => v.status === "已发布",
                  ).length
                }
                )
              </Button>
              <Button
                variant={
                  historyStatusFilter === "已归档"
                    ? "default"
                    : "outline"
                }
                size="sm"
                onClick={() => setHistoryStatusFilter("已归档")}
              >
                已归档 (
                {
                  modelData.versionHistory.filter(
                    (v: any) => v.status === "已归档",
                  ).length
                }
                )
              </Button>
            </div>
          </div>

          {/* 版本时间线列表 */}
          <div className="flex-1 overflow-y-auto space-y-3">
            {modelData.versionHistory
              .filter(
                (version: any) =>
                  historyStatusFilter === "all" ||
                  version.status === historyStatusFilter,
              )
              .map((version: any, index: number) => {
                const isBaseline =
                  version.description.includes("基线版本");
                const isLatest = index === 0;

                return (
                  <div
                    key={index}
                    className={`relative p-4 rounded-lg border transition-all ${
                      isLatest
                        ? "bg-blue-50 border-blue-200 shadow-md"
                        : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm"
                    }`}
                  >
                    {/* 时间线连接线 */}
                    {index <
                      modelData.versionHistory.filter(
                        (v: any) =>
                          historyStatusFilter === "all" ||
                          v.status === historyStatusFilter,
                      ).length -
                        1 && (
                      <div className="absolute left-8 top-full w-0.5 h-3 bg-gray-300" />
                    )}

                    <div className="flex items-start space-x-4">
                      {/* 时间线圆点 */}
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                          isLatest
                            ? "bg-blue-600 text-white"
                            : isBaseline
                              ? "bg-yellow-500 text-white"
                              : "bg-gray-300 text-gray-600"
                        }`}
                      >
                        {isLatest ? (
                          <Star className="w-5 h-5 fill-current" />
                        ) : isBaseline ? (
                          <Award className="w-5 h-5" />
                        ) : (
                          <Archive className="w-5 h-5" />
                        )}
                      </div>

                      {/* 版本信息 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-gray-900">
                              v{version.version}
                            </h4>
                            {isLatest && (
                              <Badge className="bg-blue-600">
                                最新版本
                              </Badge>
                            )}
                            {isBaseline && (
                              <Badge
                                variant="outline"
                                className="border-yellow-500 text-yellow-700"
                              >
                                <Award className="w-3 h-3 mr-1" />
                                基线
                              </Badge>
                            )}
                            <Badge
                              variant={
                                version.status === "已发布"
                                  ? "default"
                                  : "outline"
                              }
                            >
                              {version.status}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setCompareVersion1(
                                  version.version,
                                );
                                setShowVersionHistory(false);
                                setTimeout(
                                  () =>
                                    setShowVersionComparison(
                                      true,
                                    ),
                                  100,
                                );
                              }}
                            >
                              <GitCompare className="w-4 h-4 mr-1" />
                              对比
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{version.date}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <User className="w-4 h-4" />
                              <span>{version.author}</span>
                            </span>
                          </div>

                          <p className="text-sm text-gray-700">
                            {version.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* 统计信息 */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span>
                总版本数: {modelData.versionHistory.length}
              </span>
              <span>
                基线版本:{" "}
                {
                  modelData.versionHistory.filter((v: any) =>
                    v.description.includes("基线版本"),
                  ).length
                }
              </span>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowVersionHistory(false)}
            >
              关闭
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 个人库：项目使用Tab - 仅当模型已发布时显示 */}
      {libraryType === "personal" &&
        modelData.status === "已发布" && (
          <TabsContent
            value="projectUsage"
            className="space-y-6"
          >
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                项目应用统计
              </h3>
              <p className="text-sm text-gray-600">
                此模型已发布到项目库，以下是该模型镜像在项目中的实际应用情况统计
              </p>
            </div>

            {/* 使用统计卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Target className="w-8 h-8 text-blue-600" />
                    <div>
                      <div className="text-sm text-gray-600">
                        应用项目数
                      </div>
                      <div className="text-2xl font-bold text-blue-600">
                        {model.projectApplications?.length || 0}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Activity className="w-8 h-8 text-green-600" />
                    <div>
                      <div className="text-sm text-gray-600">
                        总应用次数
                      </div>
                      <div className="text-2xl font-bold text-green-600">
                        {model.projectApplications?.reduce(
                          (sum, proj) => sum + proj.useCount,
                          0,
                        ) || 0}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-8 h-8 text-purple-600" />
                    <div>
                      <div className="text-sm text-gray-600">
                        活跃项目数
                      </div>
                      <div className="text-2xl font-bold text-purple-600">
                        {model.projectApplications?.filter(
                          (p) => p.status === "进行中",
                        ).length || 0}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 项目应用列表 */}
            <Card>
              <CardHeader>
                <CardTitle>应用此模型的项目</CardTitle>
                <CardDescription>
                  按应用频次排序，显示项目库中该模型镜像的实际应用情况
                </CardDescription>
              </CardHeader>
              <CardContent>
                {model.projectApplications &&
                model.projectApplications.length > 0 ? (
                  <div className="space-y-4">
                    {model.projectApplications
                      .sort((a, b) => b.useCount - a.useCount)
                      .map((project) => (
                        <div
                          key={project.id}
                          className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-1">
                                <h4 className="font-medium text-gray-900">
                                  {project.name}
                                </h4>
                                <Badge
                                  variant={
                                    project.status === "进行中"
                                      ? "default"
                                      : project.status ===
                                          "已完成"
                                        ? "secondary"
                                        : "outline"
                                  }
                                  className={
                                    project.status === "进行中"
                                      ? "bg-blue-100 text-blue-800"
                                      : project.status ===
                                          "已完成"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-gray-100 text-gray-800"
                                  }
                                >
                                  {project.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">
                                {project.description}
                              </p>
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <span className="flex items-center space-x-1">
                                  <User className="w-3 h-3" />
                                  <span>{project.team}</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>
                                    最后使用: {project.lastUsed}
                                  </span>
                                </span>
                              </div>
                            </div>
                            <div className="ml-4 text-right">
                              <div className="text-2xl font-bold text-blue-600">
                                {project.useCount}
                              </div>
                              <div className="text-xs text-gray-500">
                                使用次数
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      暂无项目应用记录
                    </h3>
                    <p className="text-sm text-gray-500">
                      该模型已发布到项目库，但尚未被任何项目使用
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 应用趋势图 */}
            <Card>
              <CardHeader>
                <CardTitle>应用趋势</CardTitle>
                <CardDescription>
                  过去30天项目库中该模型镜像的应用趋势
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="text-center space-y-2">
                    <BarChart3 className="w-12 h-12 text-gray-400 mx-auto" />
                    <p className="text-sm text-gray-500">
                      应用趋势图表（可视化数据）
                    </p>
                    <p className="text-xs text-gray-400">
                      显示每日应用次数、活跃项目数等统计信息
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 应用场景分析 */}
            <Card className="border-2 border-blue-200 bg-blue-50/30">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Info className="w-5 h-5 text-blue-600" />
                  <span>应用场景分析</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-white rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">
                    主要应用领域
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="outline"
                      className="bg-blue-50"
                    >
                      动力总成系统 (3个项目)
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-blue-50"
                    >
                      智能驾驶 (2个项目)
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-blue-50"
                    >
                      车身工程 (1个项目)
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-blue-50"
                    >
                      底盘系统 (1个项目)
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-blue-50"
                    >
                      电池系统 (1个项目)
                    </Badge>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">
                    应用反馈
                  </h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li className="flex items-start space-x-2">
                      <span className="text-green-600 mt-1">
                        ✓
                      </span>
                      <span>
                        模型精度高，仿真结果与实测数据吻合度达95%以上
                      </span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-green-600 mt-1">
                        ✓
                      </span>
                      <span>
                        接口设计合理，易于与其他系统集成
                      </span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-green-600 mt-1">
                        ✓
                      </span>
                      <span>
                        文档完善，降低了团队的学习成本
                      </span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-600 mt-1">
                        •
                      </span>
                      <span>
                        建议增加更多参数可配置性，以适应不同车型需求
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg text-white">
                  <h4 className="font-medium mb-2">综合评价</h4>
                  <p className="text-sm text-blue-50">
                    该模型在项目库中表现优秀，被广泛应用于多个关键项目，获得了团队的一致好评。
                    建议继续保持高质量标准，并根据项目反馈进行持续优化。
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

      {/* 变更详情Dialog */}
      <Dialog
        open={showChangeDetails}
        onOpenChange={setShowChangeDetails}
      >
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-3">
              <FileText className="w-6 h-6 text-blue-600" />
              <span>版本变更详情</span>
              {selectedVersionChange && (
                <Badge variant="outline" className="ml-2">
                  v{selectedVersionChange.version}
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              查看此版本的详细文件变更记录和修改说明
            </DialogDescription>
          </DialogHeader>

          {selectedVersionChange && (
            <div className="space-y-6">
              {/* 版本基本信息 */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">
                    版本信息
                  </h3>
                  <Badge
                    variant={
                      selectedVersionChange.status === "已发布"
                        ? "default"
                        : "outline"
                    }
                  >
                    {selectedVersionChange.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">作者:</span>
                    <span className="font-medium">
                      {selectedVersionChange.author}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">日期:</span>
                    <span className="font-medium">
                      {selectedVersionChange.date}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">描述: </span>
                    {selectedVersionChange.description}
                  </p>
                </div>
              </div>

              {/* 变更统计 */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-green-700">
                      新增文件
                    </span>
                    <Plus className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="text-2xl font-semibold text-green-600">
                    +{selectedVersionChange.changes.added}
                  </div>
                  <div className="text-xs text-green-600 mt-1">
                    文件数量
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-yellow-700">
                      修改文件
                    </span>
                    <Edit className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div className="text-2xl font-semibold text-yellow-600">
                    ~{selectedVersionChange.changes.modified}
                  </div>
                  <div className="text-xs text-yellow-600 mt-1">
                    文件数量
                  </div>
                </div>

                {selectedVersionChange.changes.deleted > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-red-700">
                        删除文件
                      </span>
                      <Minus className="w-4 h-4 text-red-600" />
                    </div>
                    <div className="text-2xl font-semibold text-red-600">
                      -{selectedVersionChange.changes.deleted}
                    </div>
                    <div className="text-xs text-red-600 mt-1">
                      文件数量
                    </div>
                  </div>
                )}
              </div>

              {/* 详细文件变更列表 */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>文件变更列表</span>
                </h3>

                {/* 新增文件 */}
                {selectedVersionChange.changes.added > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm font-medium text-green-700">
                      <Plus className="w-4 h-4" />
                      <span>
                        新增文件 (
                        {selectedVersionChange.changes.added})
                      </span>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 space-y-1">
                      {Array.from({
                        length: Math.min(
                          selectedVersionChange.changes.added,
                          5,
                        ),
                      }).map((_, i) => (
                        <div
                          key={i}
                          className="flex items-center space-x-2 text-sm"
                        >
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          <span className="text-gray-700 font-mono">
                            {`Battery_Module_${i + 1}.mo`}
                          </span>
                          <span className="text-green-600 text-xs">
                            +
                            {Math.floor(Math.random() * 200) +
                              50}{" "}
                            行
                          </span>
                        </div>
                      ))}
                      {selectedVersionChange.changes.added >
                        5 && (
                        <div className="text-xs text-gray-500 italic pt-1">
                          ... 还有{" "}
                          {selectedVersionChange.changes.added -
                            5}{" "}
                          个文件
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 修改文件 */}
                {selectedVersionChange.changes.modified > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm font-medium text-yellow-700">
                      <Edit className="w-4 h-4" />
                      <span>
                        修改文件 (
                        {selectedVersionChange.changes.modified}
                        )
                      </span>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 space-y-1">
                      {Array.from({
                        length: Math.min(
                          selectedVersionChange.changes
                            .modified,
                          5,
                        ),
                      }).map((_, i) => (
                        <div
                          key={i}
                          className="flex items-center space-x-2 text-sm"
                        >
                          <div className="w-2 h-2 rounded-full bg-yellow-500" />
                          <span className="text-gray-700 font-mono">
                            {i === 0
                              ? "Battery_Controller.mo"
                              : i === 1
                                ? "Thermal_Manager.mo"
                                : `Component_${i + 1}.mo`}
                          </span>
                          <span className="text-green-600 text-xs">
                            +
                            {Math.floor(Math.random() * 50) +
                              10}
                          </span>
                          <span className="text-red-600 text-xs">
                            -
                            {Math.floor(Math.random() * 30) + 5}
                          </span>
                        </div>
                      ))}
                      {selectedVersionChange.changes.modified >
                        5 && (
                        <div className="text-xs text-gray-500 italic pt-1">
                          ... 还有{" "}
                          {selectedVersionChange.changes
                            .modified - 5}{" "}
                          个文件
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 删除文件 */}
                {selectedVersionChange.changes.deleted > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm font-medium text-red-700">
                      <Minus className="w-4 h-4" />
                      <span>
                        删除文件 (
                        {selectedVersionChange.changes.deleted})
                      </span>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 space-y-1">
                      {Array.from({
                        length: Math.min(
                          selectedVersionChange.changes.deleted,
                          3,
                        ),
                      }).map((_, i) => (
                        <div
                          key={i}
                          className="flex items-center space-x-2 text-sm"
                        >
                          <div className="w-2 h-2 rounded-full bg-red-500" />
                          <span className="text-gray-700 font-mono line-through">
                            {`Deprecated_Module_${i + 1}.mo`}
                          </span>
                          <span className="text-red-600 text-xs">
                            -
                            {Math.floor(Math.random() * 100) +
                              20}{" "}
                            行
                          </span>
                        </div>
                      ))}
                      {selectedVersionChange.changes.deleted >
                        3 && (
                        <div className="text-xs text-gray-500 italic pt-1">
                          ... 还有{" "}
                          {selectedVersionChange.changes
                            .deleted - 3}{" "}
                          个文件
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* 变更说明 */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Info className="w-5 h-5 text-blue-600" />
                  <h3 className="font-medium text-blue-900">
                    变更说明
                  </h3>
                </div>
                <div className="space-y-2 text-sm text-blue-800">
                  <p>• 优化了电池热管理模块的计算效率</p>
                  <p>• 修复了温度传感器数据读取的时序问题</p>
                  <p>• 新增了SOC估算算法的自适应参数调整功能</p>
                  <p>• 移除了已废弃的旧版本接口定义</p>
                  <p>• 更新了文档注释和使用说明</p>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() =>
                    toast.info(
                      `下载 v${selectedVersionChange.version} 变更包`,
                    )
                  }
                >
                  <Download className="w-4 h-4 mr-2" />
                  下载变更包
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setCompareVersion1(
                      selectedVersionChange.version,
                    );
                    setShowChangeDetails(false);
                    setTimeout(
                      () => setShowVersionComparison(true),
                      100,
                    );
                  }}
                >
                  <GitCompare className="w-4 h-4 mr-2" />
                  版本对比
                </Button>
                <Button
                  onClick={() => setShowChangeDetails(false)}
                >
                  关闭
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}