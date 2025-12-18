/**
 * TaskService - 任务管理服务
 * 处理任务创建、派发、指标关联、模型提交等功能
 */

import {
  Task,
  TaskStatus,
  TaskPriority,
  CreateTaskRequest,
  TaskFilter,
  TaskStatistics,
  TaskMetricAssignment,
  TaskModelSubmission,
  TaskWorkflowAssessment,
  ConfidenceLevel,
  OptimalityAssessment,
  MetricSourceType
} from '../types/task'
import { projectService } from './ProjectService'
import { metricsService } from './MetricsService'

class TaskService {
  private tasks: Map<string, Task> = new Map()
  private workflowAssessments: Map<string, TaskWorkflowAssessment[]> = new Map()

  constructor() {
    this.initializeMockData()
  }

  // 初始化模拟数据
  private initializeMockData() {
    const mockTask: Task = {
      id: 'task-001',
      projectId: 'proj-001',
      phaseId: 'ms-002',
      phaseName: '详细设计完成',
      name: '电池包能量密度优化',
      code: 'TASK-001',
      description: '通过仿真分析优化电池包能量密度，目标达到180 Wh/kg',
      type: 'simulation',
      status: 'in_progress',
      priority: 'high',
      startDate: '2025-10-01',
      dueDate: '2025-11-30',
      estimatedHours: 120,
      actualHours: 80,
      assignee: {
        userId: 'user-sim-001',
        userName: '王五',
        role: 'simulation',
        assignedAt: '2025-10-01',
        assignedBy: 'user-pm-001'
      },
      collaborators: [
        {
          userId: 'user-arch-001',
          userName: '李四',
          role: 'architect'
        }
      ],
      metricAssignments: [
        {
          id: 'tma-001',
          taskId: 'task-001',
          metricId: 'metric_1730102400000_abc123',
          metricName: '电池包能量密度',
          metricCode: 'ENERGY_DENSITY_001',
          assessment: {
            source: 'customer_requirement',
            sourceDetail: '客户要求续航里程500km，反推得出能量密度需求',
            confidence: 'high',
            confidenceReason: '团队有类似项目经验，技术路径清晰',
            optimality: 'near_optimal',
            optimalityJustification: '当前技术条件下可达到的较优水平，略低于行业领先水平',
            baselineValue: 165,
            targetValue: 180,
            challengeValue: 190,
            risks: [
              '电芯供应商产能不足',
              '热管理系统增加重量'
            ],
            technicalChallenges: [
              'Pack效率提升空间有限',
              '轻量化材料成本较高'
            ],
            assessedBy: 'user-sim-001',
            assessedAt: '2025-10-01T10:00:00Z'
          },
          progress: {
            currentValue: 175,
            achievementRate: 66.7,
            trend: 'improving',
            lastUpdated: '2025-10-28T10:00:00Z',
            updatedBy: 'user-sim-001'
          },
          verificationMethod: 'simulation',
          verificationWorkflowId: '1',
          assignedAt: '2025-10-01T10:00:00Z',
          assignedBy: 'user-pm-001'
        }
      ],
      modelSubmissions: [
        {
          id: 'tms-001',
          taskId: 'task-001',
          modelId: 'model-battery-001',
          modelName: '电池包系统模型',
          modelVersion: 'v1.2',
          metricMatches: [
            {
              metricId: 'metric_1730102400000_abc123',
              metricName: '电池包能量密度',
              matchType: 'direct_output',
              parameterPath: 'batteryPack.energyDensity',
              confidence: 'very_high'
            }
          ],
          submitType: 'update',
          description: '更新热管理模型，优化Pack结构',
          changeLog: '1. 优化液冷板布局\n2. 减轻结构件重量\n3. 提升Pack效率至85%',
          validationStatus: 'validated',
          validationComments: '模型结构合理，参数设置正确',
          validatedBy: 'user-arch-001',
          validatedAt: '2025-10-15T14:00:00Z',
          submittedBy: 'user-sim-001',
          submittedAt: '2025-10-14T16:30:00Z'
        }
      ],
      workflowIds: ['1'],
      dependencies: [],
      blockedBy: [],
      deliverables: [
        {
          name: '能量密度优化报告',
          type: 'report',
          status: 'in_progress'
        },
        {
          name: '优化后的电池包模型',
          type: 'model',
          status: 'completed',
          url: '/models/battery-pack-v1.2'
        }
      ],
      progress: 70,
      review: {
        required: true,
        reviewers: ['user-arch-001', 'user-pm-001'],
        reviewStatus: 'pending'
      },
      attachments: [],
      notes: '当前进展顺利，预计可按时完成目标值',
      createdBy: 'user-pm-001',
      createdAt: '2025-10-01T09:00:00Z',
      updatedAt: '2025-10-28T10:00:00Z'
    }

    this.tasks.set(mockTask.id, mockTask)

    // 添加工作流评估模拟数据
    const mockAssessment: TaskWorkflowAssessment = {
      taskId: 'task-001',
      workflowId: '1',
      workflowName: '电池热管理仿真',
      assessedMetrics: [
        {
          metricId: 'metric_1730102400000_abc123',
          metricName: '电池包能量密度',
          simulatedValue: 175,
          targetValue: 180,
          deviation: -5,
          deviationPercent: -2.78,
          assessment: 'near_target',
          recommendation: '建议进一步优化结构轻量化设计，有望达到目标值',
          sensitivity: [
            {
              parameter: 'Pack效率',
              influence: 0.85
            },
            {
              parameter: '结构件重量',
              influence: 0.72
            }
          ]
        }
      ],
      executionId: 'exec-001',
      executedAt: '2025-10-27T15:30:00Z',
      executedBy: 'user-sim-001',
      overallAssessment: '当前设计方案能量密度为175 Wh/kg，距离目标180 Wh/kg还有2.78%的差距。主要制约因素是Pack效率和结构重量。',
      nextSteps: [
        '采用铝合金替代部分钢制结构件',
        '优化模组排布，提升Pack效率',
        '与电芯供应商沟通，确认高能量密度电芯供货时间'
      ]
    }

    this.workflowAssessments.set('task-001', [mockAssessment])
  }

