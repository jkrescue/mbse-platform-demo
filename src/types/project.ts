import { UserRole } from '../components/AuthContext'

// 项目类型
export type ProjectType = 'vehicle' | 'powertrain' | 'battery' | 'custom'

// 项目阶段
export type ProjectPhase = 'concept' | 'design' | 'validation' | 'production'

// 项目状态
export type ProjectStatus = 'active' | 'archived' | 'onhold'

// 里程碑状态
export type MilestoneStatus = 'pending' | 'inprogress' | 'completed' | 'delayed'

// 项目成员
export interface ProjectMember {
  userId: string
  userName: string
  role: UserRole
  projectRole?: 'owner' | 'architect' | 'engineer' | 'analyst' | 'viewer'
  joinDate: string
  avatar?: string
}

// 里程碑
export interface Milestone {
  id: string
  name: string
  targetDate: string
  actualDate?: string
  status: MilestoneStatus
  dependencies: string[] // 依赖的其他里程碑ID
  deliverables: string[] // 交付物清单
  progress: number // 0-100
  description?: string
}

// 项目主表
export interface Project {
  id: string
  name: string
  code: string // 项目代号（唯一）
  type: ProjectType
  phase: ProjectPhase
  status: ProjectStatus
  
  // 时间与成本
  startDate: string
  endDate: string
  budget: number
  actualCost?: number
  currency: 'CNY' | 'USD'
  
  // 组织
  ownerId: string
  ownerName: string
  teamMembers: ProjectMember[]
  department: string
  
  // 里程碑
  milestones: Milestone[]
  
  // 元数据
  description: string
  thumbnail?: string
  templateId?: string // 来自哪个模板
  
  // 统计数据
  workflowCount?: number
  modelCount?: number
  appCount?: number
  progress?: number // 整体进度 0-100
  
  createdAt: string
  updatedAt: string
  createdBy: string
}

// 项目关联资源
export interface ProjectLink {
  projectId: string
  
  // 关联的资源ID列表
  workflowIds: string[]
  modelIds: string[]
  appIds: string[]
  datasetIds: string[]
  toolConfigIds: string[]
  
  // 关联关系元数据
  linkType: 'owned' | 'referenced' | 'shared'
  linkDate: string
  linkedBy: string
}

// 项目KPI
export interface ProjectKPI {
  projectId: string
  
  // 进度
  schedule: {
    plannedProgress: number
    actualProgress: number
    variance: number // 偏差
    criticalPath: string[] // 关键路径里程碑ID
  }
  
  // 成本
  cost: {
    plannedCost: number
    actualCost: number
    variance: number
    forecastCost: number
  }
  
  // 质量
  quality: {
    defectCount: number
    testCoverage: number
    complianceScore: number
    issueCount: number
  }
  
  // 风险
  risk: {
    openRisks: number
    highPriorityRisks: number
    mitigationRate: number
    riskScore: number // 综合风险评分
  }
  
  // 资源
  resource: {
    teamUtilization: number // 人力利用率 0-100
    computeUtilization: number // 算力利用率 0-100
    licenseUsage: number // 许可证占用 0-100
    storageUsage: number // 存储使用率 0-100
  }
  
  updatedAt: string
}

// 项目模板
export interface ProjectTemplate {
  id: string
  name: string
  type: ProjectType
  description: string
  thumbnail?: string
  
  // 预设内容
  defaultMilestones: Omit<Milestone, 'id'>[]
  defaultWorkflows: string[] // 工作流模板ID
  suggestedTeamRoles: UserRole[]
  estimatedDuration: number // 预计持续时间（天）
  
  isBuiltIn: boolean
  createdAt: string
  usageCount: number
}

// 项目创建请求
export interface CreateProjectRequest {
  name: string
  code: string
  type: ProjectType
  phase: ProjectPhase
  startDate: string
  endDate: string
  budget: number
  currency: 'CNY' | 'USD'
  description: string
  templateId?: string
  teamMembers?: ProjectMember[]
  department: string
}

// 项目过滤条件
export interface ProjectFilter {
  status?: ProjectStatus[]
  type?: ProjectType[]
  phase?: ProjectPhase[]
  ownerId?: string
  search?: string
  dateRange?: {
    start: string
    end: string
  }
}

// 项目统计
export interface ProjectStatistics {
  totalProjects: number
  activeProjects: number
  completedProjects: number
  onHoldProjects: number
  
  byType: Record<ProjectType, number>
  byPhase: Record<ProjectPhase, number>
  
  totalBudget: number
  totalActualCost: number
  averageProgress: number
}
