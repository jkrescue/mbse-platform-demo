import React from 'react'
import { ConsoleLayout } from './ConsoleLayout'
import { useAuth } from './AuthContext'
import type { UserRole } from './AuthContext'
import { Bell, Settings, Activity, TrendingUp, AlertCircle, CheckCircle, Users, Zap, ChevronDown, ChevronUp } from 'lucide-react@0.487.0'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { toast } from 'sonner@2.0.3'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible'

// 管理员Widget导入
import { 
  PlatformResourceWidget, 
  UserActivityWidget, 
  ModelLibraryAlertsWidget, 
  SystemNotificationWidget, 
  UserDistributionWidget,
  LicenseHealthWidget,
  HpcHealthWidget,
  CacheHitRateWidget,
  QualityGateWidget,
  RflpTraceabilityWidget,
  EvidencePackageWidget,
  AlertsSidebar
} from './widgets/AdminWidgets'

// 项目经理Widget导入
import { 
  MyProjectsWidget, 
  ProjectBurndownWidget, 
  ApprovalStatusWidget, 
  RiskAlertsWidget, 
  QuickActionsWidget 
} from './widgets/ProjectManagerWidgets'

// 架构师Widget导入
import { 
  ArchitectTasksWidget, 
  PendingArchitectureWidget, 
  ModelingStatusWidget, 
  RecentArchitectureActivityWidget, 
  ArchitectQuickActionsWidget 
} from './widgets/ArchitectWidgets'

// 仿真工程师Widget导入
import { 
  SimulationHistoryWidget, 
  SimulationAlertsWidget, 
  FMUManagementWidget, 
  SchemeComparisonWidget, 
  SimulationQuickActionsWidget 
} from './widgets/SimulationWidgets'

// 建模工程师Widget导入
import { 
  ModelingTasksWidget, 
  MissingModelsWidget, 
  ModelVersionAlertsWidget, 
  ModelingQuickActionsWidget 
} from './widgets/ModelingWidgets'

/**
 * 根据用户角色渲染对应的控制台Widget组合
 * 基于真实的用户认证信息动态加载相应的功能模块
 */
