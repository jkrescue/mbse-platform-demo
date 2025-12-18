/**
 * 任务详情面板
 * 展示任务详情、指标评估、模型提交等信息
 */

import { useState } from 'react'
import {
  X,
  Edit,
  Calendar,
  Users,
  Target,
  Package,
  TrendingUp,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  Activity
} from 'lucide-react@0.487.0'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { ScrollArea } from '../ui/scroll-area'
import { Progress } from '../ui/progress'
import { Task, TaskStatus, TaskPriority } from '../../types/task'
import { MetricAssessmentPanel } from './MetricAssessmentPanel'
import { TaskModelSubmissionPanel } from './TaskModelSubmissionPanel'
import { taskService } from '../../services/TaskService'

interface TaskDetailPanelProps {
  task: Task
  onClose: () => void
  onUpdate: () => void
}

export function TaskDetailPanel({ task, onClose, onUpdate }: TaskDetailPanelProps) {
  const [activeTab, setActiveTab] = useState('overview')
  
  const workflowAssessments = taskService.getWorkflowAssessments(task.id)

  const getStatusColor = (status: TaskStatus) => {
    const colors: Record<TaskStatus, string> = {
      not_started: 'bg-gray-100 text-gray-700 border-gray-200',
      in_progress: 'bg-blue-100 text-blue-700 border-blue-200',
      under_review: 'bg-purple-100 text-purple-700 border-purple-200',
      completed: 'bg-green-100 text-green-700 border-green-200',
      blocked: 'bg-red-100 text-red-700 border-red-200',
      cancelled: 'bg-gray-100 text-gray-600 border-gray-200'
    }
    return colors[status]
  }

  const getStatusText = (status: TaskStatus) => {
    const texts: Record<TaskStatus, string> = {
      not_started: '未开始',
      in_progress: '进行中',
      under_review: '审核中',
      completed: '已完成',
      blocked: '阻塞',
      cancelled: '已取消'
    }
    return texts[status]
  }

  const getPriorityText = (priority: TaskPriority) => {
    const texts: Record<TaskPriority, string> = {
      critical: '紧急',
      high: '高',
      medium: '中',
      low: '低'
    }
    return texts[priority]
  }

  const getPriorityColor = (priority: TaskPriority) => {
    const colors: Record<TaskPriority, string> = {
      critical: 'bg-red-100 text-red-700 border-red-300',
      high: 'bg-orange-100 text-orange-700 border-orange-300',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      low: 'bg-gray-100 text-gray-600 border-gray-300'
    }
    return colors[priority]
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* 头部 */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm text-gray-600">{task.code}</span>
              <Badge className={getPriorityColor(task.priority)}>
                {getPriorityText(task.priority)}
              </Badge>
              <Badge className={getStatusColor(task.status)}>
                {getStatusText(task.status)}
              </Badge>
            </div>
            <h2 className="text-gray-900">{task.name}</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <div className="border-b px-6">
            <TabsList className="w-full justify-start bg-transparent">
              <TabsTrigger value="overview" className="gap-2">
                <FileText className="w-4 h-4" />
                概览
              </TabsTrigger>
              <TabsTrigger value="metrics" className="gap-2">
                <Target className="w-4 h-4" />
                指标评估 ({task.metricAssignments.length})
              </TabsTrigger>
              <TabsTrigger value="models" className="gap-2">
                <Package className="w-4 h-4" />
                模型提交 ({task.modelSubmissions.length})
              </TabsTrigger>
              <TabsTrigger value="workflow" className="gap-2">
                <Activity className="w-4 h-4" />
                工作流评估 ({workflowAssessments.length})
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="flex-1">
            {/* 概览 */}
            <TabsContent value="overview" className="p-6 m-0">
              <div className="grid grid-cols-3 gap-6">
                {/* 左侧：任务信息 */}
                <div className="col-span-2 space-y-6">
                  {/* 基本信息 */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">基本信息</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-sm text-gray-600">任务描述</Label>
                        <p className="text-gray-900 mt-1">{task.description}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm text-gray-600">所属阶段</Label>
                          <p className="text-gray-900 mt-1">{task.phaseName}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600">任务类型</Label>
                          <p className="text-gray-900 mt-1 capitalize">{task.type}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 进度信息 */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">进度信息</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">任务进度</span>
                          <span className="text-gray-900">{task.progress}%</span>
                        </div>
                        <Progress value={task.progress} className="h-2" />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label className="text-sm text-gray-600">预计工时</Label>
                          <p className="text-gray-900 mt-1">{task.estimatedHours}h</p>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600">实际工时</Label>
                          <p className="text-gray-900 mt-1">{task.actualHours || 0}h</p>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600">工时偏差</Label>
                          <p
                            className={`mt-1 ${
                              (task.actualHours || 0) > task.estimatedHours
                                ? 'text-red-600'
                                : 'text-green-600'
                            }`}
                          >
                            {task.actualHours
                              ? `${task.actualHours - task.estimatedHours > 0 ? '+' : ''}${
                                  task.actualHours - task.estimatedHours
                                }h`
                              : '-'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 交付物 */}
                  {task.deliverables.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">交付物</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {task.deliverables.map((deliverable, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 border rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                <CheckCircle2
                                  className={`w-4 h-4 ${
                                    deliverable.status === 'completed'
                                      ? 'text-green-600'
                                      : 'text-gray-400'
                                  }`}
                                />
                                <span className="text-sm text-gray-900">{deliverable.name}</span>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {deliverable.status === 'completed'
                                  ? '已完成'
                                  : deliverable.status === 'in_progress'
                                  ? '进行中'
                                  : '待开始'}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* 右侧：人员与时间 */}
                <div className="space-y-6">
                  {/* 人员信息 */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        人员信息
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-sm text-gray-600">负责人</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm text-blue-600">
                              {task.assignee.userName.slice(0, 1)}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm text-gray-900">{task.assignee.userName}</p>
                            <p className="text-xs text-gray-500">{task.assignee.role}</p>
                          </div>
                        </div>
                      </div>
                      {task.collaborators.length > 0 && (
                        <div>
                          <Label className="text-sm text-gray-600">协作者</Label>
                          <div className="space-y-2 mt-1">
                            {task.collaborators.map(collaborator => (
                              <div key={collaborator.userId} className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                                  <span className="text-xs text-gray-600">
                                    {collaborator.userName.slice(0, 1)}
                                  </span>
                                </div>
                                <span className="text-sm text-gray-700">
                                  {collaborator.userName}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* 时间信息 */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        时间信息
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label className="text-sm text-gray-600">计划开始</Label>
                        <p className="text-sm text-gray-900 mt-1">{task.startDate}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">计划完成</Label>
                        <p className="text-sm text-gray-900 mt-1">{task.dueDate}</p>
                      </div>
                      {task.actualStartDate && (
                        <div>
                          <Label className="text-sm text-gray-600">实际开始</Label>
                          <p className="text-sm text-gray-900 mt-1">{task.actualStartDate}</p>
                        </div>
                      )}
                      {task.actualEndDate && (
                        <div>
                          <Label className="text-sm text-gray-600">实际完成</Label>
                          <p className="text-sm text-gray-900 mt-1">{task.actualEndDate}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* 指标评估 */}
            <TabsContent value="metrics" className="p-6 m-0">
              <MetricAssessmentPanel task={task} onUpdate={onUpdate} />
            </TabsContent>

            {/* 模型提交 */}
            <TabsContent value="models" className="p-6 m-0">
              <TaskModelSubmissionPanel task={task} onUpdate={onUpdate} />
            </TabsContent>

            {/* 工作流评估 */}
            <TabsContent value="workflow" className="p-6 m-0">
              <div className="space-y-4">
                {workflowAssessments.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Activity className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>暂无工作流评估记录</p>
                    <p className="text-sm mt-2">执行工作流后将自动生成评估报告</p>
                  </div>
                ) : (
                  workflowAssessments.map(assessment => (
                    <Card key={assessment.executionId}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">{assessment.workflowName}</CardTitle>
                          <Badge variant="outline">{assessment.executedAt.split('T')[0]}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label className="text-sm text-gray-600">评估总结</Label>
                          <p className="text-sm text-gray-900 mt-1">
                            {assessment.overallAssessment}
                          </p>
                        </div>

                        <div>
                          <Label className="text-sm text-gray-600 mb-2 block">指标评估结果</Label>
                          <div className="space-y-2">
                            {assessment.assessedMetrics.map(metric => (
                              <div key={metric.metricId} className="border rounded-lg p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm text-gray-900">{metric.metricName}</span>
                                  <Badge
                                    className={
                                      metric.assessment === 'meets_target' ||
                                      metric.assessment === 'exceeds_target'
                                        ? 'bg-green-100 text-green-700'
                                        : metric.assessment === 'near_target'
                                        ? 'bg-yellow-100 text-yellow-700'
                                        : 'bg-red-100 text-red-700'
                                    }
                                  >
                                    {metric.assessment === 'meets_target'
                                      ? '达标'
                                      : metric.assessment === 'exceeds_target'
                                      ? '超越目标'
                                      : metric.assessment === 'near_target'
                                      ? '接近目标'
                                      : '低于目标'}
                                  </Badge>
                                </div>
                                <div className="grid grid-cols-3 gap-3 text-xs">
                                  <div>
                                    <span className="text-gray-600">仿真值: </span>
                                    <span className="text-gray-900">{metric.simulatedValue}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">目标值: </span>
                                    <span className="text-gray-900">{metric.targetValue}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">偏差: </span>
                                    <span
                                      className={
                                        metric.deviation >= 0 ? 'text-green-600' : 'text-red-600'
                                      }
                                    >
                                      {metric.deviationPercent > 0 ? '+' : ''}
                                      {metric.deviationPercent.toFixed(1)}%
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {assessment.nextSteps.length > 0 && (
                          <div>
                            <Label className="text-sm text-gray-600 mb-2 block">下一步行动</Label>
                            <ul className="space-y-1">
                              {assessment.nextSteps.map((step, index) => (
                                <li key={index} className="text-sm text-gray-700 flex gap-2">
                                  <span className="text-blue-600">•</span>
                                  {step}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>
    </div>
  )
}

function Label({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`text-sm text-gray-600 ${className}`}>{children}</div>
}
