import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'

export type UserRole = 'admin' | 'projectManager' | 'architect' | 'simulation' | 'modeling'

export interface User {
  id: string
  username: string
  name: string
  email: string
  role: UserRole
  department: string
  avatar?: string
  permissions: string[]
  projects: string[]
  lastLogin?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// 模拟用户数据库 - 在实际应用中应该来自后端API
const mockUsers: Record<string, User> = {
  'admin': {
    id: 'admin-001',
    username: 'admin',
    name: '系统管理员',
    email: 'admin@mbse.com',
    role: 'admin',
    department: '信息技术部',
    permissions: [
      'platform.manage', 'user.manage', 'system.monitor', 
      'workflow.admin', 'app.admin', 'component.admin', 'model.admin'
    ],
    projects: ['all'],
    lastLogin: '2024-03-11 09:30'
  },
  'pmzhang': {
    id: 'pm-001',
    username: 'pmzhang',
    name: '项目经理张总',
    email: 'zhang@mbse.com',
    role: 'projectManager',
    department: '项目管理办公室',
    permissions: [
      'project.manage', 'workflow.manage', 'app.create', 
      'team.manage', 'approval.handle'
    ],
    projects: ['bms-project', 'thermal-project', 'autonomous-project'],
    lastLogin: '2024-03-11 08:45'
  },
  'archli': {
    id: 'sa-001',
    username: 'archli',
    name: '架构师李工',
    email: 'li@mbse.com',
    role: 'architect',
    department: '系统设计部',
    permissions: [
      'architecture.design', 'model.review', 'sysml.edit', 
      'ssp.export', 'component.design'
    ],
    projects: ['bms-project', 'thermal-project'],
    lastLogin: '2024-03-11 09:15'
  },
  'simwang': {
    id: 'se-001',
    username: 'simwang',
    name: '仿真工程师王工',
    email: 'wang@mbse.com',
    role: 'simulation',
    department: '仿真验证部',
    permissions: [
      'simulation.run', 'fmu.manage', 'result.analyze', 
      'scenario.config', 'performance.monitor'
    ],
    projects: ['bms-project', 'autonomous-project'],
    lastLogin: '2024-03-11 07:30'
  },
  'modelchen': {
    id: 'me-001',
    username: 'modelchen',
    name: '建模工程师陈工',
    email: 'chen@mbse.com',
    role: 'modeling',
    department: '建模开发部',
    permissions: [
      'model.develop', 'model.upload', 'simulink.use', 
      'modelica.use', 'model.test'
    ],
    projects: ['bms-project', 'thermal-project', 'autonomous-project'],
    lastLogin: '2024-03-10 16:20'
  }
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // 模拟登录函数
  const login = async (username: string, password: string): Promise<boolean> => {
    setLoading(true)
    
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 简单的用户名密码验证 (在生产环境中应该调用后端API)
    const foundUser = mockUsers[username.toLowerCase()]
    
    if (foundUser && password === '123456') { // 模拟密码验证
      const loggedInUser = {
        ...foundUser,
        lastLogin: new Date().toLocaleString('zh-CN')
      }
      setUser(loggedInUser)
      
      // 在实际应用中，这里应该保存JWT token
      localStorage.setItem('mbse_user', JSON.stringify(loggedInUser))
      localStorage.setItem('mbse_token', 'mock_jwt_token_' + Date.now())
      
      setLoading(false)
      return true
    }
    
    setLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('mbse_user')
    localStorage.removeItem('mbse_token')
  }

  // 页面刷新时恢复登录状态
  useEffect(() => {
    const savedUser = localStorage.getItem('mbse_user')
    const savedToken = localStorage.getItem('mbse_token')
    
    if (savedUser && savedToken) {
      try {
        const parsedUser = JSON.parse(savedUser)
        setUser(parsedUser)
      } catch (error) {
        console.error('Failed to parse saved user:', error)
        localStorage.removeItem('mbse_user')
        localStorage.removeItem('mbse_token')
      }
    }
    
    setLoading(false)
  }, [])

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// 权限检查辅助函数
export function hasPermission(user: User | null, permission: string): boolean {
  if (!user) return false
  return user.permissions.includes(permission) || user.role === 'admin'
}

// 项目访问权限检查
export function hasProjectAccess(user: User | null, projectId: string): boolean {
  if (!user) return false
  return user.projects.includes('all') || user.projects.includes(projectId)
}

// 获取用户可访问的菜单项
export function getAccessibleMenuItems(user: User | null) {
  if (!user) return []

  const menuItems = [
    {
      id: "console",
      permission: "console.access",
      alwaysShow: true // 控制台对所有登录用户可见
    },
    {
      id: "workflow",
      permission: "workflow.access",
      roles: ['admin', 'projectManager', 'architect', 'simulation', 'modeling']
    },
    {
      id: "appCenter",
      permission: "app.access",
      roles: ['admin', 'projectManager', 'architect', 'simulation']
    },
    {
      id: "componentManagement",
      permission: "component.access",
      roles: ['admin', 'projectManager', 'architect']
    },
    {
      id: "toolService",
      permission: "tool.access",
      roles: ['admin', 'architect', 'simulation', 'modeling']
    },
    {
      id: "modelManagement",
      permission: "model.access",
      roles: ['admin', 'projectManager', 'architect', 'simulation', 'modeling']
    }
  ]

  return menuItems.filter(item => {
    if (item.alwaysShow) return true
    if (user.role === 'admin') return true
    return item.roles?.includes(user.role) || false
  })
}