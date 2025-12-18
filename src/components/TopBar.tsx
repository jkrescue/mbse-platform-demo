import React, { useState } from "react";
import { Bell, Search, Settings } from "lucide-react@0.487.0"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { useAuth } from "./AuthContext"
import { ProjectContextSwitcher } from "./project/ProjectContextSwitcher"

interface TopBarProps {
  currentPage: string
  onCreateProject?: () => void
}

const pageTitle: Record<string, string> = {
  console: "控制台",
  projectHub: "项目管理",
  projectDashboard: "项目详情",
  workflow: "工作流管理",
  appCenter: "应用中心",
  appEditor: "应用中心", // 应用编辑器显示为应用中心
  componentManagement: "组件管理",
  toolService: "工具服务",
  modelManagement: "模型管理及服务"
}

// 模拟审核通知数据
const mockNotifications = [
  {
    id: "1",
    type: "review",
    title: "模型审核请求",
    message: "BatteryThermalModel v1.0 待您审核",
    modelName: "BatteryThermalModel",
    requester: "王五",
    timestamp: "2024-01-15 14:30:00",
    isRead: false,
  },
  {
    id: "2", 
    type: "review",
    title: "模型审核请求",
    message: "EngineControl_V3 待您审核",
    modelName: "EngineControl_V3",
    requester: "李三",
    timestamp: "2024-01-15 10:15:00",
    isRead: false,
  },
];

// 根据角色获取中文名称
const getRoleName = (role: string) => {
  switch (role) {
    case 'admin': return '平台管理员'
    case 'projectManager': return '项目经理'
    case 'architect': return '系统架构师'
    case 'simulation': return '仿真工程师'
    case 'modeling': return '建模工程师'
    default: return '用户'
  }
}

// 获取用户名首字符作为头像
const getUserInitial = (name: string) => {
  return name ? name.charAt(0) : 'U'
}

export function TopBar({ currentPage, onCreateProject }: TopBarProps) {
  const { user } = useAuth()
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNotificationClick = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-gray-900">{pageTitle[currentPage] || "MBSE平台"}</h1>
        <div className="border-l border-gray-300 h-6" />
        <ProjectContextSwitcher onCreateProject={onCreateProject} />
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
          <Search className="w-5 h-5" />
        </button>

        {/* 通知按钮 */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 relative transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* 通知下拉面板 */}
          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">通知</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      全部已读
                    </button>
                  )}
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    暂无通知
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                        !notification.isRead ? "bg-blue-50" : ""
                      }`}
                      onClick={() => handleNotificationClick(notification.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <Bell className="w-4 h-4 text-orange-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-gray-900 text-sm">
                              {notification.title}
                            </p>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">
                              {notification.timestamp}
                            </span>
                            <button className="text-xs text-blue-600 hover:text-blue-800">
                              立即处理
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {notifications.length > 0 && (
                <div className="p-4 border-t border-gray-200">
                  <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800">
                    查看全部通知
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
          <Settings className="w-5 h-5" />
        </button>
        
        {/* 用户信息 - 显示当前登录用户 */}
        {user && (
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">{user.name}</div>
              <div className="text-xs text-gray-500">{getRoleName(user.role)}</div>
            </div>
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-blue-600 text-white text-sm">
                {getUserInitial(user.name)}
              </AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>
    </header>
  )
}