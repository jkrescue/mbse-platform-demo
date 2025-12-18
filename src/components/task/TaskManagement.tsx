/**
 * 任务管理主页面
 * 集成任务列表、看板视图、统计等功能
 */

import { useState } from 'react'
import {
  Plus,
  List,
  LayoutGrid,
  Filter,
  Calendar,
  Users,
  Target,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react@0.487.0'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Badge } from '../ui/badge'
import { taskService } from '../../services/TaskService'
import { Task, TaskFilter, TaskStatus, TaskPriority } from '../../types/task'
import { TaskCreationDialog } from './TaskCreationDialog'
import { TaskDetailPanel } from './TaskDetailPanel'
import { PhaseTaskBoard } from './PhaseTaskBoard'
import { projectService } from '../../services/ProjectService'

interface TaskManagementProps {
  projectId: string
}

export function TaskManagement({ projectId }: TaskManagementProps) {
  const [view, setView] = useState<'list' | 'board'>('board')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [filter, setFilter] = useState<TaskFilter>({ projectId })

  const project = projectService.getProject(projectId)
  const tasks = taskService.getTasksByProject(projectId, filter)
  const stats = taskService.getTaskStatistics(projectId)

  if (!project) {
    return <div className="text-center py-12 text-gray-600">项目不存在</div>
  }

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

  const getPriorityColor = (priority: TaskPriority) => {
    const colors: Record<TaskPriority, string> = {
      critical: 'bg-red-100 text-red-700 border-red-300',
      high: 'bg-orange-100 text-orange-700 border-orange-300',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      low: 'bg-gray-100 text-gray-600 border-gray-300'
    }
    return colors[priority]
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

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* 头部 */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-gray-900">任务管理</h2>
            <p className="text-sm text-gray-600 mt-1">{project.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <Button
                variant={view === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('list')}
                className="gap-1.5"
              >
                <List className="w-4 h-4" />
                列表
              </Button>
              <Button
                variant={view === 'board' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('board')}
                className="gap-1.5"
              >
                <LayoutGrid className="w-4 h-4" />
                看板
              </Button>
            </div>
            <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              创建任务
            </Button>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">总任务数</p>
                  <p className="text-2xl text-gray-900 mt-1">{stats.totalTasks}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <List className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">进行中</p>
                  <p className="text-2xl text-blue-600 mt-1">{stats.byStatus.in_progress}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">已完成</p>
                  <p className="text-2xl text-green-600 mt-1">{stats.byStatus.completed}</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">完成率</p>
                  <p className="text-2xl text-gray-900 mt-1">{stats.completionRate.toFixed(0)}%</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">关联指标</p>
                  <p className="text-2xl text-orange-600 mt-1">{stats.metricsCount}</p>
                </div>
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">提交模型</p>
                  <p className="text-2xl text-teal-600 mt-1">{stats.modelsCount}</p>
                </div>
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-teal-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="flex-1 overflow-hidden">
        {view === 'board' ? (
          <PhaseTaskBoard
            projectId={projectId}
            phases={project.milestones}
            onTaskClick={setSelectedTask}
          />
        ) : (
          <div className="p-6 overflow-auto h-full">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>任务列表</CardTitle>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="w-4 h-4" />
                    筛选
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tasks.map(task => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-4 bg-white border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedTask(task)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm text-gray-500">{task.code}</span>
                          <h4 className="text-gray-900">{task.name}</h4>
                          <Badge className={getPriorityColor(task.priority)}>
                            {getPriorityText(task.priority)}
                          </Badge>
                          <Badge className={getStatusColor(task.status)}>
                            {getStatusText(task.status)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <div className="flex items-center gap-1.5">
                            <Users className="w-4 h-4" />
                            {task.assignee.userName}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            {task.dueDate}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Target className="w-4 h-4" />
                            {task.metricAssignments.length} 个指标
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-600">进度</p>
                          <p className="text-gray-900">{task.progress}%</p>
                        </div>
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full transition-all"
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* 创建任务对话框 */}
      {showCreateDialog && (
        <TaskCreationDialog
          projectId={projectId}
          onClose={() => setShowCreateDialog(false)}
          onSuccess={() => {
            setShowCreateDialog(false)
            window.location.reload()
          }}
        />
      )}

      {/* 任务详情面板 */}
      {selectedTask && (
        <TaskDetailPanel
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={() => {
            setSelectedTask(null)
            window.location.reload()
          }}
        />
      )}
    </div>
  )
}