function renderRoleConsole(
  role: UserRole, 
  workflowCount?: number, 
  appCount?: number,
  navigationHandlers?: NavigationHandlers,
  collapsedSections?: Record<string, boolean>,
  onToggleSection?: (sectionKey: string) => void
) {
  // 可折叠区域标题组件
  const CollapsibleSectionHeader = ({ 
    sectionKey, 
    title, 
    icon, 
    count 
  }: { 
    sectionKey: string
    title: string
    icon: React.ReactNode
    count?: number 
  }) => (
    <div className="col-span-full mb-2 admin-section-spacing">
      <Collapsible 
        open={!collapsedSections?.[sectionKey]} 
        onOpenChange={() => onToggleSection?.(sectionKey)}
      >
        <CollapsibleTrigger asChild>
          <button className="w-full group">
            <div className={`admin-collapsible-header ${collapsedSections?.[sectionKey] ? 'collapsed' : ''} flex items-center justify-between py-3 px-4 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-150 border border-blue-200 rounded-lg transition-all duration-200 hover:shadow-sm`}>
              <div className="flex items-center space-x-3">
                <div className="admin-section-icon-container flex items-center justify-center w-8 h-8 bg-white rounded-lg shadow-sm">
                  {icon}
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
                    {title}
                  </h3>
                  {count !== undefined && (
                    <p className="text-xs text-gray-600">
                      {count} 个组件
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {count !== undefined && (
                  <Badge variant="outline" className="admin-section-count-badge text-xs bg-white">
                    {count}
                  </Badge>
                )}
                <div className={`collapse-indicator ${collapsedSections?.[sectionKey] ? 'collapsed' : ''}`}>
                  {collapsedSections?.[sectionKey] ? (
                    <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-blue-600 transition-colors" />
                  ) : (
                    <ChevronUp className="w-4 h-4 text-gray-500 group-hover:text-blue-600 transition-colors" />
                  )}
                </div>
              </div>
            </div>
          </button>
        </CollapsibleTrigger>
      </Collapsible>
    </div>
  )

  switch (role) {
    case 'admin':
      return (
        <>
          {/* 系统健康监控区域 */}
          <CollapsibleSectionHeader 
            sectionKey="system-health"
            title="系统健康监控"
            icon={<Activity className="w-4 h-4 text-green-600" />}
            count={4}
          />
          <Collapsible open={!collapsedSections?.['system-health']}>
            <CollapsibleContent className="col-span-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5 mb-6">
                <LicenseHealthWidget onNavigateToTools={navigationHandlers?.onNavigateToTools} />
                <HpcHealthWidget />
                <CacheHitRateWidget />
                <QualityGateWidget onNavigateToWorkflow={navigationHandlers?.onNavigateToWorkflow} />
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* 追溯健康区域 */}
          <CollapsibleSectionHeader 
            sectionKey="traceability"
            title="追溯与证据管理"
            icon={<CheckCircle className="w-4 h-4 text-blue-600" />}
            count={2}
          />
          <Collapsible open={!collapsedSections?.['traceability']}>
            <CollapsibleContent className="col-span-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5 mb-6">
                <RflpTraceabilityWidget onNavigateToModel={navigationHandlers?.onNavigateToModel} />
                <EvidencePackageWidget />
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* 资源管理区域 */}
          <CollapsibleSectionHeader 
            sectionKey="resource-management"
            title="平台资源管理"
            icon={<Users className="w-4 h-4 text-purple-600" />}
            count={5}
          />
          <Collapsible open={!collapsedSections?.['resource-management']}>
            <CollapsibleContent className="col-span-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5 mb-6">
                <PlatformResourceWidget 
                  workflowCount={workflowCount} 
                  appCount={appCount}
                  onNavigateToWorkflow={navigationHandlers?.onNavigateToWorkflow}
                  onNavigateToApps={navigationHandlers?.onNavigateToApps}
                />
                <UserActivityWidget onNavigateToUsers={navigationHandlers?.onNavigateToUsers} />
                <ModelLibraryAlertsWidget onNavigateToModel={navigationHandlers?.onNavigateToModel} />
                <SystemNotificationWidget />
                <UserDistributionWidget onNavigateToUsers={navigationHandlers?.onNavigateToUsers} />
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* 系统概览区域 */}
          <CollapsibleSectionHeader 
            sectionKey="system-overview"
            title="系统状态概览"
            icon={<TrendingUp className="w-4 h-4 text-orange-600" />}
            count={1}
          />
          <Collapsible open={!collapsedSections?.['system-overview']}>
            <CollapsibleContent className="col-span-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5 mb-6">
                <SystemOverviewWidget />
              </div>
            </CollapsibleContent>
          </Collapsible>
        </>
      )
      
    case 'projectManager':
      return (
        <>
          <MyProjectsWidget onCreateProject={navigationHandlers?.onCreateProject} />
          <ProjectBurndownWidget onViewDetails={navigationHandlers?.onViewProjectDetails} />
          <ApprovalStatusWidget onReview={navigationHandlers?.onReviewApproval} />
          <RiskAlertsWidget onManageRisks={navigationHandlers?.onManageRisks} />
          <QuickActionsWidget 
            onNavigateToWorkflow={navigationHandlers?.onNavigateToWorkflow}
            onNavigateToApps={navigationHandlers?.onNavigateToApps}
            onNavigateToModel={navigationHandlers?.onNavigateToModel}
          />
          
          {/* 添加项目性能Widget */}
          <ProjectPerformanceWidget />
        </>
      )
      
    case 'architect':
      return (
        <>
          <ArchitectTasksWidget onViewTask={navigationHandlers?.onViewTask} />
          <PendingArchitectureWidget onReviewArchitecture={navigationHandlers?.onReviewArchitecture} />
          <ModelingStatusWidget onNavigateToModel={navigationHandlers?.onNavigateToModel} />
          <RecentArchitectureActivityWidget />
          <ArchitectQuickActionsWidget 
            onCreateArchitecture={navigationHandlers?.onCreateArchitecture}
            onNavigateToComponents={navigationHandlers?.onNavigateToComponents}
          />
          
          {/* 添加架构质量Widget */}
          <ArchitectureQualityWidget />
        </>
      )
      
    case 'simulation':
      return (
        <>
          <SimulationHistoryWidget onViewResults={navigationHandlers?.onViewSimulationResults} />
          <SimulationAlertsWidget onResolveAlert={navigationHandlers?.onResolveAlert} />
          <FMUManagementWidget onManageFMU={navigationHandlers?.onManageFMU} />
          <SchemeComparisonWidget onCompareSchemes={navigationHandlers?.onCompareSchemes} />
          <SimulationQuickActionsWidget 
            onRunSimulation={navigationHandlers?.onRunSimulation}
            onNavigateToWorkflow={navigationHandlers?.onNavigateToWorkflow}
          />
          
          {/* 添加仿真资源Widget */}
          <SimulationResourceWidget />
        </>
      )
      
    case 'modeling':
      return (
        <>
          <ModelingTasksWidget onViewTask={navigationHandlers?.onViewTask} />
          <MissingModelsWidget onCreateModel={navigationHandlers?.onCreateModel} />
          <ModelVersionAlertsWidget onUpdateVersion={navigationHandlers?.onUpdateVersion} />
          <ModelingQuickActionsWidget 
            onNavigateToModel={navigationHandlers?.onNavigateToModel}
            onNavigateToComponents={navigationHandlers?.onNavigateToComponents}
          />
          
          {/* 添加模型质量Widget */}
          <ModelQualityWidget />
          
          {/* 添加模型库统计Widget */}
          <ModelLibraryStatsWidget />
        </>
      )
      
    default:
      return (
        <div className="col-span-4 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <h2 className="text-xl font-medium mb-2">欢迎使用MBSE平台</h2>
            <p>请联系管理员配置您的角色权限</p>
          </div>
        </div>
      )
  }
}

