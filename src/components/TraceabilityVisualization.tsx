import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  Panel,
  ReactFlowProvider,
  Handle,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  GitBranch,
  Target,
  Cpu,
  Settings,
  TestTube,
  FileText,
  Database,
  Layers,
  Zap,
  RefreshCw,
  Filter,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Circle,
} from "lucide-react@0.487.0";

// 数据项接口定义
interface DataItem {
  id: string;
  label: string;
  value?: string;
  type:
    | "metric"
    | "parameter"
    | "constraint"
    | "result"
    | "input"
    | "output";
  unit?: string;
  connections?: string[]; // 连接到其他数据项的ID
}

// 追溯节点类型定义
interface TraceabilityNodeData {
  id: string;
  label: string;
  type:
    | "requirement"
    | "function"
    | "component"
    | "parameter"
    | "testcase"
    | "validation"
    | "external";
  category: string;
  status: "verified" | "pending" | "failed" | "draft";
  description?: string;
  properties?: Record<string, any>;
  children?: TraceabilityNodeData[];
  dataItems?: DataItem[]; // 新增数据项字段
}

// 自定义节点组件
const CustomTraceabilityNode = ({
  data,
}: {
  data: TraceabilityNodeData & {
    expanded?: boolean;
    dataExpanded?: boolean;
    onToggle?: () => void;
    onDataToggle?: () => void;
  };
}) => {
  const getNodeIcon = (type: string) => {
    switch (type) {
      case "requirement":
        return <Target className="w-3 h-3" />;
      case "function":
        return <Layers className="w-3 h-3" />;
      case "component":
        return <Cpu className="w-3 h-3" />;
      case "parameter":
        return <Settings className="w-3 h-3" />;
      case "testcase":
        return <TestTube className="w-3 h-3" />;
      case "validation":
        return <FileText className="w-3 h-3" />;
      case "external":
        return <Database className="w-3 h-3" />;
      default:
        return <GitBranch className="w-3 h-3" />;
    }
  };

  const getDataItemIcon = (type: string) => {
    switch (type) {
      case "metric":
        return <Target className="w-2 h-2" />;
      case "parameter":
        return <Settings className="w-2 h-2" />;
      case "constraint":
        return <Circle className="w-2 h-2" />;
      case "result":
        return <Zap className="w-2 h-2" />;
      case "input":
        return <ArrowRight className="w-2 h-2" />;
      case "output":
        return <ArrowRight className="w-2 h-2 rotate-180" />;
      default:
        return <Circle className="w-2 h-2" />;
    }
  };

  const getNodeColor = (type: string) => {
    switch (type) {
      case "requirement":
        return "border-blue-400 bg-blue-50";
      case "function":
        return "border-green-400 bg-green-50";
      case "component":
        return "border-purple-400 bg-purple-50";
      case "parameter":
        return "border-orange-400 bg-orange-50";
      case "testcase":
        return "border-red-400 bg-red-50";
      case "validation":
        return "border-yellow-400 bg-yellow-50";
      case "external":
        return "border-gray-400 bg-gray-50";
      default:
        return "border-gray-300 bg-white";
    }
  };

  const getDataItemColor = (type: string) => {
    switch (type) {
      case "metric":
        return "bg-blue-100 border-blue-300 text-blue-800";
      case "parameter":
        return "bg-orange-100 border-orange-300 text-orange-800";
      case "constraint":
        return "bg-red-100 border-red-300 text-red-800";
      case "result":
        return "bg-green-100 border-green-300 text-green-800";
      case "input":
        return "bg-purple-100 border-purple-300 text-purple-800";
      case "output":
        return "bg-cyan-100 border-cyan-300 text-cyan-800";
      default:
        return "bg-gray-100 border-gray-300 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div
      className={`relative p-2 rounded-lg border-2 shadow-sm min-w-[210px] max-w-[300px] ${getNodeColor(data.type)}`}
    >
      {/* 节点左侧输入端口 */}
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="w-3 h-3 !bg-blue-500 border-2 border-white shadow-md"
        style={{ left: -6 }}
      />

      {/* 节点右侧输出端口 */}
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="w-3 h-3 !bg-red-500 border-2 border-white shadow-md"
        style={{ right: -6 }}
      />

      <div className="flex items-start justify-between mb-1">
        <div className="flex items-center space-x-1">
          {getNodeIcon(data.type)}
          <span className="font-medium text-sm">
            {data.label}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <Badge
            variant="secondary"
            className={`text-xs ${getStatusColor(data.status)}`}
          >
            {data.status}
          </Badge>
          {/* 数据项收起/展开按钮 */}
          {data.dataItems && data.dataItems.length > 0 && (
            <button
              className="nodrag nopan w-4 h-4 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200 transition-colors"
              style={{ pointerEvents: "auto" }}
              onMouseDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log(
                  "数据项收起/展开按钮被点击，节点ID:",
                  data.id,
                  "当前展开状态:",
                  data.dataExpanded,
                );
                if (data.onDataToggle) {
                  data.onDataToggle();
                } else {
                  console.warn("onDataToggle函数未定义");
                }
              }}
            >
              {data.dataExpanded ? (
                <ChevronUp className="w-3 h-3 text-gray-600" />
              ) : (
                <ChevronDown className="w-3 h-3 text-gray-600" />
              )}
            </button>
          )}
        </div>
      </div>

      <div className="text-xs text-gray-600 mb-1">
        {data.category}
      </div>

      {data.description && (
        <div className="text-xs text-gray-700 mb-1 line-clamp-2">
          {data.description}
        </div>
      )}

      {/* 数据项展示区域 */}
      {data.dataItems &&
        data.dataItems.length > 0 &&
        data.dataExpanded && (
          <div className="space-y-1 mt-2 border-t border-gray-200 pt-2">
            {data.dataItems.map((item, index) => (
              <div
                key={item.id}
                className={`relative text-xs rounded px-2 py-1 flex items-center justify-between border ${getDataItemColor(item.type)}`}
              >
                {/* 数据项左侧输入端口 */}
                <Handle
                  type="target"
                  position={Position.Left}
                  id={`${data.id}-${item.id}-input`}
                  className="w-2 h-2 !bg-green-500 border border-white shadow-sm !absolute !left-[-4px] !top-[50%] !transform !-translate-y-1/2"
                  style={{
                    left: -4,
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 10,
                  }}
                />

                {/* 数据项右侧输出端口 */}
                <Handle
                  type="source"
                  position={Position.Right}
                  id={`${data.id}-${item.id}-output`}
                  className="w-2 h-2 !bg-orange-500 border border-white shadow-sm !absolute !right-[-4px] !top-[50%] !transform !-translate-y-1/2"
                  style={{
                    right: -4,
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 10,
                  }}
                />

                {/* 数据项编号标识 */}
                <div className="absolute -top-1 -left-1 w-4 h-4 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center font-bold text-[8px] z-20">
                  {index + 1}
                </div>

                <div className="flex items-center space-x-1 flex-1">
                  {getDataItemIcon(item.type)}
                  <span className="font-medium">
                    {item.label}
                  </span>
                </div>

                <div className="flex items-center space-x-1 text-right">
                  {item.value && (
                    <span className="font-mono">
                      {item.value}
                    </span>
                  )}
                  {item.unit && (
                    <span className="opacity-75">
                      {item.unit}
                    </span>
                  )}
                </div>

                {/* 连接状态指示器 */}
                <div
                  className={`w-1 h-1 rounded-full ml-1 ${item.connections && item.connections.length > 0 ? "bg-green-400" : "bg-gray-300"}`}
                ></div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
};

// 自定义边标签组件
const CustomEdgeLabel = ({
  label,
  style,
}: {
  label: string;
  style?: React.CSSProperties;
}) => (
  <div
    className="bg-white border border-gray-200 rounded px-2 py-1 text-xs font-medium shadow-sm"
    style={style}
  >
    {label}
  </div>
);

// 主要追溯可视化组件
export function TraceabilityVisualization() {
  const [filterType, setFilterType] = useState<string>("all");
  const [showConnections, setShowConnections] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);

  // 数据项展开状态管理
  const [dataExpandedStates, setDataExpandedStates] = useState<
    Record<string, boolean>
  >({});

  // 节点展开状态管理
  const [expandedNodes, setExpandedNodes] = useState<
    Set<string>
  >(new Set());
  const [showLabels, setShowLabels] = useState(true);
  const [showDataConnections, setShowDataConnections] =
    useState(false);

  // 更新数据项展开状态
  const toggleDataExpanded = useCallback(
    (nodeId: string) => {
      console.log(
        `切换数据项展开状态: ${nodeId}, 当前状态: ${dataExpandedStates[nodeId] || false}`,
      );
      setDataExpandedStates((prev) => {
        const newState = {
          ...prev,
          [nodeId]: !prev[nodeId],
        };
        console.log("更新后的数据项展开状态:", newState);
        return newState;
      });
    },
    [dataExpandedStates],
  ); // 重新添加依赖，确保获取最新状态

  // 检查是否有任何数据项展开
  const hasAnyDataExpanded = useMemo(() => {
    return Object.values(dataExpandedStates).some(
      (expanded) => expanded,
    );
  }, [dataExpandedStates]);

  // 边颜色映射函数 - 提前定义
  const getEdgeColor = useCallback((label: string) => {
    const colorMap: Record<string, string> = {
      实现: "#3b82f6",
      承载: "#10b981",
      配置: "#f59e0b",
      验证: "#ef4444",
      产生: "#8b5cf6",
      来源: "#6b7280",
      建模: "#06b6d4",
      调用: "#84cc16",
      支撑: "#f97316",
      // 扩展的数据连接关系颜色
      需求约束: "#2563eb",
      效率约束: "#059669",
      安全约束: "#dc2626",
      功率转换: "#7c3aed",
      电压约束: "#ea580c",
      热管理需求: "#c2410c",
      控制需求: "#0891b2",
      通信需求: "#4338ca",
      性能约束: "#be185d",
      容量建模: "#0d9488",
      电压建模: "#7c2d12",
      热管理建模: "#b91c1c",
      控制建模: "#1e40af",
      通信建模: "#581c87",
      性能建模: "#be123c",
      容量仿真: "#0369a1",
      电压仿真: "#92400e",
      热仿真: "#991b1b",
      控制仿真: "#1e3a8a",
      通信仿真: "#4c1d95",
      性能仿真: "#9f1239",
      模型验证: "#0f766e",
      需求验证: "#a16207",
      架构验证: "#a21caf",
      仿真输入: "#0284c7",
      组件测试: "#ca8a04",
      仿真验证: "#86198f",
      里程验证: "#dc2626",
      性能验证: "#ea580c",
      能耗验证: "#059669",
      容量协调: "#7c3aed",
      电压协调: "#be185d",
      热管理协调: "#0891b2",
      合规反馈: "#dc2626",
      认证反馈: "#ea580c",
      EMC反馈: "#059669",
      需求指导: "#2563eb",
      里程指导: "#7c3aed",
      安全指导: "#dc2626",
      // 新增蓝色连接
      蓝色连接: "#3b82f6",
      // 默认数据流色彩
      数据流: "#ec4899",
      参数传递: "#10b981",
      约束: "#f59e0b",
      验证数据: "#8b5cf6",
    };
    return colorMap[label] || "#6b7280";
  }, []);

  // 模拟追溯数据 - 严格按照图片中的节点内容和布局
  const traceabilityData: TraceabilityNodeData[] = [
    {
      id: "arch-design-001",
      label: "整车设计需求",
      type: "requirement",
      category: "系统需求",
      status: "verified",
      description: "基于客户需求的整车系统架构设计与需求分析",
      dataItems: [
        {
          id: "arch-design-001-data-1",
          label: "整车性能需求",
          value: "L3级",
          unit: "",
          type: "constraint",
          connections: ["system-arch-data-1"],
        },
        {
          id: "arch-design-001-data-2",
          label: "续航里程需求",
          value: "≥500",
          unit: "km",
          type: "constraint",
          connections: ["system-arch-data-2"],
        },
        {
          id: "arch-design-001-data-3",
          label: "安全等级要求",
          value: "ASIL-D",
          unit: "",
          type: "constraint",
          connections: ["battery-model-data-1"],
        },
      ],
    },
    {
      id: "system-arch-001",
      label: "整车系统架构",
      type: "function",
      category: "系统架构",
      status: "verified",
      description:
        "整车系统架构设计，包含各子系统的功能分配和接口定义",
      dataItems: [
        {
          id: "system-arch-data-1",
          label: "系统功能分配",
          value: "8个",
          unit: "子系统",
          type: "output",
          connections: ["battery-model-data-1"],
        },
        {
          id: "system-arch-data-2",
          label: "接口定义",
          value: "32个",
          unit: "接口",
          type: "output",
          connections: ["vcu-ctrl-data-1"],
        },
        {
          id: "system-arch-data-3",
          label: "架构约束",
          value: "15项",
          unit: "约束",
          type: "parameter",
          connections: ["test-case-data-1"],
        },
      ],
    },
    {
      id: "battery-model-001",
      label: "电池系统建模",
      type: "component",
      category: "电池系统",
      status: "verified",
      description:
        "电池系统的多物理场建模，包含电化学、热学和机械模型",
      dataItems: [
        {
          id: "battery-model-data-1",
          label: "电池容量",
          value: "100",
          unit: "kWh",
          type: "parameter",
          connections: ["mworks-sim-data-1"],
        },
        {
          id: "battery-model-data-2",
          label: "工作电压",
          value: "400",
          unit: "V",
          type: "parameter",
          connections: ["vcu-ctrl-data-2"],
        },
        {
          id: "battery-model-data-3",
          label: "热管理参数",
          value: "25-45",
          unit: "°C",
          type: "parameter",
          connections: ["test-case-data-2"],
        },
      ],
    },
    {
      id: "compliance-validation-001",
      label: "合规验证",
      type: "validation",
      category: "合规测试",
      status: "verified",
      description:
        "整车系统合规性验证，确保满足相关法规和标准要求",
      dataItems: [
        {
          id: "compliance-data-1",
          label: "GB 18384合规",
          value: "通过",
          unit: "",
          type: "result",
        },
        {
          id: "compliance-data-2",
          label: "ISO 26262认证",
          value: "ASIL-D",
          unit: "",
          type: "result",
        },
        {
          id: "compliance-data-3",
          label: "EMC测试结果",
          value: "合格",
          unit: "",
          type: "result",
        },
      ],
    },

    {
      id: "test-case-001",
      label: "整车工况测试",
      type: "testcase",
      category: "测试验证",
      status: "verified",
      description:
        "WLTC工况下的整车性能测试，验证系统设计的有效性",
      dataItems: [
        {
          id: "test-case-data-1",
          label: "测试里程",
          value: "23.25",
          unit: "km",
          type: "result",
          connections: ["compliance-data-1"],
        },
        {
          id: "test-case-data-2",
          label: "平均车速",
          value: "46.5",
          unit: "km/h",
          type: "result",
          connections: ["compliance-data-2"],
        },
        {
          id: "test-case-data-3",
          label: "能耗测试",
          value: "16.8",
          unit: "kWh/100km",
          type: "result",
          connections: ["compliance-data-3"],
        },
      ],
    },
    {
      id: "vcu-ctrl-001",
      label: "VCU整车控制器",
      type: "component",
      category: "控制器",
      status: "verified",
      description:
        "整车控制单元，负责整车能量管理和驾驶策略控制",
      dataItems: [
        {
          id: "vcu-ctrl-data-1",
          label: "控制策略",
          value: "16种",
          unit: "策略",
          type: "parameter",
          connections: ["mworks-sim-data-2"],
        },
        {
          id: "vcu-ctrl-data-2",
          label: "通信协议",
          value: "CAN-FD",
          unit: "",
          type: "parameter",
          connections: ["test-case-data-3"],
        },
        {
          id: "vcu-ctrl-data-3",
          label: "计算能力",
          value: "150",
          unit: "DMIPS",
          type: "parameter",
          connections: ["compliance-data-1"],
        },
      ],
    },
  ];

  // 创建数据项连接关系
  const createDataConnections = useCallback(() => {
    const dataConnections: Array<{
      source: string;
      target: string;
      label: string;
      type: "data";
      sourceData?: string;
      targetData?: string;
    }> = [];

    // 建立数据流转映射 - 大幅扩展数据项连接关系
    const dataFlowMap: Array<{
      sourceNode: string;
      targetNode: string;
      sourceDataLabel: string;
      targetDataLabel: string;
      label: string;
    }> = [
      // 需求层 → 功能层的数据流 - 图片中要求的蓝色连接
      {
        sourceNode: "arch-design-001",
        targetNode: "system-arch-001",
        sourceDataLabel: "整车性能需求",
        targetDataLabel: "系统功能分配",
        label: "蓝色连接",
      },
      {
        sourceNode: "arch-design-001",
        targetNode: "system-arch-001",
        sourceDataLabel: "续航里程需求",
        targetDataLabel: "系统功能分配",
        label: "蓝色连接",
      },
      {
        sourceNode: "arch-design-001",
        targetNode: "system-arch-001",
        sourceDataLabel: "安全等级要求",
        targetDataLabel: "系统功能分配",
        label: "蓝色连接",
      },
      // 其他现有连接保持不变
      {
        sourceNode: "arch-design-001",
        targetNode: "system-arch-001",
        sourceDataLabel: "续航里程需求",
        targetDataLabel: "接口定义",
        label: "效率约束",
      },
      {
        sourceNode: "arch-design-001",
        targetNode: "system-arch-001",
        sourceDataLabel: "安全等级要求",
        targetDataLabel: "架构约束",
        label: "安全约束",
      },

      // 功能层 → 组件层的数据流
      {
        sourceNode: "system-arch-001",
        targetNode: "battery-model-001",
        sourceDataLabel: "系统功能分配",
        targetDataLabel: "电池容量",
        label: "功率转换",
      },
      {
        sourceNode: "system-arch-001",
        targetNode: "battery-model-001",
        sourceDataLabel: "接口定义",
        targetDataLabel: "工作电压",
        label: "电压约束",
      },
      {
        sourceNode: "system-arch-001",
        targetNode: "battery-model-001",
        sourceDataLabel: "架构约束",
        targetDataLabel: "热管理参数",
        label: "热管理需求",
      },

      {
        sourceNode: "system-arch-001",
        targetNode: "vcu-ctrl-001",
        sourceDataLabel: "系统功能分配",
        targetDataLabel: "控制策略",
        label: "控制需求",
      },
      {
        sourceNode: "system-arch-001",
        targetNode: "vcu-ctrl-001",
        sourceDataLabel: "接口定义",
        targetDataLabel: "通信协议",
        label: "通信需求",
      },
      {
        sourceNode: "system-arch-001",
        targetNode: "vcu-ctrl-001",
        sourceDataLabel: "架构约束",
        targetDataLabel: "计算能力",
        label: "性能约束",
      },

      // 建模工具 → 测试层的数据流
      {
        sourceNode: "sysml-modeling-001",
        targetNode: "test-case-001",
        sourceDataLabel: "需求建模",
        targetDataLabel: "测试里程",
        label: "模型验证",
      },
      {
        sourceNode: "sysml-modeling-001",
        targetNode: "test-case-001",
        sourceDataLabel: "架构建模",
        targetDataLabel: "平均车速",
        label: "需求验证",
      },
      {
        sourceNode: "sysml-modeling-001",
        targetNode: "test-case-001",
        sourceDataLabel: "行为建模",
        targetDataLabel: "能耗测试",
        label: "架构验证",
      },

      // 测试层 → 验证层的数据流
      {
        sourceNode: "test-case-001",
        targetNode: "compliance-validation-001",
        sourceDataLabel: "测试里程",
        targetDataLabel: "GB 18384合规",
        label: "里程验证",
      },
      {
        sourceNode: "test-case-001",
        targetNode: "compliance-validation-001",
        sourceDataLabel: "平均车速",
        targetDataLabel: "ISO 26262认证",
        label: "性能验证",
      },
      {
        sourceNode: "test-case-001",
        targetNode: "compliance-validation-001",
        sourceDataLabel: "能耗测试",
        targetDataLabel: "EMC测试结果",
        label: "能耗验证",
      },

      // 组件间直接数据流转
      {
        sourceNode: "battery-model-001",
        targetNode: "vcu-ctrl-001",
        sourceDataLabel: "电池容量",
        targetDataLabel: "控制策略",
        label: "容量协调",
      },
      {
        sourceNode: "battery-model-001",
        targetNode: "vcu-ctrl-001",
        sourceDataLabel: "工作电压",
        targetDataLabel: "通信协议",
        label: "电压协调",
      },
      {
        sourceNode: "battery-model-001",
        targetNode: "vcu-ctrl-001",
        sourceDataLabel: "热管理参数",
        targetDataLabel: "计算能力",
        label: "热管理协调",
      },

      // 反馈验证数据流
      {
        sourceNode: "compliance-validation-001",
        targetNode: "arch-design-001",
        sourceDataLabel: "GB 18384合规",
        targetDataLabel: "整车性能需求",
        label: "合规反馈",
      },
      {
        sourceNode: "compliance-validation-001",
        targetNode: "arch-design-001",
        sourceDataLabel: "ISO 26262认证",
        targetDataLabel: "续航里程需求",
        label: "认证反馈",
      },
      {
        sourceNode: "compliance-validation-001",
        targetNode: "arch-design-001",
        sourceDataLabel: "EMC测试结果",
        targetDataLabel: "安全等级要求",
        label: "EMC反馈",
      },

      // 跨层级数据指导关系
      {
        sourceNode: "arch-design-001",
        targetNode: "test-case-001",
        sourceDataLabel: "整车性能需求",
        targetDataLabel: "测试里程",
        label: "需求指导",
      },
      {
        sourceNode: "arch-design-001",
        targetNode: "test-case-001",
        sourceDataLabel: "续航里程需求",
        targetDataLabel: "平均车速",
        label: "里程指导",
      },
      {
        sourceNode: "arch-design-001",
        targetNode: "test-case-001",
        sourceDataLabel: "安全等级要求",
        targetDataLabel: "能耗测试",
        label: "安全指导",
      },
    ];

    dataFlowMap.forEach((flow) => {
      dataConnections.push({
        source: flow.sourceNode,
        target: flow.targetNode,
        label: flow.label,
        type: "data",
        sourceData: flow.sourceDataLabel,
        targetData: flow.targetDataLabel,
      });
    });

    return dataConnections;
  }, []);

  // 创建子节点之间的数字连接关系
  const createChildNodeConnections = useCallback(() => {
    const childConnections: Array<{
      source: string;
      target: string;
      sourceChildIndex: number;
      targetChildIndex: number;
      label: string;
      color: string;
    }> = [];

    // 定义子节点之间的数字连接关系
    const childConnectionMap = [
      // 整车架构设计 -> 整车系统架构 (功能需求分析 -> 动力系统架构)
      {
        source: "arch-design-001",
        target: "system-arch-001",
        sourceChildIndex: 0, // 功能需求分析 (ID=1)
        targetChildIndex: 0, // 动力系统架构 (ID=1)
        label: "需求→架构",
        color: "#2563eb",
      },
      // 整车架构设计 -> 整车系统架构 (性能需求定义 -> 底盘系统架构)
      {
        source: "arch-design-001",
        target: "system-arch-001",
        sourceChildIndex: 1, // 性能需求定义 (ID=2)
        targetChildIndex: 1, // 底盘系统架构 (ID=2)
        label: "性能→底盘",
        color: "#dc2626",
      },
      // 整车系统架构 -> VCU整车控制器 (电子电气架构 -> 能量管理算法)
      {
        source: "system-arch-001",
        target: "vcu-ctrl-001",
        sourceChildIndex: 2, // 电子电气架构 (ID=3)
        targetChildIndex: 0, // 能量管理算法 (ID=1)
        label: "EE架构→控制",
        color: "#059669",
      },
      // VCU整车控制器 -> 电池系统建模 (驾驶策略控制 -> 热学模型)
      {
        source: "vcu-ctrl-001",
        target: "battery-model-001",
        sourceChildIndex: 1, // 驾驶策略控制 (ID=2)
        targetChildIndex: 1, // 热学模型 (ID=2)
        label: "策略→热模型",
        color: "#7c3aed",
      },
      // 电池系统建模 -> M-WORKS仿真 (BMS控制模型 -> 整车动力学仿真)
      {
        source: "battery-model-001",
        target: "mworks-sim-001",
        sourceChildIndex: 2, // BMS控制模型 (ID=3)
        targetChildIndex: 0, // 整车动力学仿真 (ID=1)
        label: "BMS→动力学",
        color: "#0891b2",
      },
      // SysML架构建模 -> 整车工况测试 (架构建模 -> WLTC中速段测试)
      {
        source: "sysml-modeling-001",
        target: "test-case-001",
        sourceChildIndex: 1, // 架构建模 (ID=2)
        targetChildIndex: 1, // WLTC中速段测试 (ID=2)
        label: "建模→测试",
        color: "#ea580c",
      },
      // 整车工况测试 -> 合规验证 (WLTC高速段测试 -> EMC合规测试)
      {
        source: "test-case-001",
        target: "compliance-validation-001",
        sourceChildIndex: 2, // WLTC高速段测试 (ID=3)
        targetChildIndex: 1, // EMC合规测试 (ID=2)
        label: "高速测试→EMC",
        color: "#be185d",
      },
      // 跨层级连接: 整车架构设计 -> 电池系统建模 (安全需求规范 -> 电化学模型)
      {
        source: "arch-design-001",
        target: "battery-model-001",
        sourceChildIndex: 2, // 安全需求规范 (ID=3)
        targetChildIndex: 0, // 电化学模型 (ID=1)
        label: "安全需求→电化学",
        color: "#f59e0b",
      },
    ];

    childConnectionMap.forEach((conn) => {
      childConnections.push({
        source: conn.source,
        target: conn.target,
        sourceChildIndex: conn.sourceChildIndex,
        targetChildIndex: conn.targetChildIndex,
        label: conn.label,
        color: conn.color,
      });
    });

    return childConnections;
  }, []);

  // 创建带有数据展开状态的节点
  const nodesWithDataStates = useMemo(() => {
    return traceabilityData.map((nodeData) => ({
      id: nodeData.id,
      type: "custom",
      position: { x: 0, y: 0 }, // 位置将在自动布局中重新计算
      data: {
        ...nodeData,
        expanded: expandedNodes.has(nodeData.id),
        dataExpanded: dataExpandedStates[nodeData.id] || false,
        onToggle: () => {
          setExpandedNodes((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(nodeData.id)) {
              newSet.delete(nodeData.id);
            } else {
              newSet.add(nodeData.id);
            }
            return newSet;
          });
        },
        onDataToggle: () => {
          toggleDataExpanded(nodeData.id);
        },
      },
    }));
  }, [
    traceabilityData,
    expandedNodes,
    dataExpandedStates,
    toggleDataExpanded,
  ]);

  // 创建节点和边
  const { nodes: initialNodes, edges: initialEdges } =
    useMemo(() => {
      const nodes: Node[] = [];
      const edges: Edge[] = [];

      // 严格按照图片中的节点布局 - 精确匹配图片中每个节点的位置
      const layouts = {
        // 第一行：节点1-4 从左到右水平排列，增加间距
        "arch-design-001": { x: 50, y: 100 }, // 节点1：整车架构设计
        "sysml-modeling-001": { x: 400, y: 100 }, // 节点2：SysML架构建模
        "system-arch-001": { x: 750, y: 100 }, // 节点3：整车系统架构
        "test-case-001": { x: 1100, y: 100 }, // 节点4：整车工况测试

        // 右侧垂直列：节点5-7 在节点4右侧垂直排列，增加间距
        "battery-model-001": { x: 1450, y: 30 }, // 节点5：电池系统建模（上）
        "vcu-ctrl-001": { x: 1450, y: 220 }, // 节点6：VCU整车控制器（中）
        "mworks-sim-001": { x: 1450, y: 410 }, // 节点7：M-WORKS仿真（下）

        // 最右侧：节点8 单独位置，增加与节点5-7的间距
        "compliance-validation-001": { x: 1800, y: 180 }, // 节点8：合规验证（最右侧）
      };

      // 创建主节点
      traceabilityData.forEach((data, index) => {
        const layout = layouts[
          data.id as keyof typeof layouts
        ] || { x: 100, y: 100 };

        nodes.push({
          id: data.id,
          type: "custom",
          position: {
            x: layout.x,
            y: layout.y,
          },
          data: {
            ...data,
            expanded: expandedNodes.has(data.id),
            dataExpanded: dataExpandedStates[data.id] || false,
            onToggle: () => {
              setExpandedNodes((prev) => {
                const newSet = new Set(prev);
                if (newSet.has(data.id)) {
                  newSet.delete(data.id);
                } else {
                  newSet.add(data.id);
                }
                return newSet;
              });
            },
            onDataToggle: () => {
              toggleDataExpanded(data.id);
            },
          },
        });
      });

      // 根据图片中的红线定义连接关系 - 严格按照图片中显示的连线
      const traceabilityConnections = [
        // 1. 整车架构设计 -> SysML架构建模 (图片中第一条红线)
        {
          source: "arch-design-001",
          target: "sysml-modeling-001",
          label: "建模支撑",
          color: "#ef4444",
        },
        // 2. 整车架构设计 -> 整车系统架构 (图片中第二条红线)
        {
          source: "arch-design-001",
          target: "system-arch-001",
          label: "需求实现",
          color: "#ef4444",
        },
        // 3. 整车系统架构 -> 整车工况测试 (图片中第三条红线)
        // {
        // source: "system-arch-001",
        // target: "test-case-001",
        // label: "测试验证",
        // color: "#ef4444",
        // },
        // 4.1 整车系统架构 -> VCU整车控制器 (图片中第四条红线)
        {
          source: "system-arch-001",
          target: "vcu-ctrl-001",
          label: "系统分解",
          color: "#ef4444",
        },
        // 4.2 整车系统架构 -> 电池系统建模 (图片中第五条红线)
        {
          source: "system-arch-001",
          target: "battery-model-001",
          label: "系统分解",
          color: "#ef4444",
        },
        // 5.1 VCU整车控制器 -> 整车工况测试
        {
          source: "vcu-ctrl-001",
          target: "test-case-001",
          label: "系统验证",
          color: "#ef4444",
        },
        // 5.2 电池系统建模 -> 整车工况测试
        {
          source: "battery-model-001",
          target: "test-case-001",
          label: "系统验证",
          color: "#ef4444",
        },
        // 5. 整车工况测试 -> 合规验证 (图片中第七条红线，从测试到最右侧的合规验证)
        {
          source: "test-case-001",
          target: "compliance-validation-001",
          label: "合规测试",
          color: "#ef4444",
        },
      ];

      // 创建边连接 - 根据数据项展开状态决定显示哪些边
      if (!hasAnyDataExpanded) {
        // 当所有数据项都收起时，显示红色实线连接
        traceabilityConnections.forEach((conn, index) => {
          edges.push({
            id: `trace-edge-${index}`,
            source: conn.source,
            target: conn.target,
            sourceHandle: "right", // 指定源端口
            targetHandle: "left", // 指定目标端口
            type: "default",
            animated: true,
            style: {
              stroke: conn.color, // 使用红色
              strokeWidth: 2.5,
              strokeDasharray: "none", // 实线
            },
            label: showLabels ? conn.label : "",
            labelStyle: {
              fontSize: 11,
              fontWeight: 500,
              fill: "#ef4444", // 红色标签
              background: "#ffffff",
              padding: "2px 6px",
              borderRadius: "4px",
              border: "1px solid #fee2e2",
            },
            labelBgStyle: {
              fill: "#ffffff",
              fillOpacity: 0.9,
              stroke: "#fee2e2",
              strokeWidth: 1,
            },
            markerEnd: {
              type: "arrowclosed",
              color: conn.color,
              width: 20,
              height: 20,
            },
          });
        });
      } else {
        // 当有数据项展开时，显示数据项间的虚线连接
        const dataConnections = createDataConnections();

        dataConnections.forEach((dataConn, index) => {
          // 根据数据项标签查找对应的数据项ID
          const sourceNode = traceabilityData.find(
            (node) => node.id === dataConn.source,
          );
          const targetNode = traceabilityData.find(
            (node) => node.id === dataConn.target,
          );

          const sourceDataItem = sourceNode?.dataItems?.find(
            (item) => item.label === dataConn.sourceData,
          );
          const targetDataItem = targetNode?.dataItems?.find(
            (item) => item.label === dataConn.targetData,
          );

          if (sourceDataItem && targetDataItem) {
            // 检查相关节点是否展开
            const sourceExpanded = dataExpandedStates[dataConn.source];
            const targetExpanded = dataExpandedStates[dataConn.target];
            
            // 只有当源节点和目标节点都展开时才显示数据项连接
            if (sourceExpanded && targetExpanded) {
              console.log(`创建数据连接: ${dataConn.sourceData} -> ${dataConn.targetData}`, {
                sourceHandle: `${dataConn.source}-${sourceDataItem.id}-output`,
                targetHandle: `${dataConn.target}-${targetDataItem.id}-input`,
                color: getEdgeColor(dataConn.label),
                sourceExpanded,
                targetExpanded
              });
              
              edges.push({
                id: `data-edge-${index}`,
                source: dataConn.source,
                target: dataConn.target,
                sourceHandle: `${dataConn.source}-${sourceDataItem.id}-output`,
                targetHandle: `${dataConn.target}-${targetDataItem.id}-input`,
                type: "default",
                animated: false,
                style: {
                  stroke: getEdgeColor(dataConn.label),
                  strokeWidth: 2,
                  strokeDasharray: "5,5",
                },
                label: showLabels ? dataConn.label : "",
                labelStyle: {
                  fontSize: 10,
                  fontWeight: 400,
                  fill: getEdgeColor(dataConn.label),
                  background: "#ffffff",
                  padding: "1px 4px",
                  borderRadius: "3px",
                  border: `1px solid ${getEdgeColor(dataConn.label)}33`,
                },
                labelBgStyle: {
                  fill: "#ffffff",
                  fillOpacity: 0.8,
                  stroke: getEdgeColor(dataConn.label),
                  strokeWidth: 0.5,
                },
                markerEnd: {
                  type: "arrowclosed",
                  color: getEdgeColor(dataConn.label),
                  width: 15,
                  height: 15,
                },
              });
            } else {
              console.log(`数据连接被跳过，节点未展开: ${dataConn.sourceData} -> ${dataConn.targetData}`, {
                sourceExpanded,
                targetExpanded,
                sourceNode: dataConn.source,
                targetNode: dataConn.target
              });
            }
          } else {
            console.warn(`无法找到数据项: ${dataConn.sourceData} -> ${dataConn.targetData}`, {
              sourceNode: sourceNode?.id,
              targetNode: targetNode?.id,
              sourceDataItem: sourceDataItem?.id,
              targetDataItem: targetDataItem?.id,
              sourceNodeDataItems: sourceNode?.dataItems?.map(item => item.label),
              targetNodeDataItems: targetNode?.dataItems?.map(item => item.label)
            });
          }
        });
      }

      // 创建子节点之间的数字连接
      const childConnections = createChildNodeConnections();

      childConnections.forEach((conn, index) => {
        edges.push({
          id: `child-edge-${index}`,
          source: conn.source,
          target: conn.target,
          sourceHandle: `${conn.source}-child-${conn.sourceChildIndex}-output`,
          targetHandle: `${conn.target}-child-${conn.targetChildIndex}-input`,
          type: "default",
          animated: false,
          style: {
            stroke: conn.color,
            strokeWidth: 1.5,
            strokeDasharray: "5,5",
          },
          label: showLabels ? conn.label : "",
          labelStyle: {
            fontSize: 10,
            fontWeight: 400,
            fill: conn.color,
            background: "#ffffff",
            padding: "1px 4px",
            borderRadius: "3px",
            border: `1px solid ${conn.color}33`,
          },
          labelBgStyle: {
            fill: "#ffffff",
            fillOpacity: 0.8,
            stroke: conn.color,
            strokeWidth: 0.5,
          },
        });
      });

      console.log("创建的节点数量:", nodes.length);
      console.log("创建的边数量:", edges.length);
      console.log(
        "节点IDs:",
        nodes.map((n) => n.id),
      );
      console.log(
        "边连接:",
        edges.map((e) => `${e.source} -> ${e.target}`),
      );

      return { nodes, edges };
    }, [
      expandedNodes,
      showLabels,
      showDataConnections,
      dataExpandedStates,
      hasAnyDataExpanded,
      getEdgeColor,
      createDataConnections,
      traceabilityData,
      toggleDataExpanded,
    ]);

  const [nodes, setNodes, onNodesChange] =
    useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] =
    useEdgesState(initialEdges);

  // 监听数据展开状态变化，同步更新React Flow节点
  useEffect(() => {
    setNodes((currentNodes) =>
      currentNodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          dataExpanded: dataExpandedStates[node.id] || false,
          onDataToggle: () => {
            toggleDataExpanded(node.id);
          },
        },
      })),
    );
  }, [dataExpandedStates, toggleDataExpanded]);

  // 监听子节点展开状态变化，同步更新React Flow节点
  useEffect(() => {
    setNodes((currentNodes) =>
      currentNodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          expanded: expandedNodes.has(node.id),
          onToggle: () => {
            setExpandedNodes((prev) => {
              const newSet = new Set(prev);
              if (newSet.has(node.id)) {
                newSet.delete(node.id);
              } else {
                newSet.add(node.id);
              }
              return newSet;
            });
          },
        },
      })),
    );
  }, [expandedNodes]);

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  // 过滤节点
  const filteredNodes = useMemo(() => {
    if (filterType === "all") return nodes;
    return nodes.filter(
      (node) => node.data.type === filterType,
    );
  }, [nodes, filterType]);

  // 过滤对应的边
  const filteredEdges = useMemo(() => {
    const visibleNodeIds = new Set(
      filteredNodes.map((node) => node.id),
    );
    return edges.filter(
      (edge) =>
        visibleNodeIds.has(edge.source) &&
        visibleNodeIds.has(edge.target),
    );
  }, [edges, filteredNodes]);

  // 节点类型
  const nodeTypes = useMemo(
    () => ({
      custom: CustomTraceabilityNode,
    }),
    [],
  );

  // 重置布局
  const handleResetLayout = () => {
    setExpandedNodes(new Set());
    setDataExpandedStates({});
  };

  // 展开所有数据项
  const handleExpandAllData = () => {
    const allNodeIds = traceabilityData.map((node) => node.id);
    const newStates: Record<string, boolean> = {};
    allNodeIds.forEach((id) => {
      newStates[id] = true;
    });
    setDataExpandedStates(newStates);
  };

  const nodeTypeOptions = [
    { value: "all", label: "全部节点", icon: GitBranch },
    { value: "requirement", label: "需求", icon: Target },
    { value: "function", label: "功能", icon: Layers },
    { value: "component", label: "组件", icon: Cpu },
    { value: "parameter", label: "参数", icon: Settings },
    { value: "testcase", label: "测试", icon: TestTube },
    { value: "validation", label: "验证", icon: FileText },
    { value: "external", label: "外部", icon: Database },
  ];

  return (
    <Card className="h-[600px] w-full">
      <div className="h-full flex flex-col">
        {/* 工具栏 */}
        <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h4 className="font-medium flex items-center space-x-2">
              <GitBranch className="w-5 h-5 text-blue-600" />
              <span>需求追溯可视化</span>
            </h4>

            <Select
              value={filterType}
              onValueChange={setFilterType}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="选择节点类型" />
              </SelectTrigger>
              <SelectContent>
                {nodeTypeOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                  >
                    <div className="flex items-center space-x-2">
                      <option.icon className="w-4 h-4" />
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLabels(!showLabels)}
            >
              {showLabels ? (
                <Eye className="w-4 h-4 mr-2" />
              ) : (
                <EyeOff className="w-4 h-4 mr-2" />
              )}
              {showLabels ? "隐藏标签" : "显示标签"}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setShowDataConnections(!showDataConnections)
              }
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              {showDataConnections
                ? "隐藏数据流"
                : "显示数据流"}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExpandAllData}
            >
              <Database className="w-4 h-4 mr-2" />
              展开数据
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleResetLayout}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              重置布局
            </Button>
          </div>
        </div>

        {/* 追溯图 */}
        <div
          id="traceability-visualization-container"
          className="flex-1 relative"
          data-testid="traceability-canvas"
          data-connection-zone="main"
        >
          <ReactFlowProvider>
            <ReactFlow
              id="traceability-flow"
              nodes={filteredNodes}
              edges={filteredEdges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              fitView
              attributionPosition="bottom-right"
              nodesDraggable={true}
              nodesConnectable={true}
              elementsSelectable={true}
              selectNodesOnDrag={false}
              panOnDrag={true}
              zoomOnScroll={true}
              zoomOnPinch={true}
              panOnScroll={false}
              preventScrolling={false}
              onConnectStart={(
                event,
                { nodeId, handleId, handleType },
              ) => {
                console.log("连接开始:", {
                  nodeId,
                  handleId,
                  handleType,
                });
                // 可以在这里添加连接开始的视觉反馈
                const container = document.getElementById(
                  "traceability-visualization-container",
                );
                if (container) {
                  container.classList.add("connecting-mode");
                }
              }}
              onConnectEnd={(event) => {
                console.log("连接结束");
                // 清除连接模式的视觉效果
                const container = document.getElementById(
                  "traceability-visualization-container",
                );
                if (container) {
                  container.classList.remove("connecting-mode");
                }
              }}
              onEdgeClick={(event, edge) => {
                console.log("点击连线:", edge);
                // 可以添加连线点击处理逻辑
              }}
              onNodeClick={(event, node) => {
                console.log("点击节点:", node);
                // 节点点击处理逻辑
              }}
              connectionMode="loose"
              snapToGrid={true}
              snapGrid={[15, 15]}
              defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
              minZoom={0.1}
              maxZoom={2}
              deleteKeyCode={["Delete", "Backspace"]}
            >
              <Controls />
              <MiniMap
                nodeColor={(node) => {
                  const type = node.data?.type || "default";
                  const colors: Record<string, string> = {
                    requirement: "#3b82f6",
                    function: "#10b981",
                    component: "#8b5cf6",
                    parameter: "#f59e0b",
                    testcase: "#ef4444",
                    validation: "#eab308",
                    external: "#6b7280",
                  };
                  return colors[type] || "#9ca3af";
                }}
                className="!bg-white !border !border-gray-200"
              />
              <Background />

              {/* 图例面板 */}
              <Panel
                position="top-right"
                className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm"
              >
                <div className="text-sm font-medium mb-2">
                  追溯关系图例
                </div>
                <div className="space-y-1 text-xs">
                  <div className="font-medium mb-1 text-gray-700">
                    节点关系
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded bg-blue-500"></div>
                    <span>实现关系</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded bg-green-500"></div>
                    <span>承载关系</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded bg-yellow-500"></div>
                    <span>配置关系</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded bg-red-500"></div>
                    <span>验证关系</span>
                  </div>

                  <div className="border-t border-gray-200 my-2"></div>
                  <div className="font-medium mb-1 text-gray-700">
                    数据流
                  </div>
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-4 h-0.5 bg-pink-500"
                      style={{
                        borderTop: "1px dashed #ec4899",
                      }}
                    ></div>
                    <span>数据流转</span>
                  </div>
                </div>
              </Panel>
            </ReactFlow>
          </ReactFlowProvider>
        </div>
      </div>
    </Card>
  );
}