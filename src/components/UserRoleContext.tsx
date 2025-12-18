import React, { createContext, useContext, ReactNode } from 'react'
import { useAuth, User, UserRole } from './AuthContext'

export type { UserRole } from './AuthContext'

export interface UserInfo {
  id: string
  name: string
  role: UserRole
  department: string
  avatar?: string
}

interface UserRoleContextType {
  currentUser: UserInfo
  setCurrentUser: (user: UserInfo) => void
  switchRole: (role: UserRole) => void
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined)

interface UserRoleProviderProps {
  children: ReactNode
}

/**
 * UserRoleProvider 现在作为 AuthContext 的适配器
 * 保持向后兼容，同时使用新的认证系统
 */
export function UserRoleProvider({ children }: UserRoleProviderProps) {
  const { user } = useAuth()

  // 如果没有认证用户，返回默认用户信息
  const currentUser: UserInfo = user ? {
    id: user.id,
    name: user.name,
    role: user.role,
    department: user.department,
    avatar: user.avatar
  } : {
    id: 'guest',
    name: '访客用户',
    role: 'modeling', // 默认角色
    department: '未分配'
  }

  // 这些函数现在主要用于向后兼容
  const setCurrentUser = (userInfo: UserInfo) => {
    console.warn('setCurrentUser is deprecated. Use AuthContext.login instead.')
  }

  const switchRole = (role: UserRole) => {
    console.warn('switchRole is deprecated in production. Roles are determined by authentication.')
  }

  return (
    <UserRoleContext.Provider value={{ currentUser, setCurrentUser, switchRole }}>
      {children}
    </UserRoleContext.Provider>
  )
}

export function useUserRole() {
  const context = useContext(UserRoleContext)
  if (!context) {
    throw new Error('useUserRole must be used within a UserRoleProvider')
  }
  return context
}

export const getRoleName = (role: UserRole): string => {
  const roleNames = {
    admin: '平台管理员',
    projectManager: '项目经理', 
    architect: '系统架构师',
    simulation: '仿真工程师',
    modeling: '建模工程师'
  }
  return roleNames[role]
}

export const getRoleColor = (role: UserRole): string => {
  const roleColors = {
    admin: 'bg-red-100 text-red-800 border-red-200',
    projectManager: 'bg-blue-100 text-blue-800 border-blue-200',
    architect: 'bg-purple-100 text-purple-800 border-purple-200', 
    simulation: 'bg-green-100 text-green-800 border-green-200',
    modeling: 'bg-orange-100 text-orange-800 border-orange-200'
  }
  return roleColors[role]
}

/**
 * 迁移指南：
 * 
 * 1. 现有组件可以继续使用 useUserRole() hook
 * 2. 但建议逐步迁移到 useAuth() hook 以获得完整的认证功能
 * 3. switchRole() 功能在生产环境中被禁用，角色由认证系统确定
 * 4. 所有用户管理应通过 AuthContext 进行
 */