// 导航处理器接口
interface NavigationHandlers {
  onNavigateToTools?: () => void
  onNavigateToModel?: () => void
  onNavigateToWorkflow?: () => void
  onNavigateToApps?: () => void
  onNavigateToUsers?: () => void
  onNavigateToComponents?: () => void
  onCreateProject?: () => void
  onViewProjectDetails?: (projectId: string) => void
  onReviewApproval?: (approvalId: string) => void
  onManageRisks?: () => void
  onViewTask?: (taskId: string) => void
  onReviewArchitecture?: (archId: string) => void
  onCreateArchitecture?: () => void
  onViewSimulationResults?: (simulationId: string) => void
  onResolveAlert?: (alertId: string) => void
  onManageFMU?: () => void
  onCompareSchemes?: () => void
  onRunSimulation?: () => void
  onCreateModel?: () => void
  onUpdateVersion?: (modelId: string) => void
}

interface ConsoleProps {
  workflowCount?: number
  appCount?: number
  onNavigate?: (page: string, params?: any) => void
}

export function Console({ workflowCount, appCount, onNavigate }: ConsoleProps = {}) {
  const { user } = useAuth()
  const [isAlertsSidebarOpen, setIsAlertsSidebarOpen] = React.useState(false)
  
  // 新增：管理员专区收起展开状态管理
  const [collapsedSections, setCollapsedSections] = React.useState<Record<string, boolean>>(() => {
    // 从localStorage读取用户的折叠配置
    try {
      const saved = localStorage.getItem(`admin-console-layout-${user?.id || 'default'}`)
      return saved ? JSON.parse(saved) : {
        'system-health': false,      // 系统健康监控
        'traceability': false,       // 追溯健康
        'resource-management': false, // 资源管理
        'system-overview': false     // 系统概览
      }
    } catch {
      return {
        'system-health': false,      // 系统健康监控
        'traceability': false,       // 追溯健康
        'resource-management': false, // 资源管理
        'system-overview': false     // 系统概览
      }
    }
  })
  
  // 保存折叠配置到localStorage
  React.useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`admin-console-layout-${user.id}`, JSON.stringify(collapsedSections))
    }
  }, [collapsedSections, user?.id])
  
  const [systemStatus, setSystemStatus] = React.useState({
    overall: 'healthy',
    services: {
      simulation: 'healthy',
      modeling: 'healthy',
      storage: 'warning',
      compute: 'healthy'
    }
  })

  // 切换折叠状态的处理函数
  const toggleSection = (sectionKey: string) => {
    setCollapsedSections(prev => {
      const newState = {
        ...prev,
        [sectionKey]: !prev[sectionKey]
      }
      
      // 显示状态提示
      const sectionNames: Record<string, string> = {
        'system-health': '系统健康监控',
        'traceability': '追溯与证据管理',
        'resource-management': '平台资源管理',
        'system-overview': '系统状态概览'
      }
      
      toast.success(
        `${sectionNames[sectionKey]} 已${newState[sectionKey] ? '收起' : '展开'}`,
        {
          duration: 2000,
          position: 'bottom-right'
        }
      )
      
      return newState
    })
  }

  // 构建导航处理器对象
  const navigationHandlers: NavigationHandlers = React.useMemo(() => ({
    onNavigateToTools: () => {
      onNavigate?.('toolService')
      toast.success('正在跳转到工具服务...')
    },
    
    onNavigateToModel: () => {
      onNavigate?.('modelManagement')
      toast.success('正在跳转到模型管理...')
    },
    
    onNavigateToWorkflow: () => {
      onNavigate?.('workflow')
      toast.success('正在跳转到工作流管理...')
    },
    
    onNavigateToApps: () => {
      onNavigate?.('appCenter')
      toast.success('正在跳转到应用中心...')
    },
    
    onNavigateToUsers: () => {
      onNavigate?.('userManagement')
      toast.success('正在跳转到用户管理...')
    },
    
    onNavigateToComponents: () => {
      onNavigate?.('componentManagement')
      toast.success('正在跳转到组件管理...')
    },
    
    onCreateProject: () => {
      toast.info('创建新项目功能正在开发中...')
    },
    
    onViewProjectDetails: (projectId: string) => {
      toast.info(`查看项目 ${projectId} 详情...`)
    },
    
    onReviewApproval: (approvalId: string) => {
      toast.info(`审批项目 ${approvalId}...`)
    },
    
    onManageRisks: () => {
      toast.info('风险管理功能正在开发中...')
    },
    
    onViewTask: (taskId: string) => {
      toast.info(`查看任务 ${taskId} 详情...`)
    },
    
    onReviewArchitecture: (archId: string) => {
      toast.info(`审查架构 ${archId}...`)
    },
    
    onCreateArchitecture: () => {
      onNavigate?.('workflowDefinition', { type: 'architecture' })
      toast.success('正在创建架构工作流...')
    },
    
    onViewSimulationResults: (simulationId: string) => {
      toast.info(`查看仿真结果 ${simulationId}...`)
    },
    
    onResolveAlert: (alertId: string) => {
      toast.success(`已处理警报 ${alertId}`)
    },
    
    onManageFMU: () => {
      toast.info('FMU管理功能正在开发中...')
    },
    
    onCompareSchemes: () => {
      toast.info('方案对比功能正在开发中...')
    },
    
    onRunSimulation: () => {
      onNavigate?.('workflow', { action: 'create', type: 'simulation' })
      toast.success('正在创建仿真工作流...')
    },
    
    onCreateModel: () => {
      onNavigate?.('modelManagement', { action: 'create' })
      toast.success('正在跳转到创建模型...')
    },
    
    onUpdateVersion: (modelId: string) => {
      toast.success(`模型 ${modelId} 版本更新完成`)
    }
  }), [onNavigate])

  // 实时数据更新
  React.useEffect(() => {
    const interval = setInterval(() => {
      // 模拟系统状态更新
      setSystemStatus(prev => ({
        ...prev,
        services: {
          ...prev.services,
          storage: Math.random() > 0.7 ? 'warning' : 'healthy'
        }
      }))
    }, 30000) // 30秒更新一次

    return () => clearInterval(interval)
  }, [])

  // 新增：键盘快捷键支持
  React.useEffect(() => {
    if (user?.role !== 'admin') return

    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + Shift + E: 展开/收起所有区域
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'E') {
        event.preventDefault()
        const allCollapsed = Object.values(collapsedSections).every(Boolean)
        const newState = allCollapsed ? 
          Object.keys(collapsedSections).reduce((acc, key) => ({ ...acc, [key]: false }), {}) :
          Object.keys(collapsedSections).reduce((acc, key) => ({ ...acc, [key]: true }), {})
        setCollapsedSections(newState)
        toast.success(
          `键盘快捷键: ${allCollapsed ? '已展开所有区域' : '已收起所有区域'}`,
          { duration: 2000, position: 'bottom-right' }
        )
      }
      
      // 数字键1-4：快速切换对应区域
      if (event.ctrlKey && event.key >= '1' && event.key <= '4') {
        event.preventDefault()
        const sectionKeys = ['system-health', 'traceability', 'resource-management', 'system-overview']
        const sectionIndex = parseInt(event.key) - 1
        const sectionKey = sectionKeys[sectionIndex]
        
        if (sectionKey) {
          toggleSection(sectionKey)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [collapsedSections, user?.role, toggleSection])

  if (!user) {
    return (
      <div className="h-full bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-medium mb-2">未授权访问</h2>
          <p className="text-gray-600">请先登录系统</p>
        </div>
      </div>
    )
  }

  // 获取系统状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600'
      case 'warning': return 'text-yellow-600'
      case 'error': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-4 h-4" />
      case 'warning': return <AlertCircle className="w-4 h-4" />
      case 'error': return <AlertCircle className="w-4 h-4" />
      default: return <Activity className="w-4 h-4" />
    }
  }

  return (
    <div className="h-full bg-gray-50 relative">
      {/* 控制台头部 - 增强版，紧凑布局 */}
      <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3">
        <div className="w-full max-w-[98%] 2xl:max-w-[95%] mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 lg:space-x-6">
              <div>
                <h1 className="text-xl lg:text-2xl font-semibold text-gray-900 flex items-center space-x-2">
                  <span>控制台</span>
                  <Badge variant="outline" className="text-xs">
                    {user.role === 'admin' ? '管理员' : 
                     user.role === 'projectManager' ? '项目经理' :
                     user.role === 'architect' ? '架构师' :
                     user.role === 'simulation' ? '仿真工程师' : '建模工程师'}
                  </Badge>
                </h1>
                <p className="text-gray-600 mt-0.5 text-sm lg:text-base">
                  欢迎回来，{user.name} ({user.department})
                </p>
              </div>
              
              {/* 系统状态指示器 */}
              <div className="hidden lg:flex items-center space-x-4 text-sm">
                <div className={`flex items-center space-x-1 ${getStatusColor(systemStatus.overall)}`}>
                  {getStatusIcon(systemStatus.overall)}
                  <span>系统状态</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-600">实时监控</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 lg:space-x-4">
              <div className="hidden lg:flex text-sm text-gray-500 items-center space-x-2">
                <Activity className="w-4 h-4" />
                <span>上次登录: {user.lastLogin}</span>
              </div>
              
              {/* 管理员专区折叠控制按钮 */}
              {user.role === 'admin' && (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const allCollapsed = Object.values(collapsedSections).every(Boolean)
                      const newState = allCollapsed ? 
                        Object.keys(collapsedSections).reduce((acc, key) => ({ ...acc, [key]: false }), {}) :
                        Object.keys(collapsedSections).reduce((acc, key) => ({ ...acc, [key]: true }), {})
                      setCollapsedSections(newState)
                      toast.success(allCollapsed ? '已展开所有区域' : '已收起所有区域')
                    }}
                    className="hidden md:flex items-center space-x-1 border-blue-200 text-blue-700 hover:bg-blue-50"
                    title={Object.values(collapsedSections).every(Boolean) ? "展开所有区域" : "收起所有区域"}
                  >
                    {Object.values(collapsedSections).every(Boolean) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronUp className="w-4 h-4" />
                    )}
                    <span className="hidden lg:inline">
                      {Object.values(collapsedSections).every(Boolean) ? "展开全部" : "收起全部"}
                    </span>
                  </Button>
                </div>
              )}
              
              {/* 快捷操作按钮 */}
              <div className="flex items-center space-x-1 lg:space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigationHandlers.onNavigateToWorkflow?.()}
                  className="flex items-center space-x-1"
                >
                  <Zap className="w-4 h-4" />
                  <span className="hidden sm:inline">快速创建</span>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast.info('个人设置功能正在开发中...')}
                  className="hidden md:flex items-center space-x-1"
                >
                  <Settings className="w-4 h-4" />
                  <span>设置</span>
                </Button>
              </div>
              
              {user.role === 'admin' && (
                <button
                  onClick={() => setIsAlertsSidebarOpen(true)}
                  className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  title="查看警报与待办"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    4
                  </span>
                </button>
              )}
            </div>
          </div>
          
          {/* 添加快速统计栏 - 更紧凑的布局 */}
          <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4 lg:space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>工作流: {workflowCount || 0}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>应用: {appCount || 0}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>在线用户: {user.role === 'admin' ? '24' : '---'}</span>
              </div>
              
              {/* 管理员快捷键提示 */}
              {user.role === 'admin' && (
                <div className="hidden xl:flex items-center space-x-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  <span>💡 快捷键: Ctrl+Shift+E (全部), Ctrl+1~4 (单个)</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-1 text-xs">
              <span>最后更新:</span>
              <span className="text-blue-600">{new Date().toLocaleTimeString('zh-CN')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 控制台内容 */}
      <ConsoleLayout>
        {renderRoleConsole(
          user.role, 
          workflowCount, 
          appCount, 
          navigationHandlers,
          collapsedSections,
          toggleSection
        )}
      </ConsoleLayout>

      {/* 警报与待办侧栏 - 仅管理员可见 */}
      {user.role === 'admin' && (
        <AlertsSidebar
          isOpen={isAlertsSidebarOpen}
          onClose={() => setIsAlertsSidebarOpen(false)}
          onNavigateToTools={navigationHandlers.onNavigateToTools}
          onNavigateToModel={navigationHandlers.onNavigateToModel}
          onNavigateToWorkflow={navigationHandlers.onNavigateToWorkflow}
        />
      )}
    </div>
  )
}

