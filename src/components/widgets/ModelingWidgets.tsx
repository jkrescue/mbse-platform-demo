import React from 'react'
import { Widget } from '../Widget'
import { Upload, FileText, AlertCircle, Clock, CheckCircle, Settings, ExternalLink, Package } from 'lucide-react@0.487.0'

// 我的建模任务Widget
export function ModelingTasksWidget() {
  const tasks = [
    { 
      id: '1', 
      project: 'BMS系统项目',
      model: 'BMS控制器模型',
      status: '开发中',
      deadline: '2024-03-20',
      progress: 75,
      priority: 'high'
    },
    { 
      id: '2', 
      project: '热管理项目',
      model: '热管理控制器模型',
      status: '待审核',
      deadline: '2024-03-18',
      progress: 95,
      priority: 'medium'
    },
    { 
      id: '3', 
      project: '智能驾驶项目',
      model: '传感器融合模型',
      status: '待开始',
      deadline: '2024-04-01',
      progress: 0,
      priority: 'low'
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case '开发中': return 'bg-blue-100 text-blue-800'
      case '待审核': return 'bg-yellow-100 text-yellow-800'
      case '待开始': return 'bg-gray-100 text-gray-800'
      case '已完成': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return '高优先级'
      case 'medium': return '中优先级'
      case 'low': return '低优先级'
      default: return '普通'
    }
  }

  return (
    <Widget id="modeling-tasks" title="我的建模任务" size="large">
      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-medium text-gray-900">{task.model}</h4>
                <p className="text-sm text-gray-600">{task.project}</p>
              </div>
              <div className="text-right">
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
                <div className={`text-xs mt-1 ${getPriorityColor(task.priority)}`}>
                  {getPriorityText(task.priority)}
                </div>
              </div>
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
                  className="h-2 bg-orange-500 rounded-full"
                  style={{ width: `${task.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="flex justify-end mt-3 space-x-2">
              <button className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200">
                编辑
              </button>
              <button className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200">
                上传
              </button>
            </div>
          </div>
        ))}
      </div>
    </Widget>
  )
}

// 缺失模型提示Widget
export function MissingModelsWidget() {
  const missingModels = [
    { 
      id: '1', 
      system: 'BMS系统',
      subsystem: '电池单体监测模块',
      architecture: 'BMS架构v2.3',
      assignee: '待分配',
      urgency: 'high'
    },
    { 
      id: '2', 
      system: '热管理系统',
      subsystem: '冷却液循环控制',
      architecture: '热管理架构v1.8',
      assignee: '陈工',
      urgency: 'medium'
    },
    { 
      id: '3', 
      system: '智能驾驶',
      subsystem: 'LIDAR数据处理',
      architecture: '传感器架构v3.1',
      assignee: '待分配',
      urgency: 'low'
    },
  ]

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'border-red-200 bg-red-50'
      case 'medium': return 'border-yellow-200 bg-yellow-50'
      case 'low': return 'border-green-200 bg-green-50'
      default: return 'border-gray-200 bg-gray-50'
    }
  }

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'high': return <AlertCircle className="w-4 h-4 text-red-500" />
      case 'medium': return <Clock className="w-4 h-4 text-yellow-500" />
      case 'low': return <CheckCircle className="w-4 h-4 text-green-500" />
      default: return <FileText className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <Widget id="missing-models" title="缺失模型提示" size="medium">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">架构中未建模子系统</span>
          <span className="text-2xl font-bold text-red-600">{missingModels.length}</span>
        </div>

        <div className="space-y-3">
          {missingModels.map((model) => (
            <div key={model.id} className={`border rounded-lg p-3 ${getUrgencyColor(model.urgency)}`}>
              <div className="flex items-start space-x-2 mb-2">
                {getUrgencyIcon(model.urgency)}
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{model.subsystem}</div>
                  <div className="text-sm text-gray-600">{model.system}</div>
                </div>
              </div>
              <div className="text-xs text-gray-600 mb-2">
                来源架构: {model.architecture}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  负责人: {model.assignee}
                </span>
                <button className="text-xs text-blue-600 hover:text-blue-800">
                  认领任务
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Widget>
  )
}

// 模型版本提醒Widget
export function ModelVersionAlertsWidget() {
  const versionAlerts = [
    { 
      id: '1', 
      model: 'BMS控制器模型v2.4',
      status: '待审核',
      submitTime: '2024-03-10 14:30',
      reviewer: '李工',
      changes: ['修复温度控制逻辑', '优化充电算法']
    },
    { 
      id: '2', 
      model: '热管理控制器v1.9',
      status: '审核中',
      submitTime: '2024-03-09 16:20',
      reviewer: '张工',
      changes: ['增加过热保护', '调整PID参数']
    },
    { 
      id: '3', 
      model: '传感器融合模型v3.2',
      status: '需修改',
      submitTime: '2024-03-08 11:15',
      reviewer: '王工',
      changes: ['接口定义不完整', '缺少异常处理']
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case '待审核': return 'bg-yellow-100 text-yellow-800'
      case '审核中': return 'bg-blue-100 text-blue-800'
      case '需修改': return 'bg-red-100 text-red-800'
      case '已通过': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Widget id="model-version-alerts" title="模型版本提醒" size="medium">
      <div className="space-y-3">
        {versionAlerts.map((alert) => (
          <div key={alert.id} className="border border-gray-200 rounded-lg p-3">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="font-medium text-gray-900 text-sm">{alert.model}</div>
                <div className="text-xs text-gray-600">{alert.submitTime}</div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(alert.status)}`}>
                {alert.status}
              </span>
            </div>
            
            <div className="text-xs text-gray-600 mb-2">
              审核人: {alert.reviewer}
            </div>
            
            <div className="space-y-1">
              <div className="text-xs font-medium text-gray-700">变更内容:</div>
              {alert.changes.map((change, index) => (
                <div key={index} className="text-xs text-gray-600 flex items-start space-x-1">
                  <span>•</span>
                  <span>{change}</span>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end mt-2">
              <button className="text-xs text-blue-600 hover:text-blue-800">
                查看详情
              </button>
            </div>
          </div>
        ))}
      </div>
    </Widget>
  )
}

// 快速入口Widget
export function ModelingQuickActionsWidget() {
  const actions = [
    { 
      id: '1', 
      name: '上传模型', 
      icon: Upload, 
      color: 'bg-blue-500 hover:bg-blue-600',
      description: '上传Simulink/Modelica' 
    },
    { 
      id: '2', 
      name: 'Simulink', 
      icon: ExternalLink, 
      color: 'bg-green-500 hover:bg-green-600',
      description: '打开MATLAB' 
    },
    { 
      id: '3', 
      name: 'Modelica', 
      icon: Settings, 
      color: 'bg-purple-500 hover:bg-purple-600',
      description: '打开Dymola' 
    },
    { 
      id: '4', 
      name: '模型库', 
      icon: Package, 
      color: 'bg-orange-500 hover:bg-orange-600',
      description: '个人模型空间' 
    },
  ]

  return (
    <Widget id="modeling-quick-actions" title="快速入口" size="medium">
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