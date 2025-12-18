import React from 'react'
import { Widget } from '../Widget'
import { Play, Pause, BarChart3, AlertTriangle, Settings, Database, TrendingUp, Activity } from 'lucide-react@0.487.0'

// 仿真执行历史Widget
export function SimulationHistoryWidget() {
  const simulations = [
    { 
      id: '1', 
      name: 'BMS热管理仿真验证',
      status: '已完成',
      startTime: '2024-03-10 14:30',
      duration: '25分钟',
      result: 'passed',
      progress: 100
    },
    { 
      id: '2', 
      name: '电池包碰撞安全仿真',
      status: '运行中',
      startTime: '2024-03-11 09:15',
      duration: '执行中',
      result: 'running',
      progress: 68
    },
    { 
      id: '3', 
      name: '整车动力学性能仿真',
      status: '排队中',
      startTime: '待启动',
      duration: '预计45分钟',
      result: 'pending',
      progress: 0
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case '已完成': return 'bg-green-100 text-green-800'
      case '运行中': return 'bg-blue-100 text-blue-800'
      case '排队中': return 'bg-yellow-100 text-yellow-800'
      case '失败': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getResultIcon = (result: string) => {
    switch (result) {
      case 'passed': return <Activity className="w-4 h-4 text-green-500" />
      case 'running': return <Play className="w-4 h-4 text-blue-500" />
      case 'pending': return <Pause className="w-4 h-4 text-yellow-500" />
      case 'failed': return <AlertTriangle className="w-4 h-4 text-red-500" />
      default: return <Activity className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <Widget id="simulation-history" title="仿真执行历史" size="large">
      <div className="space-y-4">
        {simulations.map((sim) => (
          <div key={sim.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                {getResultIcon(sim.result)}
                <h4 className="font-medium text-gray-900">{sim.name}</h4>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(sim.status)}`}>
                {sim.status}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-3 text-sm text-gray-600">
              <div>开始时间: {sim.startTime}</div>
              <div>耗时: {sim.duration}</div>
            </div>
            
            {sim.status === '运行中' && (
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">执行进度</span>
                  <span className="font-medium">{sim.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 bg-blue-500 rounded-full"
                    style={{ width: `${sim.progress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Widget>
  )
}

// 指标预警Widget
export function SimulationAlertsWidget() {
  const alerts = [
    { 
      id: '1', 
      simulation: 'BMS热管理仿真',
      metric: '电池温度',
      value: '65°C',
      threshold: '60°C',
      level: 'warning',
      time: '5分钟前'
    },
    { 
      id: '2', 
      simulation: '碰撞安全仿真',
      metric: '变形量',
      value: '150mm',
      threshold: '120mm',
      level: 'critical',
      time: '10分钟前'
    },
    { 
      id: '3', 
      simulation: '动力学仿真',
      metric: '加速度',
      value: '0.85g',
      threshold: '1.0g',
      level: 'normal',
      time: '15分钟前'
    },
  ]

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'critical': return 'border-red-200 bg-red-50'
      case 'warning': return 'border-yellow-200 bg-yellow-50'
      case 'normal': return 'border-green-200 bg-green-50'
      default: return 'border-gray-200 bg-gray-50'
    }
  }

  const getAlertIcon = (level: string) => {
    switch (level) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-500" />
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'normal': return <Activity className="w-4 h-4 text-green-500" />
      default: return <Activity className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <Widget id="simulation-alerts" title="指标预警" size="medium">
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div key={alert.id} className={`border rounded-lg p-3 ${getAlertColor(alert.level)}`}>
            <div className="flex items-start space-x-2 mb-2">
              {getAlertIcon(alert.level)}
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">{alert.metric}</div>
                <div className="text-sm text-gray-600">{alert.simulation}</div>
              </div>
            </div>
            <div className="text-sm">
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">当前值:</span>
                <span className="font-medium">{alert.value}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">阈值:</span>
                <span className="font-medium">{alert.threshold}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{alert.time}</span>
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

// 我的FMU管理Widget
export function FMUManagementWidget() {
  const fmuModels = [
    { 
      id: '1', 
      name: 'BMS_Controller_v2.3.fmu',
      version: 'v2.3',
      size: '2.4MB',
      lastModified: '2024-03-10',
      status: '已验证'
    },
    { 
      id: '2', 
      name: 'ThermalManagement_v1.8.fmu',
      version: 'v1.8',
      size: '1.9MB',
      lastModified: '2024-03-09',
      status: '待验证'
    },
    { 
      id: '3', 
      name: 'BatteryPack_Model_v3.1.fmu',
      version: 'v3.1',
      size: '3.2MB',
      lastModified: '2024-03-08',
      status: '已验证'
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case '已验证': return 'bg-green-100 text-green-800'
      case '待验证': return 'bg-yellow-100 text-yellow-800'
      case '验证失败': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Widget id="fmu-management" title="我的FMU管理" size="medium">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">FMU模型文件</span>
          <span className="text-sm text-gray-600">{fmuModels.length} 个文件</span>
        </div>

        <div className="space-y-2">
          {fmuModels.map((fmu) => (
            <div key={fmu.id} className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-medium text-gray-900 text-sm">{fmu.name}</div>
                  <div className="text-xs text-gray-600">{fmu.size} • {fmu.lastModified}</div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(fmu.status)}`}>
                  {fmu.status}
                </span>
              </div>
              <div className="flex justify-end space-x-2">
                <button className="text-xs text-blue-600 hover:text-blue-800">
                  编辑
                </button>
                <button className="text-xs text-green-600 hover:text-green-800">
                  使用
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Widget>
  )
}

// 方案对比Widget
export function SchemeComparisonWidget() {
  const schemes = [
    { 
      id: '1', 
      name: '方案A - 标准配置',
      metrics: {
        efficiency: 85,
        cost: 75,
        performance: 80,
        safety: 90
      },
      overall: 82.5
    },
    { 
      id: '2', 
      name: '方案B - 优化配置',
      metrics: {
        efficiency: 92,
        cost: 65,
        performance: 88,
        safety: 85
      },
      overall: 82.5
    },
    { 
      id: '3', 
      name: '方案C - 高性能配置',
      metrics: {
        efficiency: 78,
        cost: 55,
        performance: 95,
        safety: 82
      },
      overall: 77.5
    },
  ]

  const metricNames = {
    efficiency: '效率',
    cost: '成本',
    performance: '性能',
    safety: '安全性'
  }

  return (
    <Widget id="scheme-comparison" title="方案对比" size="large">
      <div className="space-y-4">
        {schemes.map((scheme) => (
          <div key={scheme.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">{scheme.name}</h4>
              <div className="text-right">
                <span className="text-sm text-gray-600">综合评分</span>
                <div className="text-xl font-bold text-blue-600">{scheme.overall}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(scheme.metrics).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{metricNames[key as keyof typeof metricNames]}</span>
                    <span className="font-medium">{value}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="h-1.5 bg-blue-500 rounded-full"
                      style={{ width: `${value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Widget>
  )
}

// 快捷操作Widget
export function SimulationQuickActionsWidget() {
  const actions = [
    { 
      id: '1', 
      name: '运行仿真', 
      icon: Play, 
      color: 'bg-green-500 hover:bg-green-600',
      description: '启动新仿真' 
    },
    { 
      id: '2', 
      name: '编辑脚本', 
      icon: Settings, 
      color: 'bg-blue-500 hover:bg-blue-600',
      description: '仿真配置' 
    },
    { 
      id: '3', 
      name: '结果分析', 
      icon: BarChart3, 
      color: 'bg-purple-500 hover:bg-purple-600',
      description: '查看报告' 
    },
    { 
      id: '4', 
      name: '模型库', 
      icon: Database, 
      color: 'bg-orange-500 hover:bg-orange-600',
      description: 'FMU管理' 
    },
  ]

  return (
    <Widget id="simulation-quick-actions" title="快捷操作" size="medium">
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