// 新增Widget组件定义
function SystemOverviewWidget() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 col-span-1 sm:col-span-2 lg:col-span-2 xl:col-span-2">
      <h3 className="font-medium mb-3 flex items-center space-x-2">
        <Activity className="w-4 h-4 text-blue-600" />
        <span>系统概览</span>
      </h3>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="text-center p-2 bg-gray-50 rounded">
          <div className="text-gray-600 text-xs mb-1">CPU使用率</div>
          <div className="text-lg font-semibold text-green-600">45%</div>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded">
          <div className="text-gray-600 text-xs mb-1">内存使用</div>
          <div className="text-lg font-semibold text-blue-600">2.1GB</div>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded">
          <div className="text-gray-600 text-xs mb-1">存储空间</div>
          <div className="text-lg font-semibold text-yellow-600">78%</div>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded">
          <div className="text-gray-600 text-xs mb-1">任务队列</div>
          <div className="text-lg font-semibold text-purple-600">12</div>
        </div>
      </div>
    </div>
  )
}

function ProjectPerformanceWidget() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="font-medium mb-3 flex items-center space-x-2">
        <TrendingUp className="w-4 h-4 text-green-600" />
        <span>项目绩效</span>
      </h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
          <span className="text-gray-600">按时完成率</span>
          <span className="font-semibold text-green-600">87%</span>
        </div>
        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
          <span className="text-gray-600">质量达标率</span>
          <span className="font-semibold text-blue-600">94%</span>
        </div>
        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
          <span className="text-gray-600">资源利用率</span>
          <span className="font-semibold text-purple-600">73%</span>
        </div>
      </div>
    </div>
  )
}

