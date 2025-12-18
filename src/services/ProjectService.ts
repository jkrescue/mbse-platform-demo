import {
  Project,
  ProjectTemplate,
  CreateProjectRequest,
  ProjectFilter,
  ProjectKPI,
  ProjectLink,
  ProjectStatistics,
  ProjectStatus,
  ProjectType,
  ProjectPhase,
  Milestone
} from '../types/project'

// Mock数据：项目模板
const projectTemplates: ProjectTemplate[] = [
  {
    id: 'template-vehicle',
    name: '新能源整车开发项目',
    type: 'vehicle',
    description: '完整的新能源整车开发流程，包含从概念设计到量产准备的全部里程碑',
    thumbnail: undefined,
    defaultMilestones: [
      {
        name: '概念方案评审',
        targetDate: '',
        status: 'pending',
        dependencies: [],
        deliverables: ['概念设计报告', '可行性分析'],
        progress: 0
      },
      {
        name: '详细设计完成',
        targetDate: '',
        status: 'pending',
        dependencies: [],
        deliverables: ['详细设计文档', 'CAD模型'],
        progress: 0
      },
      {
        name: '样车试制',
        targetDate: '',
        status: 'pending',
        dependencies: [],
        deliverables: ['样车', '测试报告'],
        progress: 0
      },
      {
        name: '量产准备',
        targetDate: '',
        status: 'pending',
        dependencies: [],
        deliverables: ['工艺文件', '质量标准'],
        progress: 0
      }
    ],
    defaultWorkflows: [],
    suggestedTeamRoles: ['projectManager', 'architect', 'simulation', 'modeling'],
    estimatedDuration: 730, // 2年
    isBuiltIn: true,
    createdAt: '2024-01-01',
    usageCount: 15
  },
  {
    id: 'template-powertrain',
    name: '三电系统开发项目',
    type: 'powertrain',
    description: '电池、电机、电控三电系统的集成开发与优化',
    thumbnail: undefined,
    defaultMilestones: [
      {
        name: '系统架构设计',
        targetDate: '',
        status: 'pending',
        dependencies: [],
        deliverables: ['系统架构图', '接口定义'],
        progress: 0
      },
      {
        name: '仿真验证完成',
        targetDate: '',
        status: 'pending',
        dependencies: [],
        deliverables: ['仿真报告', '优化方案'],
        progress: 0
      },
      {
        name: '台架测试',
        targetDate: '',
        status: 'pending',
        dependencies: [],
        deliverables: ['测试数据', '性能报告'],
        progress: 0
      }
    ],
    defaultWorkflows: [],
    suggestedTeamRoles: ['architect', 'simulation', 'modeling'],
    estimatedDuration: 365, // 1年
    isBuiltIn: true,
    createdAt: '2024-01-01',
    usageCount: 8
  },
  {
    id: 'template-battery',
    name: '电池包开发项目',
    type: 'battery',
    description: '动力电池包的设计、仿真与测试验证',
    thumbnail: undefined,
    defaultMilestones: [
      {
        name: '电芯选型完成',
        targetDate: '',
        status: 'pending',
        dependencies: [],
        deliverables: ['选型报告'],
        progress: 0
      },
      {
        name: '热管理设计',
        targetDate: '',
        status: 'pending',
        dependencies: [],
        deliverables: ['热管理方案', '仿真分析'],
        progress: 0
      },
      {
        name: 'BMS开发完成',
        targetDate: '',
        status: 'pending',
        dependencies: [],
        deliverables: ['BMS软件', '测试报告'],
        progress: 0
      }
    ],
    defaultWorkflows: [],
    suggestedTeamRoles: ['architect', 'simulation', 'modeling'],
    estimatedDuration: 180, // 6个月
    isBuiltIn: true,
    createdAt: '2024-01-01',
    usageCount: 12
  },
  {
    id: 'template-custom',
    name: '空白项目',
    type: 'custom',
    description: '从零开始创建自定义项目',
    thumbnail: undefined,
    defaultMilestones: [],
    defaultWorkflows: [],
    suggestedTeamRoles: [],
    estimatedDuration: 90,
    isBuiltIn: true,
    createdAt: '2024-01-01',
    usageCount: 5
  }
]

