/**
 * 任务管理数据模型
 * 用于项目阶段任务管理、指标下发、模型提交等功能
 */

import { UserRole } from '../components/AuthContext'

// 任务状态
export type TaskStatus = 'not_started' | 'in_progress' | 'under_review' | 'completed' | 'blocked' | 'cancelled'

// 任务优先级
export type TaskPriority = 'critical' | 'high' | 'medium' | 'low'

// 指标评估置信度
export type ConfidenceLevel = 'very_high' | 'high' | 'medium' | 'low' | 'very_low'

// 指标来源类型
export type MetricSourceType = 
  | 'customer_requirement'    // 客户需求
  | 'regulation'              // 法规要求
  | 'competitor_benchmark'    // 竞品对标
  | 'internal_target'         // 内部目标
  | 'technical_constraint'    // 技术约束
  | 'cost_optimization'       // 成本优化

// 指标最优性评估
export type OptimalityAssessment = 
  | 'optimal'           // 最优
  | 'near_optimal'      // 接近最优
  | 'acceptable'        // 可接受
  | 'needs_improvement' // 需要改进
  | 'not_feasible'      // 不可行

// 模型-指标匹配类型
export type ModelMetricMatchType = 
  | 'direct_output'     // 直接输出
  | 'derived'           // 派生计算
  | 'constraint'        // 约束条件
  | 'validation'        // 验证手段

// 任务指标关联
export interface TaskMetricAssignment {
  id: string
  taskId: string
  metricId: string
  metricName: string          // 冗余字段，便于显示
  metricCode: string
  
  // 指标评估（任务开始阶段填写）
  assessment: {
    // 指标来源
    source: MetricSourceType
    sourceDetail: string      // 具体来源说明
    
    // 完成信心
    confidence: ConfidenceLevel
    confidenceReason: string  // 信心依据
    
    // 最优性评估
    optimality: OptimalityAssessment
    optimalityJustification: string  // 最优性说明
    
    // 基线与目标
    baselineValue?: number    // 基线值
    targetValue: number       // 目标值
    challengeValue?: number   // 挑战值
    
    // 风险与挑战
    risks: string[]           // 风险因素
    technicalChallenges: string[]  // 技术挑战
    
    // 评估人与时间
    assessedBy: string
    assessedAt: string
  }
  
  // 指标完成情况（任务过程中更新）
  progress: {
    currentValue?: number
    achievementRate: number   // 达成率 0-100
    trend: 'improving' | 'stable' | 'declining'
    lastUpdated: string
    updatedBy: string
  }
  
  // 验证方式
  verificationMethod: 'simulation' | 'test' | 'analysis' | 'calculation'
  verificationWorkflowId?: string  // 关联的工作流ID
  
  // 元数据
  assignedAt: string
  assignedBy: string
}

// 任务模型提交
export interface TaskModelSubmission {
  id: string
  taskId: string
  modelId: string
  modelName: string
  modelVersion: string
  
  // 模型-指标匹配关系
  metricMatches: {
    metricId: string
    metricName: string
    matchType: ModelMetricMatchType
    parameterPath: string     // 模型参数路径，如 "battery.energyDensity"
    calculationFormula?: string  // 如果是派生计算，描述公式
    confidence: ConfidenceLevel  // 匹配可信度
  }[]
  
  // 提交信息
  submitType: 'initial' | 'update' | 'revision' | 'final'
  description: string
  changeLog?: string
  
  // 验证状态
  validationStatus: 'pending' | 'validated' | 'rejected'
  validationComments?: string
  validatedBy?: string
  validatedAt?: string
  
  // 元数据
  submittedBy: string
  submittedAt: string
}

// 任务主体
export interface Task {
  id: string
  projectId: string
  phaseId: string             // 所属项目阶段（对应项目里程碑）
  phaseName: string           // 冗余字段
  
  // 基本信息
  name: string
  code: string                // 任务编号，如 TASK-001
  description: string
  type: 'design' | 'simulation' | 'testing' | 'analysis' | 'review' | 'integration' | 'other'
  
  // 状态与优先级
  status: TaskStatus
  priority: TaskPriority
  
