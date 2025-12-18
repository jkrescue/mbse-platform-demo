import { useState, useCallback, useRef, useEffect } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Separator } from "./ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { ArrowLeft, Play, Save, Settings, Eye, Layers, CheckCircle, AlertTriangle } from "lucide-react@0.487.0"
import { WorkflowNodeComponent } from "./workflow/WorkflowNodeComponent"
import { RFLPComponentLibraryPanel } from "./workflow/RFLPComponentLibraryPanel"
import { CanvasToolbar } from "./workflow/CanvasToolbar"
import { NodeConfigPanel } from "./NodeConfigPanel"
import { automotiveRFLPTemplates, nodeTypeDisplayNames, RFLPTemplate } from "./workflow/rflpTemplates"
import { 
  PORT_POSITIONS, 
  DEFAULT_NODE_CONFIG,
  ZOOM_CONFIG,
  NODE_DIMENSIONS
} from "./workflow/constants"
import { 
  getTagColor,
  constrainPosition,
  generateNodeId
} from "./workflow/utils"
import { WorkflowNode, Connection } from "./workflow/types"
import { toast } from "sonner@2.0.3"

interface RFLPWorkflowEditorProps {
  workflowData: any
  onBack: () => void
  onSave: (data: any) => void
  userRole?: string
  isFromAppCenter?: boolean
  templateId?: string // RFLP模板ID
}