// Mock数据：项目列表
let mockProjects: Project[] = [
  {
    id: 'proj-001',
    name: 'A00级纯电动车开发',
    code: 'A00-NEV-2025',
    type: 'vehicle',
    phase: 'design',
    status: 'active',
    startDate: '2025-01-01',
    endDate: '2026-12-31',
    budget: 35000000,
    actualCost: 12800000,
    currency: 'CNY',
    ownerId: 'user-pm-001',
    ownerName: '张三',
    department: '研发部',
    teamMembers: [
      {
        userId: 'user-pm-001',
        userName: '张三',
        role: 'projectManager',
        projectRole: 'owner',
        joinDate: '2025-01-01'
      },
      {
        userId: 'user-arch-001',
        userName: '李四',
        role: 'architect',
        projectRole: 'architect',
        joinDate: '2025-01-01'
      },
      {
        userId: 'user-sim-001',
        userName: '王五',
        role: 'simulation',
        projectRole: 'engineer',
        joinDate: '2025-01-15'
      }
    ],
    milestones: [
      {
        id: 'ms-001',
        name: '概念方案评审',
        targetDate: '2025-03-31',
        actualDate: '2025-03-28',
        status: 'completed',
        dependencies: [],
        deliverables: ['概念设计报告', '可行性分析'],
        progress: 100
      },
      {
        id: 'ms-002',
        name: '详细设计完成',
        targetDate: '2025-09-30',
        status: 'inprogress',
        dependencies: ['ms-001'],
        deliverables: ['详细设计文档', 'CAD模型'],
        progress: 65
      },
      {
        id: 'ms-003',
        name: '样车试制',
        targetDate: '2026-03-31',
        status: 'pending',
        dependencies: ['ms-002'],
        deliverables: ['样车', '测试报告'],
        progress: 0
      },
      {
        id: 'ms-004',
        name: '量产准备',
        targetDate: '2026-11-30',
        status: 'pending',
        dependencies: ['ms-003'],
        deliverables: ['工艺文件', '质量标准'],
        progress: 0
      }
    ],
    description: '面向城市通勤的A00级纯电动车，主打高性价比，目标续航350km',
    templateId: 'template-vehicle',
    workflowCount: 13,
    modelCount: 28,
    appCount: 2,
    progress: 38,
    createdAt: '2025-01-01',
    updatedAt: '2025-10-27',
    createdBy: 'user-pm-001'
  },
  {
    id: 'proj-002',
    name: '高性能三电系统研发',
    code: 'PWR-TRAIN-2025',
    type: 'powertrain',
    phase: 'validation',
    status: 'active',
    startDate: '2024-06-01',
    endDate: '2025-12-31',
    budget: 18000000,
    actualCost: 14200000,
    currency: 'CNY',
    ownerId: 'user-pm-002',
    ownerName: '赵六',
    department: '动力系统部',
    teamMembers: [
      {
        userId: 'user-pm-002',
        userName: '赵六',
        role: 'projectManager',
        projectRole: 'owner',
        joinDate: '2024-06-01'
      }
    ],
    milestones: [
      {
        id: 'ms-005',
        name: '系统架构设计',
        targetDate: '2024-08-31',
        actualDate: '2024-08-25',
        status: 'completed',
        dependencies: [],
        deliverables: ['系统架构图'],
        progress: 100
      },
      {
        id: 'ms-006',
        name: '仿真验证完成',
        targetDate: '2025-02-28',
        actualDate: '2025-02-20',
        status: 'completed',
        dependencies: ['ms-005'],
        deliverables: ['仿真报告'],
        progress: 100
      },
      {
        id: 'ms-007',
        name: '台架测试',
        targetDate: '2025-08-31',
        status: 'inprogress',
        dependencies: ['ms-006'],
        deliverables: ['测试数据'],
        progress: 45
      }
    ],
    description: '300kW高性能三电系统，支持800V高压平台',
    templateId: 'template-powertrain',
    workflowCount: 8,
    modelCount: 15,
    appCount: 1,
    progress: 72,
    createdAt: '2024-06-01',
    updatedAt: '2025-10-27',
    createdBy: 'user-pm-002'
  }
]

// Mock数据：项目KPI
const mockProjectKPIs: Map<string, ProjectKPI> = new Map([
  [
    'proj-001',
    {
      projectId: 'proj-001',
      schedule: {
        plannedProgress: 42,
        actualProgress: 38,
        variance: -4,
        criticalPath: ['ms-002', 'ms-003']
      },
      cost: {
        plannedCost: 14500000,
        actualCost: 12800000,
        variance: -1700000,
        forecastCost: 33200000
      },
      quality: {
        defectCount: 8,
        testCoverage: 76,
        complianceScore: 92,
        issueCount: 3
      },
      risk: {
        openRisks: 5,
        highPriorityRisks: 2,
        mitigationRate: 68,
        riskScore: 42
      },
      resource: {
        teamUtilization: 78,
        computeUtilization: 52,
        licenseUsage: 65,
        storageUsage: 34
      },
      updatedAt: '2025-10-27'
    }
  ]
])

