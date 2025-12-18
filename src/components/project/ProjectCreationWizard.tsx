import { useState } from 'react'
import { X, ChevronLeft, ChevronRight, Car, Zap, Battery, FileText, Check, Calendar, DollarSign } from 'lucide-react@0.487.0'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { ProjectTemplate, CreateProjectRequest, ProjectType, ProjectPhase } from '../../types/project'
import { projectService } from '../../services/ProjectService'
import { useAuth } from '../AuthContext'
import { toast } from 'sonner@2.0.3'

interface ProjectCreationWizardProps {
  open: boolean
  onClose: () => void
  onSuccess?: (projectId: string) => void
}

export function ProjectCreationWizard({ open, onClose, onSuccess }: ProjectCreationWizardProps) {
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(null)
  const [formData, setFormData] = useState<Partial<CreateProjectRequest>>({
    currency: 'CNY',
    phase: 'concept',
    department: user?.department || '研发部'
  })

  const templates = projectService.getTemplates()

  const handleReset = () => {
    setStep(1)
    setSelectedTemplate(null)
    setFormData({
      currency: 'CNY',
      phase: 'concept',
      department: user?.department || '研发部'
    })
  }

  const handleClose = () => {
    handleReset()
    onClose()
  }

  const handleNext = () => {
    // 验证当前步骤
    if (step === 1 && !selectedTemplate) {
      toast.error('请选择项目模板')
      return
    }
    if (step === 2) {
      if (!formData.name?.trim()) {
        toast.error('请输入项目名称')
        return
      }
      if (!formData.code?.trim()) {
        toast.error('请输入项目代号')
        return
      }
      if (!formData.startDate) {
        toast.error('请选择开始日期')
        return
      }
      if (!formData.endDate) {
        toast.error('请选择结束日期')
        return
      }
      if (new Date(formData.endDate) <= new Date(formData.startDate)) {
        toast.error('结束日期必须晚于开始日期')
        return
      }
      if (!formData.budget || formData.budget <= 0) {
        toast.error('请输入有效的预算金额')
        return
      }
    }

    setStep(step + 1)
  }

  const handlePrevious = () => {
    setStep(step - 1)
  }

  const handleCreate = () => {
    if (!user) {
      toast.error('请先登录')
      return
    }

    if (!formData.name || !formData.code || !formData.startDate || !formData.endDate || !formData.budget) {
      toast.error('请填写所有必填字段')
      return
    }

    const request: CreateProjectRequest = {
      name: formData.name,
      code: formData.code,
      type: selectedTemplate?.type || 'custom',
      phase: formData.phase || 'concept',
      startDate: formData.startDate,
      endDate: formData.endDate,
      budget: formData.budget,
      currency: formData.currency || 'CNY',
      description: formData.description || '',
      templateId: selectedTemplate?.id,
      department: formData.department || user.department
    }

    try {
      const project = projectService.createProject(request, user.id, user.name)
      toast.success('项目创建成功')
      handleClose()
      if (onSuccess) {
        onSuccess(project.id)
      }
    } catch (error) {
      toast.error('项目创建失败')
      console.error(error)
    }
  }

  const getTemplateIcon = (type: ProjectType) => {
    switch (type) {
      case 'vehicle':
        return Car
      case 'powertrain':
        return Zap
      case 'battery':
        return Battery
      default:
        return FileText
    }
  }

  const calculateDuration = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate)
      const end = new Date(formData.endDate)
      const months = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30))
      return months
    }
    return 0
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>创建新项目</DialogTitle>
            <Badge variant="outline">{step}/4</Badge>
          </div>
          <DialogDescription className="sr-only">
            {step === 1 && '选择项目模板，系统将自动配置相应的里程碑和工作流'}
            {step === 2 && '填写项目的基本信息，包括名称、代号、时间和预算'}
            {step === 3 && '查看根据模板预设的项目里程碑'}
            {step === 4 && '确认项目信息并创建'}
          </DialogDescription>
          <Progress value={(step / 4) * 100} className="mt-2" />
        </DialogHeader>

        <div className="mt-4">
          {/* 步骤1: 选择模板 */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">选择项目模板</h3>
                <p className="text-sm text-gray-600 mb-4">
                  选择一个项目模板快速开始，系统将自动配置相应的里程碑和工作流
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {templates.map((template) => {
                  const Icon = getTemplateIcon(template.type)
                  const isSelected = selectedTemplate?.id === template.id

                  return (
                    <button
                      key={template.id}
                      onClick={() => {
                        setSelectedTemplate(template)
                        setFormData({ ...formData, type: template.type })
                      }}
                      className={`
                        p-4 rounded-lg border-2 text-left transition-all
                        ${isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`
                          p-3 rounded-lg
                          ${isSelected ? 'bg-blue-100' : 'bg-gray-100'}
                        `}>
                          <Icon className={`h-6 w-6 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{template.name}</h4>
                            {isSelected && (
                              <Check className="h-4 w-4 text-blue-600" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {template.description}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span>{template.defaultMilestones.length} 个里程碑</span>
                            <span>•</span>
                            <span>约 {Math.round(template.estimatedDuration / 30)} 个月</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>

              {selectedTemplate && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium mb-2">将预设内容：</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• {selectedTemplate.defaultMilestones.length} 个里程碑节点</li>
                    <li>• {selectedTemplate.suggestedTeamRoles.length} 个推荐角色</li>
                    <li>• 预计工期: 约 {Math.round(selectedTemplate.estimatedDuration / 30)} 个月</li>
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* 步骤2: 基本信息 */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">基本信息</h3>
                <p className="text-sm text-gray-600 mb-4">
                  填写项目的基本信息
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">项目名称 *</Label>
                  <Input
                    id="name"
                    placeholder="例如：某新能源车型A00级开发项目"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="code">项目代号 *</Label>
                  <Input
                    id="code"
                    placeholder="例如：A00-NEV-2025"
                    value={formData.code || ''}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">项目类型</Label>
                    <Input
                      id="type"
                      value={
                        selectedTemplate?.type === 'vehicle' ? '新能源整车' :
                        selectedTemplate?.type === 'powertrain' ? '三电系统' :
                        selectedTemplate?.type === 'battery' ? '电池包开发' : '自定义'
                      }
                      disabled
                    />
                  </div>

                  <div>
                    <Label htmlFor="phase">项目阶段</Label>
                    <Select
                      value={formData.phase}
                      onValueChange={(value) => setFormData({ ...formData, phase: value as ProjectPhase })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="concept">概念设计</SelectItem>
                        <SelectItem value="design">详细设计</SelectItem>
                        <SelectItem value="validation">验证测试</SelectItem>
                        <SelectItem value="production">量产准备</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="department">所属部门</Label>
                  <Input
                    id="department"
                    value={formData.department || ''}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">开始日期 *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate || ''}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="endDate">结束日期 *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate || ''}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>
                </div>

                {calculateDuration() > 0 && (
                  <div className="p-3 bg-gray-50 rounded-lg text-sm">
                    <Calendar className="h-4 w-4 inline mr-2" />
                    项目工期: <span className="font-medium">{calculateDuration()} 个月</span>
                  </div>
                )}

                <div>
                  <Label htmlFor="budget">项目预算 *</Label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        id="budget"
                        type="number"
                        placeholder="3500"
                        value={formData.budget || ''}
                        onChange={(e) => setFormData({ ...formData, budget: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <Select
                      value={formData.currency}
                      onValueChange={(value) => setFormData({ ...formData, currency: value as 'CNY' | 'USD' })}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CNY">¥ 万元</SelectItem>
                        <SelectItem value="USD">$ 万美元</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">项目描述</Label>
                  <Textarea
                    id="description"
                    placeholder="简要描述项目的目标、范围和特点..."
                    rows={3}
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 步骤3: 里程碑配置 */}
          {step === 3 && selectedTemplate && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">里程碑配置</h3>
                <p className="text-sm text-gray-600 mb-4">
                  以下是根据模板预设的项目里程碑，创建后可在项目中调整
                </p>
              </div>

              <div className="space-y-3">
                {selectedTemplate.defaultMilestones.map((milestone, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          <Check className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{milestone.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            交付物: {milestone.deliverables.join('、')}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">里程碑 {index + 1}</Badge>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                <p>💡 里程碑将根据项目起止日期自动分配目标时间</p>
              </div>
            </div>
          )}

          {/* 步骤4: 确认信息 */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">确认信息</h3>
                <p className="text-sm text-gray-600 mb-4">
                  请确认以下项目信息，确认后将创建项目
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 border rounded-lg space-y-3">
                  <div>
                    <div className="text-sm text-gray-500">项目名称</div>
                    <div className="font-medium">{formData.name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">项目代号</div>
                    <div className="font-medium">{formData.code}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">项目类型</div>
                      <Badge variant="outline">{selectedTemplate?.name}</Badge>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">项目阶段</div>
                      <Badge variant="outline">
                        {formData.phase === 'concept' ? '概念设计' :
                         formData.phase === 'design' ? '详细设计' :
                         formData.phase === 'validation' ? '验证测试' : '量产准备'}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">开始日期</div>
                      <div className="font-medium">{formData.startDate}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">结束日期</div>
                      <div className="font-medium">{formData.endDate}</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">项目预算</div>
                    <div className="font-medium">
                      {formData.currency === 'CNY' ? '¥' : '$'} {formData.budget} 万{formData.currency === 'CNY' ? '元' : '美元'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">项目负责人</div>
                    <div className="font-medium">{user?.name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">所属部门</div>
                    <div className="font-medium">{formData.department}</div>
                  </div>
                  {selectedTemplate && (
                    <div>
                      <div className="text-sm text-gray-500">里程碑数量</div>
                      <div className="font-medium">{selectedTemplate.defaultMilestones.length} 个</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 底部按钮 */}
          <div className="flex justify-between mt-6 pt-4 border-t">
            <Button
              variant="outline"
              onClick={step === 1 ? handleClose : handlePrevious}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              {step === 1 ? '取消' : '上一步'}
            </Button>

            <Button onClick={step === 4 ? handleCreate : handleNext}>
              {step === 4 ? '创建项目' : '下一步'}
              {step !== 4 && <ChevronRight className="h-4 w-4 ml-1" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
