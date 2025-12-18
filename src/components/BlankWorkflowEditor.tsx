import {
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import {
  ChevronLeft,
  Save,
  Activity,
  Rocket,
  Loader2,
  Upload,
  Play,
  Square,
} from "lucide-react@0.487.0";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner@2.0.3";
import { NodeConfigPanel } from "./NodeConfigPanel";
import { ComponentLibraryPanel } from "./workflow/ComponentLibraryPanel";
import { CanvasToolbar } from "./workflow/CanvasToolbar";
import { WorkflowNodeComponent } from "./workflow/WorkflowNodeComponent";
import {
  BlankWorkflowEditorProps,
  WorkflowNode,
  Connection,
} from "./workflow/types";
import {
  componentLibrary,
  DEFAULT_OPEN_SECTIONS,
  DEFAULT_NODE_CONFIG,
  PORT_POSITIONS,
  ZOOM_CONFIG,
} from "./workflow/constants";
import {
  getTagColor,
  constrainPosition,
  isArchConversionNode,
  generateNodeId,
  createCanvasState,
  createSimulationResults,
} from "./workflow/utils";
import { RFLPTemplate, nodeTypeDisplayNames } from "./workflow/rflpTemplates";

export function BlankWorkflowEditor({
  workflowData,
  onBack,
  onSave,
  userRole,
  isFromAppCenter = false,
}: BlankWorkflowEditorProps) {
  const [workflowName, setWorkflowName] = useState(
    workflowData?.name || "新建应用",
  );
  const [workflowDescription, setWorkflowDescription] =
    useState(workflowData?.description || "");
  const [openSections, setOpenSections] = useState<string[]>(DEFAULT_OPEN_SECTIONS);

  // 画布状态 - 空白画布，没有预设节点
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // 应用RFLP模板到画布
  const applyRFLPTemplate = useCallback((template: RFLPTemplate) => {
    console.log("应用RFLP模板:", template.name);
    
    // 创建模板节点
    const templateNodes: WorkflowNode[] = template.presetNodes.map(presetNode => ({
      id: presetNode.id,
      type: presetNode.type,
      name: presetNode.data.label,
      description: nodeTypeDisplayNames[presetNode.type] || presetNode.type,
      tag: presetNode.layer.toUpperCase(), // 使用RFLP层作为标签
      tagColor: template.layers[presetNode.layer].color,
      status: "waiting",
      position: presetNode.position,
      collapsed: false,
      ports: PORT_POSITIONS,
      config: {
        ...DEFAULT_NODE_CONFIG,
        ...(presetNode.data.config || {}),
        rflpLayer: presetNode.layer, // 标记RFLP层
        layerColor: template.layers[presetNode.layer].color
      }
    }));

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

  // 恢复画布状态或应用RFLP模板
  useEffect(() => {
    if (workflowData?.rflpTemplate && (!workflowData?.canvasState?.nodes || workflowData.canvasState.nodes.length === 0)) {
      // 如果有RFLP模板且没有保存的画布状态，应用模板
      applyRFLPTemplate(workflowData.rflpTemplate);
    } else if (workflowData?.canvasState) {
      // 恢复已保存的画布状态
      const { canvasState } = workflowData;
      
      // 恢复节点
      if (canvasState.nodes) {
        setNodes(canvasState.nodes);
      }
      
      // 恢复连接
      if (canvasState.connections) {
        setConnections(canvasState.connections);
      }
      
      // 恢复视图状态
      if (canvasState.viewport) {
        setZoom(canvasState.viewport.zoom || ZOOM_CONFIG.default);
        setPanX(canvasState.viewport.panX || 0);
        setPanY(canvasState.viewport.panY || 0);
      }
    } else if (workflowData?.nodes) {
      // 向后兼容：如果没有canvasState但有nodes数据
      setNodes(workflowData.nodes || []);
      setConnections(workflowData.connections || []);
    }
  }, [workflowData, applyRFLPTemplate]);

  // 缩放和视图状态
  const [zoom, setZoom] = useState<number>(ZOOM_CONFIG.default);
  const [panX, setPanX] = useState<number>(0);
  const [panY, setPanY] = useState<number>(0);

  // 运行状态
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationResults, setSimulationResults] = useState<any>(null);
  const [canPublish, setCanPublish] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // 拖拽状态管理
  const [isDraggingFromLibrary, setIsDraggingFromLibrary] = useState(false);

  // 右侧配置抽屉状态
  const [isConfigDrawerOpen, setIsConfigDrawerOpen] = useState(false);
  const [configNodeId, setConfigNodeId] = useState<string | null>(null);

  // Canvas ref for coordinate calculations
  const canvasRef = useRef<HTMLDivElement>(null);

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId],
    );
  };

  const handleSave = () => {
    const canvasState = createCanvasState(nodes, connections, zoom, panX, panY);
    
    const updatedWorkflow = {
      ...workflowData,
      name: workflowName,
      description: workflowDescription,
      nodes,
      connections,
      canvasState: canvasState,
      lastSaved: new Date().toISOString(),
    };
    onSave(updatedWorkflow);
  };

  // 处理节点配置保存
  const handleNodeConfigSave = useCallback((config: any) => {
    if (configNodeId) {
      setNodes(prev => prev.map(node => 
        node.id === configNodeId 
          ? { 
              ...node, 
              name: config.nodeName,
              description: config.description,
              config: {
                ...node.config,
                priority: config.priority,
                autoRun: config.autoExecute,
                timeout: config.timeout,
                retryCount: config.retryCount,
                ...(config.archConversionConfig && { archConversionConfig: config.archConversionConfig })
              }
            }
          : node
      ));
      setIsConfigDrawerOpen(false);
      setConfigNodeId(null);
    }
  }, [configNodeId]);

  // 获取当前配置的节点
  const getCurrentConfigNode = useCallback(() => {
    return configNodeId ? nodes.find(n => n.id === configNodeId) : null;
  }, [configNodeId, nodes]);

  // 处理画布拖拽放置
  const handleCanvasDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const data = e.dataTransfer.getData("application/json");
      if (data) {
        const item = JSON.parse(data);
        const rect = e.currentTarget.getBoundingClientRect();

        // 考虑画布缩放和平移
        const canvasX =
          (e.clientX - rect.left - panX) / (zoom / 100);
        const canvasY =
          (e.clientY - rect.top - panY) / (zoom / 100);

        // 调整位置，使节点中心对齐鼠标位置
        const x = canvasX - 180;
        const y = canvasY - 60;

        // 约束到画布边界
        const constrainedPos = constrainPosition(x, y);

        const newNode: WorkflowNode = {
          id: generateNodeId(),
          type: item.id,
          name: item.name,
          description: item.description,
          tag: item.tag || "DEFAULT",
          tagColor: getTagColor(item.tag),
          status: "waiting",
          position: constrainedPos,
          collapsed: false,
          ports: PORT_POSITIONS,
          action: item.action ? `• ${item.action}` : undefined,
          config: DEFAULT_NODE_CONFIG,
        };

        setNodes((prev) => [...prev, newNode]);
      }
      setIsDraggingFromLibrary(false);
    },
    [zoom, panX, panY],
  );

  // 处理节点点击事件，显示配置
  const handleNodeClick = useCallback((nodeId: string) => {
    setSelectedNode(nodeId);
    setIsConfigDrawerOpen(true);
    setConfigNodeId(nodeId);
  }, []);

  // 构建节点依赖关系图
  const buildDependencyGraph = () => {
    const graph: Record<string, string[]> = {};
    
    // 初始化所有节点
    nodes.forEach(node => {
      graph[node.id] = [];
    });
    
    // 添加依赖关系（from节点执行完后才能执行to节点）
    connections.forEach(conn => {
      if (!graph[conn.from]) graph[conn.from] = [];
      graph[conn.from].push(conn.to);
    });
    
    return graph;
  };

  // 拓扑排序获取执行顺序
  const getExecutionOrder = () => {
    const graph = buildDependencyGraph();
    const inDegree: Record<string, number> = {};
    const executionQueue: string[] = [];
    const result: string[] = [];
    
    // 计算每个节点的入度
    nodes.forEach(node => {
      inDegree[node.id] = 0;
    });
    
    connections.forEach(conn => {
      inDegree[conn.to] = (inDegree[conn.to] || 0) + 1;
    });
    
    // 找到所有入度为0的节点作为起始节点
    nodes.forEach(node => {
      if (inDegree[node.id] === 0) {
        executionQueue.push(node.id);
      }
    });
    
    // 拓扑排序
    while (executionQueue.length > 0) {
      const currentNodeId = executionQueue.shift()!;
      result.push(currentNodeId);
      
      // 处理当前节点的所有后续节点
      graph[currentNodeId]?.forEach(nextNodeId => {
        inDegree[nextNodeId]--;
        if (inDegree[nextNodeId] === 0) {
          executionQueue.push(nextNodeId);
        }
      });
    }
    
    return result;
  };

  // 执行单个节点 - 严格按依赖顺序执行
  const executeNode = (nodeId: string, order: number) => {
    const node = nodes.find(n => n.id === nodeId);
    
    // 等待前置条件满足的检查函数
    const waitForPrerequisites = () => {
      return new Promise<void>((resolve) => {
        const checkInterval = setInterval(() => {
          setNodes(currentNodes => {
            const prerequisiteConnections = connections.filter(conn => conn.to === nodeId);
            const allPrerequisitesMet = prerequisiteConnections.length === 0 || 
              prerequisiteConnections.every(conn => {
                const prerequisiteNode = currentNodes.find(n => n.id === conn.from);
                return prerequisiteNode && prerequisiteNode.status === 'completed';
              });

            if (allPrerequisitesMet) {
              clearInterval(checkInterval);
              resolve();
            }
            return currentNodes;
          });
        }, 100); // 每100ms检查一次
      });
    };

    // 异步执行节点
    setTimeout(async () => {
      // 等待前置条件满足
      await waitForPrerequisites();
      
      // 设置节点为运行状态
      setNodes(prevNodes => 
        prevNodes.map(n => 
          n.id === nodeId 
            ? { ...n, status: "running" }
            : n
        )
      );

      // 模拟节点执行时间（2-4秒）
      const executionTime = Math.random() * 2000 + 2000;
      
      setTimeout(() => {
        setNodes(prevNodes => {
          const updatedNodes = prevNodes.map(n => 
            n.id === nodeId 
              ? { ...n, status: "completed" }
              : n
          );
          
          return updatedNodes;
        });
      }, executionTime);
    }, order * 100); // 给每个节点一个小的启动延迟，让依赖检查逻辑有时间工作
  };

  // 启动工作流执行
  const handleRunWorkflow = () => {
    if (nodes.length === 0) {
      toast.error("请先添加组件到应用中");
      return;
    }

    setIsRunning(true);
    
    // 重置所有节点状态为等待
    setNodes(prevNodes => 
      prevNodes.map(node => ({ ...node, status: "waiting" }))
    );

    // 获取执行顺序
    const executionOrder = getExecutionOrder();
    console.log("执行顺序:", executionOrder);

    if (executionOrder.length === 0) {
      setIsRunning(false);
      return;
    }

    // 按拓扑排序顺序启动节点执行
    executionOrder.forEach((nodeId, index) => {
      executeNode(nodeId, index);
    });

    // 监控执行完成状态
    const checkExecutionComplete = () => {
      const interval = setInterval(() => {
        setNodes(currentNodes => {
          const completedCount = currentNodes.filter(n => n.status === 'completed').length;
          
          // 如果所有节点都完成了，停止工作流
          if (completedCount === executionOrder.length) {
            clearInterval(interval);
            setIsRunning(false);
            toast.success("工作流执行完成", {
              description: `共执行了${executionOrder.length}个节点`,
              duration: 3000
            });
          }
          
          return currentNodes;
        });
      }, 500); // 每500ms检查一次
    };
    
    checkExecutionComplete();
  };

  // 停止工作流执行
  const handleStopWorkflow = () => {
    setIsRunning(false);
    // 停止时将所有运行中的节点设置为等待状态
    const runningNodes = nodes.filter(node => node.status === "running");
    
    setNodes(prevNodes => 
      prevNodes.map(node => 
        node.status === "running" 
          ? { ...node, status: "waiting" }
          : node
      )
    );
    
    if (runningNodes.length > 0) {
      const runningNodeNames = runningNodes.map(node => `"${node.name}"`).join("、");
      toast.warning("工作流执行已停止", {
        description: `已停止正在运行的节点：${runningNodeNames}`,
        duration: 4000
      });
    } else {
      toast.warning("工作流执行已停止");
    }
  };

  // 缩放控制函数
  const handleZoomIn = () => {
    setZoom(Math.min(ZOOM_CONFIG.max, zoom + ZOOM_CONFIG.step));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(ZOOM_CONFIG.min, zoom - ZOOM_CONFIG.step));
  };

  const handleResetView = () => {
    setZoom(ZOOM_CONFIG.default);
    setPanX(0);
    setPanY(0);
  };

  // 处理仿真分析 
  const handleSimulation = async () => {
    if (nodes.length === 0) {
      toast.error("请先添加组件到应用中");
      return;
    }

    setIsSimulating(true);
    
    try {
      // 模拟仿真分析过程
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const results = createSimulationResults(nodes.length, connections.length);
      
      setSimulationResults(results);
      setCanPublish(true);
      toast.success("仿真分析完成，所有测试通过！");
    } catch (error) {
      toast.error("仿真分析失败");
    } finally {
      setIsSimulating(false);
    }
  };

  // 发布应用
  const handlePublishApp = () => {
    if (!canPublish) {
      toast.warning("请先进行仿真分析");
      return;
    }
    
    toast.success("应用发布成功！");
  };

  const currentConfigNode = getCurrentConfigNode();

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Top Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            {isFromAppCenter ? "返回应用中心" : "返回"}
          </Button>
          
          {/* 面包屑导航 */}
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>{isFromAppCenter ? "应用中心" : "工作流管理"}</span>
            <span>/</span>
            <span className="text-gray-900">{workflowName || "应用编辑"}</span>
          </div>
        </div>
        
        {/* 应用信息区域 */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Label>应用名称:</Label>
            <Input
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="w-48"
              placeholder="请输入应用名称"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant={isRunning ? "destructive" : "default"}
              size="sm"
              onClick={isRunning ? handleStopWorkflow : handleRunWorkflow}
              disabled={nodes.length === 0}
              className="flex items-center gap-2"
            >
              {isRunning ? (
                <Square className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {isRunning ? "停止" : "运行"}
            </Button>
            
            <Button onClick={handleSave} variant="outline">
              <Save className="w-4 h-4 mr-2" />
              保存
            </Button>
            
            <Button
              onClick={handleSimulation}
              disabled={isSimulating || nodes.length === 0}
              variant="outline"
            >
              {isSimulating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Activity className="w-4 h-4 mr-2" />
              )}
              仿真分析
            </Button>
            
            <Button
              onClick={handlePublishApp}
              disabled={!canPublish}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Rocket className="w-4 h-4 mr-2" />
              发布应用
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex relative">
        {/* Left Panel - Component Library */}
        {workflowData?.rflpTemplate ? (
          // RFLP模板专用组件库
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-xs">RFLP</span>
                </div>
                <h3 className="text-sm font-medium">RFLP层次组件</h3>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                基于{workflowData.rflpTemplate.name}的组件库
              </p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {Object.entries(workflowData.rflpTemplate.layers).map(([layerKey, layer]) => (
                <div key={layerKey} className="space-y-2">
                  <div 
                    className="flex items-center space-x-2 p-2 rounded"
                    style={{ backgroundColor: layer.color + '20' }}
                  >
                    <div
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: layer.color }}
                    />
                    <span className="text-sm font-medium">{layer.name}</span>
                    <div className="ml-auto text-xs text-gray-500">
                      {layer.nodeTypes.length}个组件
                    </div>
                  </div>
                  <div className="ml-5 space-y-1">
                    {layer.nodeTypes.map(nodeType => (
                      <div
                        key={nodeType}
                        className="p-2 text-sm border rounded cursor-pointer hover:bg-gray-50 transition-colors"
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData("application/json", JSON.stringify({
                            id: nodeType,
                            name: nodeTypeDisplayNames[nodeType] || nodeType,
                            description: `${layer.name}层组件`,
                            tag: layerKey.toUpperCase()
                          }));
                        }}
                      >
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: layer.color }}
                          />
                          <span>{nodeTypeDisplayNames[nodeType] || nodeType}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              <div className="pt-4 border-t border-gray-200">
                <div className="text-xs text-gray-500 space-y-1">
                  <p>💡 RFLP模板说明:</p>
                  <p>• R: 需求层 - 需求定义与管理</p>
                  <p>• F: 功能层 - 功能分解与设计</p>
                  <p>• L: 逻辑层 - 架构设计与转换</p>
                  <p>• P: 物理层 - 仿真与物理实现</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // 默认组件库
          <ComponentLibraryPanel
            componentLibrary={componentLibrary}
            openSections={openSections}
            onToggleSection={toggleSection}
          />
        )}

        {/* Canvas Area */}
        <div className="flex-1 relative overflow-hidden">
          <div
            ref={canvasRef}
            className="w-full h-full bg-gray-100 relative"
            onDrop={handleCanvasDrop}
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = "copy";
            }}
            onDragEnter={(e) => {
              e.preventDefault();
              setIsDraggingFromLibrary(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDraggingFromLibrary(false);
            }}
            style={{
              transform: `scale(${zoom / 100}) translate(${panX}px, ${panY}px)`,
              transformOrigin: "0 0",
            }}
          >
            {/* 画布网格背景 */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  radial-gradient(circle, #94a3b8 1px, transparent 1px)
                `,
                backgroundSize: "40px 40px",
              }}
            />
            
            {/* 拖拽提示 */}
            {isDraggingFromLibrary && nodes.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-lg">释放组件到此处</p>
                  <p className="text-sm">开始构建您的应用</p>
                </div>
              </div>
            )}

            {/* 渲染节点 */}
            {nodes.map((node) => (
              <WorkflowNodeComponent
                key={node.id}
                node={node}
                isSelected={selectedNode === node.id}
                onClick={handleNodeClick}
                getNodeStatusStyle={(status: string) => {
                  switch (status) {
                    case "completed": return "border-green-500 bg-green-50";
                    case "running": return "border-yellow-500 bg-yellow-50";
                    case "waiting": return "border-gray-300 bg-white";
                    default: return "border-gray-300 bg-white";
                  }
                }}
              />
            ))}

            {/* 渲染连接线 */}
            <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
              {connections.map((connection) => {
                const fromNode = nodes.find(n => n.id === connection.from);
                const toNode = nodes.find(n => n.id === connection.to);
                
                if (!fromNode || !toNode) return null;
                
                const startX = fromNode.position.x + 360;
                const startY = fromNode.position.y + 60;
                const endX = toNode.position.x;
                const endY = toNode.position.y + 60;
                
                const midX = startX + (endX - startX) / 2;
                
                // 使用连接的样式信息，如果有的话
                const strokeColor = connection.style?.stroke || "#3b82f6";
                const strokeWidth = connection.style?.strokeWidth || 2;
                const strokeDasharray = connection.style?.strokeDasharray || "none";
                
                return (
                  <g key={connection.id}>
                    <path
                      d={`M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      strokeDasharray={strokeDasharray}
                      fill="none"
                      markerEnd="url(#arrowhead)"
                    />
                    {/* 连接标签 */}
                    {connection.label && (
                      <text
                        x={midX}
                        y={(startY + endY) / 2 - 10}
                        textAnchor="middle"
                        className="text-xs fill-gray-600"
                        style={{ fontSize: '10px' }}
                      >
                        {connection.label}
                      </text>
                    )}
                  </g>
                );
              })}
              
              {/* 箭头标记定义 */}
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 10 3.5, 0 7"
                    fill="#3b82f6"
                  />
                </marker>
              </defs>
            </svg>

          </div>

          {/* 工具栏 */}
          <CanvasToolbar
            zoom={zoom}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onResetView={handleResetView}
          />
        </div>

        {/* 右侧统一节点配置面板 */}
        {isConfigDrawerOpen && currentConfigNode && (
          <NodeConfigPanel
            node={currentConfigNode}
            isOpen={isConfigDrawerOpen}
            onClose={() => {
              setIsConfigDrawerOpen(false);
              setConfigNodeId(null);
            }}
            onSave={handleNodeConfigSave}
          />
        )}
      </div>
    </div>
  );
}