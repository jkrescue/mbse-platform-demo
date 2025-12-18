import React, { useState } from "react"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Separator } from "../ui/separator"
import { ScrollArea } from "../ui/scroll-area"
import { 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  Info, 
  Layers,
  ArrowRight,
  AlertCircle
} from "lucide-react@0.487.0"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible"

// RFLP组件库数据结构
const rflpComponentLibrary = [
  {
    id: "requirements-layer",
    title: "需求层 (Requirements)",
    layer: "R",
    color: "#3B82F6",
    description: "需求管理与同步组件",
    items: [
      {
        id: "requirement-creation",
        name: "需求创建",
        description: "创建和管理系统需求",
        type: "requirement-creation",
        category: "需求管理"
      },
      {
        id: "requirement-sync", 
        name: "需求同步",
        description: "同步需求到架构设计",
        type: "requirement-sync",
        category: "需求同步"
      },
      {
        id: "energy-requirement-sync",
        name: "能量需求同步", 
        description: "新能源汽车能量管理需求同步",
        type: "energy-requirement-sync",
        category: "专业需求"
      }
    ]
  },
  {
    id: "functional-layer",
    title: "功能层 (Functional)",
    layer: "F", 
    color: "#10B981",
    description: "功能与架构设计组件",
    items: [
      {
        id: "function-system-design",
        name: "功能系统设计",
        description: "进行功能与系统的详细设计",
        type: "function-system-design",
        category: "功能设计"
      },
      {
        id: "arch-conversion",
        name: "架构转换", 
        description: "转换架构到目标格式",
        type: "arch-conversion",
        category: "架构设计"
      },
      {
        id: "vehicle-safety-arch",
        name: "整车安全架构",
        description: "整车安全架构设计",
        type: "vehicle-safety-arch", 
        category: "专业架构"
      }
    ]
  },
  {
    id: "logical-layer",
    title: "逻辑层 (Logical)",
    layer: "L",
    color: "#8B5CF6", 
    description: "系统集成与验证组件",
    items: [
      {
        id: "ssp-conversion",
        name: "SSP转换",
        description: "将架构转换为SSP格式",
        type: "ssp-conversion",
        category: "系统集成"
      },
      {
        id: "ssp-arch-conversion", 
        name: "SSP架构转换",
        description: "架构转换为SSP可信管理",
        type: "ssp-arch-conversion",
        category: "系统集成"
      },
      {
        id: "ssp-modelica",
        name: "SSP-Modelica",
        description: "系统级综合仿真验证",
        type: "ssp-modelica",
        category: "集成验证"
      }
    ]
  },
  {
    id: "physical-layer",
    title: "物理层 (Physical)",
    layer: "P",
    color: "#F59E0B",
    description: "DOE分析与性能仿真组件", 
    items: [
      {
        id: "simulation",
        name: "通用仿真",
        description: "通用仿真计算",
        type: "simulation",
        category: "基础仿真"
      },
      {
        id: "energy-simulation",
        name: "能量流仿真",
        description: "整车能量流系统级仿真验证",
        type: "energy-simulation", 
        category: "专业仿真"
      },
      {
        id: "battery-thermal-design",
        name: "电池热管理",
        description: "电池热管理系统设计",
        type: "battery-thermal-design",
        category: "专业仿真"
      },
      {
        id: "battery-model-sim",
        name: "电池建模仿真",
        description: "电池系统建模与仿真分析",
        type: "battery-model-sim",
        category: "专业仿真"
      },
      {
        id: "mworks-sim",
        name: "M-Works仿真",
        description: "M-Works仿真配置",
        type: "mworks-sim",
        category: "仿真平台"
      },
      {
        id: "doe-analysis",
        name: "DOE实验设计",
        description: "实验设计与多元分析",
        type: "doe-analysis",
        category: "DOE分析"
      }
    ]
  }
]

interface RFLPComponentLibraryPanelProps {
  onAddNode: (componentType: string, position: { x: number, y: number }) => void
  userRole?: string
  currentLayer?: string
  rflpLayers?: Record<string, { name: string, color: string }>
}