  // ==================== 任务CRUD ====================

  /**
   * 获取项目的所有任务
   */
  getTasksByProject(projectId: string, filter?: TaskFilter): Task[] {
    let tasks = Array.from(this.tasks.values())
      .filter(task => task.projectId === projectId)

    if (filter) {
      if (filter.phaseId) {
        tasks = tasks.filter(t => t.phaseId === filter.phaseId)
      }
      if (filter.status && filter.status.length > 0) {
        tasks = tasks.filter(t => filter.status!.includes(t.status))
      }
      if (filter.priority && filter.priority.length > 0) {
        tasks = tasks.filter(t => filter.priority!.includes(t.priority))
      }
      if (filter.assigneeId) {
        tasks = tasks.filter(t => t.assignee.userId === filter.assigneeId)
      }
      if (filter.type && filter.type.length > 0) {
        tasks = tasks.filter(t => filter.type!.includes(t.type))
      }
      if (filter.search) {
        const search = filter.search.toLowerCase()
        tasks = tasks.filter(t =>
          t.name.toLowerCase().includes(search) ||
          t.code.toLowerCase().includes(search) ||
          t.description.toLowerCase().includes(search)
        )
      }
    }

    return tasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  /**
   * 获取阶段的所有任务
   */
  getTasksByPhase(projectId: string, phaseId: string): Task[] {
    return this.getTasksByProject(projectId, { phaseId })
  }

  /**
   * 获取用户的任务
   */
  getTasksByUser(userId: string, filter?: TaskFilter): Task[] {
    let tasks = Array.from(this.tasks.values())
      .filter(task => 
        task.assignee.userId === userId ||
        task.collaborators.some(c => c.userId === userId)
      )

    if (filter) {
      if (filter.projectId) {
        tasks = tasks.filter(t => t.projectId === filter.projectId)
      }
      if (filter.status && filter.status.length > 0) {
        tasks = tasks.filter(t => filter.status!.includes(t.status))
      }
    }

    return tasks
  }

  /**
   * 获取单个任务
   */
  getTask(taskId: string): Task | undefined {
    return this.tasks.get(taskId)
  }

  /**
   * 创建任务
   */
  createTask(request: CreateTaskRequest, creatorId: string, creatorName: string): Task {
    const project = projectService.getProject(request.projectId)
    if (!project) {
      throw new Error('项目不存在')
    }

    const phase = project.milestones.find(m => m.id === request.phaseId)
    if (!phase) {
      throw new Error('项目阶段不存在')
    }

    // 生成任务编号
    const taskCount = this.getTasksByProject(request.projectId).length
    const taskCode = `TASK-${String(taskCount + 1).padStart(3, '0')}`

    const newTask: Task = {
      id: `task-${Date.now()}`,
      projectId: request.projectId,
      phaseId: request.phaseId,
      phaseName: phase.name,
      name: request.name,
      code: taskCode,
      description: request.description,
      type: request.type,
      status: 'not_started',
      priority: request.priority,
      startDate: request.startDate,
      dueDate: request.dueDate,
      estimatedHours: request.estimatedHours,
      assignee: {
        userId: request.assigneeUserId,
        userName: project.teamMembers.find(m => m.userId === request.assigneeUserId)?.userName || '未知',
        role: project.teamMembers.find(m => m.userId === request.assigneeUserId)?.role || 'modeling',
        assignedAt: new Date().toISOString(),
        assignedBy: creatorId
      },
      collaborators: (request.collaborators || []).map(userId => {
        const member = project.teamMembers.find(m => m.userId === userId)
        return {
          userId,
          userName: member?.userName || '未知',
          role: member?.role || 'modeling'
        }
      }),
      metricAssignments: [],
      modelSubmissions: [],
      workflowIds: [],
      dependencies: request.dependencies || [],
      blockedBy: [],
      deliverables: request.deliverables || [],
      progress: 0,
      review: request.requireReview ? {
        required: true,
        reviewers: request.reviewers || [],
        reviewStatus: 'pending'
      } : undefined,
      attachments: [],
      notes: '',
      createdBy: creatorId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    this.tasks.set(newTask.id, newTask)

    // 如果有关联指标，创建指标关联（但assessment需要后续填写）
    if (request.metricIds && request.metricIds.length > 0) {
      request.metricIds.forEach(metricId => {
        this.addMetricToTask(newTask.id, metricId, creatorId)
      })
    }

    return newTask
  }

  /**
   * 更新任务
   */
  updateTask(taskId: string, updates: Partial<Task>): Task | null {
    const task = this.tasks.get(taskId)
    if (!task) return null

    const updatedTask = {
      ...task,
      ...updates,
      id: task.id,
      updatedAt: new Date().toISOString()
    }

    this.tasks.set(taskId, updatedTask)
    return updatedTask
  }

  /**
   * 删除任务
   */
  deleteTask(taskId: string): boolean {
    return this.tasks.delete(taskId)
  }

  // ==================== 指标关联管理 ====================

  /**
   * 添加指标到任务
   */
  addMetricToTask(taskId: string, metricId: string, userId: string): TaskMetricAssignment | null {
    const task = this.tasks.get(taskId)
    if (!task) return null

    const metric = metricsService.getMetric(metricId)
    if (!metric) return null

    // 检查是否已经关联
    if (task.metricAssignments.some(ma => ma.metricId === metricId)) {
      return null
    }

    const assignment: TaskMetricAssignment = {
      id: `tma-${Date.now()}`,
      taskId,
      metricId,
      metricName: metric.name,
      metricCode: metric.code,
      assessment: {
        source: 'internal_target',
        sourceDetail: '',
        confidence: 'medium',
        confidenceReason: '',
        optimality: 'acceptable',
        optimalityJustification: '',
        targetValue: metric.targetValue,
        baselineValue: metric.currentValue,
        risks: [],
        technicalChallenges: [],
        assessedBy: userId,
        assessedAt: new Date().toISOString()
      },
      progress: {
        currentValue: metric.currentValue,
        achievementRate: 0,
        trend: 'stable',
        lastUpdated: new Date().toISOString(),
        updatedBy: userId
      },
      verificationMethod: metric.verificationMethod,
      assignedAt: new Date().toISOString(),
      assignedBy: userId
    }

    task.metricAssignments.push(assignment)
    this.updateTask(taskId, { metricAssignments: task.metricAssignments })

    return assignment
  }

  /**
   * 更新任务指标评估
   */
  updateMetricAssessment(
    taskId: string,
    assignmentId: string,
    assessment: Partial<TaskMetricAssignment['assessment']>
  ): TaskMetricAssignment | null {
    const task = this.tasks.get(taskId)
    if (!task) return null

    const assignmentIndex = task.metricAssignments.findIndex(ma => ma.id === assignmentId)
    if (assignmentIndex === -1) return null

    task.metricAssignments[assignmentIndex].assessment = {
      ...task.metricAssignments[assignmentIndex].assessment,
      ...assessment,
      assessedAt: new Date().toISOString()
    }

    this.updateTask(taskId, { metricAssignments: task.metricAssignments })

    return task.metricAssignments[assignmentIndex]
  }

  /**
   * 更新指标进度
   */
  updateMetricProgress(
    taskId: string,
    assignmentId: string,
    progress: Partial<TaskMetricAssignment['progress']>,
    userId: string
  ): TaskMetricAssignment | null {
    const task = this.tasks.get(taskId)
    if (!task) return null

    const assignmentIndex = task.metricAssignments.findIndex(ma => ma.id === assignmentId)
    if (assignmentIndex === -1) return null

    task.metricAssignments[assignmentIndex].progress = {
      ...task.metricAssignments[assignmentIndex].progress,
      ...progress,
      lastUpdated: new Date().toISOString(),
      updatedBy: userId
    }

    this.updateTask(taskId, { metricAssignments: task.metricAssignments })

    return task.metricAssignments[assignmentIndex]
  }

  // ==================== 模型提交管理 ====================

  /**
   * 提交模型到任务
   */
  submitModel(
    taskId: string,
    modelId: string,
    modelName: string,
    modelVersion: string,
    submission: Omit<TaskModelSubmission, 'id' | 'taskId' | 'modelId' | 'modelName' | 'modelVersion' | 'submittedAt'>,
    userId: string
  ): TaskModelSubmission | null {
    const task = this.tasks.get(taskId)
    if (!task) return null

    const newSubmission: TaskModelSubmission = {
      id: `tms-${Date.now()}`,
      taskId,
      modelId,
      modelName,
      modelVersion,
      ...submission,
      submittedBy: userId,
      submittedAt: new Date().toISOString()
    }

    task.modelSubmissions.push(newSubmission)
    this.updateTask(taskId, { modelSubmissions: task.modelSubmissions })

    return newSubmission
  }

  /**
   * 验证模型提交
   */
  validateModelSubmission(
    taskId: string,
    submissionId: string,
    status: 'validated' | 'rejected',
    comments: string,
    validatorId: string
  ): TaskModelSubmission | null {
    const task = this.tasks.get(taskId)
    if (!task) return null

    const submissionIndex = task.modelSubmissions.findIndex(ms => ms.id === submissionId)
    if (submissionIndex === -1) return null

    task.modelSubmissions[submissionIndex].validationStatus = status
    task.modelSubmissions[submissionIndex].validationComments = comments
    task.modelSubmissions[submissionIndex].validatedBy = validatorId
    task.modelSubmissions[submissionIndex].validatedAt = new Date().toISOString()

    this.updateTask(taskId, { modelSubmissions: task.modelSubmissions })

    return task.modelSubmissions[submissionIndex]
  }

  // ==================== 工作流评估 ====================

  /**
   * 添加工作流评估
   */
  addWorkflowAssessment(assessment: TaskWorkflowAssessment): void {
    const assessments = this.workflowAssessments.get(assessment.taskId) || []
    assessments.push(assessment)
    this.workflowAssessments.set(assessment.taskId, assessments)

    // 根据工作流评估更新任务指标进度
    const task = this.tasks.get(assessment.taskId)
    if (task) {
      assessment.assessedMetrics.forEach(am => {
        const assignmentIndex = task.metricAssignments.findIndex(ma => ma.metricId === am.metricId)
        if (assignmentIndex !== -1) {
          const assignment = task.metricAssignments[assignmentIndex]
          const targetValue = assignment.assessment.targetValue
          const achievementRate = (am.simulatedValue / targetValue) * 100

          task.metricAssignments[assignmentIndex].progress = {
            currentValue: am.simulatedValue,
            achievementRate: Math.min(achievementRate, 100),
            trend: am.deviation >= 0 ? 'improving' : 'declining',
            lastUpdated: new Date().toISOString(),
            updatedBy: assessment.executedBy
          }
        }
      })

      this.updateTask(assessment.taskId, { metricAssignments: task.metricAssignments })
    }
  }

  /**
   * 获取任务的工作流评估
   */
  getWorkflowAssessments(taskId: string): TaskWorkflowAssessment[] {
    return this.workflowAssessments.get(taskId) || []
  }

  // ==================== 统计与分析 ====================

  /**
   * 获取任务统计
   */
  getTaskStatistics(projectId: string, phaseId?: string): TaskStatistics {
    const tasks = phaseId
      ? this.getTasksByPhase(projectId, phaseId)
      : this.getTasksByProject(projectId)

    const byStatus: Record<TaskStatus, number> = {
      not_started: 0,
      in_progress: 0,
      under_review: 0,
      completed: 0,
      blocked: 0,
      cancelled: 0
    }

    const byPriority: Record<TaskPriority, number> = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0
    }

    let totalMetrics = 0
    let totalModels = 0
    let completedTasks = 0
    let onTimeTasks = 0

    tasks.forEach(task => {
      byStatus[task.status]++
      byPriority[task.priority]++
      totalMetrics += task.metricAssignments.length
      totalModels += task.modelSubmissions.length

      if (task.status === 'completed') {
        completedTasks++
        if (task.actualEndDate && task.actualEndDate <= task.dueDate) {
          onTimeTasks++
        }
      }
    })

    return {
      totalTasks: tasks.length,
      byStatus,
      byPriority,
      completionRate: tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0,
      onTimeRate: completedTasks > 0 ? (onTimeTasks / completedTasks) * 100 : 0,
      averageProgress: tasks.length > 0
        ? tasks.reduce((sum, t) => sum + t.progress, 0) / tasks.length
        : 0,
      totalEstimatedHours: tasks.reduce((sum, t) => sum + t.estimatedHours, 0),
      totalActualHours: tasks.reduce((sum, t) => sum + (t.actualHours || 0), 0),
      metricsCount: totalMetrics,
      modelsCount: totalModels
    }
  }
}

export const taskService = new TaskService()
