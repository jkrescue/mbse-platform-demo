// 应用依赖管理相关类型定义
export interface AppDependencies {
  appId: string;
  lastUpdated: string;
  
  // 组件依赖
  components: ComponentDependency[];
  
  // 工具服务依赖  
  toolServices: ToolServiceDependency[];
  
  // 模型版本依赖
  modelVersions: ModelVersionDependency[];
  
  // 依赖关系图
  dependencyGraph: DependencyNode[];
  
  // 依赖健康度
  healthScore: number;
}

export interface ComponentDependency {
  id: string;
  name: string;
  type: 'atomic' | 'composite';        // 原子组件/复合组件
  version: string;
  category: string;                    // 分类（RFLP等）
  status: 'stable' | 'beta' | 'deprecated';
  usageCount: number;                  // 在应用中使用次数
  lastUsed: string;                    // 最后使用时间
  
  // 依赖元信息
  metadata: {
    description: string;
    author: string;
    documentation: string;
    repository: string;
    license: string;
    size: number;                      // 组件大小(KB)
  };
  
  // 兼容性信息
  compatibility: {
    minPlatformVersion: string;
    maxPlatformVersion?: string;
    conflictsWith: string[];           // 冲突组件列表
    recommendedWith: string[];         // 推荐组合
  };
}

export interface ToolServiceDependency {
  id: string;
  name: string;
  type: 'internal' | 'external';      // 内部服务/外部服务
  version: string;
  endpoint: string;
  status: 'active' | 'deprecated' | 'maintenance';
  
  // 服务配置
  configuration: {
    timeout: number;
    retryPolicy: {
      maxRetries: number;
      backoff: string;
    };
    authentication: {
      type: 'apiKey' | 'oauth' | 'basic';
      required: boolean;
    };
  };
  
  // 使用统计
  usage: {
    callCount: number;               // 调用次数
    errorRate: number;               // 错误率
    avgResponseTime: number;         // 平均响应时间
    dataVolume: number;              // 数据传输量
  };
}

export interface ModelVersionDependency {
  id: string;
  modelName: string;
  version: string;
  framework: string;                   // TensorFlow, PyTorch, ONNX等
  status: 'stable' | 'beta' | 'deprecated';
  
  // 模型信息
  modelInfo: {
    size: number;                    // 模型大小(MB)
    inputShape: number[];            // 输入形状
    outputShape: number[];           // 输出形状
    precision: 'fp32' | 'fp16' | 'int8';
    accelerator: 'cpu' | 'gpu' | 'tpu';
  };
  
  // 性能指标
  performance: {
    accuracy: number;                // 准确率
    inferenceTime: number;           // 推理时间(ms)
    memoryUsage: number;            // 内存使用(MB)
    throughput: number;             // 吞吐量(samples/s)
  };
}

export interface ExternalAPIDependency {
  id: string;
  name: string;
  provider: string;
  endpoint: string;
  version: string;
  
  // API配置
  configuration: {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers: Record<string, string>;
    rateLimit: {
      requestsPerMinute: number;
      requestsPerDay: number;
    };
  };
  
  // 可靠性
  reliability: {
    uptime: number;                  // 正常运行时间百分比
    avgResponseTime: number;         // 平均响应时间
    errorRate: number;               // 错误率
  };
}

// 依赖关系图节点
export interface DependencyNode {
  id: string;
  type: 'component' | 'tool' | 'model' | 'api';
  name: string;
  version: string;
  
  // 依赖关系
  dependencies: string[];              // 依赖的节点ID列表
  dependents: string[];                // 依赖此节点的ID列表
  
  // 节点属性
  properties: {
    critical: boolean;               // 是否为关键依赖
    replaceable: boolean;            // 是否可替换
    impact: 'high' | 'medium' | 'low'; // 影响级别
  };
}

// 应用统计数据结构
export interface AppStatistics {
  appId: string;
  appName: string;
  
  // 运行统计
  runStatistics: {
    totalRuns: number;              // 总运行次数
    successfulRuns: number;         // 成功运行次数
    failedRuns: number;             // 失败运行次数
    successRate: number;            // 成功率 (0-100)
    averageExecutionTime: number;   // 平均执行时间(秒)
    lastRunTime: string;            // 最后运行时间
    recentRuns: RunRecord[];        // 最近50次运行记录
  };
  
