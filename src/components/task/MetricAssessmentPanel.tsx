/**
 * 指标评估面板
 * 用于评估任务关联指标的来源、信心、最优性等
 */

import { useState } from 'react'
import {
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Edit,
  Save,
  X
} from 'lucide-react@0.487.0'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select'
import { Progress } from '../ui/progress'
import { toast } from 'sonner@2.0.3'
import { Task, TaskMetricAssignment, ConfidenceLevel, OptimalityAssessment, MetricSourceType } from '../../types/task'
import { taskService } from '../../services/TaskService'
import { useAuth } from '../AuthContext'

interface MetricAssessmentPanelProps {
  task: Task
  onUpdate: () => void
}

export function MetricAssessmentPanel({ task, onUpdate }: MetricAssessmentPanelProps) {
  const { user } = useAuth()
  const [editingMetric, setEditingMetric] = useState<string | null>(null)
  const [assessmentData, setAssessmentData] = useState<Partial<TaskMetricAssignment['assessment']>>({})

  const startEdit = (assignment: TaskMetricAssignment) => {
    setEditingMetric(assignment.id)
    setAssessmentData(assignment.assessment)
  }

  const cancelEdit = () => {
    setEditingMetric(null)
    setAssessmentData({})
  }

  const saveAssessment = (assignmentId: string) => {
    const result = taskService.updateMetricAssessment(task.id, assignmentId, assessmentData)
    if (result) {
      toast.success('指标评估已更新')
      setEditingMetric(null)
      onUpdate()
    } else {
      toast.error('更新失败')
    }
  }

  const getSourceText = (source: MetricSourceType) => {
    const texts: Record<MetricSourceType, string> = {
      customer_requirement: '客户需求',
      regulation: '法规要求',
      competitor_benchmark: '竞品对标',
      internal_target: '内部目标',
      technical_constraint: '技术约束',
      cost_optimization: '成本优化'
    }
    return texts[source]
  }

  const getConfidenceText = (confidence: ConfidenceLevel) => {
    const texts: Record<ConfidenceLevel, string> = {
      very_high: '非常高',
      high: '高',
      medium: '中',
      low: '低',
      very_low: '非常低'
    }
    return texts[confidence]
  }

  const getOptimalityText = (optimality: OptimalityAssessment) => {
    const texts: Record<OptimalityAssessment, string> = {
      optimal: '最优',
      near_optimal: '接近最优',
      acceptable: '可接受',
      needs_improvement: '需要改进',
      not_feasible: '不可行'
    }
    return texts[optimality]
  }

  const getConfidenceColor = (confidence: ConfidenceLevel) => {
    const colors: Record<ConfidenceLevel, string> = {
      very_high: 'bg-green-100 text-green-700 border-green-200',
      high: 'bg-blue-100 text-blue-700 border-blue-200',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      low: 'bg-orange-100 text-orange-700 border-orange-200',
      very_low: 'bg-red-100 text-red-700 border-red-200'
    }
    return colors[confidence]
  }

  const getOptimalityColor = (optimality: OptimalityAssessment) => {
    const colors: Record<OptimalityAssessment, string> = {
      optimal: 'bg-green-100 text-green-700 border-green-200',
      near_optimal: 'bg-blue-100 text-blue-700 border-blue-200',
      acceptable: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      needs_improvement: 'bg-orange-100 text-orange-700 border-orange-200',
      not_feasible: 'bg-red-100 text-red-700 border-red-200'
    }
    return colors[optimality]
  }

  if (task.metricAssignments.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <Target className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p>该任务暂未关联指标</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {task.metricAssignments.map(assignment => {
        const isEditing = editingMetric === assignment.id

        return (
          <Card key={assignment.id} className="border-l-4 border-l-blue-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-base">{assignment.metricName}</CardTitle>
                    <Badge variant="outline">{assignment.metricCode}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <Badge className={getConfidenceColor(assignment.assessment.confidence)}>
                      信心: {getConfidenceText(assignment.assessment.confidence)}
                    </Badge>
                    <Badge className={getOptimalityColor(assignment.assessment.optimality)}>
                      {getOptimalityText(assignment.assessment.optimality)}
                    </Badge>
                  </div>
                </div>
                {!isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEdit(assignment)}
                    className="gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    编辑评估
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  {/* 编辑模式 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>指标来源 *</Label>
                      <Select
                        value={assessmentData.source}
                        onValueChange={value =>
                          setAssessmentData({ ...assessmentData, source: value as MetricSourceType })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="customer_requirement">客户需求</SelectItem>
                          <SelectItem value="regulation">法规要求</SelectItem>
                          <SelectItem value="competitor_benchmark">竞品对标</SelectItem>
                          <SelectItem value="internal_target">内部目标</SelectItem>
                          <SelectItem value="technical_constraint">技术约束</SelectItem>
                          <SelectItem value="cost_optimization">成本优化</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>完成信心 *</Label>
                      <Select
                        value={assessmentData.confidence}
                        onValueChange={value =>
                          setAssessmentData({ ...assessmentData, confidence: value as ConfidenceLevel })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="very_high">非常高</SelectItem>
                          <SelectItem value="high">高</SelectItem>
                          <SelectItem value="medium">中</SelectItem>
                          <SelectItem value="low">低</SelectItem>
                          <SelectItem value="very_low">非常低</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>最优性评估 *</Label>
                      <Select
                        value={assessmentData.optimality}
                        onValueChange={value =>
                          setAssessmentData({
                            ...assessmentData,
                            optimality: value as OptimalityAssessment
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="optimal">最优</SelectItem>
                          <SelectItem value="near_optimal">接近最优</SelectItem>
                          <SelectItem value="acceptable">可接受</SelectItem>
                          <SelectItem value="needs_improvement">需要改进</SelectItem>
                          <SelectItem value="not_feasible">不可行</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>目标值</Label>
                      <Input
                        type="number"
                        value={assessmentData.targetValue}
                        onChange={e =>
                          setAssessmentData({
                            ...assessmentData,
                            targetValue: parseFloat(e.target.value)
                          })
                        }
                      />
                    </div>

                    <div>
                      <Label>基线值（可选）</Label>
                      <Input
                        type="number"
                        value={assessmentData.baselineValue || ''}
                        onChange={e =>
                          setAssessmentData({
                            ...assessmentData,
                            baselineValue: e.target.value ? parseFloat(e.target.value) : undefined
                          })
                        }
                      />
                    </div>

                    <div>
                      <Label>挑战值（可选）</Label>
                      <Input
                        type="number"
                        value={assessmentData.challengeValue || ''}
                        onChange={e =>
                          setAssessmentData({
                            ...assessmentData,
                            challengeValue: e.target.value ? parseFloat(e.target.value) : undefined
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label>来源详情</Label>
                    <Textarea
                      value={assessmentData.sourceDetail}
                      onChange={e =>
                        setAssessmentData({ ...assessmentData, sourceDetail: e.target.value })
                      }
                      placeholder="详细说明指标的具体来源..."
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label>信心依据</Label>
                    <Textarea
                      value={assessmentData.confidenceReason}
                      onChange={e =>
                        setAssessmentData({ ...assessmentData, confidenceReason: e.target.value })
                      }
                      placeholder="说明为什么有这样的信心程度..."
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label>最优性说明</Label>
                    <Textarea
                      value={assessmentData.optimalityJustification}
                      onChange={e =>
                        setAssessmentData({
                          ...assessmentData,
                          optimalityJustification: e.target.value
                        })
                      }
                      placeholder="说明为什么认为是这个最优性水平..."
                      rows={2}
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <Button onClick={() => saveAssessment(assignment.id)} className="gap-2">
                      <Save className="w-4 h-4" />
                      保存评估
                    </Button>
                    <Button variant="outline" onClick={cancelEdit} className="gap-2">
                      <X className="w-4 h-4" />
                      取消
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* 查看模式 */}
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                      <Label className="text-xs text-gray-600">指标来源</Label>
                      <p className="text-sm text-gray-900 mt-1">
                        {getSourceText(assignment.assessment.source)}
                      </p>
                      {assignment.assessment.sourceDetail && (
                        <p className="text-xs text-gray-600 mt-1">
                          {assignment.assessment.sourceDetail}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label className="text-xs text-gray-600">完成信心</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getConfidenceColor(assignment.assessment.confidence)}>
                          {getConfidenceText(assignment.assessment.confidence)}
                        </Badge>
                      </div>
                      {assignment.assessment.confidenceReason && (
                        <p className="text-xs text-gray-600 mt-1">
                          {assignment.assessment.confidenceReason}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label className="text-xs text-gray-600">最优性评估</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getOptimalityColor(assignment.assessment.optimality)}>
                          {getOptimalityText(assignment.assessment.optimality)}
                        </Badge>
                      </div>
                      {assignment.assessment.optimalityJustification && (
                        <p className="text-xs text-gray-600 mt-1">
                          {assignment.assessment.optimalityJustification}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label className="text-xs text-gray-600">目标值设置</Label>
                      <div className="flex items-center gap-4 mt-1 text-sm">
                        {assignment.assessment.baselineValue && (
                          <span className="text-gray-600">
                            基线: <span className="text-gray-900">{assignment.assessment.baselineValue}</span>
                          </span>
                        )}
                        <span className="text-blue-600">
                          目标: <span className="text-blue-700">{assignment.assessment.targetValue}</span>
                        </span>
                        {assignment.assessment.challengeValue && (
                          <span className="text-green-600">
                            挑战: <span className="text-green-700">{assignment.assessment.challengeValue}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 风险与挑战 */}
                  {(assignment.assessment.risks.length > 0 ||
                    assignment.assessment.technicalChallenges.length > 0) && (
                    <div className="pt-4 border-t">
                      <div className="grid grid-cols-2 gap-4">
                        {assignment.assessment.risks.length > 0 && (
                          <div>
                            <Label className="text-xs text-gray-600 mb-2 flex items-center gap-1.5">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              风险因素
                            </Label>
                            <ul className="space-y-1">
                              {assignment.assessment.risks.map((risk, index) => (
                                <li key={index} className="text-xs text-gray-700 flex gap-1.5">
                                  <span className="text-red-500">•</span>
                                  {risk}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {assignment.assessment.technicalChallenges.length > 0 && (
                          <div>
                            <Label className="text-xs text-gray-600 mb-2 flex items-center gap-1.5">
                              <Target className="w-3.5 h-3.5" />
                              技术挑战
                            </Label>
                            <ul className="space-y-1">
                              {assignment.assessment.technicalChallenges.map((challenge, index) => (
                                <li key={index} className="text-xs text-gray-700 flex gap-1.5">
                                  <span className="text-orange-500">•</span>
                                  {challenge}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 进度信息 */}
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-xs text-gray-600 flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5" />
                        完成进度
                      </Label>
                      <div className="flex items-center gap-3 text-xs">
                        {assignment.progress.currentValue && (
                          <span className="text-gray-600">
                            当前值: <span className="text-gray-900">{assignment.progress.currentValue}</span>
                          </span>
                        )}
                        <span className="text-blue-600">
                          达成率: {assignment.progress.achievementRate.toFixed(1)}%
                        </span>
                        <Badge
                          className={
                            assignment.progress.trend === 'improving'
                              ? 'bg-green-100 text-green-700'
                              : assignment.progress.trend === 'declining'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-700'
                          }
                        >
                          {assignment.progress.trend === 'improving'
                            ? '改善中'
                            : assignment.progress.trend === 'declining'
                            ? '下降'
                            : '稳定'}
                        </Badge>
                      </div>
                    </div>
                    <Progress value={assignment.progress.achievementRate} className="h-2" />
                  </div>

                  {/* 验证方式 */}
                  <div className="pt-4 border-t">
                    <Label className="text-xs text-gray-600 mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      验证方式
                    </Label>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {assignment.verificationMethod === 'simulation'
                          ? '仿真验证'
                          : assignment.verificationMethod === 'test'
                          ? '测试验证'
                          : assignment.verificationMethod === 'analysis'
                          ? '分析验证'
                          : '计算验证'}
                      </Badge>
                      {assignment.verificationWorkflowId && (
                        <span className="text-xs text-gray-600">
                          工作流ID: {assignment.verificationWorkflowId}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