// Mock数据：项目关联
const mockProjectLinks: Map<string, ProjectLink> = new Map([
  [
    'proj-001',
    {
      projectId: 'proj-001',
      workflowIds: ['1', '2', '3'],
      modelIds: ['model-001', 'model-002'],
      appIds: ['app-001'],
      datasetIds: [],
      toolConfigIds: [],
      linkType: 'owned',
      linkDate: '2025-01-01',
      linkedBy: 'user-pm-001'
    }
  ]
])

class ProjectService {
  // 获取所有项目模板
  getTemplates(): ProjectTemplate[] {
    return projectTemplates
  }

  // 获取单个模板
  getTemplate(templateId: string): ProjectTemplate | undefined {
    return projectTemplates.find(t => t.id === templateId)
  }

  // 创建项目
  createProject(request: CreateProjectRequest, userId: string, userName: string): Project {
    const template = request.templateId ? this.getTemplate(request.templateId) : undefined
    
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name: request.name,
      code: request.code,
      type: request.type,
      phase: request.phase,
      status: 'active',
      startDate: request.startDate,
      endDate: request.endDate,
      budget: request.budget,
      currency: request.currency,
      ownerId: userId,
      ownerName: userName,
      department: request.department,
      teamMembers: request.teamMembers || [
        {
          userId,
          userName,
          role: 'projectManager',
          projectRole: 'owner',
          joinDate: new Date().toISOString()
        }
      ],
      milestones: template
        ? template.defaultMilestones.map((ms, idx) => ({
            ...ms,
            id: `ms-${Date.now()}-${idx}`,
            targetDate: this.calculateMilestoneDate(request.startDate, idx, template.defaultMilestones.length, request.endDate)
          }))
        : [],
      description: request.description,
      templateId: request.templateId,
      workflowCount: 0,
      modelCount: 0,
      appCount: 0,
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: userId
    }

    mockProjects.push(newProject)
    
    // 初始化项目关联
    mockProjectLinks.set(newProject.id, {
      projectId: newProject.id,
      workflowIds: [],
      modelIds: [],
      appIds: [],
      datasetIds: [],
      toolConfigIds: [],
      linkType: 'owned',
      linkDate: new Date().toISOString(),
      linkedBy: userId
    })