  // 资源消耗统计
  resourceConsumption: {
    cpuUsageTotal: number;          // 总CPU使用时间(小时)
    memoryPeakUsage: number;        // 内存峰值使用(MB)
    storageUsage: number;           // 存储使用量(MB)
    licenseConsumption: {           // License消耗统计
      totalTokens: number;          // 总消耗Token数
      averageTokensPerRun: number;  // 平均每次运行消耗
      costEstimate: number;         // 估算成本(元)
    };
    networkTraffic: number;         // 网络流量(MB)
  };
  
  // 用户使用统计
  userEngagement: {
    totalUsers: number;             // 总使用用户数
    activeUsers: number;            // 活跃用户数(30天内)
    downloadCount: number;          // 下载次数
    favoriteCount: number;          // 收藏次数
    viewCount: number;              // 查看次数
    commentCount: number;           // 评论数
    ratingAverage: number;          // 平均评分
    topUsers: UserEngagementRecord[]; // 主要使用用户
  };
  
  // 质量指标
  qualityMetrics: {
    errorRate: number;              // 错误率
    timeoutRate: number;            // 超时率
    retryRate: number;              // 重试率
    performanceScore: number;       // 性能评分(0-100)
    reliabilityScore: number;       // 可靠性评分(0-100)
    userSatisfaction: number;       // 用户满意度(0-100)
  };
  
  // 趋势数据
  trends: {
    daily: StatisticsTrend[];       // 日趋势数据
    weekly: StatisticsTrend[];      // 周趋势数据
    monthly: StatisticsTrend[];     // 月趋势数据
  };
}

export interface RunRecord {
  id: string;
  timestamp: string;
  duration: number;
  status: 'success' | 'failed' | 'timeout';
  userId: string;
  errorMessage?: string;
  resourceUsage: {
    cpu: number;
    memory: number;
    tokens: number;
  };
}

export interface UserEngagementRecord {
  userId: string;
  userName: string;
  runCount: number;
  lastActiveTime: string;
  engagement: 'high' | 'medium' | 'low';
}

export interface StatisticsTrend {
  date: string;
  runs: number;
  successRate: number;
  avgDuration: number;
  activeUsers: number;
}

// 运维操作相关类型
export interface OperationalStatus {
  status: 'active' | 'disabled' | 'maintenance' | 'deprecated' | 'emergency';
  substatus?: string;                   // 子状态说明
  lastStatusChange: string;
  statusReason: string;                 // 状态变更原因
  
  availability: {
    uptime: number;                     // 正常运行时间百分比
    lastDowntime: string;               // 最后停机时间
    mttr: number;                       // 平均恢复时间(分钟)
    mtbf: number;                       // 平均故障间隔时间(小时)
  };
  
  capacity: {
    currentLoad: number;                // 当前负载百分比
    maxCapacity: number;                // 最大容量
    utilizationTrend: 'increasing' | 'stable' | 'decreasing';
  };
  
  dependencies: {
    healthy: number;                    // 健康依赖数量
    degraded: number;                   // 降级依赖数量
    failed: number;                     // 失败依赖数量
  };
}

export interface BatchOperation {
  id: string;
  type: 'status-change' | 'maintenance' | 'testing' | 'backup' | 'cleanup';
  
  target: {
    apps: string[];                     // 目标应用ID列表
    filters: AppFilter[];               // 应用筛选条件
    exclusions: string[];               // 排除的应用ID
  };
  
  operation: {
    action: string;                     // 具体操作
    parameters: Record<string, any>;    // 操作参数
    schedule: {
      immediate: boolean;
      scheduledTime?: string;
      staggered: boolean;               // 是否交错执行
      batchSize?: number;               // 批次大小
      delay?: number;                   // 批次间延迟(秒)
    };
  };
  
  safeguards: {
    dryRun: boolean;                    // 是否为演练模式
    confirmation: boolean;              // 是否需要确认
    rollbackEnabled: boolean;           // 是否支持回滚
    maxFailures: number;                // 最大失败数量
    timeoutPerApp: number;              // 单个应用超时时间(分钟)
  };
  
  progress: BatchOperationProgress;
  results: BatchOperationResult[];
}

export interface BatchOperationProgress {
  total: number;
  completed: number;
  failed: number;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  currentApp?: string;
  estimatedCompletion?: string;
}

export interface BatchOperationResult {
  appId: string;
  appName: string;
  status: 'success' | 'failed' | 'skipped';
  message?: string;
  duration: number;
  timestamp: string;
}

export interface AppFilter {
  field: string;
  operator: 'equals' | 'contains' | 'startsWith' | 'in' | 'range';
  value: any;
  display?: string;
}