export function RFLPComponentLibraryPanel({ 
  onAddNode, 
  userRole, 
  currentLayer,
  rflpLayers = {}
}: RFLPComponentLibraryPanelProps) {
  const [openSections, setOpenSections] = useState<string[]>(["requirements-layer", "functional-layer", "logical-layer", "physical-layer"])
  const [selectedComponent, setSelectedComponent] = useState<any>(null)

  // 切换分组展开/收起
  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  // 处理组件拖拽开始
  const handleDragStart = (e: React.DragEvent, item: any) => {
    e.dataTransfer.setData("application/json", JSON.stringify(item))
    e.dataTransfer.effectAllowed = "copy"
  }

  // 处理组件双击添加
  const handleComponentDoubleClick = (item: any) => {
    // 在画布中心添加节点
    const centerPosition = { x: 400, y: 300 }
    onAddNode(item.type, centerPosition)
    setSelectedComponent(null)
  }

  // 根据当前层过滤组件库
  const filteredLibrary = currentLayer 
    ? rflpComponentLibrary.filter(section => section.layer === currentLayer)
    : rflpComponentLibrary

  // 获取层级映射提示
  const getLayerMappingInfo = (layer: string) => {
    const mappings = {
      "R": "需求管理与同步相关组件",
      "F": "功能设计与架构转换组件", 
      "L": "系统集成与验证组件",
      "P": "DOE分析与性能仿真组件"
    }
    return mappings[layer as keyof typeof mappings] || ""
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* 标题区域 */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2 mb-2">
          <Layers className="w-5 h-5 text-blue-600" />
          <h3 className="font-medium">RFLP组件库</h3>
        </div>
        <p className="text-sm text-gray-600">
          拖拽或双击组件添加到画布
        </p>
        
        {/* 当前层级信息 */}
        {currentLayer && (
          <div className="mt-3 p-2 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2 text-sm">
              <div 
                className="w-3 h-3 rounded"
                style={{ backgroundColor: rflpLayers[currentLayer]?.color }}
              />
              <span className="font-medium">{rflpLayers[currentLayer]?.name}</span>
            </div>
            <p className="text-xs text-blue-700 mt-1">
              {getLayerMappingInfo(currentLayer)}
            </p>
          </div>
        )}
      </div>

      {/* 组件列表 */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {filteredLibrary.map(section => (
            <Card key={section.id} className="border-l-4" style={{ borderLeftColor: section.color }}>
              <Collapsible
                open={openSections.includes(section.id)}
                onOpenChange={() => toggleSection(section.id)}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className="pb-2 cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: section.color }}
                        />
                        <div>
                          <CardTitle className="text-sm">{section.title}</CardTitle>
                          <CardDescription className="text-xs">
                            {section.description}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs">
                          {section.items.length}
                        </Badge>
                        {openSections.includes(section.id) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <CardContent className="pt-0 space-y-2">
                    {section.items.map(item => (
                      <div
                        key={item.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors group ${
                          selectedComponent?.id === item.id
                            ? "bg-blue-50 border-blue-200"
                            : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                        }`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, item)}
                        onClick={() => setSelectedComponent(item)}
                        onDoubleClick={() => handleComponentDoubleClick(item)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="text-sm font-medium">{item.name}</h4>
                              <Badge variant="outline" className="text-xs">
                                {item.category}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600">{item.description}</p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleComponentDoubleClick(item)
                            }}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {/* 选中组件详情 */}
      {selectedComponent && (
        <div className="p-4 border-t border-gray-200 bg-blue-50">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">{selectedComponent.name}</h4>
              <Button 
                size="sm" 
                onClick={() => handleComponentDoubleClick(selectedComponent)}
                className="h-6 px-2 text-xs"
              >
                添加到画布
              </Button>
            </div>
            <p className="text-xs text-gray-600">{selectedComponent.description}</p>
            
            {/* 映射提示 */}
            <div className="flex items-start space-x-2 p-2 bg-blue-100 rounded text-xs">
              <Info className="w-3 h-3 mt-0.5 text-blue-600" />
              <div className="text-blue-800">
                <div className="font-medium">RFLP映射:</div>
                <div>将映射到 {filteredLibrary.find(l => l.items.includes(selectedComponent))?.title} 层</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 使用提示 */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="space-y-2 text-xs text-gray-600">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-3 h-3" />
            <span className="font-medium">使用提示:</span>
          </div>
          <ul className="space-y-1 pl-5">
            <li>• 拖拽组件到画布中添加节点</li>
            <li>• 双击组件快速添加到画布中心</li>
            <li>• 组件会自动映射到对应的RFLP层级</li>
            <li>• 组件库内容不可修改，只能实例化节点</li>
          </ul>
        </div>
      </div>
    </div>
  )
}