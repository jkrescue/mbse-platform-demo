import { useState } from "react"
import { ChevronLeft, Save, FileText, Tag, Type, AlignLeft, AlertTriangle } from "lucide-react@0.487.0"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Card } from "./ui/card"
import { Badge } from "./ui/badge"
import { RFLPTemplateSelector } from "./RFLPTemplateSelector"
import { RFLPTemplate } from "./workflow/rflpTemplates"

interface WorkflowDefinitionProps {
  onBack: () => void
  onConfirm: (workflowData: any) => void
  userRole?: string
  editingWorkflow?: any // 用于编辑模式
  isEditMode?: boolean // 标识是否为编辑模式
  templateType?: string // 新增模板类型参数
}

export function WorkflowDefinition({ 
  onBack, 
  onConfirm, 
  userRole, 
  editingWorkflow, 
  isEditMode = false,
  templateType // 新增参数
}: WorkflowDefinitionProps) {
  const [showRFLPSelector, setShowRFLPSelector] = useState(templateType === 'rflp')
  const [selectedRFLPTemplate, setSelectedRFLPTemplate] = useState<RFLPTemplate | null>(null)
  
  const [formData, setFormData] = useState({
    name: editingWorkflow?.name || "",
    description: editingWorkflow?.description || "",
    type: editingWorkflow?.type || "",
    category: editingWorkflow?.category || "",
    priority: editingWorkflow?.priority || "中", // 默认优先级为中
    version: editingWorkflow?.version || "1.0.0",
    tags: editingWorkflow?.tags || [] as string[],
  })

  const [currentTag, setCurrentTag] = useState("")

  // 处理RFLP模板选择
  const handleRFLPTemplateSelect = (template: RFLPTemplate) => {
    setSelectedRFLPTemplate(template)
    setShowRFLPSelector(false)
    
    // 自动填充工作流信息
    setFormData({
      name: template.name,
      description: template.description,
      type: 'design', // RFLP模板默认为设计开发工作流
      category: 'powertrain', // 根据模板领域映射到对应分类
      priority: '高', // RFLP模板通常重要性较高
      version: '1.0.0',
      tags: ['RFLP', 'MBSE', '系统工程']
    })
  }

  // 处理取消RFLP模板选择
  const handleCancelRFLPTemplateSelection = () => {
    setShowRFLPSelector(false)
    setSelectedRFLPTemplate(null)
    // 如果是从RFLP模式取消，返回到应用中心
    if (templateType === 'rflp') {
      onBack()
    }
  }

  // 如果显示RFLP选择器，渲染选择器组件
  if (showRFLPSelector) {
    return (
      <RFLPTemplateSelector
        onTemplateSelect={handleRFLPTemplateSelect}
        onCancel={handleCancelRFLPTemplateSelection}
        userRole={userRole}
      />
    )
  }

  const workflowTypes = [
    { value: "simulation", label: "仿真验证工作流", description: "用于系统仿真和验证的工作流" },
    { value: "design", label: "设计开发工作流", description: "用于产品设计和开发的工作流" },
    { value: "analysis", label: "分析评估工作流", description: "用于数据分析和性能评估的工作流" },
    { value: "testing", label: "测试验证工作流", description: "用于测试和质量验证的工作流" },
    { value: "integration", label: "集成部署工作流", description: "用于系统集成和部署的工作流" },
  ]

  const categories = [
    { value: "thermal", label: "热管理仿真" },
    { value: "vehicle-performance", label: "整车性能仿真" },
    { value: "energy-management", label: "整车能量管理" },
    { value: "vehicle-dynamics", label: "车辆动力学仿真" },
    { value: "powertrain", label: "动力总成仿真" },
    { value: "battery-thermal", label: "电池热管理仿真" },
    { value: "nvh", label: "NVH噪声振动仿真" },
    { value: "aerodynamics", label: "空气动力学仿真" },
    { value: "crash-safety", label: "碰撞安全仿真" },
    { value: "durability", label: "耐久性仿真" },
  ]

  const priorities = [
    { value: "高", label: "高", description: "紧急或重要的工作流", color: "text-red-600" },
    { value: "中", label: "中", description: "常规重要性的工作流", color: "text-yellow-600" },
    { value: "低", label: "低", description: "可延后处理的工作流", color: "text-gray-600" },
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }))
      setCurrentTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  const isFormValid = formData.name.trim() && formData.description.trim() && formData.type && formData.category

  const handleConfirm = () => {
    if (isFormValid) {
      const workflowData = {
        ...formData,
        id: isEditMode ? editingWorkflow.id : `workflow-${Date.now()}`,
        createTime: isEditMode ? editingWorkflow.createTime : new Date().toLocaleString('zh-CN'),
        status: isEditMode ? editingWorkflow.status : "草稿",
        isBlankWorkflow: isEditMode ? editingWorkflow.isBlankWorkflow : !selectedRFLPTemplate, // 有RFLP模板时不是空白工作流
        rflpTemplate: selectedRFLPTemplate // 传递RFLP模板信息
      }
      onConfirm(workflowData)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onBack}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              返回
            </Button>
            <div>
              <h1 className="text-xl font-semibold">
                {isEditMode ? "编辑工作流" : "创建新应用"}
              </h1>
              <p className="text-sm text-gray-600">
                {isEditMode ? "修改工作流的基本信息和配置" : "定义工作流的基本信息和配置"}
              </p>
            </div>
          </div>
          <Button onClick={handleConfirm} disabled={!isFormValid}>
            <Save className="w-4 h-4 mr-2" />
            {isEditMode ? "保存修改" : "确认创建"}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* RFLP模板信息显示 */}
            {selectedRFLPTemplate && (
              <Card className="p-6 bg-blue-50 border-blue-200">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">RFLP</span>
                  </div>
                  <h2 className="text-lg font-medium text-blue-900">已选择RFLP模板</h2>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium text-blue-800">{selectedRFLPTemplate.name}</div>
                    <div className="text-sm text-blue-700">{selectedRFLPTemplate.description}</div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-blue-700">
                    <span>包含 {selectedRFLPTemplate.presetNodes.length} 个预设节点</span>
                    <span>包含 {selectedRFLPTemplate.presetConnections.length} 个追溯关系</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(selectedRFLPTemplate.layers).map(([layerKey, layer]) => (
                      <div key={layerKey} className="flex items-center space-x-2 px-3 py-1 bg-white rounded-full border border-blue-200">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: layer.color }}
                        />
                        <span className="text-sm text-blue-800">{layer.name}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowRFLPSelector(true)}
                    className="text-blue-700 border-blue-300 hover:bg-blue-100"
                  >
                    重新选择模板
                  </Button>
                </div>
              </Card>
            )}

            {/* Basic Information */}
            <Card className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-medium">基本信息</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">应用名称 *</Label>
                  <Input
                    id="name"
                    placeholder="请输入应用名称"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="description">描述信息 *</Label>
                  <Textarea
                    id="description"
                    placeholder="请详细描述应用的用途和功能"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="version">版本号</Label>
                  <Input
                    id="version"
                    value={formData.version}
                    onChange={(e) => handleInputChange("version", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </Card>

            {/* Type and Category */}
            <Card className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Type className="w-5 h-5 text-green-600" />
                <h2 className="text-lg font-medium">类型分类</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="type">应用类型 *</Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="选择应用类型" />
                    </SelectTrigger>
                    <SelectContent>
                      {workflowTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div>
                            <div className="font-medium">{type.label}</div>
                            <div className="text-sm text-gray-500">{type.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="category">应用领域 *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="选择应用领域" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            {/* Priority Settings */}
            <Card className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h2 className="text-lg font-medium">优先级设置</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="priority">应用优先级</Label>
                  <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="选择优先级" />
                    </SelectTrigger>
                    <SelectContent>
                      {priorities.map((priority) => (
                        <SelectItem key={priority.value} value={priority.value}>
                          <div className="flex items-center space-x-2">
                            <span className={priority.color}>●</span>
                            <div>
                              <div className="">{priority.label}</div>
                              <div className="text-sm text-gray-500">{priority.description}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    💡 优先级设置将影响应用在列表中的显示和排序，高优先级的应用会被优先处理。
                  </p>
                </div>
              </div>
            </Card>

            {/* Tags */}
            <Card className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Tag className="w-5 h-5 text-orange-600" />
                <h2 className="text-lg font-medium">标签管理</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="tags">添加标签</Label>
                  <div className="flex space-x-2 mt-1">
                    <Input
                      id="tags"
                      placeholder="输入标签名称"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1"
                    />
                    <Button variant="outline" onClick={handleAddTag} disabled={!currentTag.trim()}>
                      添加
                    </Button>
                  </div>
                </div>

                {formData.tags.length > 0 && (
                  <div>
                    <Label>已添加的标签</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="px-2 py-1">
                          {tag}
                          <button
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-2 text-xs hover:text-red-600"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Right Column - Preview */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-medium mb-4">预览信息</h2>
              
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600">名称</div>
                  <div className="font-medium">{formData.name || "未设置"}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-600">类型</div>
                  <div className="font-medium">
                    {workflowTypes.find(t => t.value === formData.type)?.label || "未选择"}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-600">领域</div>
                  <div className="font-medium">
                    {categories.find(c => c.value === formData.category)?.label || "未选择"}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-600">版本</div>
                  <div className="font-medium">{formData.version}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-600">优先级</div>
                  <div className="font-medium">
                    {priorities.find(p => p.value === formData.priority)?.label || "中"}
                  </div>
                </div>

                {formData.tags.length > 0 && (
                  <div>
                    <div className="text-sm text-gray-600 mb-2">标签</div>
                    <div className="flex flex-wrap gap-1">
                      {formData.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6 bg-blue-50 border-blue-200">
              <h3 className="font-medium text-blue-800 mb-2">
                {isEditMode ? "编辑说明" : "创建说明"}
              </h3>
              <ul className="text-sm text-blue-700 space-y-1">
                {isEditMode ? (
                  <>
                    <li>• 修改完成后将保存到应用列表</li>
                    <li>• 所有修改将立即生效</li>
                    <li>• 优先级修改会影响排序</li>
                    <li>• 标签修改会影响搜索结果</li>
                  </>
                ) : (
                  <>
                    <li>• 确认信息后将进入应用编辑器</li>
                    <li>• 编辑器提供完整的组件库</li>
                    <li>• 画布初始为空白状态</li>
                    <li>• 可自由设计应用结构</li>
                  </>
                )}
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}