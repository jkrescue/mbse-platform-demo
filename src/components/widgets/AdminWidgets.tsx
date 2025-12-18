import React from 'react'
import { Widget } from '../Widget'
import { Activity, Users, Database, AlertTriangle, TrendingUp, Server, HardDrive, Cpu, Radio, Package, GitBranch, FileText, FolderOpen, Key, Wrench, ArrowUp, ArrowDown, Minus, CheckCircle, AlertCircle, Clock, X, ExternalLink, Eye, Bell, Link, FileCheck, Gauge, Shield, Cloud, Zap, CheckSquare, AlertOctagon, Timer, Settings, Link2Off } from 'lucide-react@0.487.0'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'

// 通用卡片组件 - 统一样式规范
function StatCard({ 
  icon: Icon, 
  value, 
  label, 
  change, 
  trend, 
  color = 'blue',
  unit = '',
  description
}: {
  icon: any
  value: number | string
  label: string
  change?: string
  trend?: 'up' | 'down' | 'neutral'
  color?: string
  unit?: string
  description?: string
}) {
  const colorClasses = {
    blue: 'bg-blue-500 text-blue-600 bg-blue-50 border-blue-200',
    green: 'bg-green-500 text-green-600 bg-green-50 border-green-200',
    orange: 'bg-orange-500 text-orange-600 bg-orange-50 border-orange-200',
    purple: 'bg-purple-500 text-purple-600 bg-purple-50 border-purple-200',
    red: 'bg-red-500 text-red-600 bg-red-50 border-red-200',
    yellow: 'bg-yellow-500 text-yellow-600 bg-yellow-50 border-yellow-200'
  }

  const [bgColor, textColor, cardBg, borderColor] = colorClasses[color as keyof typeof colorClasses]?.split(' ') || colorClasses.blue.split(' ')

  const getTrendIcon = () => {
    if (!trend) return null
    if (trend === 'up') return <ArrowUp className="w-3 h-3 text-green-600" />
    if (trend === 'down') return <ArrowDown className="w-3 h-3 text-red-600" />
    return <Minus className="w-3 h-3 text-gray-600" />
  }

  return (
    <div className={`relative overflow-hidden rounded-lg ${cardBg} border ${borderColor} p-4 transition-all duration-200 hover:shadow-md`}>
      <div className="flex items-start justify-between">
        <div className={`p-2 rounded-lg ${bgColor} text-white`}>
          <Icon className="w-4 h-4" />
        </div>
        {change && trend && (
          <div className="flex items-center space-x-1">
            {getTrendIcon()}
            <span className={`text-xs font-medium ${
              trend === 'up' ? 'text-green-600' : 
              trend === 'down' ? 'text-red-600' : 'text-gray-600'
            }`}>
              {change}
            </span>
          </div>
        )}
      </div>
      
      <div className="mt-3 space-y-1">
        <div className="flex items-baseline space-x-1">
          <span className="text-2xl font-bold text-gray-900">{value}</span>
          {unit && <span className="text-sm text-gray-500">{unit}</span>}
        </div>
        <div className="text-sm font-medium text-gray-700">{label}</div>
        {description && <div className="text-xs text-gray-500">{description}</div>}
      </div>
    </div>
  )
}

