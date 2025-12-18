/**
 * 任务创建对话框
 * 支持选择指标、设置派发对象等
 */

import { useState } from 'react'
import {
  X,
  Calendar,
  Users,
  Target,
  Clock,
  FileText,
  AlertCircle
} from 'lucide-react@0.487.0'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Checkbox } from '../ui/checkbox'
import { ScrollArea } from '../ui/scroll-area'
import { toast } from 'sonner@2.0.3'
import { projectService } from '../../services/ProjectService'
import { taskService } from '../../services/TaskService'
import { metricsService } from '../../services/MetricsService'
import { CreateTaskRequest, TaskPriority } from '../../types/task'
import { useAuth } from '../AuthContext'
import { MetricSelector } from '../metrics/MetricSelector'

interface TaskCreationDialogProps {
  projectId: string
  phaseId?: string
  onClose: () => void
  onSuccess: () => void
}

export function TaskCreationDialog({
  projectId,
  phaseId,
  onClose,
  onSuccess
}: TaskCreationDialogProps) {
  const { user } = useAuth()
  const project = projectService.getProject(projectId)
  const projectMetrics = metricsService.getMetricsByProject(projectId)

  const [formData, setFormData] = useState<Partial<CreateTaskRequest>>({
    projectId,
    phaseId: phaseId || '',
    name: '',
    description: '',
    type: 'simulation',
    priority: 'medium',
    startDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    estimatedHours: 40,
    assigneeUserId: '',
    collaborators: [],
    metricIds: [],
    dependencies: [],
    requireReview: false,
    reviewers: []
  })

  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([])

  const handleSubmit = () => {
    if (!formData.name || !formData.phaseId || !formData.assigneeUserId || !formData.dueDate) {
      toast.error('请填写必填字段')
      return
    }

    try {
      const task = taskService.createTask(
        {
          ...formData,
          metricIds: selectedMetrics
        } as CreateTaskRequest,
        user?.id || 'user-001',
        user?.name || '当前用户'
      )

      toast.success('任务创建成功')
      onSuccess()
    } catch (error: any) {
      toast.error(error.message || '创建失败')
    }
  }

  const toggleMetric = (metricId: string) => {
    setSelectedMetrics(prev =>
      prev.includes(metricId)
        ? prev.filter(id => id !== metricId)
        : [...prev, metricId]
    )
  }

  if (!project) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* 头部 */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-gray-900">创建任务</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* 内容 */}
        <ScrollArea className="flex-1 px-6 py-4">
          <div className="space-y-6">
            {/* 基本信息 */}
            <Card>
              <CardContent className="p-4">
                <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  基本信息
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label>任务名称 *</Label>
                    <Input
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="例如：电池包能量密度优化"
                    />
                  </div>

                  <div className="col-span-2">
                    <Label>任务描述</Label>
                    <Textarea
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      placeholder="描述任务的目标、范围和预期成果..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>所属阶段 *</Label>
                    <Select
                      value={formData.phaseId}
                      onValueChange={value => setFormData({ ...formData, phaseId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择项目阶段" />
                      </SelectTrigger>
                      <SelectContent>
                        {project.milestones.map(milestone => (
                          <SelectItem key={milestone.id} value={milestone.id}>
                            {milestone.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>任务类型</Label>
                    <Select
                      value={formData.type}
                      onValueChange={value =>
                        setFormData({ ...formData, type: value as any })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="design">设计</SelectItem>
                        <SelectItem value="simulation">仿真</SelectItem>
                        <SelectItem value="testing">测试</SelectItem>
                        <SelectItem value="analysis">分析</SelectItem>
                        <SelectItem value="review">评审</SelectItem>
                        <SelectItem value="integration">集成</SelectItem>
                        <SelectItem value="other">其他</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>优先级</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={value =>
                        setFormData({ ...formData, priority: value as TaskPriority })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="critical">紧急</SelectItem>
                        <SelectItem value="high">高</SelectItem>
                        <SelectItem value="medium">中</SelectItem>
                        <SelectItem value="low">低</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>预计工时（小时）</Label>
                    <Input
                      type="number"
                      value={formData.estimatedHours}
                      onChange={e =>
                        setFormData({ ...formData, estimatedHours: parseInt(e.target.value) })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 时间安排 */}
            <Card>
              <CardContent className="p-4">
                <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  时间安排
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>开始日期 *</Label>
                    <Input
                      type="date"
                      value={formData.startDate}
                      onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>截止日期 *</Label>
                    <Input
                      type="date"
                      value={formData.dueDate}
                      onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 任务派发 */}
            <Card>
              <CardContent className="p-4">
                <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  任务派发
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label>负责人 *</Label>
                    <Select
                      value={formData.assigneeUserId}
                      onValueChange={value =>
                        setFormData({ ...formData, assigneeUserId: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择负责人" />
                      </SelectTrigger>
                      <SelectContent>
                        {project.teamMembers.map(member => (
                          <SelectItem key={member.userId} value={member.userId}>
                            {member.userName} ({member.role})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>协作者（可选）</Label>
                    <div className="border rounded-lg p-3 max-h-40 overflow-y-auto">
                      {project.teamMembers
                        .filter(m => m.userId !== formData.assigneeUserId)
                        .map(member => (
                          <div key={member.userId} className="flex items-center gap-2 py-1">
                            <Checkbox
                              checked={formData.collaborators?.includes(member.userId)}
                              onCheckedChange={checked => {
                                const newCollaborators = checked
                                  ? [...(formData.collaborators || []), member.userId]
                                  : (formData.collaborators || []).filter(
                                      id => id !== member.userId
                                    )
                                setFormData({ ...formData, collaborators: newCollaborators })
                              }}
                            />
                            <span className="text-sm">
                              {member.userName} ({member.role})
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 关联指标 */}
            <MetricSelector
              projectId={projectId}
              selectedMetricIds={selectedMetrics}
              onSelectionChange={setSelectedMetrics}
              showRadarChart={true}
            />
          </div>
        </ScrollArea>

        {/* 底部操作 */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button onClick={handleSubmit}>创建任务</Button>
        </div>
      </div>
    </div>
  )
}
