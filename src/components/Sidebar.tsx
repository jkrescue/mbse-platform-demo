import { 
  LayoutDashboard,
  GitBranch, 
  AppWindow, 
  Package, 
  Wrench, 
  Database,
  Users,
  LogOut,
  GitCompare,
  Archive,
  ChevronDown,
  ChevronRight,
  FolderKanban,
  Target
} from "lucide-react@0.487.0"
import { useAuth } from "./AuthContext"
import { useState } from "react"

export function Sidebar({
  currentPage,
  onNavigate
}: {
  currentPage: string;
  onNavigate: (page: string) => void;
}) {
  const { user, logout } = useAuth()
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['modelManagement']) // 默认展开模型管理
  )

  const navigationItems = [
    {
      id: "console",
      label: "控制台",
      description: "系统概览与快速操作",
      icon: LayoutDashboard
    },
    {
      id: "projectHub",
      label: "项目管理",
      description: "项目全生命周期管理",
      icon: FolderKanban
    },
    {
      id: "appCenter",
      label: "应用中心", 
      description: "应用市场与个人应用",
      icon: AppWindow
    },
    {
      id: "workflow", 
      label: "工作流管理",
      description: "MBSE工作流设计与执行",
      icon: GitBranch
    },
    {
      id: "componentManagement",
      label: "组件管理",
      description: "MBSE组件库与工具集成",
      icon: Package
    },
    {
      id: "toolService",
      label: "工具服务",
      description: "第三方工具集成与配置",
      icon: Wrench
    },
    {
      id: "modelManagement",
      label: "模型管理及服务",
      description: "模型库、对比分析与版本管理",
      icon: Database,
      hasSubMenu: true,
      subItems: [
        {
          id: "modelManagement",
          label: "模型库管理",
          description: "仿真模型库与依赖关系"
        },
        {
          id: "modelComparison",
          label: "模型对比分析",
          description: "多模型对比分析工具"
        },
        {
          id: "modelVersion",
          label: "版本与基线管理",
          description: "模型版本控制与基线管理"
        }
      ]
    },
    {
      id: "metricsHub",
      label: "指标与权衡",
      description: "性能指标、竞品对标与权衡研究",
      icon: Target
    }
  ]

  // 基于用户角色过滤导航项
  const getFilteredNavigationItems = () => {
    const userRole = user?.role
    
    if (userRole === 'admin') {
      // 管理员可以看到所有功能，并额外显示用户管理
      return [
        ...navigationItems,
        {
          id: "userManagement",
          label: "用户管理",
          description: "用户权限与角色管理",
          icon: Users
        }
      ]
    }
    
    if (userRole === 'projectManager') {
      // 项目经理重点关注项目管理、工作流、应用中心、模型管理
      return navigationItems.filter(item => 
        ['console', 'projectHub', 'appCenter', 'workflow', 'modelManagement'].includes(item.id)
      )
    }
    
    if (userRole === 'architect') {
      // 系统架构师关注组件管理、模型管理
      return navigationItems.filter(item => 
        ['console', 'workflow', 'componentManagement', 'modelManagement'].includes(item.id)
      )
    }
    
    if (userRole === 'simulation') {
      // 仿真工程师关注工作流、工具服务、模型管理
      return navigationItems.filter(item => 
        ['console', 'workflow', 'toolService', 'modelManagement'].includes(item.id)
      )
    }
    
    if (userRole === 'modeling') {
      // 建模工程师关注模型管理、组件管理
      return navigationItems.filter(item => 
        ['console', 'modelManagement', 'componentManagement'].includes(item.id)
      )
    }
    
    // 默认显示基础功能
    return navigationItems.filter(item => 
      ['console', 'appCenter', 'workflow', 'modelManagement'].includes(item.id)
    )
  }

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  const isModelManagementPage = (page: string) => {
    return ['modelManagement', 'modelComparison', 'modelVersion', 'modelDetail'].includes(page)
  }

  const filteredItems = getFilteredNavigationItems()

  return (
    <div className="w-72 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <div>
            <h1 className="font-semibold text-gray-900">MBSE 平台</h1>
            <p className="text-sm text-gray-600">模型驱动工程</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {filteredItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id || 
                          (currentPage === "appEditor" && item.id === "appCenter") ||
                          (item.hasSubMenu && isModelManagementPage(currentPage))
          const isExpanded = expandedSections.has(item.id)
          
          return (
            <div key={item.id}>
              {/* 主菜单项 */}
              <button
                onClick={() => {
                  if (item.hasSubMenu) {
                    toggleSection(item.id)
                    // 如果有子菜单且当前未展开，点击时导航到第一个子项
                    if (!isExpanded) {
                      onNavigate(item.subItems?.[0]?.id || item.id)
                    }
                  } else {
                    onNavigate(item.id)
                  }
                }}
                className={`w-full flex items-start px-3 py-2.5 rounded-lg text-left transition-all duration-200 group ${
                  isActive
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 mt-1 mr-3 ${
                  isActive 
                    ? "text-blue-600" 
                    : "text-gray-400 group-hover:text-gray-600"
                }`} />
                <div className="flex-1 min-w-0 overflow-hidden">
                  <div className="font-medium text-sm leading-tight mb-1">{item.label}</div>
                  <div className="text-xs text-gray-500 leading-tight truncate">{item.description}</div>
                </div>
                {item.hasSubMenu && (
                  <div className="flex-shrink-0 ml-2">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                )}
              </button>

              {/* 子菜单项 */}
              {item.hasSubMenu && isExpanded && (
                <div className="ml-7 mt-1 space-y-1">
                  {item.subItems?.map((subItem) => (
                    <button
                      key={subItem.id}
                      onClick={() => onNavigate(subItem.id)}
                      className={`w-full flex items-start px-3 py-2 rounded-lg text-left transition-all duration-200 group ${
                        currentPage === subItem.id
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                      }`}
                    >
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <div className="font-medium text-sm leading-tight mb-1">{subItem.label}</div>
                        <div className="text-xs text-gray-500 leading-tight truncate">{subItem.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-gray-600 font-medium text-sm">
              {user?.name?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm text-gray-900 truncate">
              {user?.name || '未知用户'}
            </p>
            <p className="text-xs text-gray-600 truncate">
              {user?.role === 'admin' ? '平台管理员' :
               user?.role === 'projectManager' ? '项目经理' :
               user?.role === 'architect' ? '系统架构师' :
               user?.role === 'simulation' ? '仿真工程师' :
               user?.role === 'modeling' ? '建模工程师' : '普通用户'}
            </p>
          </div>
        </div>
        
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>退出登录</span>
        </button>
      </div>
    </div>
  )
}