  // 时间计划
  startDate: string
  dueDate: string
  actualStartDate?: string
  actualEndDate?: string
  estimatedHours: number
  actualHours?: number
  
  // 任务派发
  assignee: {
    userId: string
    userName: string
    role: UserRole
    assignedAt: string
    assignedBy: string
  }
  
  // 协作者
  collaborators: {
    userId: string
    userName: string
    role: UserRole
  }[]
  
  // 关联指标
  metricAssignments: TaskMetricAssignment[]
  
  // 模型提交
  modelSubmissions: TaskModelSubmission[]
  
  // 工作流关联
  workflowIds: string[]       // 关联的工作流ID
  
  // 依赖关系
  dependencies: string[]      // 依赖的其他任务ID
  blockedBy: string[]         // 被哪些任务阻塞
  
  // 交付物
  deliverables: {
    name: string
    type: 'document' | 'model' | 'report' | 'code' | 'data' | 'other'
    status: 'pending' | 'in_progress' | 'completed'
    url?: string
  }[]
  
  // 进度
  progress: number            // 0-100
  
  // 审核
  review?: {
    required: boolean
    reviewers: string[]       // 审核人ID
    reviewStatus: 'pending' | 'approved' | 'rejected' | 'changes_requested'
    reviewComments?: string
    reviewedBy?: string
    reviewedAt?: string
  }
  
  // 附件与备注
  attachments: {
    name: string
    url: string
    uploadedBy: string
    uploadedAt: string
  }[]
  
  notes: string
  
  // 元数据
  createdBy: string
  createdAt: string
  updatedAt: string
  completedAt?: string
}

// 任务创建请求
export interface CreateTaskRequest {
  projectId: string
  phaseId: string
  name: string
  description: string
  type: Task['type']
  priority: TaskPriority
  startDate: string
  dueDate: string
  estimatedHours: number
  assigneeUserId: string
  collaborators?: string[]    // 用户ID列表
  metricIds: string[]         // 关联的指标ID
  dependencies?: string[]
  deliverables?: Task['deliverables']
  requireReview?: boolean
  reviewers?: string[]
}

// 任务过滤条件
export interface TaskFilter {
  projectId?: string
  phaseId?: string
  status?: TaskStatus[]
  priority?: TaskPriority[]
  assigneeId?: string
  type?: Task['type'][]
  search?: string
  dateRange?: {
    start: string
    end: string
  }
}

// 任务统计
export interface TaskStatistics {
  totalTasks: number
  byStatus: Record<TaskStatus, number>
  byPriority: Record<TaskPriority, number>
  completionRate: number
  onTimeRate: number          // 按时完成率
  averageProgress: number
  totalEstimatedHours: number
  totalActualHours: number
  metricsCount: number        // 关联指标总数
  modelsCount: number         // 提交模型总数
}

// 指标评估模板（用于指导用户填写）
export interface MetricAssessmentTemplate {
  metricId: string
  
  // 预设问题
  questions: {
    question: string
    category: 'source' | 'feasibility' | 'optimality' | 'risk'
    required: boolean
  }[]
  
  // 参考数据
  historicalData?: {
    similarProjects: {
      projectName: string
      achievedValue: number
      difficulty: string
    }[]
    industryBenchmark?: {
      average: number
      best: number
      worst: number
    }
  }
}

// 任务-工作流关联评估
export interface TaskWorkflowAssessment {
  taskId: string
  workflowId: string
  workflowName: string
  
  // 评估的指标
  assessedMetrics: {
    metricId: string
    metricName: string
    
    // 仿真/分析结果
    simulatedValue: number
    targetValue: number
    deviation: number         // 偏差
    deviationPercent: number  // 偏差百分比
    
    // 评估结论
    assessment: 'meets_target' | 'near_target' | 'below_target' | 'exceeds_target'
    recommendation: string
    
    // 敏感性分析
    sensitivity?: {
      parameter: string
      influence: number       // 影响度
    }[]
  }[]
  
  // 工作流执行信息
  executionId: string
  executedAt: string
  executedBy: string
  
  // 评估总结
  overallAssessment: string
  nextSteps: string[]
}
