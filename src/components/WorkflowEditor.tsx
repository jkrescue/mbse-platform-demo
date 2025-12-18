import {
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { ArchConversionNodeConfig } from "./ArchConversionNodeConfig";
import { EnergyRequirementSyncNodeConfig } from "./nodeConfig/EnergyRequirementSyncNodeConfig";
import { EnergySSPConversionNodeConfig } from "./nodeConfig/EnergySSPConversionNodeConfig";
import { DefaultNodeConfig } from "./nodeConfig/DefaultNodeConfig";
import { RequirementSyncNodeConfig } from "./nodeConfig/RequirementSyncNodeConfig";
import { RequirementCreationNodeConfig } from "./nodeConfig/RequirementCreationNodeConfig";
import { FunctionSystemDesignNodeConfig } from "./nodeConfig/FunctionSystemDesignNodeConfig";
import { SimulationNodeConfig } from "./nodeConfig/SimulationNodeConfig";
import { DOEAnalysisNodeConfig } from "./nodeConfig/DOEAnalysisNodeConfig";
import { BatteryThermalDesignNodeConfig } from "./nodeConfig/BatteryThermalDesignNodeConfig";
import { VehicleSafetyArchNodeConfig } from "./nodeConfig/VehicleSafetyArchNodeConfig";
import { SSPArchConversionNodeConfig } from "./nodeConfig/SSPArchConversionNodeConfig";
import { SSPModelicaNodeConfig } from "./nodeConfig/SSPModelicaNodeConfig";
import { MWorksSimNodeConfig } from "./nodeConfig/MWorksSimNodeConfig";
import { EnergySimulationNodeConfig } from "./nodeConfig/EnergySimulationNodeConfig";
import { BatteryModelSimNodeConfig } from "./nodeConfig/BatteryModelSimNodeConfig";
import { toast } from "sonner@2.0.3";

// Import types, constants, and utils
import { 
  WorkflowEditorProps, 
  WorkflowNode, 
  Connection, 
  ContextMenuPosition,
  NodeStatus 
} from "./workflow/workflowEditorTypes";
import { 
  componentLibrary, 
  getTagColor 
} from "./workflow/workflowEditorConstants";
import { 
  energyManagementNodes, 
  initialNodes, 
  energyManagementConnections, 
  initialConnections 
} from "./workflow/workflowEditorData";
import{
  isArchConversionNode,
  isEnergyRequirementSyncNode,
  isEnergySSPConversionNode,
  isRequirementSyncNode,
  isFunctionSystemDesignNode,
  isBatteryThermalDesignNode,
  isVehicleSafetyArchNode,
  isSSPArchConversionNode,
  isSSPModelicaNode,
  isMWorksSimNode,
  isEnergySimulationNode,
  isBatteryModelSimNode,
  isSimulationNode,
  isDOEAnalysisNode,
  constrainPosition,
  constrainPan,
  getConnectionColor,
} from "./workflow/workflowEditorUtils";
import { RFLPTemplate, nodeTypeDisplayNames } from "./workflow/rflpTemplates";

// Import components
import { WorkflowToolbar } from "./workflow/WorkflowToolbar";
import { ComponentLibraryPanel } from "./workflow/ComponentLibraryPanel";
import { WorkflowCanvas } from "./workflow/WorkflowCanvas";
import { ConfigDrawer } from "./workflow/ConfigDrawer";
import { ContextMenu } from "./workflow/ContextMenu";
import { ResultDrawer } from "./workflow/ResultDrawer";

export function WorkflowEditor({
  workflowData,
  onBack,
  onSave,
  userRole,
  onOpenInTool,
}: WorkflowEditorProps) {
  const [workflowName, setWorkflowName] = useState(
    workflowData?.name || "新建工作流",
  );
  const [workflowDescription, setWorkflowDescription] =
    useState(workflowData?.description || "");
  const [openSections, setOpenSections] = useState<string[]>([
    "requirement-management",
    "function-architecture",
    "system-integration-sim",
    "design-traceability",
  ]);

  // 画布状态 - 根据工作流类型选择不同的初始节点
  const isEnergyManagementWorkflow =
    workflowData?.id === "energy-management-workflow";
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedNode, setSelectedNode] = useState<
    string | null
  >(null);

  // 应用RFLP模板到画布
  const applyRFLPTemplate = useCallback((template: RFLPTemplate) => {
    console.log("应用RFLP模板:", template.name);
    
    // 使用预设的组件库节点创建RFLP模板节点
    // 将RFLP模板的抽象节点类型映射到具体的组件库节点
    const nodeTypeMapping: Record<string, string> = {
      'requirement-analysis': 'requirement-creation',
      'vehicle-demand': 'requirement-sync',
      'system-architecture': 'function-system-design',
      'thermal-management': 'battery-thermal-design',
      'energy-system-simulation': 'energy-simulation',
      'thermal-simulation': 'battery-model-sim',
      'system-validation': 'doe-analysis',
      'performance-verification': 'simulation'
    };

    // 创建模板节点，将RFLP抽象节点实例化为具体的组件库节点
    const templateNodes: WorkflowNode[] = template.presetNodes.map(presetNode => {
      // 获取对应的具体节点类型
      const concreteNodeType = nodeTypeMapping[presetNode.type] || presetNode.type;
      
      // 从组件库中查找对应的节点定义
      let nodeDefinition = null;
      for (const section of componentLibrary) {
        nodeDefinition = section.items.find(item => item.id === concreteNodeType);
        if (nodeDefinition) break;
      }

      // 如果没有找到具体的节点定义，使用默认的
      if (!nodeDefinition) {
        nodeDefinition = {
          id: concreteNodeType,
          name: nodeTypeDisplayNames[presetNode.type] || presetNode.data.label,
          description: `基于${template.name}的${presetNode.layer.toUpperCase()}层组件`,
          tag: presetNode.layer.toUpperCase()
        };
      }

      return {
        id: presetNode.id,
        type: concreteNodeType,
        name: nodeDefinition.name,
        description: nodeDefinition.description,
        tag: presetNode.layer.toUpperCase(),
        tagColor: template.layers[presetNode.layer].color,
        status: "waiting" as NodeStatus,
        position: presetNode.position,
        collapsed: false,
        ports: {
          input: { x: 20, y: 60 },
          output: { x: 340, y: 60 }
        },
        config: {
          priority: "中",
          autoRun: false,
          timeout: 300,
          retryCount: 0,
          rflpLayer: presetNode.layer,
          layerColor: template.layers[presetNode.layer].color,
          ...(presetNode.data.config || {})
        }
      };
    });

    // 创建模板连接
    const templateConnections: Connection[] = template.presetConnections.map(conn => ({
      id: conn.id,
      from: conn.source,
      to: conn.target,
      fromPort: "output",
      toPort: "input",
      type: conn.type,
      label: conn.label,
      style: {
        stroke: conn.type === 'traceability' ? '#ef4444' : 
               conn.type === 'decomposition' ? '#3b82f6' : '#10b981',
        strokeWidth: 2,
        strokeDasharray: conn.type === 'traceability' ? '5,5' : 'none'
      }
    }));

    setNodes(templateNodes);
    setConnections(templateConnections);
    
    // 显示成功提示
    toast.success(`已加载${template.name}模板`, {
      description: `包含${templateNodes.length}个节点，${templateConnections.length}个追溯关系`,
      duration: 4000
    });
  }, []);

  // 初始化画布状态
  useEffect(() => {
    if (workflowData?.rflpTemplate && (!workflowData?.nodes || workflowData.nodes.length === 0)) {
      // 如果有RFLP模板且没有保存的节点状态，应用模板
      applyRFLPTemplate(workflowData.rflpTemplate);
    } else if (workflowData?.nodes) {
      // 恢复已保存的节点状态
      setNodes(workflowData.nodes || []);
      setConnections(workflowData.connections || []);
    } else if (isEnergyManagementWorkflow) {
      // 特定的能量管理工作流
      setNodes(energyManagementNodes);
      setConnections(energyManagementConnections);
    } else {
      // 默认初始节点
      setNodes(initialNodes);
      setConnections(initialConnections);
    }
  }, [workflowData, applyRFLPTemplate, isEnergyManagementWorkflow]);

  // 缩放和视图状态
  const [zoom, setZoom] = useState<number>(100);
  const [panX, setPanX] = useState<number>(0);
  const [panY, setPanY] = useState<number>(0);

  // 运行状态
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // 画布拖拽状态
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{
    x: number;
    y: number;
  }>({
    x: 0,
    y: 0,
  });
  const [lastPan, setLastPan] = useState<{
    x: number;
    y: number;
  }>({
    x: 0,
    y: 0,
  });

  // 拖拽状态管理
  const [isDraggingFromLibrary, setIsDraggingFromLibrary] =
    useState(false);

  // 节点库选中状态管理
  const [selectedLibraryItem, setSelectedLibraryItem] =
    useState<{
      item: any;
      sectionTag: string;
    } | null>(null);

  // 连线创建状态管理
  const [isCreatingConnection, setIsCreatingConnection] =
    useState(false);
  const [connectionStart, setConnectionStart] = useState<{
    nodeId: string;
    port: "input" | "output";
    x: number;
    y: number;
  } | null>(null);
  const [dragPosition, setDragPosition] = useState<{
    x: number;
    y: number;
  }>({
    x: 0,
    y: 0,
  });

  // 节点拖拽状态
  const [draggingNode, setDraggingNode] = useState<{
    id: string;
    offset: { x: number; y: number };
    startPosition: { x: number; y: number };
    hasMoved: boolean;
  } | null>(null);

  // 右侧配置抽屉状态
  const [isConfigDrawerOpen, setIsConfigDrawerOpen] =
    useState(false);
  const [configNodeId, setConfigNodeId] = useState<
    string | null
  >(null);

  // 右键菜单状态
  const [contextMenu, setContextMenu] =
    useState<ContextMenuPosition | null>(null);

  // 底部结果抽屉状态
  const [isResultDrawerOpen, setIsResultDrawerOpen] =
    useState(false);
  const [resultNodeId, setResultNodeId] = useState<
    string | null
  >(null);

  // 移动模式状态
  const [isMoveMode, setIsMoveMode] = useState(false);

  // Canvas ref for coordinate calculations
  const canvasRef = useRef<HTMLDivElement>(null);

  // Toolbar ref for config drawer positioning
  const toolbarRef = useRef<HTMLDivElement>(null);

  // 配置保存处理函数
  const handleConfigSave = useCallback(
    (config: any) => {
      if (configNodeId) {
        setNodes((prev) =>
          prev.map((node) =>
            node.id === configNodeId
              ? {
                  ...node,
                  name: config.nodeName,
                  description: config.description,
                  config: {
                    ...node.config,
                    ...config,
                  },
                }
              : node,
          ),
        );
        setIsConfigDrawerOpen(false);
        setConfigNodeId(null);
      }
    },
    [configNodeId],
  );

  // 获取当前配置的节点
  const getCurrentConfigNode = useCallback(() => {
    return configNodeId
      ? nodes.find((n) => n.id === configNodeId)
      : null;
  }, [configNodeId, nodes]);

  // 处理配置关闭
  const handleConfigCancel = useCallback(() => {
    setIsConfigDrawerOpen(false);
    setConfigNodeId(null);
  }, [setIsConfigDrawerOpen, setConfigNodeId]);

  // 渲染节点配置内容
  const renderNodeConfigContent = (node: WorkflowNode) => {
    // 创建需求节点的专门配置（第一个节点）
    if (node.type === 'requirement-creation' || (node.name && node.name.includes('创建需求'))) {
      return (
        <RequirementCreationNodeConfig
          node={node}
          onSave={handleConfigSave}
          onCancel={handleConfigCancel}
          userRole={userRole}
        />
      );
    }

    // 能量管理需求同步节点的独立配置
    if (isEnergyRequirementSyncNode(node)) {
      return (
        <EnergyRequirementSyncNodeConfig
          node={node}
          onSave={handleConfigSave}
          onCancel={handleConfigCancel}
          userRole={userRole}
        />
      );
    }

    // 能量管理SSP转换节点的独立配置
    if (isEnergySSPConversionNode(node)) {
      return (
        <EnergySSPConversionNodeConfig
          node={node}
          onSave={handleConfigSave}
          onCancel={handleConfigCancel}
          userRole={userRole}
        />
      );
    }

    // 电池热管理设计节点配置
    if (isBatteryThermalDesignNode(node)) {
      return (
        <BatteryThermalDesignNodeConfig
          node={node}
          onSave={handleConfigSave}
          onCancel={handleConfigCancel}
          userRole={userRole}
        />
      );
    }

    // 整车安全架构设计节点配置
    if (isVehicleSafetyArchNode(node)) {
      return (
        <VehicleSafetyArchNodeConfig
          node={node}
          onSave={handleConfigSave}
          onCancel={handleConfigCancel}
          userRole={userRole}
        />
      );
    }

    // SSP架构转换节点配置
    if (isSSPArchConversionNode(node)) {
      return (
        <SSPArchConversionNodeConfig
          node={node}
          onSave={handleConfigSave}
          onCancel={handleConfigCancel}
          userRole={userRole}
        />
      );
    }

    // SSP-Modelica节点配置
    if (isSSPModelicaNode(node)) {
      return (
        <SSPModelicaNodeConfig
          node={node}
          onSave={handleConfigSave}
          onCancel={handleConfigCancel}
          userRole={userRole}
        />
      );
    }

    // M-works仿真节点配置
    if (isMWorksSimNode(node)) {
      return (
        <MWorksSimNodeConfig
          node={node}
          onSave={handleConfigSave}
          onCancel={handleConfigCancel}
          userRole={userRole}
        />
      );
    }

    // 能量流仿真验证节点配置
    if (isEnergySimulationNode(node)) {
      return (
        <EnergySimulationNodeConfig
          node={node}
          onSave={handleConfigSave}
          onCancel={handleConfigCancel}
          userRole={userRole}
        />
      );
    }

    // 电池建模仿真节点配置
    if (isBatteryModelSimNode(node)) {
      return (
        <BatteryModelSimNodeConfig
          node={node}
          onSave={handleConfigSave}
          onCancel={handleConfigCancel}
          userRole={userRole}
        />
      );
    }

    // 架构转换节点配置
    if (isArchConversionNode(node)) {
      return (
        <ArchConversionNodeConfig
          isOpen={true}
          onSave={handleConfigSave}
          onCancel={handleConfigCancel}
          initialData={node.config?.archConversionConfig}
          nodeName={node.name}
          nodeDescription={node.description}
        />
      );
    }

    // 标准需求同步节点配置
    if (isRequirementSyncNode(node)) {
      return (
        <RequirementSyncNodeConfig
          node={node}
          onSave={handleConfigSave}
          onCancel={handleConfigCancel}
          userRole={userRole}
        />
      );
    }

    // 功能&系统设计节点配置
    if (isFunctionSystemDesignNode(node)) {
      return (
        <FunctionSystemDesignNodeConfig
          node={node}
          onSave={handleConfigSave}
          onCancel={handleConfigCancel}
          userRole={userRole}
        />
      );
    }

    // 仿真节点配置
    if (isSimulationNode(node)) {
      return (
        <SimulationNodeConfig
          node={node}
          onSave={handleConfigSave}
          onCancel={handleConfigCancel}
          userRole={userRole}
        />
      );
    }

    // DOE分析节点配置
    if (isDOEAnalysisNode(node)) {
      return (
        <DOEAnalysisNodeConfig
          node={node}
          onSave={handleConfigSave}
          onCancel={handleConfigCancel}
          userRole={userRole}
        />
      );
    }

    // 默认节点配置
    return (
      <DefaultNodeConfig
        node={node}
        onSave={handleConfigSave}
        onCancel={handleConfigCancel}
        userRole={userRole}
      />
    );
  };

  const handleSave = () => {
    const updatedWorkflow = {
      ...workflowData,
      name: workflowName,
      description: workflowDescription,
      nodes,
      connections,
      lastSaved: new Date().toISOString(),
    };
    onSave(updatedWorkflow);
  };

  // 处理节点选中和配置抽屉打开
  const handleNodeClick = useCallback((nodeId: string) => {
    setSelectedNode(nodeId);
    setConfigNodeId(nodeId);
    setIsConfigDrawerOpen(true);
  }, []);

  const currentConfigNode = getCurrentConfigNode();

  return (
    <div className="h-full flex bg-gray-50">
      {/* 左侧工具栏 */}
      <ComponentLibraryPanel
        componentLibrary={componentLibrary}
        openSections={openSections}
        setOpenSections={setOpenSections}
        selectedLibraryItem={selectedLibraryItem}
        setSelectedLibraryItem={setSelectedLibraryItem}
        workflowName={workflowName}
        setWorkflowName={setWorkflowName}
        workflowDescription={workflowDescription}
        setWorkflowDescription={setWorkflowDescription}
        onBack={onBack}
        onSave={handleSave}
        zoom={zoom}
        panX={panX}
        panY={panY}
        nodes={nodes}
        setNodes={setNodes}
        constrainPosition={constrainPosition}
        getTagColor={getTagColor}
      />

      {/* 右侧画布区域 */}
      <div className="flex-1 flex flex-col">
        {/* 画布工具栏 */}
        <WorkflowToolbar
          toolbarRef={toolbarRef}
          isRunning={isRunning}
          setIsRunning={setIsRunning}
          isMoveMode={isMoveMode}
          setIsMoveMode={setIsMoveMode}
          zoom={zoom}
          setZoom={setZoom}
          setPanX={setPanX}
          setPanY={setPanY}
          nodes={nodes}
          connections={connections}
          setNodes={setNodes}
          constrainPan={constrainPan}
        />

        {/* 画布区域 */}
        <WorkflowCanvas
          canvasRef={canvasRef}
          nodes={nodes}
          setNodes={setNodes}
          connections={connections}
          setConnections={setConnections}
          selectedNode={selectedNode}
          setSelectedNode={setSelectedNode}
          draggingNode={draggingNode}
          setDraggingNode={setDraggingNode}
          zoom={zoom}
          setZoom={setZoom}
          panX={panX}
          setPanX={setPanX}
          panY={panY}
          setPanY={setPanY}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
          dragStart={dragStart}
          setDragStart={setDragStart}
          lastPan={lastPan}
          setLastPan={setLastPan}
          isDraggingFromLibrary={isDraggingFromLibrary}
          setIsDraggingFromLibrary={setIsDraggingFromLibrary}
          selectedLibraryItem={selectedLibraryItem}
          setSelectedLibraryItem={setSelectedLibraryItem}
          isCreatingConnection={isCreatingConnection}
          setIsCreatingConnection={setIsCreatingConnection}
          connectionStart={connectionStart}
          setConnectionStart={setConnectionStart}
          dragPosition={dragPosition}
          setDragPosition={setDragPosition}
          isMoveMode={isMoveMode}
          setIsMoveMode={setIsMoveMode}
          isResultDrawerOpen={isResultDrawerOpen}
          setIsResultDrawerOpen={setIsResultDrawerOpen}
          contextMenu={contextMenu}
          setContextMenu={setContextMenu}
          isConfigDrawerOpen={isConfigDrawerOpen}
          setIsConfigDrawerOpen={setIsConfigDrawerOpen}
          setConfigNodeId={setConfigNodeId}
          onNodeClick={handleNodeClick}
          constrainPosition={constrainPosition}
          constrainPan={constrainPan}
          getTagColor={getTagColor}
          getNodeStatusStyle={(status: string) => {
            switch (status) {
              case "completed": return "border-green-500 bg-green-50";
              case "running": return "border-yellow-500 bg-yellow-50";
              case "waiting": return "border-gray-300 bg-white";
              default: return "border-gray-300 bg-white";
            }
          }}
          getConnectionColor={getConnectionColor}
        />
      </div>

      {/* 右侧配置抽屉 */}
      <ConfigDrawer
        isConfigDrawerOpen={isConfigDrawerOpen}
        setIsConfigDrawerOpen={setIsConfigDrawerOpen}
        configNodeId={configNodeId}
        setConfigNodeId={setConfigNodeId}
        nodes={nodes}
        toolbarRef={toolbarRef}
        renderNodeConfigContent={renderNodeConfigContent}
      />

      {/* 右键菜单 */}
      <ContextMenu
        contextMenu={contextMenu}
        setContextMenu={setContextMenu}
        nodes={nodes}
        setNodes={setNodes}
        connections={connections}
        setConnections={setConnections}
        setConfigNodeId={setConfigNodeId}
        setIsConfigDrawerOpen={setIsConfigDrawerOpen}
        setResultNodeId={setResultNodeId}
        setIsResultDrawerOpen={setIsResultDrawerOpen}
        onOpenInTool={onOpenInTool}
      />

      {/* 底部结果抽屉 */}
      <ResultDrawer
        isResultDrawerOpen={isResultDrawerOpen}
        setIsResultDrawerOpen={setIsResultDrawerOpen}
        resultNodeId={resultNodeId}
        nodes={nodes}
      />
    </div>
  );
}