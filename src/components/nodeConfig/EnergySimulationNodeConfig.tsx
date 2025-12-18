import React, { useState, useCallback } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Badge } from "../ui/badge";
import {
  Settings,
  Box,
  CheckCircle,
  AlertCircle,
  Maximize2,
  Minimize2,
  Home,
  ChevronRight,
} from "lucide-react@0.487.0";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  MiniMap,
  Background,
  useNodesState,
  useEdgesState,
  ConnectionMode,
  NodeProps,
  Handle,
  Position,
} from "reactflow";
import { createPortal } from "react-dom";
import "reactflow/dist/style.css";

interface EnergySimulationNodeConfigProps {
  node: any;
  onSave: (config: any) => void;
  onCancel: () => void;
  userRole?: string;
}

export function EnergySimulationNodeConfig({
  node,
  onSave,
  onCancel,
  userRole,
}: EnergySimulationNodeConfigProps) {
  // 优化配置数据获取，支持多种数据路径
  const getNodeParameter = (path: string, defaultValue: any) => {
    return node?.config?.parameters?.[path] || 
           node?.parameters?.[path] || 
           node?.config?.[path] || 
           defaultValue;
  };

  const [config, setConfig] = useState({
    nodeName: node?.name || "SSP到Modelica转换",
    description:
      node?.description ||
      "将SSP格式文件自动转换为Modelica模型",
    timeout: getNodeParameter('timeout', 1200),
    retryCount: getNodeParameter('retryCount', 1),
    autoRun: getNodeParameter('autoRun', true),
    // SSP到Modelica转换特有配置
    sourceSSPFile: getNodeParameter('sourceSSPFile', "local-upload"),
    targetFormat: getNodeParameter('targetFormat', "modelica"),
    sspConfig: getNodeParameter('sspConfig', {
      version: "1.0",
      maxHierarchyLevel: 5,
      expectedComponents: 50,
      parseTimeout: 300,
      memoryLimit: 2048,
    }),
    modelSelection: getNodeParameter('modelSelection', {
      librarySource: "standard-library",
      fmuModel: "fmu-standard",
      amesimModel: "amesim-hydraulic",
      modelicaModel: "modelica-standard",
      customModel: "user-defined",
    }),
    modelMapping: getNodeParameter('modelMapping', {
      autoMapping: true,
      hierarchyMatch: true,
      interfaceMapping: true,
      parameterInheritance: true,
      typeValidation: true,
      dependencyCheck: true,
    }),
    conversionOptions: getNodeParameter('conversionOptions', [
      "preserveHierarchy",
      "generateConnections",
      "convertParameters",
      "generateInterfaces",
      "validateSyntax",
    ]),
    codeGeneration: getNodeParameter('codeGeneration', {
      generateAnnotations: true,
      optimizeCode: true,
      enableParallelization: false,
      generateTestCases: true,
      includeMetadata: true,
      generatePlots: false,
    }),
    advancedSettings: getNodeParameter('advancedSettings', {
      enableIncrementalConversion: true,
      enableCaching: true,
      enableVersionControl: false,
      versionStrategy: "semantic",
    }),
    outputConfiguration: getNodeParameter('outputConfiguration', {
      timeResolution: 0.1,
      dataFormat: "csv",
      includeGraphics: true,
    }),
    validationCriteria: getNodeParameter('validationCriteria', {
      syntaxValidation: { enabled: true, strictness: 0.8 },
      semanticValidation: { enabled: true, tolerance: 0.05 },
      modelConsistency: {
        enabled: true,
        minScore: 0.7,
        maxErrors: 10,
      },
    }),
  });

  // 模型配置相关状态
  const [showModelConfig, setShowModelConfig] = useState(false);
  const [modelConfigCompleted, setModelConfigCompleted] =
    useState(
      getNodeParameter('modelConfigCompleted', false),
    );
  // 默认模型配置 - 为每个系统模块预设默认模型
  const defaultBlockModels = {
    battery_pack: {
      type: "modelica",
      id: "battery-mod-1",
      name: "电池包Modelica模型",
      description: "基于等效电路的电池模型"
    },
    bms: {
      type: "fmu",
      id: "bms-fmu-1",
      name: "电池管理系统FMU",
      description: "BMS控制策略模型"
    },
    dc_dc: {
      type: "modelica",
      id: "dcdc-mod-1",
      name: "DC/DC Modelica模型",
      description: "电压变换器模型"
    },
    inverter: {
      type: "fmu",
      id: "inverter-fmu-1",
      name: "三电平逆变器FMU",
      description: "功率电子逆变器模型"
    },
    motor: {
      type: "modelica",
      id: "motor-mod-1",
      name: "电机Modelica库",
      description: "标准电机模型库"
    },
    vcu: {
      type: "fmu",
      id: "vcu-fmu-1",
      name: "整车控制器FMU",
      description: "VCU系统控制模型"
    },
    thermal_sys: {
      type: "amesim",
      id: "thermal-ames-1",
      name: "热管理AMESim模型",
      description: "热管理系统仿真"
    },
    charging: {
      type: "modelica",
      id: "charging-mod-1",
      name: "充电系统Modelica模型",
      description: "AC/DC充电控制模型"
    },
    regen_brake: {
      type: "fmu",
      id: "regen-fmu-1",
      name: "制动回收FMU模型",
      description: "再生制动能量回收模型"
    }
  };

  const [ibdBlockModels, setIbdBlockModels] = useState(
    getNodeParameter('ibdBlockModels', {}),
  );
  const [selectedBlock, setSelectedBlock] = useState<
    string | null
  >(null);
  const [showModelSelector, setShowModelSelector] =
    useState(false);
  const [isArchitectureExpanded, setIsArchitectureExpanded] =
    useState(false);

  // IBD图模拟数据 - 汽车能量管理系统架构
  const ibdBlocks = [
    {
      id: "battery_pack",
      name: "高压电池包",
      subtitle: "HV Battery",
      type: "energy-source",
      x: 120,
      y: 180,
      width: 100,
      height: 60,
      configured: !!ibdBlockModels["battery_pack"],
    },
    {
      id: "bms",
      name: "BMS",
      subtitle: "电池管理系统",
      type: "control-unit",
      x: 120,
      y: 280,
      width: 100,
      height: 50,
      configured: !!ibdBlockModels["bms"],
    },
    {
      id: "dc_dc",
      name: "DC/DC",
      subtitle: "变换器",
      type: "power-converter",
      x: 280,
      y: 180,
      width: 80,
      height: 50,
      configured: !!ibdBlockModels["dc_dc"],
    },
    {
      id: "inverter",
      name: "逆变器",
      subtitle: "Inverter",
      type: "power-converter",
      x: 420,
      y: 120,
      width: 80,
      height: 50,
      configured: !!ibdBlockModels["inverter"],
    },
    {
      id: "motor",
      name: "驱动电机",
      subtitle: "Traction Motor",
      type: "actuator",
      x: 560,
      y: 120,
      width: 100,
      height: 60,
      configured: !!ibdBlockModels["motor"],
    },
    {
      id: "vcu",
      name: "VCU",
      subtitle: "整车控制器",
      type: "control-unit",
      x: 300,
      y: 60,
      width: 100,
      height: 50,
      configured: !!ibdBlockModels["vcu"],
    },
    {
      id: "thermal_sys",
      name: "热管理系统",
      subtitle: "Thermal Mgmt",
      type: "auxiliary-system",
      x: 450,
      y: 280,
      width: 120,
      height: 50,
      configured: !!ibdBlockModels["thermal_sys"],
    },
    {
      id: "charging",
      name: "充电系统",
      subtitle: "Charging",
      type: "interface-system",
      x: 120,
      y: 80,
      width: 100,
      height: 50,
      configured: !!ibdBlockModels["charging"],
    },
    {
      id: "regen_brake",
      name: "制动能量回收",
      subtitle: "Regen Braking",
      type: "actuator",
      x: 560,
      y: 220,
      width: 120,
      height: 50,
      configured: !!ibdBlockModels["regen_brake"],
    },
  ];

  // 可选模型库数据
  const modelLibrary = {
    fmu: [
      {
        id: "battery-fmu-1",
        name: "电池包热力学FMU模型",
        description: "包含电化学和热力学特性",
      },
      {
        id: "charging-fmu-1",
        name: "充电系统FMU模型",
        description: "AC/DC充电系统电气模型",
      },
      {
        id: "motor-fmu-1",
        name: "永磁同步电机FMU",
        description: "三相永磁同步电机模型",
      },
      {
        id: "inverter-fmu-1",
        name: "三电平逆变器FMU",
        description: "功率电子逆变器模型",
      },
      {
        id: "bms-fmu-1",
        name: "电池管理系统FMU",
        description: "BMS控制策略模型",
      },
      {
        id: "vcu-fmu-1",
        name: "整车控制器FMU",
        description: "VCU系统控制模型",
      },
      {
        id: "thermal-fmu-1",
        name: "热管理FMU模型",
        description: "热量传输与散热模型",
      },
      {
        id: "dcdc-fmu-1",
        name: "DC/DC变换器FMU",
        description: "直流电压变换模型",
      },
      {
        id: "regen-fmu-1",
        name: "制动回收FMU模型",
        description: "再生制动能量回收模型",
      },
    ],
    modelica: [
      {
        id: "battery-mod-1",
        name: "电池包Modelica模型",
        description: "基于等效电路的电池模型",
      },
      {
        id: "charging-mod-1",
        name: "充电系统Modelica模型",
        description: "AC/DC充电控制模型",
      },
      {
        id: "motor-mod-1",
        name: "电机Modelica库",
        description: "标准电机模型库",
      },
      {
        id: "inverter-mod-1",
        name: "逆变器Modelica模型",
        description: "功率电子变换器模型",
      },
      {
        id: "thermal-mod-1",
        name: "热传导Modelica模型",
        description: "传热仿真模型",
      },
      {
        id: "bms-mod-1",
        name: "BMS Modelica模型",
        description: "电池管理系统模型",
      },
      {
        id: "vcu-mod-1",
        name: "VCU Modelica模型",
        description: "整车控制模型",
      },
      {
        id: "dcdc-mod-1",
        name: "DC/DC Modelica模型",
        description: "电压变换器模型",
      },
      {
        id: "regen-mod-1",
        name: "制动回收Modelica模型",
        description: "能量回收系统模型",
      },
    ],
    amesim: [
      {
        id: "battery-ames-1",
        name: "电池AMESim模型",
        description: "电池电化学特性模型",
      },
      {
        id: "charging-ames-1",
        name: "充电AMESim模型",
        description: "充电系统仿真模型",
      },
      {
        id: "motor-ames-1",
        name: "电机AMESim模型",
        description: "电机驱动系统模型",
      },
      {
        id: "thermal-ames-1",
        name: "热管理AMESim模型",
        description: "热管理系统仿真",
      },
      {
        id: "hydraulic-ames-1",
        name: "液压系统AMESim模型",
        description: "液压传动系统",
      },
      {
        id: "inverter-ames-1",
        name: "逆变器AMESim模型",
        description: "功率电子系统模型",
      },
      {
        id: "bms-ames-1",
        name: "BMS AMESim模型",
        description: "电池管理系统模型",
      },
      {
        id: "vcu-ames-1",
        name: "VCU AMESim模型",
        description: "整车控制模型",
      },
      {
        id: "regen-ames-1",
        name: "制动回收AMESim模型",
        description: "再生制动系统模型",
      },
    ],
  };

  // 处理块选择模型
  const handleBlockClick = (blockId: string) => {
    setSelectedBlock(blockId);
    setShowModelSelector(true);
  };

  // 自定义IBD节点组件
  const IBDNode = ({ data, selected }: NodeProps) => {
    const block = data.block;
    const configured = block.configured;

    const handleNodeClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      handleBlockClick(block.id);
    };

    return (
      <div
        className={`relative bg-white border-2 transition-all cursor-pointer ${
          configured ? "border-green-600" : "border-blue-600"
        } ${selected ? "ring-2 ring-blue-400" : ""}`}
        style={{
          width: block.width || 80,
          height: block.height || 50,
          backgroundColor: configured ? "#f0fdf4" : "#fffbeb",
        }}
        onClick={handleNodeClick}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Handle 连接点 */}
        <Handle
          type="target"
          position={Position.Left}
          style={{
            left: -3,
            width: 6,
            height: 6,
            backgroundColor: "#22c55e",
            border: "0.5px solid #000000",
          }}
        />
        <Handle
          type="source"
          position={Position.Right}
          style={{
            right: -3,
            width: 6,
            height: 6,
            backgroundColor: "#22c55e",
            border: "0.5px solid #000000",
          }}
        />
        <Handle
          type="target"
          position={Position.Top}
          style={{
            top: -3,
            width: 6,
            height: 6,
            backgroundColor: "#22c55e",
            border: "0.5px solid #000000",
          }}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          style={{
            bottom: -3,
            width: 6,
            height: 6,
            backgroundColor: "#22c55e",
            border: "0.5px solid #000000",
          }}
        />

        {/* 类型标识条 */}
        <div
          className={`absolute top-0 left-0 right-0 h-2 ${
            block.type === "energy-source"
              ? "bg-red-200"
              : block.type === "power-converter"
                ? "bg-orange-200"
                : block.type === "control-unit"
                  ? "bg-blue-200"
                  : block.type === "actuator"
                    ? "bg-green-200"
                    : block.type === "auxiliary-system"
                      ? "bg-purple-200"
                      : "bg-gray-200"
          }`}
        />

        {/* 内容区域 */}
        <div className="flex flex-col items-center justify-center h-full px-1 pt-2">
          {/* 主标题 */}
          <div
            className="text-xs font-medium text-center leading-tight pointer-events-none"
            style={{
              color: configured ? "#059669" : "#1d4ed8",
              fontSize: "11px",
            }}
          >
            :{block.name}
          </div>

          {/* 副标题 */}
          {block.subtitle && (
            <div
              className="text-xs text-center leading-tight pointer-events-none mt-1"
              style={{
                color: configured ? "#065f46" : "#1e40af",
                opacity: 0.8,
                fontSize: "10px",
              }}
            >
              {block.subtitle}
            </div>
          )}
        </div>

        {/* 配置状态指示 */}
        {configured && (
          <div className="absolute top-1 right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs leading-none">
              ✓
            </span>
          </div>
        )}
      </div>
    );
  };

  // 自定义外部接口节点组件
  const InterfaceNode = ({ data }: NodeProps) => {
    return (
      <div className="bg-white border border-black px-2 py-1 text-xs text-center">
        {data.label}
      </div>
    );
  };

  // 节点类型定义
  const nodeTypes = {
    ibdNode: IBDNode,
    interfaceNode: InterfaceNode,
  };

  // 将IBD数据转换为React Flow节点
  const initialNodes: Node[] = [
    // IBD节点
    ...ibdBlocks.map((block) => ({
      id: block.id,
      type: "ibdNode",
      position: {
        x: block.x - (block.width || 80) / 2,
        y: block.y - (block.height || 50) / 2,
      },
      data: {
        block: {
          ...block,
          configured: !!ibdBlockModels[block.id],
        },
      },
      draggable: false,
    })),
  ];

  // 定义连接线
  const initialEdges: Edge[] = [
    // 能量流连接
    {
      id: "charging-battery-pack",
      source: "charging",
      target: "battery_pack",
      animated: true,
      style: { stroke: "#000000", strokeWidth: 1.5 },
      label: ":iEnergy",
      labelStyle: { fontSize: 10, fill: "#000000" },
    },
    {
      id: "battery-dcdc",
      source: "battery_pack",
      target: "dc_dc",
      animated: true,
      style: { stroke: "#000000", strokeWidth: 1.5 },
      label: ":iEnergy",
      labelStyle: { fontSize: 10, fill: "#000000" },
    },
    {
      id: "battery-inverter",
      source: "battery_pack",
      target: "inverter",
      animated: true,
      style: { stroke: "#000000", strokeWidth: 1.5 },
      label: ":iEnergy",
      labelStyle: { fontSize: 10, fill: "#000000" },
    },
    {
      id: "inverter-motor",
      source: "inverter",
      target: "motor",
      animated: true,
      style: { stroke: "#000000", strokeWidth: 1.5 },
      label: ":iEnergy",
      labelStyle: { fontSize: 10, fill: "#000000" },
    },
    // 控制信号连接
    {
      id: "vcu-inverter",
      source: "vcu",
      target: "inverter",
      style: {
        stroke: "#000000",
        strokeWidth: 1.5,
        strokeDasharray: "4,2",
      },
      label: ":iControl",
      labelStyle: { fontSize: 10, fill: "#000000" },
    },
    {
      id: "vcu-bms",
      source: "vcu",
      target: "bms",
      style: {
        stroke: "#000000",
        strokeWidth: 1.5,
        strokeDasharray: "4,2",
      },
      label: ":iControl",
      labelStyle: { fontSize: 10, fill: "#000000" },
    },
    {
      id: "vcu-regen",
      source: "vcu",
      target: "regen_brake",
      style: {
        stroke: "#000000",
        strokeWidth: 1.5,
        strokeDasharray: "4,2",
      },
      label: ":iControl",
      labelStyle: { fontSize: 10, fill: "#000000" },
    },
    // 制动回收
    {
      id: "regen-battery",
      source: "regen_brake",
      target: "battery_pack",
      animated: true,
      style: { stroke: "#000000", strokeWidth: 1.5 },
      label: ":iEnergy",
      labelStyle: { fontSize: 10, fill: "#000000" },
    },
    // 热管理连接
    {
      id: "dcdc-thermal",
      source: "dc_dc",
      target: "thermal_sys",
      style: { stroke: "#000000", strokeWidth: 1.5 },
      label: ":iThermal",
      labelStyle: { fontSize: 10, fill: "#000000" },
    },
    // BMS反馈
    {
      id: "bms-vcu",
      source: "bms",
      target: "vcu",
      style: {
        stroke: "#000000",
        strokeWidth: 1.5,
        strokeDasharray: "4,2",
      },
      label: ":iStatus",
      labelStyle: { fontSize: 10, fill: "#000000" },
    },
  ];

  const [nodes, setNodes, onNodesChange] =
    useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] =
    useEdgesState(initialEdges);

  // 更新节点配置状态
  const updateNodeConfiguration = useCallback(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.type === "ibdNode") {
          const block = node.data.block;
          return {
            ...node,
            data: {
              ...node.data,
              block: {
                ...block,
                configured: !!ibdBlockModels[block.id],
              },
            },
          };
        }
        return node;
      }),
    );
  }, [ibdBlockModels]);

  // 当配置状态改变时更新节点
  React.useEffect(() => {
    updateNodeConfiguration();
  }, [ibdBlockModels, updateNodeConfiguration]);

  // 监听ibdBlockModels变化，自动更新modelConfigCompleted状态
  React.useEffect(() => {
    const allConfigured = ibdBlocks.every((block) => ibdBlockModels[block.id]);
    setModelConfigCompleted(allConfigured);
  }, [ibdBlockModels, ibdBlocks]);

  // 组件初始化时的调试信息
  React.useEffect(() => {
    console.log("EnergySimulationNodeConfig 初始化:");
    console.log("- 节点数据:", node);
    console.log("- 已配置模型:", ibdBlockModels);
    console.log("- 配置完成状态:", modelConfigCompleted);
    console.log("- 配置的模块数量:", Object.keys(ibdBlockModels).length);
    console.log("- 需配置模块总数:", ibdBlocks.length);
  }, []); // 只在组件挂载时执行一次

  // 监听扩展状态变化
  React.useEffect(() => {
    // 阻止页面滚动当全屏模式开启时
    if (isArchitectureExpanded) {
      document.body.style.overflow = "hidden";
      // 关闭模型配置对话框以避免重叠
      setShowModelConfig(false);
    } else {
      document.body.style.overflow = "unset";
    }

    // 清理函数
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isArchitectureExpanded]);

  // 处理模型选择确认
  const handleModelSelection = (
    modelType: string,
    modelId: string,
    model: any,
  ) => {
    setIbdBlockModels((prev) => {
      const updated = {
        ...prev,
        [selectedBlock!]: {
          type: modelType,
          id: modelId,
          name: model.name,
          description: model.description,
        },
      };
      
      // 检查是否所有模块都已配置
      const allConfigured = ibdBlocks.every((block) => updated[block.id]);
      setModelConfigCompleted(allConfigured);
      
      return updated;
    });
    
    setShowModelSelector(false);
    setSelectedBlock(null);

    // 如果在全屏模式下，选择模型后给用户提示
    if (isArchitectureExpanded) {
      console.log(
        `已为 ${ibdBlocks.find((b) => b.id === selectedBlock)?.name} 配置模型: ${model.name}`,
      );
    }
  };

  // 应用默认模型配置
  const handleApplyDefaultModels = () => {
    setIbdBlockModels(defaultBlockModels);
    setModelConfigCompleted(true);
    console.log("已应用默认模型配置");
    
    // 显示成功提示
    alert("已成功应用默认模型配置！所有模块已完成配置，现在可以保存节点设置，配置将被持久化保存。");
  };

  // 确认模型配置
  const handleConfirmModelConfig = () => {
    const allBlocksConfigured = ibdBlocks.every(
      (block) => ibdBlockModels[block.id],
    );
    if (allBlocksConfigured) {
      setModelConfigCompleted(true);
      setShowModelConfig(false);
    }
  };

  const handleSave = () => {
    // 检查模型配置是否完成 - 改进检查逻辑
    const allBlocksConfigured = ibdBlocks.every(
      (block) => ibdBlockModels[block.id]
    );
    
    if (!allBlocksConfigured) {
      alert("请先完成所有模块的模型配置再保存");
      return;
    }

    // 构建完整的配置数据，确保数据结构正确
    const nodeConfig = {
      nodeName: config.nodeName,
      description: config.description,
      priority: "中", // 默认优先级
      autoExecute: config.autoRun,
      timeout: config.timeout,
      retryCount: config.retryCount,
      // 将所有参数配置数据封装在parameters对象中，确保结构一致
      parameters: {
        sourceSSPFile: config.sourceSSPFile,
        targetFormat: config.targetFormat,
        sspConfig: config.sspConfig,
        modelSelection: config.modelSelection,
        modelMapping: config.modelMapping,
        conversionOptions: config.conversionOptions,
        codeGeneration: config.codeGeneration,
        advancedSettings: config.advancedSettings,
        outputConfiguration: config.outputConfiguration,
        validationCriteria: config.validationCriteria,
        modelConfigCompleted: allBlocksConfigured, // 保存配置完成状态
        ibdBlockModels: ibdBlockModels, // 保存模型映射配置
      }
    };

    console.log("保存节点配置:", nodeConfig);
    onSave(nodeConfig);
    
    // 显示保存成功提示
    alert(`节点 "${config.nodeName}" 配置已保存成功！\n\n已保存的配置包括：\n- 基础设置\n- 模型库来源\n- ${Object.keys(ibdBlockModels).length} 个模块的模型映射\n\n下次打开此节点时，配置将自动恢复。`);
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground">
          配置模型组成
        </p>
      </div>

      <Separator />

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic">基础设置</TabsTrigger>
          <TabsTrigger value="modelSelection">
            模型选择
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4 mt-4">
          <div>
            <Label htmlFor="nodeName">节点名称</Label>
            <Input
              id="nodeName"
              value={config.nodeName}
              onChange={(e) =>
                setConfig({
                  ...config,
                  nodeName: e.target.value,
                })
              }
              placeholder="请输入节点名称"
            />
          </div>

          <div>
            <Label htmlFor="description">节点描述</Label>
            <Textarea
              id="description"
              value={config.description}
              onChange={(e) =>
                setConfig({
                  ...config,
                  description: e.target.value,
                })
              }
              placeholder="请输入节点描述"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="sourceSSPFile">源SSP文件</Label>
            <Select
              value={config.sourceSSPFile}
              onValueChange={(value) =>
                setConfig({ ...config, sourceSSPFile: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="选择SSP文件" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="local-upload">
                  本地上传
                </SelectItem>
                <SelectItem value="project-library">
                  项目库文件
                </SelectItem>
                <SelectItem value="system-default">
                  系统默认SSP
                </SelectItem>
                <SelectItem value="recent-files">
                  最近使用文件
                </SelectItem>
                <SelectItem value="shared-library">
                  共享库文件
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="targetFormat">目标模型格式</Label>
            <Select
              value={config.targetFormat}
              onValueChange={(value) =>
                setConfig({ ...config, targetFormat: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="选择目标模型格式" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="modelica">
                  Modelica模型
                </SelectItem>
                <SelectItem value="amesim">
                  AMESim模型
                </SelectItem>
                <SelectItem value="simulink">
                  Simulink模型
                </SelectItem>
                <SelectItem value="fmu">FMU模型</SelectItem>
                <SelectItem value="custom">
                  自定义格式
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="autoExecute"
              checked={config.autoRun}
              onCheckedChange={(checked) =>
                setConfig({
                  ...config,
                  autoRun: checked,
                })
              }
            />
            <Label htmlFor="autoExecute">自动运行</Label>
          </div>
        </TabsContent>

        <TabsContent value="modelSelection" className="space-y-4 mt-4">
          <div>
            <Label htmlFor="modelLibrarySource">
              模型库来源
            </Label>
            <Select
              value={config.modelSelection.librarySource}
              onValueChange={(value) =>
                setConfig({
                  ...config,
                  modelSelection: {
                    ...config.modelSelection,
                    librarySource: value,
                  },
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="选择模型库来源" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard-library">
                  标准模型库
                </SelectItem>
                <SelectItem value="project-library">
                  项目模型库
                </SelectItem>
                <SelectItem value="user-library">
                  用户模型库
                </SelectItem>
                <SelectItem value="shared-library">
                  共享模型库
                </SelectItem>
                <SelectItem value="external-library">
                  外部模型库
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>模型配置</Label>
            <div className="mt-2 border border-gray-200 rounded-lg overflow-hidden bg-white">
              {/* 配置状态头部 - 简化布局 */}
              <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">
                      模型映射配置
                    </h4>
                    <p className="text-xs text-gray-600 mt-1">
                      为SSP中的每个系统模块选择对应的模型类型和具体模型
                    </p>
                  </div>
                  
                  {/* 配置进度指示器 - 简化布局 */}
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-700">
                        进度: {Object.keys(ibdBlockModels).length}/{ibdBlocks.length}
                      </span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-20">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${(Object.keys(ibdBlockModels).length / ibdBlocks.length) * 100}%`
                          }}
                        />
                      </div>
                      {Object.keys(ibdBlockModels).length === ibdBlocks.length ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm font-medium">配置完成</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-orange-600">
                          <AlertCircle className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            待配置 {ibdBlocks.length - Object.keys(ibdBlockModels).length} 个
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* 操作按钮区域 - 简化布局 */}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleApplyDefaultModels}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>使用默认配置</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowModelConfig(true)}
                        className="flex items-center gap-2"
                      >
                        <Settings className="h-4 w-4" />
                        <span>手动配置</span>
                        {Object.keys(ibdBlockModels).length === ibdBlocks.length ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-orange-500" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 已配置模块列表 - 简化表格 */}
              {Object.keys(ibdBlockModels).length > 0 && (
                <div className="p-3">
                  <h5 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <Box className="h-4 w-4 text-blue-600" />
                    已配置模块列表
                  </h5>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {Object.entries(ibdBlockModels).map(
                      ([blockId, model]: [string, any]) => {
                        const block = ibdBlocks.find(
                          (b) => b.id === blockId,
                        );
                        return (
                          <div
                            key={blockId}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
                          >
                            <div className="flex items-center space-x-2 flex-1 min-w-0">
                              <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>
                              <div className="min-w-0">
                                <span className="font-medium text-gray-900 block truncate">
                                  {block?.name}
                                </span>
                                <div className="text-xs text-gray-500 truncate">
                                  {block?.subtitle}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 flex-shrink-0">
                              <Badge
                                variant="secondary"
                                className="text-xs"
                              >
                                {model.type.toUpperCase()}
                              </Badge>
                              <div className="flex space-x-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedBlock(blockId);
                                    setShowModelSelector(true);
                                  }}
                                  className="text-xs px-2 py-1 h-auto text-blue-600 hover:text-blue-700"
                                >
                                  编辑
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setIbdBlockModels((prev) => {
                                      const updated = { ...prev };
                                      delete updated[blockId];
                                      setModelConfigCompleted(
                                        ibdBlocks.length - 1 <= Object.keys(updated).length
                                      );
                                      return updated;
                                    });
                                  }}
                                  className="text-xs px-2 py-1 h-auto text-red-600 hover:text-red-700"
                                >
                                  删除
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      },
                    )}
                  </div>
                </div>
              )}

              {/* 空状态显示 */}
              {Object.keys(ibdBlockModels).length === 0 && (
                <div className="p-6 text-center">
                  <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    <Box className="h-6 w-6 text-gray-400" />
                  </div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">
                    暂无配置模型
                  </h4>
                  <p className="text-xs text-gray-500 mb-4">
                    请点击上方按钮开始配置模型映射
                  </p>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleApplyDefaultModels}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>快速配置</span>
                  </Button>
                </div>
              )}

              {/* 配置说明 - 简化显示 */}
              <div className="p-3 bg-blue-50 border-t border-blue-100">
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-white text-xs">i</span>
                  </div>
                  <div className="text-xs text-blue-800">
                    <p><strong>使用默认配置</strong>：一键应用预设的最佳实践模型配置</p>
                    <p><strong>手动配置</strong>：在架构图中点击各模块，自定义选择模型类型</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center space-x-3 pt-4">
        <Button variant="outline" onClick={onCancel}>
          取消
        </Button>
        <Button onClick={handleSave}>保存配置</Button>
      </div>

      {/* 模型配置对话框 */}
      <Dialog
        open={showModelConfig}
        onOpenChange={setShowModelConfig}
      >
        <DialogContent className="max-w-6xl max-h-[85vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Box className="h-5 w-5" />
              <span>模型配置</span>
            </DialogTitle>
            <DialogDescription>
              为架构图中的每个系统模块选择对应的模型类型和具体模型，完成模型映射配置。
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col space-y-4 h-[70vh]">
            {/* 配置状态指示 */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium">配置进度</h3>
                <p className="text-sm text-gray-600">
                  已配置 {Object.keys(ibdBlockModels).length} /{" "}
                  {ibdBlocks.length} 个模块
                </p>
              </div>
              <div className="flex space-x-2">
                {ibdBlocks.map((block) => (
                  <div
                    key={block.id}
                    className={`w-3 h-3 rounded-full ${
                      ibdBlockModels[block.id]
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                    title={`${block.name}: ${ibdBlockModels[block.id] ? "已配置" : "未配置"}`}
                  />
                ))}
              </div>
            </div>

            {/* IBD图显示区域 */}
            <div className="flex-1 bg-white border border-gray-200 rounded-lg relative overflow-hidden">
              <div className="absolute inset-0 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-700">
                    点击下方模块选择对应的模型类型
                  </h4>
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsArchitectureExpanded(true);
                      }}
                      className="flex items-center space-x-1"
                    >
                      <Maximize2 className="h-4 w-4" />
                      <span>全屏查看</span>
                    </Button>
                  </div>
                </div>

                {/* React Flow 架构图 */}
                <div
                  className="w-full h-full border border-gray-200 bg-white rounded"
                  style={{ height: "calc(100% - 40px)" }}
                >
                  <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    nodeTypes={nodeTypes}
                    connectionMode={ConnectionMode.Loose}
                    fitView
                    fitViewOptions={{
                      padding: 0.1,
                      minZoom: 0.5,
                      maxZoom: 2,
                    }}
                    minZoom={0.3}
                    maxZoom={3}
                    defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
                    nodesDraggable={false}
                    nodesConnectable={false}
                    elementsSelectable={true}
                    zoomOnScroll={true}
                    zoomOnPinch={true}
                    panOnDrag={[1, 2]}
                    selectNodesOnDrag={false}
                    onNodeClick={(event, node) => {
                      if (
                        node.type === "ibdNode" &&
                        node.data.block
                      ) {
                        event.stopPropagation();
                        handleBlockClick(node.data.block.id);
                      }
                    }}
                  >
                    {/* 背景 */}
                    <Background
                      variant="lines"
                      gap={20}
                      size={1}
                      color="#f0f0f0"
                    />

                    {/* 控制面板 */}
                    <Controls
                      position="top-right"
                      showZoom={true}
                      showFitView={true}
                      showInteractive={false}
                    />

                    {/* 自定义标题 */}
                    <div
                      className="absolute top-2 left-2 pointer-events-none"
                      style={{ zIndex: 5 }}
                    >
                      <div className="text-sm font-medium text-black bg-white px-2 py-1 rounded border">
                        ibd [Block] 新能源汽车能量管理系统
                        Energy Management System
                      </div>
                    </div>
                  </ReactFlow>
                </div>
              </div>
            </div>

            {/* 已配置模型列表 */}
            <div className="max-h-32 overflow-y-auto">
              <h4 className="text-sm font-medium mb-2">
                已配置模型
              </h4>
              <div className="space-y-2">
                {Object.entries(ibdBlockModels).map(
                  ([blockId, model]: [string, any]) => {
                    const block = ibdBlocks.find(
                      (b) => b.id === blockId,
                    );
                    return (
                      <div
                        key={blockId}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-medium">
                            {block?.name}
                          </span>
                          <Badge variant="secondary">
                            {model.type.toUpperCase()}
                          </Badge>
                        </div>
                        <span className="text-sm text-gray-600">
                          {model.name}
                        </span>
                      </div>
                    );
                  },
                )}
              </div>
            </div>

            {/* 确认按钮 */}
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setShowModelConfig(false)}
              >
                取消
              </Button>
              <Button
                onClick={handleConfirmModelConfig}
                disabled={
                  Object.keys(ibdBlockModels).length <
                  ibdBlocks.length
                }
              >
                确认模型配置
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 全屏架构图扩展视图 */}
      {isArchitectureExpanded &&
        createPortal(
          <div className="fixed inset-0 z-[9999] bg-white">
            {/* 顶部导航栏 */}
            <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
              {/* 面包屑导航 */}
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Home className="h-4 w-4" />
                <ChevronRight className="h-4 w-4" />
                <span>节点配置</span>
                <ChevronRight className="h-4 w-4" />
                <span>模型配置</span>
                <ChevronRight className="h-4 w-4" />
                <span className="text-gray-900 font-medium">
                  架构图扩展视图
                </span>
              </div>

              {/* 操作按钮 */}
              <div className="flex items-center space-x-3">
                <div className="text-sm text-gray-500">
                  点击模块进行配置 • 鼠标滚轮缩放 • 拖拽平移
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsArchitectureExpanded(false);
                    // 退出全屏后返回到模型配置对话框
                    setTimeout(() => {
                      setShowModelConfig(true);
                    }, 100);
                  }}
                  className="flex items-center space-x-1"
                >
                  <Minimize2 className="h-4 w-4" />
                  <span>退出全屏</span>
                </Button>
              </div>
            </div>

            {/* 架构图主体区域 */}
            <div className="h-[calc(100vh-64px)] bg-white">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                connectionMode={ConnectionMode.Loose}
                fitView
                fitViewOptions={{
                  padding: 0.05,
                  minZoom: 0.5,
                  maxZoom: 4,
                }}
                minZoom={0.3}
                maxZoom={5}
                defaultViewport={{ x: 0, y: 0, zoom: 1.5 }}
                nodesDraggable={false}
                nodesConnectable={false}
                elementsSelectable={true}
                zoomOnScroll={true}
                zoomOnPinch={true}
                panOnDrag={[1, 2]}
                selectNodesOnDrag={false}
                onNodeClick={(event, node) => {
                  if (
                    node.type === "ibdNode" &&
                    node.data.block
                  ) {
                    event.stopPropagation();
                    handleBlockClick(node.data.block.id);
                  }
                }}
              >
                {/* 背景 */}
                <Background
                  variant="lines"
                  gap={30}
                  size={1.5}
                  color="#e5e7eb"
                />

                {/* 控制面板 */}
                <Controls
                  position="bottom-right"
                  showZoom={true}
                  showFitView={true}
                  showInteractive={false}
                  style={{
                    marginBottom: 20,
                    marginRight: 20,
                  }}
                />

                {/* 架构图标题 */}
                <div
                  className="absolute top-6 left-6 pointer-events-none"
                  style={{ zIndex: 5 }}
                >
                  <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                      ibd [Block] 新能源汽车能量管理系统
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Energy Management System Architecture
                    </p>
                  </div>
                </div>

                {/* 配置状态指示器 */}
                <div
                  className="absolute top-6 right-6 pointer-events-none"
                  style={{ zIndex: 5 }}
                >
                  <div className="bg-white/95 backdrop-blur-sm px-4 py-3 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-sm text-gray-600 mb-2">
                      配置进度
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-lg font-semibold text-gray-900">
                        {Object.keys(ibdBlockModels).length}/
                        {ibdBlocks.length}
                      </div>
                      <div className="flex space-x-1">
                        {ibdBlocks.map((block) => (
                          <div
                            key={block.id}
                            className={`w-2 h-2 rounded-full ${
                              ibdBlockModels[block.id]
                                ? "bg-green-500"
                                : "bg-gray-300"
                            }`}
                            title={`${block.name}: ${ibdBlockModels[block.id] ? "已配置" : "未配置"}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </ReactFlow>
            </div>
          </div>,
          document.body,
        )}

      {/* 模型选择对话框 - 支持全屏模式 */}
      {showModelSelector &&
        selectedBlock &&
        (isArchitectureExpanded ? (
          createPortal(
            <div className="fixed inset-0 z-[10000] bg-black/50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold mb-2">
                    选择 &quot;
                    {
                      ibdBlocks.find(
                        (b) => b.id === selectedBlock,
                      )?.name
                    }
                    &quot; 的模型
                  </h2>
                  <p className="text-gray-600 text-sm">
                    从公共模型库中选择适合的模型类型（FMU、Modelica、AMESim），所选模型将用于该系统模块的仿真计算。
                  </p>
                </div>

                <div className="p-6 space-y-6 max-h-[calc(80vh-140px)] overflow-y-auto">
                  <Tabs defaultValue="fmu" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="fmu">
                        FMU模型
                      </TabsTrigger>
                      <TabsTrigger value="modelica">
                        Modelica模型
                      </TabsTrigger>
                      <TabsTrigger value="amesim">
                        AMESim模型
                      </TabsTrigger>
                    </TabsList>

                    {Object.entries(modelLibrary).map(
                      ([type, models]) => (
                        <TabsContent
                          key={type}
                          value={type}
                          className="space-y-3"
                        >
                          <div className="text-sm text-gray-600 mb-4">
                            从公共库中选择 {type.toUpperCase()}{" "}
                            模型，选中的模型将保存到公共库中
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-80 overflow-y-auto">
                            {models.map((model: any) => (
                              <div
                                key={model.id}
                                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                onClick={() =>
                                  handleModelSelection(
                                    type,
                                    model.id,
                                    model,
                                  )
                                }
                              >
                                <h4 className="font-medium text-gray-900 mb-2">
                                  {model.name}
                                </h4>
                                <p className="text-sm text-gray-600 mb-3">
                                  {model.description}
                                </p>
                                <Badge variant="outline">
                                  {type.toUpperCase()}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </TabsContent>
                      ),
                    )}
                  </Tabs>
                </div>

                <div className="p-6 border-t border-gray-200 flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowModelSelector(false);
                      setSelectedBlock(null);
                    }}
                  >
                    取消
                  </Button>
                </div>
              </div>
            </div>,
            document.body,
          )
        ) : (
          <Dialog
            open={showModelSelector}
            onOpenChange={(open) => {
              setShowModelSelector(open);
              if (!open) {
                setSelectedBlock(null);
              }
            }}
          >
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
              <DialogHeader>
                <DialogTitle>
                  选择 &quot;
                  {
                    ibdBlocks.find(
                      (b) => b.id === selectedBlock,
                    )?.name
                  }
                  &quot; 的模型
                </DialogTitle>
                <DialogDescription>
                  从公共模型库中选择适合的模型类型（FMU、Modelica、AMESim），所选模型将用于该系统模块的仿真计算。
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <Tabs defaultValue="fmu" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="fmu">
                      FMU模型
                    </TabsTrigger>
                    <TabsTrigger value="modelica">
                      Modelica模型
                    </TabsTrigger>
                    <TabsTrigger value="amesim">
                      AMESim模型
                    </TabsTrigger>
                  </TabsList>

                  {Object.entries(modelLibrary).map(
                    ([type, models]) => (
                      <TabsContent
                        key={type}
                        value={type}
                        className="space-y-3"
                      >
                        <div className="text-sm text-gray-600 mb-4">
                          从公共库中选择 {type.toUpperCase()}{" "}
                          模型，选中的模型将保存到公共库中
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-80 overflow-y-auto">
                          {models.map((model: any) => (
                            <div
                              key={model.id}
                              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                              onClick={() =>
                                handleModelSelection(
                                  type,
                                  model.id,
                                  model,
                                )
                              }
                            >
                              <h4 className="font-medium text-gray-900 mb-2">
                                {model.name}
                              </h4>
                              <p className="text-sm text-gray-600 mb-3">
                                {model.description}
                              </p>
                              <Badge variant="outline">
                                {type.toUpperCase()}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    ),
                  )}
                </Tabs>

                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowModelSelector(false);
                      setSelectedBlock(null);
                    }}
                  >
                    取消
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ))}
    </div>
  );
}