// 进度条组件 - 统一样式
function ProgressIndicator({ 
  label, 
  value, 
  max, 
  percentage, 
  status = 'normal',
  showQueue = false,
  queueCount = 0
}: {
  label: string
  value: number
  max: number
  percentage: number
  status?: 'normal' | 'warning' | 'critical'
  showQueue?: boolean
  queueCount?: number
}) {
  const getStatusColor = () => {
    switch (status) {
      case 'warning': return 'bg-yellow-500'
      case 'critical': return 'bg-red-500'
      default: return 'bg-green-500'
    }
  }

  const getTextColor = () => {
    switch (status) {
      case 'warning': return 'text-yellow-600'
      case 'critical': return 'text-red-600'
      default: return 'text-green-600'
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <div className="flex items-center space-x-2">
          <span className={`text-sm font-bold ${getTextColor()}`}>
            {value}/{max}
          </span>
          {showQueue && queueCount > 0 && (
            <Badge variant="outline" className="text-xs px-1.5 py-0.5">
              队列{queueCount}
            </Badge>
          )}
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-500 ${getStatusColor()}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  )
}

// 平台资源使用统计Widget - 重新设计
interface PlatformResourceWidgetProps {
  workflowCount?: number
  appCount?: number
  onNavigateToWorkflow?: () => void
  onNavigateToApps?: () => void
}

export function PlatformResourceWidget({ 
  workflowCount = 13, 
  appCount = 6, 
  onNavigateToWorkflow,
  onNavigateToApps
}: PlatformResourceWidgetProps) {
  const stats = [
    {
      icon: Users,
      value: 57,
      label: '总用户数',
      change: '+5',
      trend: 'up' as const,
      color: 'blue',
      unit: '人',
      description: '本月新增'
    },
    {
      icon: FolderOpen,
      value: 23,
      label: '活跃项目',
      change: '+3',
      trend: 'up' as const,
      color: 'green',
      unit: '个',
      description: '本周新增'
    },
    {
      icon: Package,
      value: appCount,
      label: '应用总数',
      change: '0',
      trend: 'neutral' as const,
      color: 'purple',
      unit: '个',
      description: '无变化'
    },
    {
      icon: GitBranch,
      value: workflowCount,
      label: '工作流数量',
      change: '+2',
      trend: 'up' as const,
      color: 'orange',
      unit: '个',
      description: '本月新增'
    }
  ]

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 col-span-1 md:col-span-2 lg:col-span-2">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <span>平台使用统计</span>
        </h3>
        <Badge variant="outline" className="text-xs">
          实时更新
        </Badge>
      </div>

      {/* 统计卡片网格 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* 系统健康概览 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
        <h4 className="font-medium text-gray-800 mb-3 flex items-center space-x-2">
          <Database className="w-4 h-4 text-blue-600" />
          <span>系统状态概览</span>
        </h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-xl font-bold text-green-600">98.5%</div>
            <div className="text-xs text-gray-600">系统可用性</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-blue-600">1.2TB</div>
            <div className="text-xs text-gray-600">存储使用量</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-purple-600">43</div>
            <div className="text-xs text-gray-600">在线用户</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// 用户活跃度Widget - 优化版
interface UserActivityWidgetProps {
  onNavigateToUsers?: () => void
}

export function UserActivityWidget({ onNavigateToUsers }: UserActivityWidgetProps) {
  const activityData = [
    { day: '周一', value: 45, trend: 'up', change: '+5' },
    { day: '周二', value: 52, trend: 'up', change: '+7' },
    { day: '周三', value: 48, trend: 'down', change: '-4' },
    { day: '周四', value: 61, trend: 'up', change: '+13' },
    { day: '周五', value: 55, trend: 'down', change: '-6' },
    { day: '周六', value: 28, trend: 'down', change: '-27' },
    { day: '周日', value: 25, trend: 'down', change: '-3' },
  ]

  const maxValue = Math.max(...activityData.map(d => d.value))
  const avgValue = Math.round(activityData.reduce((sum, d) => sum + d.value, 0) / activityData.length)
  const weekTotal = activityData.reduce((sum, d) => sum + d.value, 0)

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium flex items-center space-x-2">
          <Activity className="w-4 h-4 text-blue-600" />
          <span>趋势分析</span>
        </h3>
        <Button variant="ghost" size="sm" onClick={onNavigateToUsers}>
          <Eye className="w-3 h-3" />
        </Button>
      </div>

      {/* 核心指标 */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-bold text-gray-900">{Math.max(...activityData.map(d => d.value))}</div>
          <div className="text-xs text-gray-600">最高活跃度(周四)</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-bold text-gray-900">{Math.min(...activityData.map(d => d.value))}</div>
          <div className="text-xs text-gray-600">最低活跃度(周日)</div>
        </div>
      </div>

      {/* 趋势提示 */}
      <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
        <div className="flex items-start space-x-2">
          <div className="w-4 h-4 mt-0.5 text-blue-600">💡</div>
          <p className="text-sm text-blue-800">
            工作日流量高于周末，建议在工作日进行重要功能推广
          </p>
        </div>
      </div>
    </div>
  )
}

// 用户分布Widget - 精简版
interface UserDistributionWidgetProps {
  onNavigateToUsers?: () => void
}

export function UserDistributionWidget({ onNavigateToUsers }: UserDistributionWidgetProps) {
  const userStats = [
    { role: '管理员', count: 3, color: 'bg-red-500', percentage: 5 },
    { role: '项目经理', count: 8, color: 'bg-blue-500', percentage: 14 },
    { role: '架构师', count: 12, color: 'bg-purple-500', percentage: 21 },
    { role: '仿真工程师', count: 15, color: 'bg-green-500', percentage: 26 },
    { role: '建模工程师', count: 19, color: 'bg-orange-500', percentage: 34 },
  ]

  const totalUsers = userStats.reduce((sum, stat) => sum + stat.count, 0)

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium flex items-center space-x-2">
          <Users className="w-4 h-4 text-blue-600" />
          <span>用户分布</span>
        </h3>
        <Button variant="ghost" size="sm" onClick={onNavigateToUsers}>
          <ExternalLink className="w-3 h-3" />
        </Button>
      </div>

      {/* 总用户数 */}
      <div className="text-center p-3 bg-gray-50 rounded-lg mb-4">
        <div className="text-2xl font-bold text-gray-900">{totalUsers}</div>
        <div className="text-sm text-gray-600">总用户数</div>
      </div>

      {/* 角色分布列表 */}
      <div className="space-y-2">
        {userStats.map((stat) => (
          <div key={stat.role} className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
              <span className="text-sm text-gray-700">{stat.role}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-900">{stat.count}</span>
              <span className="text-xs text-gray-500">({stat.percentage}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// 系统概览Widget - 新增
function SystemOverviewWidget() {
  const systemMetrics = [
    { label: 'CPU使用率', value: '45%', color: 'text-green-600' },
    { label: '内存使用', value: '2.1GB', color: 'text-blue-600' },
    { label: '存储空间', value: '78%', color: 'text-yellow-600' },
    { label: '任务队列', value: '12', color: 'text-purple-600' }
  ]

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="font-medium mb-4 flex items-center space-x-2">
        <Server className="w-4 h-4 text-blue-600" />
        <span>系统概览</span>
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        {systemMetrics.map((metric, index) => (
          <div key={index} className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-600 mb-1">{metric.label}</div>
            <div className={`text-lg font-semibold ${metric.color}`}>{metric.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// License使用率Widget - 优化版
interface LicenseHealthWidgetProps {
  onNavigateToTools?: () => void
}

export function LicenseHealthWidget({ onNavigateToTools }: LicenseHealthWidgetProps) {
  const licenseData = [
    { name: 'M-WORKS', used: 85, total: 100, percentage: 85, status: 'warning' as const, queue: 3 },
    { name: 'EA', used: 23, total: 50, percentage: 46, status: 'normal' as const, queue: 0 },
    { name: 'Modelica', used: 67, total: 80, percentage: 84, status: 'warning' as const, queue: 2 },
    { name: 'POLARION', used: 45, total: 60, percentage: 75, status: 'normal' as const, queue: 0 },
  ]

  const totalUsed = licenseData.reduce((sum, item) => sum + item.used, 0)
  const totalAvailable = licenseData.reduce((sum, item) => sum + item.total, 0)
  const totalQueued = licenseData.reduce((sum, item) => sum + item.queue, 0)

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium flex items-center space-x-2">
          <Key className="w-4 h-4 text-blue-600" />
          <span>License使用率</span>
        </h3>
        <Button variant="ghost" size="sm" onClick={onNavigateToTools}>
          <Settings className="w-3 h-3" />
        </Button>
      </div>

      {/* 总体概览 */}
      <div className="bg-blue-50 rounded-lg p-3 mb-4 border border-blue-200">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-sm font-bold text-blue-600">{totalUsed}/{totalAvailable}</div>
            <div className="text-xs text-gray-600">已用/总数</div>
          </div>
          <div>
            <div className="text-sm font-bold text-orange-600">{totalQueued}</div>
            <div className="text-xs text-gray-600">排队数</div>
          </div>
          <div>
            <div className="text-sm font-bold text-purple-600">
              {Math.round((totalUsed / totalAvailable) * 100)}%
            </div>
            <div className="text-xs text-gray-600">使用率</div>
          </div>
        </div>
      </div>

      {/* License列表 */}
      <div className="space-y-2">
        {licenseData.map((license) => (
          <ProgressIndicator
            key={license.name}
            label={license.name}
            value={license.used}
            max={license.total}
            percentage={license.percentage}
            status={license.status}
            showQueue={license.queue > 0}
            queueCount={license.queue}
          />
        ))}
      </div>
    </div>
  )
}

// HPC节点可用率Widget - 优化版
export function HpcHealthWidget() {
  const hpcData = {
    totalNodes: 24,
    availableNodes: 18,
    busyNodes: 5,
    failedNodes: 1,
    queueLength: 12,
    avgWaitTime: 8.5
  }

  const availabilityRate = Math.round((hpcData.availableNodes / hpcData.totalNodes) * 100)

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="font-medium mb-4 flex items-center space-x-2">
        <Server className="w-4 h-4 text-blue-600" />
        <span>HPC节点状态</span>
      </h3>

      {/* 核心指标 */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
          <div className={`text-xl font-bold ${availabilityRate >= 80 ? 'text-green-600' : availabilityRate >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
            {availabilityRate}%
          </div>
          <div className="text-xs text-gray-600">节点可用率</div>
        </div>
        <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
          <div className="text-xl font-bold text-orange-600">{hpcData.queueLength}</div>
          <div className="text-xs text-gray-600">队列长度</div>
        </div>
      </div>

      {/* 节点状态分布 */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>可用节点</span>
          </div>
          <span className="font-medium">{hpcData.availableNodes}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>忙碌节点</span>
          </div>
          <span className="font-medium">{hpcData.busyNodes}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>故障节点</span>
          </div>
          <span className="font-medium">{hpcData.failedNodes}</span>
        </div>
      </div>
    </div>
  )
}

// 缓存命中率Widget - 优化版
export function CacheHitRateWidget() {
  const cacheData = {
    hitRate: 87.3,
    totalRequests: 1542,
    hitRequests: 1346,
    missRequests: 196,
    cacheSize: '2.3GB',
    maxCacheSize: '5.0GB'
  }

  const cacheUsagePercentage = (2.3 / 5.0) * 100

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="font-medium mb-4 flex items-center space-x-2">
        <Database className="w-4 h-4 text-blue-600" />
        <span>缓存命中率</span>
      </h3>

      {/* 命中率主指标 */}
      <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200 mb-4">
        <div className="text-2xl font-bold text-green-600">{cacheData.hitRate}%</div>
        <div className="text-sm text-gray-600">Run复现命中率</div>
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="text-center p-2 bg-gray-50 rounded">
          <div className="text-sm font-bold text-green-600">{cacheData.hitRequests}</div>
          <div className="text-xs text-gray-600">命中次数</div>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded">
          <div className="text-sm font-bold text-red-600">{cacheData.missRequests}</div>
          <div className="text-xs text-gray-600">未命中次数</div>
        </div>
      </div>

      {/* 缓存使用情况 */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">缓存使用</span>
          <span className="font-medium">{cacheData.cacheSize} / {cacheData.maxCacheSize}</span>
        </div>
        <Progress value={cacheUsagePercentage} className="h-2" />
        <div className="text-xs text-gray-500 text-center">
          使用率 {Math.round(cacheUsagePercentage)}%
        </div>
      </div>
    </div>
  )
}

// QG关口通过率Widget - 优化版
interface QualityGateWidgetProps {
  onNavigateToWorkflow?: () => void
}

export function QualityGateWidget({ onNavigateToWorkflow }: QualityGateWidgetProps) {
  const qgData = {
    totalGates: 25,
    passedGates: 19,
    failedGates: 4,
    pendingGates: 2,
    passRate: 76
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-blue-600" />
          <span>质量关口</span>
        </h3>
        <Button variant="ghost" size="sm" onClick={onNavigateToWorkflow}>
          <ExternalLink className="w-3 h-3" />
        </Button>
      </div>

      {/* 通过率指标 */}
      <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200 mb-4">
        <div className="text-2xl font-bold text-blue-600">{qgData.passRate}%</div>
        <div className="text-sm text-gray-600">质量关口通过率</div>
      </div>

      {/* 详细统计 */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>已通过</span>
          </div>
          <span className="font-medium">{qgData.passedGates}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>未通过</span>
          </div>
          <span className="font-medium">{qgData.failedGates}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>待审核</span>
          </div>
          <span className="font-medium">{qgData.pendingGates}</span>
        </div>
      </div>
    </div>
  )
}

// RFLP追溯健康Widget - 优化版
interface RflpTraceabilityWidgetProps {
  onNavigateToModel?: () => void
}

export function RflpTraceabilityWidget({ onNavigateToModel }: RflpTraceabilityWidgetProps) {
  const rflpData = {
    totalElements: 1247,
    tracedElements: 1156,
    traceabilityRate: 93,
    brokenLinks: 12,
    pendingValidation: 8
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium flex items-center space-x-2">
          <Link className="w-4 h-4 text-blue-600" />
          <span>RFLP追溯</span>
        </h3>
        <Button variant="ghost" size="sm" onClick={onNavigateToModel}>
          <ExternalLink className="w-3 h-3" />
        </Button>
      </div>

      {/* 追溯率指标 */}
      <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200 mb-4">
        <div className="text-2xl font-bold text-green-600">{rflpData.traceabilityRate}%</div>
        <div className="text-sm text-gray-600">追溯完整性</div>
      </div>

      {/* 详细统计 */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">已追溯元素</span>
          <span className="font-medium">{rflpData.tracedElements}/{rflpData.totalElements}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">断链问题</span>
          <span className="font-medium text-red-600">{rflpData.brokenLinks}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">待验证</span>
          <span className="font-medium text-yellow-600">{rflpData.pendingValidation}</span>
        </div>
      </div>
    </div>
  )
}

// 证据包健康Widget - 优化版
export function EvidencePackageWidget() {
  const evidenceData = {
    totalPackages: 45,
    completedPackages: 38,
    incompletePackages: 5,
    failedPackages: 2,
    completionRate: 84
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="font-medium mb-4 flex items-center space-x-2">
        <Package className="w-4 h-4 text-blue-600" />
        <span>证据包状态</span>
      </h3>

      {/* 完成率指标 */}
      <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200 mb-4">
        <div className="text-2xl font-bold text-blue-600">{evidenceData.completionRate}%</div>
        <div className="text-sm text-gray-600">证据包完整率</div>
      </div>

      {/* 详细统计 */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>已完成</span>
          </div>
          <span className="font-medium">{evidenceData.completedPackages}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>进行中</span>
          </div>
          <span className="font-medium">{evidenceData.incompletePackages}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>失败</span>
          </div>
          <span className="font-medium">{evidenceData.failedPackages}</span>
        </div>
      </div>
    </div>
  )
}

// 模型库异常提醒Widget - 优化版
interface ModelLibraryAlertsWidgetProps {
  onNavigateToModel?: () => void
}

export function ModelLibraryAlertsWidget({ onNavigateToModel }: ModelLibraryAlertsWidgetProps) {
  const alerts = [
    { 
      id: '1', 
      type: 'warning', 
      message: '模型库存储空间使用率达到85%', 
      time: '10分钟前',
      count: 0
    },
    { 
      id: '2', 
      type: 'error', 
      message: '发现127个未分类模型文件', 
      time: '2小时前',
      count: 127
    },
    { 
      id: '3', 
      type: 'info', 
      message: '模型版本清理任务已完成', 
      time: '1天前',
      count: 0
    },
  ]

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />
      default: return <CheckCircle className="w-4 h-4 text-blue-500" />
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-yellow-600" />
          <span>模型库异常</span>
        </h3>
        <Button variant="ghost" size="sm" onClick={onNavigateToModel}>
          <ExternalLink className="w-3 h-3" />
        </Button>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <div key={alert.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
            {getAlertIcon(alert.type)}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 mb-1">{alert.message}</p>
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">{alert.time}</p>
                {alert.count > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {alert.count}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// 系统通知Widget - 优化版
export function SystemNotificationWidget() {
  const [notifications, setNotifications] = React.useState([
    { id: '1', title: '系统维护通知', content: '系统将于今晚2:00-4:00进行维护', time: '2小时前' },
    { id: '2', title: 'MBSE平台v2.1.0版本已发布', content: '新版本包含多项功能增强', time: '1天前' },
  ])

  const [newNotification, setNewNotification] = React.useState('')

  const handleBroadcast = () => {
    if (newNotification.trim()) {
      const notification = {
        id: Date.now().toString(),
        title: '系统广播',
        content: newNotification,
        time: '刚刚'
      }
      setNotifications([notification, ...notifications.slice(0, 2)])
      setNewNotification('')
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3">
      <h3 className="font-medium mb-3 flex items-center space-x-2">
        <Bell className="w-4 h-4 text-blue-600" />
        <span>系统通知</span>
      </h3>

      {/* 发布通知 */}
      <div className="space-y-2 mb-3">
        <textarea
          value={newNotification}
          onChange={(e) => setNewNotification(e.target.value)}
          placeholder="发布系统广播..."
          className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm resize-none"
          rows={2}
        />
        <Button
          onClick={handleBroadcast}
          className="w-full"
          size="sm"
          disabled={!newNotification.trim()}
        >
          <Radio className="w-3 h-3 mr-1" />
          发布广播
        </Button>
      </div>

      {/* 通知列表 */}
      <div className="space-y-1.5 max-h-32 overflow-y-auto">
        {notifications.map((notification) => (
          <div key={notification.id} className="p-2 border border-gray-100 rounded text-sm">
            <div className="font-medium text-gray-900 mb-0.5">{notification.title}</div>
            <div className="text-gray-600 text-xs mb-1">{notification.content}</div>
            <div className="text-xs text-gray-500">{notification.time}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// 警报与待办侧栏 - 仅管理员可见
interface AlertsSidebarProps {
  isOpen: boolean
  onClose: () => void
  onNavigateToTools?: () => void
  onNavigateToModel?: () => void
  onNavigateToWorkflow?: () => void
}

export function AlertsSidebar({ 
  isOpen, 
  onClose, 
  onNavigateToTools, 
  onNavigateToModel, 
  onNavigateToWorkflow 
}: AlertsSidebarProps) {
  const alerts = [
    {
      id: '1',
      title: 'License即将到期',
      description: 'M-WORKS License将在15天后到期',
      type: 'warning',
      action: 'License管理',
      onClick: onNavigateToTools
    },
    {
      id: '2', 
      title: '模型库空间不足',
      description: '存储空间使用率已达到85%',
      type: 'error',
      action: '模型管理',
      onClick: onNavigateToModel
    },
    {
      id: '3',
      title: '质量关口异常',
      description: '4个工作流未通过质量检查',
      type: 'warning',
      action: '工作流管理',
      onClick: onNavigateToWorkflow
    },
    {
      id: '4',
      title: 'HPC节点故障',
      description: '计算节点#12离线，需要维护',
      type: 'error',
      action: '系统监控',
      onClick: () => console.log('Navigate to system monitoring')
    }
  ]

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-96">
        <SheetHeader>
          <SheetTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>系统警报与待办</span>
          </SheetTitle>
          <SheetDescription>
            平台管理员专用的系统状态监控和待办事项
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start space-x-3">
                <div className={`mt-1 w-2 h-2 rounded-full ${
                  alert.type === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                }`} />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{alert.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={alert.onClick}
              >
                {alert.action}
              </Button>
            </div>
          ))}
        </div>
        
        <Separator className="my-6" />
        
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">快速操作</h4>
          <div className="space-y-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={onNavigateToTools}
            >
              <Settings className="w-4 h-4 mr-2" />
              工具服务管理
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={onNavigateToModel}
            >
              <Database className="w-4 h-4 mr-2" />
              模型库维护
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={onNavigateToWorkflow}
            >
              <GitBranch className="w-4 h-4 mr-2" />
              工作流审核
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}