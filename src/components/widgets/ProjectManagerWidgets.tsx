import React from 'react'
import { Widget } from '../Widget'
import { Calendar, Users, Clock, AlertCircle, Plus, UserCheck, TrendingDown, CheckCircle } from 'lucide-react@0.487.0'

// 我的项目进度Widget
export function MyProjectsWidget() {
  const projects = [
    { 
      id: '1', 
      name: '新能源汽车BMS系统', 
      progress: 75, 
      status: '进行中',
      deadline: '2024-03-15',
      team: 8,
      risk: 'low'
    },
    { 
      id: '2', 
      name: '智能驾驶控制系统', 
      progress: 60, 
      status: '进行中',
      deadline: '2024-04-20',
      team: 12,
      risk: 'medium'
    },
    { 
      id: '3', 
      name: '电池热管理系统', 
      progress: 30, 
      status: '设计阶段',
      deadline: '2024-05-10',
      team: 6,
      risk: 'high'
    },
  ]

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRiskText = (risk: string) => {
    switch (risk) {
      case 'low': return '低风险'
      case 'medium': return '中风险'
      case 'high': return '高风险'
      default: return '未知'
    }
  }

  return (
    <Widget id="my-projects" title="我的项目进度" size="large">
      <div className="space-y-4">
        {projects.map((project) => (
          <div key={project.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">{project.name}</h4>
              <span className={`text-xs px-2 py-1 rounded-full ${getRiskColor(project.risk)}`}>
                {getRiskText(project.risk)}
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{project.deadline}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{project.team} 人</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{project.status}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">进度</span>
                <span className="font-medium">{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 bg-blue-500 rounded-full"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Widget>
  )
}

// 跨项目燃尽图Widget
export function ProjectBurndownWidget() {
  const burndownData = [
    { date: '本周一', planned: 100, actual: 95, completed: 85 },
    { date: '本周二', planned: 85, actual: 82, completed: 78 },
    { date: '本周三', planned: 70, actual: 75, completed: 65 },
    { date: '本周四', planned: 55, actual: 60, completed: 52 },
    { date: '本周五', planned: 40, actual: 45, completed: 38 },
  ]

  return (
    <Widget id="project-burndown" title="跨项目燃尽图" size="large">
      <div className="space-y-4">
        {/* 统计摘要 */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-xl font-bold text-blue-600">156</div>
            <div className="text-sm text-gray-600">总任务数</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-xl font-bold text-green-600">118</div>
            <div className="text-sm text-gray-600">已完成</div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="text-xl font-bold text-red-600">8</div>
            <div className="text-sm text-gray-600">延误任务</div>
          </div>
        </div>

        {/* 趋势图表 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm font-medium">
            <span>任务完成趋势</span>
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-1 bg-blue-500 rounded"></div>
                <span>计划</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-1 bg-green-500 rounded"></div>
                <span>实际</span>
              </div>
            </div>
          </div>
          
          {burndownData.map((data, index) => (
            <div key={data.date} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{data.date}</span>
                <span className="text-gray-900">{data.completed}/{data.planned}</span>
              </div>
              <div className="flex space-x-1">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 bg-blue-300 rounded-full"
                    style={{ width: '100%' }}
                  ></div>
                  <div 
                    className="h-2 bg-green-500 rounded-full -mt-2"
                    style={{ width: `${(data.completed / data.planned) * 100}%` }}
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

// 审批状态Widget
export function ApprovalStatusWidget() {
  const approvals = [
    { 
      id: '1', 
      type: '模型审核', 
      item: 'BMS控制器模型v2.1', 
      submitter: '陈工',
      time: '2小时前',
      urgent: true 
    },
    { 
      id: '2', 
      type: '资源申请', 
      item: '仿真服务器资源申请', 
      submitter: '王工',
      time: '4小时前',
      urgent: false 
    },
    { 
      id: '3', 
      type: '架构变更', 
      item: '热管理系统架构调整', 
      submitter: '李工',
      time: '1天前',
      urgent: true 
    },
  ]

  return (
    <Widget id="approval-status" title="审批状态" size="medium">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">待审批事项</span>
          <span className="text-2xl font-bold text-orange-600">{approvals.length}</span>
        </div>

        <div className="space-y-3">
          {approvals.map((approval) => (
            <div key={approval.id} className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">{approval.type}</span>
                  {approval.urgent && (
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                      紧急
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-500">{approval.time}</span>
              </div>
              <div className="text-sm text-gray-600 mb-2">{approval.item}</div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">提交人: {approval.submitter}</span>
                <button className="text-xs text-blue-600 hover:text-blue-800">
                  处理
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Widget>
  )
}

// 风险提醒Widget
export function RiskAlertsWidget() {
  const risks = [
    { 
      id: '1', 
      level: 'high', 
      project: 'BMS系统项目',
      issue: '关键模型开发进度延误', 
      impact: '可能影响整体交付时间',
      time: '30分钟前' 
    },
    { 
      id: '2', 
      level: 'medium', 
      project: '智能驾驶项目',
      issue: '仿真验证资源不足', 
      impact: '需要协调额外计算资源',
      time: '2小时前' 
    },
  ]

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'border-red-200 bg-red-50'
      case 'medium': return 'border-yellow-200 bg-yellow-50'
      case 'low': return 'border-green-200 bg-green-50'
      default: return 'border-gray-200 bg-gray-50'
    }
  }

  const getRiskIcon = (level: string) => {
    return <AlertCircle className={`w-4 h-4 ${
      level === 'high' ? 'text-red-500' : 
      level === 'medium' ? 'text-yellow-500' : 'text-green-500'
    }`} />
  }

  return (
    <Widget id="risk-alerts" title="风险提醒" size="medium">
      <div className="space-y-3">
        {risks.map((risk) => (
          <div key={risk.id} className={`border rounded-lg p-3 ${getRiskColor(risk.level)}`}>
            <div className="flex items-start space-x-2 mb-2">
              {getRiskIcon(risk.level)}
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">{risk.project}</div>
                <div className="text-sm text-gray-700">{risk.issue}</div>
              </div>
            </div>
            <div className="text-xs text-gray-600 mb-2">{risk.impact}</div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{risk.time}</span>
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

// 快速操作入口Widget
export function QuickActionsWidget() {
  const actions = [
    { 
      id: '1', 
      name: '新建项目', 
      icon: Plus, 
      color: 'bg-blue-500 hover:bg-blue-600',
      description: '创建新项目' 
    },
    { 
      id: '2', 
      name: '分配任务', 
      icon: UserCheck, 
      color: 'bg-green-500 hover:bg-green-600',
      description: '任务分配管理' 
    },
    { 
      id: '3', 
      name: '团队管理', 
      icon: Users, 
      color: 'bg-purple-500 hover:bg-purple-600',
      description: '成员权限管理' 
    },
    { 
      id: '4', 
      name: '进度报告', 
      icon: TrendingDown, 
      color: 'bg-orange-500 hover:bg-orange-600',
      description: '生成项目报告' 
    },
  ]

  return (
    <Widget id="quick-actions" title="快速操作入口" size="medium">
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