function ArchitectureQualityWidget() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="font-medium mb-3 flex items-center space-x-2">
        <CheckCircle className="w-4 h-4 text-green-600" />
        <span>架构质量</span>
      </h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
          <span className="text-gray-600">合规性检查</span>
          <Badge variant="outline" className="text-green-600 text-xs">通过</Badge>
        </div>
        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
          <span className="text-gray-600">复用度</span>
          <span className="font-semibold text-blue-600">68%</span>
        </div>
        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
          <span className="text-gray-600">复杂度评分</span>
          <Badge variant="outline" className="text-yellow-600 text-xs">中等</Badge>
        </div>
      </div>
    </div>
  )
}

function SimulationResourceWidget() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="font-medium mb-3 flex items-center space-x-2">
        <Zap className="w-4 h-4 text-purple-600" />
        <span>仿真资源</span>
      </h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
          <span className="text-gray-600">计算节点</span>
          <span className="font-semibold text-green-600">8/12</span>
        </div>
        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
          <span className="text-gray-600">队列任务</span>
          <span className="font-semibold text-yellow-600">5</span>
        </div>
        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
          <span className="text-gray-600">GPU使用率</span>
          <span className="font-semibold text-blue-600">34%</span>
        </div>
      </div>
    </div>
  )
}

function ModelQualityWidget() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="font-medium mb-3 flex items-center space-x-2">
        <CheckCircle className="w-4 h-4 text-blue-600" />
        <span>模型质量</span>
      </h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
          <span className="text-gray-600">验证通过</span>
          <Badge variant="outline" className="text-green-600 text-xs">95%</Badge>
        </div>
        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
          <span className="text-gray-600">文档完整性</span>
          <span className="font-semibold text-blue-600">82%</span>
        </div>
        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
          <span className="text-gray-600">版本一致性</span>
          <Badge variant="outline" className="text-green-600 text-xs">正常</Badge>
        </div>
      </div>
    </div>
  )
}

function ModelLibraryStatsWidget() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="font-medium mb-3 flex items-center space-x-2">
        <Users className="w-4 h-4 text-green-600" />
        <span>模型库统计</span>
      </h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
          <span className="text-gray-600">总模型数</span>
          <span className="font-semibold text-blue-600">1,247</span>
        </div>
        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
          <span className="text-gray-600">本月新增</span>
          <span className="font-semibold text-green-600">+23</span>
        </div>
        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
          <span className="text-gray-600">使用频次</span>
          <span className="font-semibold text-purple-600">4,156</span>
        </div>
      </div>
    </div>
  )
}