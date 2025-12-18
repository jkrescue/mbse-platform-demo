/**
 * 按项目阶段展示任务的看板视图
 * 支持拖拽排序和阶段切换
 */

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { ScrollArea } from '../ui/scroll-area'
import {
  Calendar,
  Users,
  Target,
  AlertCircle,
  CheckCircle2,
  Clock,
  Package
} from 'lucide-react@0.487.0'
import { Milestone } from '../../types/project'
import { Task, TaskStatus, TaskPriority } from '../../types/task'
import { taskService } from '../../services/TaskService'

interface PhaseTaskBoardProps {
  projectId: string
  phases: Milestone[]
  onTaskClick: (task: Task) => void
}

export function PhaseTaskBoard({ projectId, phases, onTaskClick }: PhaseTaskBoardProps) {
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

  const getPriorityIcon = (priority: TaskPriority) => {
    const icons: Record<TaskPriority, { icon: any; color: string }> = {
      critical: { icon: AlertCircle, color: 'text-red-600' },
      high: { icon: AlertCircle, color: 'text-orange-600' },
      medium: { icon: Clock, color: 'text-yellow-600' },
      low: { icon: CheckCircle2, color: 'text-gray-400' }
    }
    return icons[priority]
  }

  const getPhaseColor = (phaseStatus: Milestone['status']) => {
    const colors = {
      pending: 'border-l-gray-300 bg-gray-50',
      inprogress: 'border-l-blue-500 bg-blue-50/50',
      completed: 'border-l-green-500 bg-green-50/50',
      delayed: 'border-l-red-500 bg-red-50/50'
    }
    return colors[phaseStatus]
  }

  return (
    <div className="h-full overflow-hidden">
      <ScrollArea className="h-full">
        <div className="p-6">
          <div className="grid grid-cols-4 gap-6">
            {phases.map(phase => {
              const phaseTasks = taskService.getTasksByPhase(projectId, phase.id)
              const phaseStats = taskService.getTaskStatistics(projectId, phase.id)

              return (
                <div key={phase.id} className="flex flex-col h-full">
                  <Card className={`border-l-4 ${getPhaseColor(phase.status)} mb-4`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{phase.name}</CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {phaseTasks.length}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600 mt-2">
                        <Calendar className="w-3.5 h-3.5" />
                        {phase.targetDate}
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                          <span>阶段进度</span>
                          <span>{phase.progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full transition-all"
                            style={{ width: `${phase.progress}%` }}
                          />
                        </div>
                      </div>
                    </CardHeader>
                  </Card>

                  <ScrollArea className="flex-1">
                    <div className="space-y-3 pr-1">
                      {phaseTasks.map(task => {
                        const PriorityIconComponent = getPriorityIcon(task.priority).icon
                        const priorityColor = getPriorityIcon(task.priority).color

                        return (
                          <Card
                            key={task.id}
                            className="cursor-pointer hover:shadow-lg transition-all border-l-4"
                            style={{
                              borderLeftColor:
                                task.status === 'in_progress'
                                  ? '#3b82f6'
                                  : task.status === 'completed'
                                  ? '#10b981'
                                  : task.status === 'blocked'
                                  ? '#ef4444'
                                  : '#d1d5db'
                            }}
                            onClick={() => onTaskClick(task)}
                          >
                            <CardContent className="p-4">
                              {/* 任务头部 */}
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <PriorityIconComponent
                                      className={`w-3.5 h-3.5 ${priorityColor}`}
                                    />
                                    <span className="text-xs text-gray-500">{task.code}</span>
                                  </div>
                                  <h4 className="text-sm text-gray-900 line-clamp-2">
                                    {task.name}
                                  </h4>
                                </div>
                              </div>

                              {/* 状态标签 */}
                              <Badge className={`${getStatusColor(task.status)} text-xs mb-3`}>
                                {getStatusText(task.status)}
                              </Badge>

                              {/* 任务信息 */}
                              <div className="space-y-2 text-xs text-gray-600">
                                <div className="flex items-center gap-1.5">
                                  <Users className="w-3.5 h-3.5" />
                                  <span className="truncate">{task.assignee.userName}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="w-3.5 h-3.5" />
                                  <span>{task.dueDate}</span>
                                </div>
                                {task.metricAssignments.length > 0 && (
                                  <div className="flex items-center gap-1.5">
                                    <Target className="w-3.5 h-3.5" />
                                    <span>{task.metricAssignments.length} 个指标</span>
                                  </div>
                                )}
                                {task.modelSubmissions.length > 0 && (
                                  <div className="flex items-center gap-1.5">
                                    <Package className="w-3.5 h-3.5" />
                                    <span>{task.modelSubmissions.length} 个模型</span>
                                  </div>
                                )}
                              </div>

                              {/* 进度条 */}
                              <div className="mt-3">
                                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                                  <span>进度</span>
                                  <span>{task.progress}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-blue-600 rounded-full transition-all"
                                    style={{ width: `${task.progress}%` }}
                                  />
                                </div>
                              </div>

                              {/* 指标达成率 */}
                              {task.metricAssignments.length > 0 && (
                                <div className="mt-2 pt-2 border-t">
                                  <div className="text-xs text-gray-600">
                                    指标平均达成率:{' '}
                                    <span className="text-gray-900">
                                      {(
                                        task.metricAssignments.reduce(
                                          (sum, ma) => sum + ma.progress.achievementRate,
                                          0
                                        ) / task.metricAssignments.length
                                      ).toFixed(0)}
                                      %
                                    </span>
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  </ScrollArea>
                </div>
              )
            })}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