export function RFLPWorkflowEditor({ 
  workflowData, 
  onBack, 
  onSave, 
  userRole, 
  isFromAppCenter = false,
  templateId = "energy-management" // 默认使用能量管理模板
}: RFLPWorkflowEditorProps) {
  // 获取RFLP模板
  const rflpTemplate = automotiveRFLPTemplates.find(t => t.id === templateId) || automotiveRFLPTemplates[0]
  
  // 工作流状态
  const [nodes, setNodes] = useState<WorkflowNode[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [configNodeId, setConfigNodeId] = useState<string | null>(null)
  const [isConfigDrawerOpen, setIsConfigDrawerOpen] = useState(false)
  const [currentLayer, setCurrentLayer] = useState<string>("all") // 当前查看的RFLP层，"all"表示全部
  const [showValidationResults, setShowValidationResults] = useState(false)
  
  // 画布状态
  const [zoom, setZoom] = useState<number>(ZOOM_CONFIG.default)
  const [panX, setPanX] = useState<number>(0)
  const [panY, setPanY] = useState<number>(0)
  
  // 执行状态
  const [isExecuting, setIsExecuting] = useState(false)
  const [executionResults, setExecutionResults] = useState<any>({})
  
  // refs
  const canvasRef = useRef<HTMLDivElement>(null)
  const lastSaveTime = useRef<Date | null>(null)

  // 初始化RFLP模板节点和连接
  useEffect(() => {
    if (workflowData?.canvasState?.nodes) {
      // 恢复已保存的画布状态
      setNodes(workflowData.canvasState.nodes)
      setConnections(workflowData.canvasState.connections || [])
      if (workflowData.canvasState.viewport) {
        setZoom(workflowData.canvasState.viewport.zoom || ZOOM_CONFIG.default)
        setPanX(workflowData.canvasState.viewport.panX || 0)
        setPanY(workflowData.canvasState.viewport.panY || 0)
      }
    } else if (rflpTemplate.presetNodes && rflpTemplate.presetNodes.length > 0) {
      // 应用RFLP模板的预设节点
      const templateNodes: WorkflowNode[] = rflpTemplate.presetNodes.map(presetNode => ({
        id: presetNode.id,
        type: presetNode.type,
        name: presetNode.data.label,
        description: nodeTypeDisplayNames[presetNode.type] || presetNode.type,
        tag: presetNode.layer.toUpperCase(),
        tagColor: rflpTemplate.layers[presetNode.layer].color,
        status: "waiting",
        position: presetNode.position,
        collapsed: false,
        ports: PORT_POSITIONS,
        config: {
          ...DEFAULT_NODE_CONFIG,
          rflpLayer: presetNode.layer,
          layerColor: rflpTemplate.layers[presetNode.layer].color
        }
      }))

      const templateConnections: Connection[] = rflpTemplate.presetConnections.map(conn => ({
        id: conn.id,
        from: conn.source,
        to: conn.target,
        fromPort: "output",
        toPort: "input"
      }))

      setNodes(templateNodes)
      setConnections(templateConnections)
    }
  }, [rflpTemplate, workflowData])

  // 根据当前层过滤节点
  const filteredNodes = currentLayer === "all" ? nodes : nodes.filter(node => node.config?.rflpLayer === currentLayer)
  
  // 根据当前层过滤连接
  const filteredConnections = currentLayer === "all" ? connections : connections.filter(conn => {
    const sourceNode = nodes.find(n => n.id === conn.from)
    const targetNode = nodes.find(n => n.id === conn.to)
    return (sourceNode?.config?.rflpLayer === currentLayer) || (targetNode?.config?.rflpLayer === currentLayer)
  })

  // 获取RFLP层信息
  const getCurrentLayerInfo = () => {
    return currentLayer === "all" ? null : rflpTemplate.layers[currentLayer] || { name: "未知层", color: "#gray" }
  }

  // 验证工作流
  const validateWorkflow = useCallback(() => {
    const results: any[] = []
    
    // 执行RFLP模板的验证规则
    rflpTemplate.validationRules.forEach(rule => {
      try {
        if (rule.rule.includes("连接") && connections.length === 0) {
          results.push({
            level: "warning",
            message: rule.description,
            nodeId: null
          })
        } else if (rule.rule.includes("节点") && nodes.length === 0) {
          results.push({
            level: "error", 
            message: rule.description,
            nodeId: null
          })
        }
      } catch (error) {
        console.error("验证规则执行失败:", error)
      }
    })
    
    return results
  }, [nodes, connections, rflpTemplate.validationRules])

  // 处理从组件库添加节点
  const handleAddNodeFromLibrary = useCallback((componentType: string, position: { x: number, y: number }) => {
    // 根据组件类型映射到RFLP层
    const layerMapping: Record<string, string> = {
      "requirement-creation": "R",
      "requirement-sync": "R", 
      "energy-requirement-sync": "R",
      "function-system-design": "F",
      "arch-conversion": "F",
      "vehicle-safety-arch": "F",
      "ssp-conversion": "L",
      "ssp-arch-conversion": "L", 
      "ssp-modelica": "L",
      "simulation": "P",
      "energy-simulation": "P",
      "battery-thermal-design": "P",
      "battery-model-sim": "P",
      "mworks-sim": "P",
      "doe-analysis": "P"
    }
    
    const targetLayer = layerMapping[componentType] || (currentLayer === "all" ? "R" : currentLayer)
    const layerInfo = rflpTemplate.layers[targetLayer]
    
    const newNode: WorkflowNode = {
      id: generateNodeId(),
      type: componentType,
      name: nodeTypeDisplayNames[componentType] || componentType,
      description: `${layerInfo?.name || "未知层"}层组件`,
      tag: targetLayer.toUpperCase(),
      tagColor: layerInfo?.color || "#gray",
      status: 'waiting',
      position: constrainPosition(position.x - NODE_DIMENSIONS.width / 2, position.y - NODE_DIMENSIONS.height / 2),
      collapsed: false,
      ports: PORT_POSITIONS,
      config: {
        ...DEFAULT_NODE_CONFIG,
        rflpLayer: targetLayer,
        layerColor: layerInfo?.color
      }
    }
    
    setNodes(prevNodes => [...prevNodes, newNode])
    toast.success(`已添加 ${nodeTypeDisplayNames[componentType]} 到 ${layerInfo?.name} 层`)
  }, [currentLayer, rflpTemplate.layers])

  // 处理节点点击
  const handleNodeClick = useCallback((nodeId: string) => {
    setSelectedNode(nodeId)
    setConfigNodeId(nodeId)
    setIsConfigDrawerOpen(true)
  }, [])

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
                retryCount: config.retryCount
              }
            }
          : node
      ))
      setIsConfigDrawerOpen(false)
      setConfigNodeId(null)
    }
  }, [configNodeId])

  // 获取当前配置的节点
  const getCurrentConfigNode = useCallback(() => {
    return configNodeId ? nodes.find(n => n.id === configNodeId) : null
  }, [configNodeId, nodes])

  // 处理工作流执行
  const handleExecuteWorkflow = useCallback(async () => {
    const validationResults = validateWorkflow()
    const hasErrors = validationResults.some(result => result.level === 'error')
    
    if (hasErrors) {
      toast.error("工作流存在错误，无法执行")
      setShowValidationResults(true)
      return
    }
    
    setIsExecuting(true)
    
    try {
      for (const node of nodes) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        setExecutionResults(prev => ({
          ...prev,
          [node.id]: {
            status: 'completed',
            result: `${node.name} 执行完成`,
            executionTime: new Date().toLocaleString('zh-CN'),
            output: `节点 ${node.name} 在 ${rflpTemplate.layers[node.config?.rflpLayer]?.name} 层执行成功`
          }
        }))
        
        setNodes(prevNodes => 
          prevNodes.map(n => 
            n.id === node.id 
              ? { ...n, status: 'completed' }
              : n
          )
        )
      }
      
      toast.success("RFLP工作流执行完成")
    } catch (error) {
      toast.error("工作流执行失败")
      console.error("Workflow execution failed:", error)
    } finally {
      setIsExecuting(false)
    }
  }, [nodes, validateWorkflow, rflpTemplate.layers])

  // 处理保存
  const handleSave = useCallback(() => {
    const canvasState = {
      nodes,
      connections,
      viewport: {
        zoom,
        panX,
        panY
      }
    }
    
    const saveData = {
      ...workflowData,
      canvasState,
      rflpTemplate: {
        id: rflpTemplate.id,
        name: rflpTemplate.name,
        version: rflpTemplate.version
      },
      lastSaved: new Date().toISOString(),
      executionResults
    }
    
    lastSaveTime.current = new Date()
    onSave(saveData)
  }, [workflowData, nodes, connections, zoom, panX, panY, executionResults, onSave, rflpTemplate])

  // 画布拖拽处理
  const handleCanvasDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const data = e.dataTransfer.getData("application/json")
    if (data) {
      const item = JSON.parse(data)
      const rect = e.currentTarget.getBoundingClientRect()

      const canvasX = (e.clientX - rect.left - panX) / (zoom / 100)
      const canvasY = (e.clientY - rect.top - panY) / (zoom / 100)

      handleAddNodeFromLibrary(item.id, { x: canvasX, y: canvasY })
    }
  }, [panX, panY, zoom, handleAddNodeFromLibrary])

  // 缩放控制
  const handleZoomIn = () => setZoom(Math.min(ZOOM_CONFIG.max, zoom + ZOOM_CONFIG.step))
  const handleZoomOut = () => setZoom(Math.max(ZOOM_CONFIG.min, zoom - ZOOM_CONFIG.step))
  const handleResetView = () => {
    setZoom(ZOOM_CONFIG.default)
    setPanX(0)
    setPanY(0)
  }

  const currentConfigNode = getCurrentConfigNode()

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* 顶部工具栏 */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回{isFromAppCenter ? "应用中心" : "工作流"}
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div>
              <h1 className="text-xl font-semibold">{workflowData.name}</h1>
              <p className="text-sm text-gray-600">
                基于 {rflpTemplate.name} 模板 · {rflpTemplate.description}
              </p>
            </div>
          </div>

          {/* RFLP层选择器 */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-gray-500" />
              <Select value={currentLayer} onValueChange={setCurrentLayer}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="选择层级" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部层级</SelectItem>
                  {Object.entries(rflpTemplate.layers).map(([key, layer]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded"
                          style={{ backgroundColor: layer.color }}
                        />
                        <span>{layer.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              {showValidationResults && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowValidationResults(false)}
                  className="text-orange-600 border-orange-600"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  验证结果
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm" 
                onClick={() => setShowValidationResults(!showValidationResults)}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                验证
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleExecuteWorkflow}
                disabled={isExecuting}
              >
                <Play className="w-4 h-4 mr-2" />
                {isExecuting ? '执行中...' : '执行工作流'}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
              >
                <Save className="w-4 h-4 mr-2" />
                保存
              </Button>
            </div>
          </div>
        </div>

        {/* 当前层信息 */}
        {currentLayer !== "all" && getCurrentLayerInfo() && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div 
                className="w-4 h-4 rounded"
                style={{ backgroundColor: getCurrentLayerInfo()!.color }}
              />
              <span className="font-medium">{getCurrentLayerInfo()!.name}</span>
              <Badge variant="secondary">
                {filteredNodes.length} 个节点
              </Badge>
            </div>
          </div>
        )}
      </div>

      {/* 主要内容区域 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧RFLP组件库 */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <RFLPComponentLibraryPanel
            onAddNode={handleAddNodeFromLibrary}
            userRole={userRole}
            currentLayer={currentLayer}
            rflpLayers={rflpTemplate.layers}
          />
        </div>

        {/* 中间画布区域 */}
        <div className="flex-1 flex flex-col">
          {/* 画布工具栏 */}
          <CanvasToolbar 
            zoom={zoom}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onResetView={handleResetView}
          />

          {/* 工作流画布 */}
          <div className="flex-1 relative overflow-hidden">
            <div
              ref={canvasRef}
              className="w-full h-full bg-gray-100 relative"
              onDrop={handleCanvasDrop}
              onDragOver={(e) => {
                e.preventDefault()
                e.dataTransfer.dropEffect = "copy"
              }}
              style={{
                transform: `scale(${zoom / 100}) translate(${panX}px, ${panY}px)`,
                transformOrigin: "0 0"
              }}
            >
              {/* 画布网格背景 */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `radial-gradient(circle, #94a3b8 1px, transparent 1px)`,
                  backgroundSize: "40px 40px"
                }}
              />
              
              {/* 渲染节点 */}
              {filteredNodes.map((node) => (
                <WorkflowNodeComponent
                  key={node.id}
                  node={node}
                  isSelected={selectedNode === node.id}
                  onClick={handleNodeClick}
                  getNodeStatusStyle={(status: string) => {
                    switch (status) {
                      case "completed": return "border-green-500 bg-green-50"
                      case "running": return "border-yellow-500 bg-yellow-50"
                      case "waiting": return "border-gray-300 bg-white"
                      default: return "border-gray-300 bg-white"
                    }
                  }}
                />
              ))}

              {/* 渲染连接线 */}
              <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
                {filteredConnections.map((connection) => {
                  const fromNode = nodes.find(n => n.id === connection.from)
                  const toNode = nodes.find(n => n.id === connection.to)
                  
                  if (!fromNode || !toNode) return null
                  
                  const startX = fromNode.position.x + 360
                  const startY = fromNode.position.y + 60
                  const endX = toNode.position.x
                  const endY = toNode.position.y + 60
                  
                  const midX = startX + (endX - startX) / 2
                  
                  return (
                    <g key={connection.id}>
                      <path
                        d={`M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`}
                        stroke="#3b82f6"
                        strokeWidth="2"
                        fill="none"
                        markerEnd="url(#arrowhead)"
                      />
                    </g>
                  )
                })}
                
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
          </div>
        </div>

        {/* 验证结果面板 */}
        {showValidationResults && (
          <div className="w-80 bg-white border-l border-gray-200">
            <Card className="h-full rounded-none border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  RFLP验证结果
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {validateWorkflow().map((result, index) => (
                  <div 
                    key={index}
                    className={`p-3 rounded-lg border ${
                      result.level === 'error' 
                        ? 'bg-red-50 border-red-200 text-red-800'
                        : 'bg-yellow-50 border-yellow-200 text-yellow-800'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className={`w-4 h-4 mt-0.5 ${
                        result.level === 'error' ? 'text-red-600' : 'text-yellow-600'
                      }`} />
                      <div className="flex-1">
                        <div className="font-medium">
                          {result.level === 'error' ? '错误' : '警告'}
                        </div>
                        <div className="text-sm mt-1">{result.message}</div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {validateWorkflow().length === 0 && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-800">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4" />
                      <span className="font-medium">验证通过</span>
                    </div>
                    <div className="text-sm mt-1">RFLP工作流符合所有验证规则</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* 右侧节点配置面板 */}
        {isConfigDrawerOpen && currentConfigNode && (
          <NodeConfigPanel
            node={currentConfigNode}
            isOpen={isConfigDrawerOpen}
            onClose={() => {
              setIsConfigDrawerOpen(false)
              setConfigNodeId(null)
            }}
            onSave={handleNodeConfigSave}
          />
        )}
      </div>
    </div>
  )
}