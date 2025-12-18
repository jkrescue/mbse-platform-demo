import { useState } from "react"
import { Button } from "./ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Badge } from "./ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Separator } from "./ui/separator"
import { CheckCircle, Circle, Layers, ArrowRight } from "lucide-react@0.487.0"
import { automotiveRFLPTemplates, getRecommendedTemplates, nodeTypeDisplayNames, RFLPTemplate } from "./workflow/rflpTemplates"

interface RFLPTemplateSelectorProps {
  onTemplateSelect: (template: RFLPTemplate) => void
  onCancel: () => void
  userRole?: string
}

export function RFLPTemplateSelector({ 
  onTemplateSelect, 
  onCancel, 
  userRole 
}: RFLPTemplateSelectorProps) {
  const [selectedDomain, setSelectedDomain] = useState<string>('automotive')
  const [selectedTemplate, setSelectedTemplate] = useState<RFLPTemplate | null>(null)
  
  // 根据用户角色过滤推荐模板
  const recommendedTemplates = getRecommendedTemplates(userRole)

  // 获取角色显示名称
  const getRoleDisplayName = (role?: string) => {
    switch (role) {
      case 'admin': return '平台管理员'
      case 'projectManager': return '项目经理'
      case 'architect': return '系统架构师'
      case 'simulation': return '仿真工程师'
      case 'modeling': return '建模工程师'
      default: return '用户'
    }
  }

  // 获取RFLP层连接类型的颜色
  const getConnectionTypeColor = (type: string) => {
    switch (type) {
      case 'traceability': return '#ef4444' // 红色 - 追溯关系
      case 'decomposition': return '#3b82f6' // 蓝色 - 分解关系
      case 'realization': return '#10b981' // 绿色 - 实现关系
      default: return '#6b7280'
    }
  }

  // 统计模板中各层的节点数量
  const getLayerNodeCount = (template: RFLPTemplate, layer: string) => {
    return template.presetNodes.filter(node => node.layer === layer).length
  }

  return (
    <div className="min-h-full bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* 页面标题和说明 */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Layers className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-semibold text-gray-900">选择RFLP模板</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            基于模型的系统工程(MBSE)RFLP模板帮助您快速搭建结构化的工作流程。
            RFLP代表需求(Requirements)、功能(Functions)、逻辑(Logical)、物理(Physical)四个层次。
          </p>
          
          {/* 角色提示 */}
          {userRole && (
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              <span className="text-blue-800 text-sm">
                已为您的角色({getRoleDisplayName(userRole)})优化推荐内容
              </span>
            </div>
          )}
        </div>

        {/* 领域选择 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">应用领域</CardTitle>
            <CardDescription>选择您要创建应用的专业领域</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedDomain} onValueChange={setSelectedDomain}>
              <SelectTrigger className="w-full max-w-xs">
                <SelectValue placeholder="选择应用领域" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="automotive">汽车工程</SelectItem>
                <SelectItem value="aerospace">航空航天</SelectItem>
                <SelectItem value="general">通用工程</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* 模板列表 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">预定义模板</CardTitle>
            <CardDescription>
              基于{selectedDomain === 'automotive' ? '汽车工程' : selectedDomain === 'aerospace' ? '航空航天' : '通用工程'}领域的RFLP模板
              {recommendedTemplates.length < automotiveRFLPTemplates.length && (
                <span className="text-blue-600 ml-2">
                  (已为您的角色筛选出 {recommendedTemplates.length} 个相关模板)
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {recommendedTemplates.map(template => (
                <div
                  key={template.id}
                  className={`relative p-6 border rounded-xl cursor-pointer transition-all hover:shadow-lg ${
                    selectedTemplate?.id === template.id
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedTemplate(template)}
                >
                  {/* 选择指示器 */}
                  <div className="absolute top-4 right-4">
                    {selectedTemplate?.id === template.id ? (
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400" />
                    )}
                  </div>

                  {/* 模板信息 */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{template.name}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{template.description}</p>
                    </div>

                    <div className="space-y-3">
                      {/* 领域标签 */}
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {template.domain === 'automotive' ? '汽车工程' : '通用工程'}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {template.presetNodes.length} 个节点
                        </span>
                      </div>

                      {/* RFLP层预览 */}
                      <div className="space-y-2">
                        <div className="text-xs text-gray-500 mb-1">RFLP层次结构:</div>
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(template.layers).map(([layerKey, layer]) => (
                            <div key={layerKey} className="flex items-center space-x-2">
                              <div
                                className="w-3 h-3 rounded"
                                style={{ backgroundColor: layer.color }}
                              />
                              <div className="flex-1 min-w-0">
                                <span className="text-xs text-gray-700 truncate block">
                                  {layer.name}
                                </span>
                                <span className="text-xs text-gray-400">
                                  {getLayerNodeCount(template, layerKey as any)}个
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 关系类型预览 */}
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500">追溯关系:</div>
                        <div className="flex flex-wrap gap-1">
                          {Array.from(new Set(template.presetConnections.map(c => c.type))).map(type => (
                            <div key={type} className="flex items-center space-x-1">
                              <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: getConnectionTypeColor(type) }}
                              />
                              <span className="text-xs text-gray-600">
                                {type === 'traceability' ? '追溯' : 
                                 type === 'decomposition' ? '分解' : '实现'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {recommendedTemplates.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Layers className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>暂无适合当前领域的模板</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 选中模板详情预览 */}
        {selectedTemplate && (
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <span>模板详情预览</span>
              </CardTitle>
              <CardDescription>
                {selectedTemplate.name} - 包含 {selectedTemplate.presetNodes.length} 个预设节点，
                {selectedTemplate.presetConnections.length} 个追溯关系
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* RFLP层详细信息 */}
              <div>
                <h4 className="font-medium mb-4">RFLP层次详情:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(selectedTemplate.layers).map(([layerKey, layer]) => {
                    const layerNodes = selectedTemplate.presetNodes.filter(
                      node => node.layer === layerKey
                    )
                    return (
                      <div key={layerKey} className="p-4 border rounded-lg">
                        <div className="flex items-center space-x-3 mb-3">
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: layer.color }}
                          />
                          <h5 className="font-medium">{layer.name}</h5>
                          <Badge variant="secondary" className="text-xs">
                            {layerNodes.length}个节点
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          {layerNodes.map(node => (
                            <div key={node.id} className="text-sm text-gray-600 flex items-center">
                              <ArrowRight className="w-3 h-3 mr-2 text-gray-400" />
                              {nodeTypeDisplayNames[node.type] || node.type}
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <Separator />

              {/* 验证规则 */}
              <div>
                <h4 className="font-medium mb-3">内置验证规则:</h4>
                <div className="space-y-2">
                  {selectedTemplate.validationRules.map((rule, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Badge 
                        variant={rule.level === 'error' ? 'destructive' : 'secondary'}
                        className="text-xs mt-0.5"
                      >
                        {rule.level === 'error' ? '错误' : '警告'}
                      </Badge>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{rule.rule}</div>
                        <div className="text-xs text-gray-600 mt-1">{rule.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 操作按钮 */}
        <div className="flex items-center justify-between pt-6 border-t">
          <Button variant="outline" onClick={onCancel} className="px-8">
            取消
          </Button>
          <Button 
            onClick={() => selectedTemplate && onTemplateSelect(selectedTemplate)}
            disabled={!selectedTemplate}
            className="px-8"
          >
            使用此模板创建应用
          </Button>
        </div>
      </div>
    </div>
  )
}