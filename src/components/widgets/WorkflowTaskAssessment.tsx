/**
 * 工作流任务评估组件
 * 用于在工作流执行后评估任务指标
 */

import { useState } from 'react'
import {
  Target,
  TrendingUp,
  Save,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react@0.487.0'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { toast } from 'sonner@2.0.3'
import { taskService } from '../../services/TaskService'
import { TaskWorkflowAssessment } from '../../types/task'
import { useAuth } from '../AuthContext'

interface WorkflowTaskAssessmentProps {
  workflowId: string
  workflowName: string
  executionId: string
  onClose: () => void
}

export function WorkflowTaskAssessment({
  workflowId,
  workflowName,
  executionId,
  onClose
}: WorkflowTaskAssessmentProps) {
  const { user } = useAuth()
  
  // 简化：这里应该从后端获取关联的任务列表
  // 现在我们假设已经有关联的任务
  const [selectedTask, setSelectedTask] = useState<string>('')
  const [assessmentData, setAssessmentData] = useState<{
    assessedMetrics: Array<{
      metricId: string
      metricName: string
      simulatedValue: number
      targetValue: number
      recommendation: string
    }>
    overallAssessment: string
    nextSteps: string[]
  }>({
    assessedMetrics: [],
    assessedMetrics: [],
    overallAssessment: '',
    nextSteps: ['']
  })

  // 模拟任务列表（实际应该从taskService获取）
  const mockTasks = [
    { id: 'task-001', name: '电池包能量密度优化', code: 'TASK-001' }
  ]

  const handleAddMetric = () => {
    setAssessmentData({
      ...assessmentData,
      assessedMetrics: [
        ...assessmentData.assessedMetrics,
        {
          metricId: '',
          metricName: '',
          simulatedValue: 0,
          targetValue: 0,
          recommendation: ''
        }
      ]
    })
  }

  const handleUpdateMetric = (index: number, field: string, value: any) => {
    const updated = [...assessmentData.assessedMetrics]
    updated[index] = { ...updated[index], [field]: value }
    setAssessmentData({ ...assessmentData, assessedMetrics: updated })
  }

  const handleAddNextStep = () => {
    setAssessmentData({
      ...assessmentData,
      nextSteps: [...assessmentData.nextSteps, '']
    })
  }

  const handleUpdateNextStep = (index: number, value: string) => {
    const updated = [...assessmentData.nextSteps]
    updated[index] = value
    setAssessmentData({ ...assessmentData, nextSteps: updated })
  }

  const handleSubmit = () => {
    if (!selectedTask) {
      toast.error('请选择关联任务')
      return
    }

    if (assessmentData.assessedMetrics.length === 0) {
      toast.error('请至少添加一个指标评估')
      return
    }

    // 构建完整的评估数据
    const assessment: TaskWorkflowAssessment = {
      taskId: selectedTask,
      workflowId,
      workflowName,
      assessedMetrics: assessmentData.assessedMetrics.map(m => {
        const deviation = m.simulatedValue - m.targetValue
        const deviationPercent = (deviation / m.targetValue) * 100
        
        let assessmentType: 'meets_target' | 'near_target' | 'below_target' | 'exceeds_target'
        if (Math.abs(deviationPercent) <= 5) {
          assessmentType = 'meets_target'
        } else if (deviationPercent > 5) {
          assessmentType = 'exceeds_target'
        } else if (deviationPercent > -10) {
          assessmentType = 'near_target'
        } else {
          assessmentType = 'below_target'
        }

        return {
          ...m,
          deviation,
          deviationPercent,
          assessment: assessmentType
        }
      }),
      executionId,
      executedAt: new Date().toISOString(),
      executedBy: user?.id || 'user-001',
      overallAssessment: assessmentData.overallAssessment,
      nextSteps: assessmentData.nextSteps.filter(s => s.trim() !== '')
    }

    // 保存评估
    taskService.addWorkflowAssessment(assessment)

    toast.success('工作流评估已保存')
    onClose()
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            工作流指标评估
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* 工作流信息 */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-xs text-gray-600">工作流名称</Label>
                  <p className="text-gray-900 mt-1">{workflowName}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-600">执行ID</Label>
                  <p className="text-gray-900 mt-1">{executionId}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 关联任务 */}
          <div>
            <Label>关联任务 *</Label>
            <select
              className="w-full mt-1 border rounded-lg px-3 py-2"
              value={selectedTask}
              onChange={e => setSelectedTask(e.target.value)}
            >
              <option value="">选择任务...</option>
              {mockTasks.map(task => (
                <option key={task.id} value={task.id}>
                  {task.code} - {task.name}
                </option>
              ))}
            </select>
          </div>

          {/* 指标评估 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label>指标评估结果</Label>
              <Button size="sm" variant="outline" onClick={handleAddMetric}>
                添加指标
              </Button>
            </div>
            
            {assessmentData.assessedMetrics.length === 0 ? (
              <div className="text-center py-8 border rounded-lg text-gray-500">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p>暂未添加指标评估</p>
              </div>
            ) : (
              <div className="space-y-3">
                {assessmentData.assessedMetrics.map((metric, index) => (
                  <Card key={index}>
                    <CardContent className="p-4 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs">指标名称</Label>
                          <Input
                            className="h-8 mt-1"
                            value={metric.metricName}
                            onChange={e =>
                              handleUpdateMetric(index, 'metricName', e.target.value)
                            }
                            placeholder="例如：电池包能量密度"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">指标ID</Label>
                          <Input
                            className="h-8 mt-1"
                            value={metric.metricId}
                            onChange={e =>
                              handleUpdateMetric(index, 'metricId', e.target.value)
                            }
                            placeholder="metric_xxx"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs">仿真值</Label>
                          <Input
                            type="number"
                            className="h-8 mt-1"
                            value={metric.simulatedValue}
                            onChange={e =>
                              handleUpdateMetric(
                                index,
                                'simulatedValue',
                                parseFloat(e.target.value)
                              )
                            }
                          />
                        </div>
                        <div>
                          <Label className="text-xs">目标值</Label>
                          <Input
                            type="number"
                            className="h-8 mt-1"
                            value={metric.targetValue}
                            onChange={e =>
                              handleUpdateMetric(index, 'targetValue', parseFloat(e.target.value))
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs">建议</Label>
                        <Textarea
                          className="mt-1"
                          rows={2}
                          value={metric.recommendation}
                          onChange={e =>
                            handleUpdateMetric(index, 'recommendation', e.target.value)
                          }
                          placeholder="基于仿真结果的改进建议..."
                        />
                      </div>

                      {/* 显示偏差 */}
                      {metric.simulatedValue && metric.targetValue && (
                        <div className="pt-2 border-t text-xs">
                          <span className="text-gray-600">偏差: </span>
                          <span
                            className={
                              metric.simulatedValue >= metric.targetValue
                                ? 'text-green-600'
                                : 'text-red-600'
                            }
                          >
                            {((metric.simulatedValue - metric.targetValue) / metric.targetValue * 100).toFixed(2)}%
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* 评估总结 */}
          <div>
            <Label>评估总结</Label>
            <Textarea
              className="mt-1"
              rows={4}
              value={assessmentData.overallAssessment}
              onChange={e =>
                setAssessmentData({ ...assessmentData, overallAssessment: e.target.value })
              }
              placeholder="总结本次工作流执行的评估结果，包括主要发现和整体结论..."
            />
          </div>

          {/* 下一步行动 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label>下一步行动</Label>
              <Button size="sm" variant="outline" onClick={handleAddNextStep}>
                添加行动项
              </Button>
            </div>
            <div className="space-y-2">
              {assessmentData.nextSteps.map((step, index) => (
                <Input
                  key={index}
                  value={step}
                  onChange={e => handleUpdateNextStep(index, e.target.value)}
                  placeholder={`行动项 ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              取消
            </Button>
            <Button onClick={handleSubmit} className="gap-2">
              <Save className="w-4 h-4" />
              保存评估
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
