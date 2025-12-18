import React from 'react'
import { Widget } from '../Widget'
import { FileText, Settings, Upload, ExternalLink, Archive, GitBranch, Clock, CheckCircle } from 'lucide-react@0.487.0'

// 我的建模任务Widget
export function ArchitectTasksWidget() {
  const tasks = [
    { 
      id: '1', 
      project: 'BMS系统项目',
      task: 'BMS系统架构设计',
      status: '进行中',
      deadline: '2024-03-20',
      progress: 65
    },
    { 
      id: '2', 
      project: '智能驾驶项目',
      task: '传感器融合架构',
      status: '待审核',
      deadline: '2024-03-15',
      progress: 90
    },
    { 
      id: '3', 
      project: '热管理项目',
      task: '热管理控制架构',
      status: '待开始',
      deadline: '2024-04-01',
      progress: 0
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case '进行中': return 'bg-blue-100 text-blue-800'
      case '待审核': return 'bg-yellow-100 text-yellow-800'
      case '待开始': return 'bg-gray-100 text-gray-800'
      case '已完成': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Widget id="architect-tasks" title="我的建模任务" size="large">
      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-medium text-gray-900">{task.task}</h4>
                <p className="text-sm text-gray-600">{task.project}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(task.status)}`}>
                {task.status}
              </span>
            </div>
            
            <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{task.deadline}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">完成进度</span>
                <span className="font-medium">{task.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 bg-purple-500 rounded-full"
                  style={{ width: `${task.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Widget>
  )
}

// 待审架构模型Widget
export function PendingArchitectureWidget() {
  const pendingModels = [
    { 
      id: '1', 
      name: 'BMS控制架构v2.3',
      submitter: '李工',
      submitTime: '2024-03-10',
      type: 'SysML模型',
      size: '2.4MB'
    },
    { 
      id: '2', 
      name: '热管理系统架构v1.8',
      submitter: '张工',
      submitTime: '2024-03-09',
      type: 'EA模型',
      size: '1.8MB'
    },
    { 
      id: '3', 
      name: '传感器融合架构v3.1',
      submitter: '王工',
      submitTime: '2024-03-08',
      type: 'SysML模型',
      size: '3.2MB'
    },
  ]

  return (
    <Widget id="pending-architecture" title="待审架构模型" size="medium">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">待审核模型</span>
          <span className="text-2xl font-bold text-purple-600">{pendingModels.length}</span>
        </div>

        <div className="space-y-3">
          {pendingModels.map((model) => (
            <div key={model.id} className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-medium text-gray-900 text-sm">{model.name}</div>
                  <div className="text-xs text-gray-600">{model.type} • {model.size}</div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">提交人: {model.submitter}</span>
                <span className="text-gray-500">{model.submitTime}</span>
              </div>
              <div className="mt-2 flex space-x-2">
                <button className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200">
                  通过
                </button>
                <button className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200">
                  驳回
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Widget>
  )
}

// 建模状态图Widget
export function ModelingStatusWidget() {
  const statusData = [
    { status: '设计中', count: 12, color: 'bg-blue-500' },
    { status: '待审核', count: 5, color: 'bg-yellow-500' },
    { status: '已发布', count: 28, color: 'bg-green-500' },
    { status: '需修改', count: 3, color: 'bg-red-500' },
  ]

  const totalModels = statusData.reduce((sum, item) => sum + item.count, 0)

  return (
    <Widget id="modeling-status" title="建模状态图" size="medium">
      <div className="space-y-4">
        {/* 总数统计 */}
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">{totalModels}</div>
          <div className="text-sm text-gray-600">总模型数</div>
        </div>

        {/* 状态分布 */}
        <div className="space-y-3">
          {statusData.map((item) => (
            <div key={item.status} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded ${item.color}`}></div>
                <span className="text-sm text-gray-700">{item.status}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">{item.count}</span>
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${item.color}`}
                    style={{ width: `${(item.count / totalModels) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Widget>
  )
}

// 最近架构活动Widget
export function RecentArchitectureActivityWidget() {
  const activities = [
    { 
      id: '1', 
      action: '提交架构',
      model: 'BMS控制器架构v2.3',
      user: '李工',
      time: '2小时前',
      type: 'submit'
    },
    { 
      id: '2', 
      action: '审核通过',
      model: '热管理系统架构v1.7',
      user: '系统',
      time: '4小时前',
      type: 'approve'
    },
    { 
      id: '3', 
      action: '导出SSP',
      model: '传感器融合架构v3.0',
      user: '王工',
      time: '1天前',
      type: 'export'
    },
    { 
      id: '4', 
      action: '创建分支',
      model: 'BMS架构主分支',
      user: '张工',
      time: '1天前',
      type: 'branch'
    },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'submit': return <Upload className="w-4 h-4 text-blue-500" />
      case 'approve': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'export': return <ExternalLink className="w-4 h-4 text-purple-500" />
      case 'branch': return <GitBranch className="w-4 h-4 text-orange-500" />
      default: return <FileText className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <Widget id="recent-activity" title="最近架构活动" size="medium">
      <div className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50">
            {getActivityIcon(activity.type)}
            <div className="flex-1 min-w-0">
              <div className="text-sm">
                <span className="font-medium text-gray-900">{activity.action}</span>
                <span className="text-gray-600 ml-1">{activity.model}</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-gray-500">{activity.user}</span>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Widget>
  )
}

// 快速入口Widget
export function ArchitectQuickActionsWidget() {
  const actions = [
    { 
      id: '1', 
      name: '上传架构', 
      icon: Upload, 
      color: 'bg-blue-500 hover:bg-blue-600',
      description: '上传SysML模型' 
    },
    { 
      id: '2', 
      name: '打开EA', 
      icon: ExternalLink, 
      color: 'bg-green-500 hover:bg-green-600',
      description: '启动EA工具' 
    },
    { 
      id: '3', 
      name: '导出SSP', 
      icon: Archive, 
      color: 'bg-purple-500 hover:bg-purple-600',
      description: '导出SSP文件' 
    },
    { 
      id: '4', 
      name: '架构模板', 
      icon: FileText, 
      color: 'bg-orange-500 hover:bg-orange-600',
      description: '管理模板库' 
    },
  ]

  return (
    <Widget id="architect-quick-actions" title="快速入口" size="medium">
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <button
            key={action.id}
            className={`${action.color} text-white p-4 rounded-lg transition-colors group`}
          >
            <div className="flex flex-col items-center space-y-2">
              <action.icon className="w-6 h-6" />
              <span className="text-sm font-medium">{action.name}</span>
            </div>
          </button>
        ))}
      </div>
    </Widget>
  )
}