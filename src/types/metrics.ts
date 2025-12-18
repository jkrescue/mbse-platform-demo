/**
 * Metrics & Trade-off 数据模型
 * 用于汽车行业MBSE系统的指标管理、权衡分析和设计空间探索
 */

// 1. 指标定义
export interface Metric {
  id: string;
  projectId: string;
  name: string;              // 续航里程
  code: string;              // RANGE_001
  
  // 分类
  category: 'performance' | 'cost' | 'reliability' | 'compliance' | 'safety';
  level: 'project' | 'system' | 'subsystem' | 'component';
  
  // 目标与约束
  unit: string;              // km, s, kWh/100km
  targetValue: number;       // 500
  lowerBound?: number;       // 450
  upperBound?: number;       // 无上限
  tolerance: number;         // ±5%
  
  // 权重与优先级
  weight: number;            // 0-1, 用于多目标优化
  priority: 'must' | 'should' | 'nice-to-have';
  
  // 当前状态
  currentValue?: number;     // 实际达成值
  predictedValue?: number;   // 基于仿真的预测值
  trend: 'improving' | 'stable' | 'declining';
  
  // 验证方式
  verificationMethod: 'simulation' | 'test' | 'analysis' | 'inspection';
  
  // 追溯
  parentMetricId?: string;   // 分解自哪个上级指标
  childMetricIds: string[];  // 分解出的子指标
  
  // 元数据
  owner: string;
  lastUpdated: string;
  source: string;            // 需求来源（客户、法规、竞品...）
  createdAt: string;
  createdBy: string;
}

// 2. RFLP分解与绑定
export interface MetricBreakdown {
  metricId: string;
  
  // RFLP四层映射
  requirementId?: string;    // R: Polarion需求ID
  functionalId?: string;     // F: 功能架构元素ID
  logicalId?: string;        // L: 逻辑架构元素ID  
  physicalIds: string[];     // P: 物理模型/参数ID
  
  // 绑定的模型参数
  modelBindings: {
    modelId: string;
    parameterPath: string;   // "battery.energyDensity"
    parameterType: 'input' | 'output' | 'constraint';
  }[];
  
  // 验证手段
  verificationItems: {
    type: 'simulation' | 'test';
    workflowId?: string;
    testCaseId?: string;
    evidenceId?: string;     // 验证证据ID
  }[];
  
  // 分解公式（可选）
  decompositionFormula?: string;  // "RANGE = f(batteryCapacity, efficiency, CdA)"
}

// 3. 竞品对标
export interface BenchmarkItem {
  id: string;
  projectId: string;
  
  // 竞品信息
  competitor: string;        // 特斯拉、比亚迪...
  model: string;            // Model 3、海豹...
  variant: string;          // 长续航版、性能版...
  
  // 指标数据（与Metric对应）
  metrics: {
    metricId: string;
    value: number;
    confidence: 'confirmed' | 'estimated' | 'rumored';
  }[];
  
  // 溯源
  source: string;           // 官网、测评、拆解...
  sourceUrl?: string;
  measurementCondition: string;  // WLTP、CLTC...
  
  // 元数据
  releaseDate: string;
  addedDate: string;
  addedBy: string;
}

// 4. 权衡研究
export interface TradeStudy {
  id: string;
  projectId: string;
  name: string;             // "续航vs加速权衡分析"
  description?: string;
  
  // 目标与约束
  objectives: {
    metricId: string;
    direction: 'maximize' | 'minimize';
    weight: number;
  }[];
  
  constraints: {
    metricId: string;
    minValue?: number;
    maxValue?: number;
  }[];
  
  // 候选方案
  candidates: {
    id: string;
    name: string;           // "方案A：高能量密度电池"
    description: string;
    parameters: { [key: string]: number };
    metricValues: { metricId: string; value: number }[];
    cost: number;
    feasibility: number;    // 0-1
  }[];
  
  // 帕累托集
  paretoFrontier: string[]; // candidateIds
  
  // 推荐方案
  recommendedCandidateId?: string;
  recommendation: string;
  
  // 元数据
  createdBy: string;
  createdAt: string;
  lastUpdated: string;
  status: 'draft' | 'review' | 'approved' | 'adopted';
}

// 5. 设计空间探索
export interface DSERun {
  id: string;
  projectId: string;
  tradeStudyId?: string;
  name: string;
  
  // 探索配置
  method: 'sweep' | 'doe' | 'genetic' | 'pso' | 'montecarlo';
  
  parameters: {
    name: string;
    minValue: number;
    maxValue: number;
    step?: number;
    distribution?: 'uniform' | 'normal' | 'lognormal';
  }[];
  
  // DOE配置
  doeConfig?: {
    type: 'fullfactorial' | 'lhs' | 'orthogonal';
    sampleSize: number;
  };
  
  // 优化算法配置
  optimizationConfig?: {
    algorithm: 'nsga2' | 'nsga3' | 'spea2';
    populationSize: number;
    generations: number;
    convergenceTolerance: number;
  };
  
  // 执行状态
  status: 'queued' | 'running' | 'completed' | 'failed';
  progress: number;
  
  // 结果摘要
  resultSummary?: {
    totalRuns: number;
    feasibleRuns: number;
    paretoSolutions: number;
    bestSolution: { parameters: any; objectives: any };
    sensitivityAnalysis: {
      parameter: string;
      influence: number;  // 对目标的影响度
    }[];
  };
  
  // 元数据
  startTime: string;
  endTime?: string;
  computeTime?: number;
  createdBy: string;
}

// 辅助类型
export interface MetricTrend {
  metricId: string;
  timestamp: string;
  value: number;
  source: 'simulation' | 'test' | 'manual';
}

export interface MetricValidation {
  metricId: string;
  validationDate: string;
  validatedBy: string;
  result: 'passed' | 'failed' | 'partial';
  evidence: {
    type: 'simulation' | 'test' | 'document';
    id: string;
    name: string;
  }[];
  notes: string;
}