    return newProject
  }

  // 计算里程碑日期（均匀分布）
  private calculateMilestoneDate(startDate: string, index: number, total: number, endDate: string): string {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const duration = end.getTime() - start.getTime()
    const interval = duration / total
    const targetDate = new Date(start.getTime() + interval * (index + 1))
    return targetDate.toISOString().split('T')[0]
  }

  // 获取所有项目
  getProjects(filter?: ProjectFilter): Project[] {
    let filtered = [...mockProjects]

    if (filter) {
      if (filter.status && filter.status.length > 0) {
        filtered = filtered.filter(p => filter.status!.includes(p.status))
      }
      if (filter.type && filter.type.length > 0) {
        filtered = filtered.filter(p => filter.type!.includes(p.type))
      }
      if (filter.phase && filter.phase.length > 0) {
        filtered = filtered.filter(p => filter.phase!.includes(p.phase))
      }
      if (filter.ownerId) {
        filtered = filtered.filter(p => p.ownerId === filter.ownerId)
      }
      if (filter.search) {
        const search = filter.search.toLowerCase()
        filtered = filtered.filter(p =>
          p.name.toLowerCase().includes(search) ||
          p.code.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search)
        )
      }
    }

    return filtered
  }

  // 获取单个项目
  getProject(projectId: string): Project | undefined {
    return mockProjects.find(p => p.id === projectId)
  }

  // 更新项目
  updateProject(projectId: string, updates: Partial<Project>): Project | undefined {
    const index = mockProjects.findIndex(p => p.id === projectId)
    if (index === -1) return undefined

    mockProjects[index] = {
      ...mockProjects[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }

    return mockProjects[index]
  }

  // 删除项目
  deleteProject(projectId: string): boolean {
    const index = mockProjects.findIndex(p => p.id === projectId)
    if (index === -1) return false

    mockProjects.splice(index, 1)
    mockProjectLinks.delete(projectId)
    mockProjectKPIs.delete(projectId)
    return true
  }

  // 归档项目
  archiveProject(projectId: string): Project | undefined {
    return this.updateProject(projectId, { status: 'archived' })
  }

  // 获取项目KPI
  getProjectKPI(projectId: string): ProjectKPI | undefined {
    return mockProjectKPIs.get(projectId)
  }

  // 获取项目关联资源
  getProjectLinks(projectId: string): ProjectLink | undefined {
    return mockProjectLinks.get(projectId)
  }

  // 添加资源到项目
  addResourceToProject(projectId: string, resourceType: 'workflow' | 'model' | 'app', resourceId: string): void {
    const links = mockProjectLinks.get(projectId)
    if (!links) return

    switch (resourceType) {
      case 'workflow':
        if (!links.workflowIds.includes(resourceId)) {
          links.workflowIds.push(resourceId)
        }
        break
      case 'model':
        if (!links.modelIds.includes(resourceId)) {
          links.modelIds.push(resourceId)
        }
        break
      case 'app':
        if (!links.appIds.includes(resourceId)) {
          links.appIds.push(resourceId)
        }
        break
    }

    // 更新项目统计
    const project = this.getProject(projectId)
    if (project) {
      this.updateProject(projectId, {
        workflowCount: links.workflowIds.length,
        modelCount: links.modelIds.length,
        appCount: links.appIds.length
      })
    }
  }

  // 从项目移除资源
  removeResourceFromProject(projectId: string, resourceType: 'workflow' | 'model' | 'app', resourceId: string): void {
    const links = mockProjectLinks.get(projectId)
    if (!links) return

    switch (resourceType) {
      case 'workflow':
        links.workflowIds = links.workflowIds.filter(id => id !== resourceId)
        break
      case 'model':
        links.modelIds = links.modelIds.filter(id => id !== resourceId)
        break
      case 'app':
        links.appIds = links.appIds.filter(id => id !== resourceId)
        break
    }

    // 更新项目统计
    const project = this.getProject(projectId)
    if (project) {
      this.updateProject(projectId, {
        workflowCount: links.workflowIds.length,
        modelCount: links.modelIds.length,
        appCount: links.appIds.length
      })
    }
  }

  // 获取项目统计
  getStatistics(userId?: string, userRole?: string): ProjectStatistics {
    const projects = userId && userRole !== 'admin'
      ? mockProjects.filter(p => p.ownerId === userId || p.teamMembers.some(m => m.userId === userId))
      : mockProjects

    const stats: ProjectStatistics = {
      totalProjects: projects.length,
      activeProjects: projects.filter(p => p.status === 'active').length,
      completedProjects: 0, // 可以根据里程碑计算
      onHoldProjects: projects.filter(p => p.status === 'onhold').length,
      byType: {
        vehicle: projects.filter(p => p.type === 'vehicle').length,
        powertrain: projects.filter(p => p.type === 'powertrain').length,
        battery: projects.filter(p => p.type === 'battery').length,
        custom: projects.filter(p => p.type === 'custom').length
      },
      byPhase: {
        concept: projects.filter(p => p.phase === 'concept').length,
        design: projects.filter(p => p.phase === 'design').length,
        validation: projects.filter(p => p.phase === 'validation').length,
        production: projects.filter(p => p.phase === 'production').length
      },
      totalBudget: projects.reduce((sum, p) => sum + p.budget, 0),
      totalActualCost: projects.reduce((sum, p) => sum + (p.actualCost || 0), 0),
      averageProgress: projects.length > 0
        ? projects.reduce((sum, p) => sum + (p.progress || 0), 0) / projects.length
        : 0
    }

    return stats
  }

  // 检查用户权限
  checkPermission(projectId: string, userId: string, action: 'view' | 'edit' | 'delete' | 'manage'): boolean {
    const project = this.getProject(projectId)
    if (!project) return false

    // 项目所有者有所有权限
    if (project.ownerId === userId) return true

    // 检查是否是团队成员
    const member = project.teamMembers.find(m => m.userId === userId)
    if (!member) return false

    // 根据项目角色判断权限
    switch (action) {
      case 'view':
        return true // 所有团队成员都可以查看
      case 'edit':
        return member.projectRole === 'owner' || member.projectRole === 'architect' || member.projectRole === 'engineer'
      case 'delete':
      case 'manage':
        return member.projectRole === 'owner'
      default:
        return false
    }
  }
}

export const projectService = new ProjectService()
