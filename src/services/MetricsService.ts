/**
 * MetricsService - 指标管理服务
 * 处理指标、竞品对标、权衡研究和设计空间探索的数据操作
 */

import { 
  Metric, 
  MetricBreakdown, 
  BenchmarkItem, 
  TradeStudy, 
  DSERun,
  MetricTrend,
  MetricValidation
} from '../types/metrics';
import { PRESET_METRICS, PRESET_COMPETITORS, CompetitorPreset } from '../data/presetMetrics';

class MetricsService {
  private metrics: Map<string, Metric> = new Map();
  private breakdowns: Map<string, MetricBreakdown> = new Map();
  private benchmarks: Map<string, BenchmarkItem> = new Map();
  private tradeStudies: Map<string, TradeStudy> = new Map();
  private dseRuns: Map<string, DSERun> = new Map();
  private metricTrends: Map<string, MetricTrend[]> = new Map();
  private metricValidations: Map<string, MetricValidation[]> = new Map();

  constructor() {
    this.initializeMockData();
  }

  // ==================== 指标管理 ====================
  
  /**
   * 获取项目的所有指标
   */
  getMetricsByProject(projectId: string): Metric[] {
    return Array.from(this.metrics.values())
      .filter(metric => metric.projectId === projectId);
  }

  /**
   * 获取指定指标
   */
  getMetric(metricId: string): Metric | undefined {
    return this.metrics.get(metricId);
  }

  /**
   * 创建新指标
   */
  createMetric(metric: Omit<Metric, 'id' | 'createdAt' | 'lastUpdated'>): Metric {
    const newMetric: Metric = {
      ...metric,
      id: `metric_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };
    
    this.metrics.set(newMetric.id, newMetric);
    return newMetric;
  }

  /**
   * 更新指标
   */
  updateMetric(metricId: string, updates: Partial<Metric>): Metric | null {
    const metric = this.metrics.get(metricId);
    if (!metric) return null;

    const updatedMetric = {
      ...metric,
      ...updates,
      id: metric.id,
      lastUpdated: new Date().toISOString(),
    };

    this.metrics.set(metricId, updatedMetric);
    return updatedMetric;
  }

  /**
   * 删除指标
   */
  deleteMetric(metricId: string): boolean {
    return this.metrics.delete(metricId);
  }

  /**
   * 获取指标层级树
   */
  getMetricHierarchy(projectId: string): Metric[] {
    const metrics = this.getMetricsByProject(projectId);
    return metrics.filter(m => !m.parentMetricId);
  }

  /**
   * 获取子指标
   */
  getChildMetrics(metricId: string): Metric[] {
    const metric = this.metrics.get(metricId);
    if (!metric) return [];

    return metric.childMetricIds
      .map(id => this.metrics.get(id))
      .filter(Boolean) as Metric[];
  }

  // ==================== RFLP分解 ====================

  /**
   * 获取指标的RFLP分解
   */
  getMetricBreakdown(metricId: string): MetricBreakdown | undefined {
    return this.breakdowns.get(metricId);
  }

  /**
   * 创建或更新RFLP分解
   */
  setMetricBreakdown(breakdown: MetricBreakdown): void {
    this.breakdowns.set(breakdown.metricId, breakdown);
  }

  /**
   * 删除RFLP分解
   */
  deleteMetricBreakdown(metricId: string): boolean {
    return this.breakdowns.delete(metricId);
  }

  // ==================== 竞品对标 ====================

  /**
   * 获取项目的所有竞品对标
   */
  getBenchmarksByProject(projectId: string): BenchmarkItem[] {
    return Array.from(this.benchmarks.values())
      .filter(benchmark => benchmark.projectId === projectId);
  }

  /**
   * 创建竞品对标
   */
  createBenchmark(benchmark: Omit<BenchmarkItem, 'id' | 'addedDate'>): BenchmarkItem {
    const newBenchmark: BenchmarkItem = {
      ...benchmark,
      id: `benchmark_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      addedDate: new Date().toISOString(),
    };

    this.benchmarks.set(newBenchmark.id, newBenchmark);
    return newBenchmark;
  }

  /**
   * 更新竞品对标
   */
  updateBenchmark(benchmarkId: string, updates: Partial<BenchmarkItem>): BenchmarkItem | null {
    const benchmark = this.benchmarks.get(benchmarkId);
    if (!benchmark) return null;

    const updated = {
      ...benchmark,
      ...updates,
      id: benchmark.id,
    };

    this.benchmarks.set(benchmarkId, updated);
    return updated;
  }

  /**
   * 删除竞品对标
   */
  deleteBenchmark(benchmarkId: string): boolean {
    return this.benchmarks.delete(benchmarkId);
  }

  /**
   * 获取指定指标的竞品对比数据
   */
  getBenchmarkComparison(projectId: string, metricId: string): {
    metric: Metric;
    benchmarks: { competitor: string; model: string; value: number; confidence: string }[];
  } | null {
    const metric = this.metrics.get(metricId);
    if (!metric || metric.projectId !== projectId) return null;

    const projectBenchmarks = this.getBenchmarksByProject(projectId);
    const comparisons = projectBenchmarks.map(benchmark => {
      const metricData = benchmark.metrics.find(m => m.metricId === metricId);
      return metricData ? {
        competitor: benchmark.competitor,
        model: benchmark.model,
        value: metricData.value,
        confidence: metricData.confidence,
      } : null;
    }).filter(Boolean) as { competitor: string; model: string; value: number; confidence: string }[];

    return {
      metric,
      benchmarks: comparisons,
    };
  }

  // ==================== 权衡研究 ====================

  /**
   * 获取项目的所有权衡研究
   */
  getTradeStudiesByProject(projectId: string): TradeStudy[] {
    return Array.from(this.tradeStudies.values())
      .filter(study => study.projectId === projectId);
  }

  /**
   * 获取指定权衡研究
   */
  getTradeStudy(studyId: string): TradeStudy | undefined {
    return this.tradeStudies.get(studyId);
  }

  /**
   * 创建权衡研究
   */
  createTradeStudy(study: Omit<TradeStudy, 'id' | 'createdAt' | 'lastUpdated'>): TradeStudy {
    const newStudy: TradeStudy = {
      ...study,
      id: `trade_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    this.tradeStudies.set(newStudy.id, newStudy);
    return newStudy;
  }

  /**
   * 更新权衡研究
   */
  updateTradeStudy(studyId: string, updates: Partial<TradeStudy>): TradeStudy | null {
    const study = this.tradeStudies.get(studyId);
    if (!study) return null;

    const updated = {
      ...study,
      ...updates,
      id: study.id,
      lastUpdated: new Date().toISOString(),
    };

    this.tradeStudies.set(studyId, updated);
    return updated;
  }

  /**
   * 删除权衡研究
   */
  deleteTradeStudy(studyId: string): boolean {
    return this.tradeStudies.delete(studyId);
  }

  /**
   * 计算帕累托前沿
   */
  calculateParetoFrontier(study: TradeStudy): string[] {
    const candidates = study.candidates;
    const paretoSet: string[] = [];

    for (const candidate of candidates) {
      let isDominated = false;

      for (const other of candidates) {
        if (candidate.id === other.id) continue;

        // 检查是否被支配
        let betterInAll = true;
        let betterInSome = false;

        for (const objective of study.objectives) {
          const candValue = candidate.metricValues.find(m => m.metricId === objective.metricId)?.value ?? 0;
          const otherValue = other.metricValues.find(m => m.metricId === objective.metricId)?.value ?? 0;

          const candScore = objective.direction === 'maximize' ? candValue : -candValue;
          const otherScore = objective.direction === 'maximize' ? otherValue : -otherValue;

          if (otherScore > candScore) {
            betterInSome = true;
          } else if (otherScore < candScore) {
            betterInAll = false;
          }
        }

        if (betterInAll && betterInSome) {
          isDominated = true;
          break;
        }
      }

      if (!isDominated) {
        paretoSet.push(candidate.id);
      }
    }

    return paretoSet;
  }

  // ==================== 设计空间探索 ====================

  /**
   * 获取项目的所有DSE运行
   */
  getDSERunsByProject(projectId: string): DSERun[] {
    return Array.from(this.dseRuns.values())
      .filter(run => run.projectId === projectId);
  }

  /**
   * 获取指定DSE运行
   */
  getDSERun(runId: string): DSERun | undefined {
    return this.dseRuns.get(runId);
  }

  /**
   * 创建DSE运行
   */
  createDSERun(run: Omit<DSERun, 'id' | 'startTime'>): DSERun {
    const newRun: DSERun = {
      ...run,
      id: `dse_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      startTime: new Date().toISOString(),
    };

    this.dseRuns.set(newRun.id, newRun);
    
    // 模拟异步执行
    if (newRun.status === 'running') {
      this.simulateDSEExecution(newRun.id);
    }

    return newRun;
  }

  /**
   * 更新DSE运行
   */
  updateDSERun(runId: string, updates: Partial<DSERun>): DSERun | null {
    const run = this.dseRuns.get(runId);
    if (!run) return null;

    const updated = {
      ...run,
      ...updates,
      id: run.id,
    };

    this.dseRuns.set(runId, updated);
    return updated;
  }

  /**
   * 删除DSE运行
   */
  deleteDSERun(runId: string): boolean {
    return this.dseRuns.delete(runId);
  }

  /**
   * 模拟DSE执行过程
   */
  private simulateDSEExecution(runId: string): void {
    const updateProgress = (progress: number) => {
      const run = this.dseRuns.get(runId);
      if (run) {
        this.updateDSERun(runId, { progress });
      }
    };

    // 模拟进度更新
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      updateProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        // 生成模拟结果
        this.completeDSERun(runId);
      }
    }, 500);
  }

  /**
   * 完成DSE运行并生成结果
   */
  private completeDSERun(runId: string): void {
    const run = this.dseRuns.get(runId);
    if (!run) return;

    const totalRuns = run.parameters.length * 10; // 模拟
    const resultSummary = {
      totalRuns,
      feasibleRuns: Math.floor(totalRuns * 0.8),
      paretoSolutions: Math.floor(totalRuns * 0.1),
      bestSolution: {
        parameters: run.parameters.reduce((acc, p) => ({
          ...acc,
          [p.name]: (p.minValue + p.maxValue) / 2,
        }), {}),
        objectives: {},
      },
      sensitivityAnalysis: run.parameters.map(p => ({
        parameter: p.name,
        influence: Math.random(),
      })),
    };

    this.updateDSERun(runId, {
      status: 'completed',
      progress: 100,
      endTime: new Date().toISOString(),
      computeTime: Math.random() * 3600,
      resultSummary,
    });
  }

  // ==================== 趋势与验证 ====================

  /**
   * 添加指标趋势数据点
   */
  addMetricTrend(trend: MetricTrend): void {
    const trends = this.metricTrends.get(trend.metricId) || [];
    trends.push(trend);
    this.metricTrends.set(trend.metricId, trends);
  }

  /**
   * 获取指标趋势
   */
  getMetricTrends(metricId: string): MetricTrend[] {
    return this.metricTrends.get(metricId) || [];
  }

  /**
   * 添加指标验证记录
   */
  addMetricValidation(validation: MetricValidation): void {
    const validations = this.metricValidations.get(validation.metricId) || [];
    validations.push(validation);
    this.metricValidations.set(validation.metricId, validations);
  }

  /**
   * 获取指标验证记录
   */
  getMetricValidations(metricId: string): MetricValidation[] {
    return this.metricValidations.get(metricId) || [];
  }

  // ==================== 预置数据加载 ====================

  /**
   * 为项目初始化预置指标体系
   */
  initializePresetMetrics(projectId: string): Metric[] {
    const createdMetrics: Metric[] = []
    const metricCodeMap = new Map<string, string>() // metricCode -> metricId

    // 创建预置指标
    PRESET_METRICS.forEach(presetMetric => {
      const metric = this.createMetric({
        ...presetMetric,
        projectId
      })
      createdMetrics.push(metric)
      metricCodeMap.set(metric.code, metric.id)
    })

    // 创建竞品对标数据
    PRESET_COMPETITORS.forEach(competitor => {
      this.createCompetitorBenchmark(projectId, competitor, metricCodeMap)
    })

    return createdMetrics
  }

  /**
   * 创建竞品对标数据
   */
  private createCompetitorBenchmark(
    projectId: string,
    competitor: CompetitorPreset,
    metricCodeMap: Map<string, string>
  ): void {
    const metrics = competitor.metricValues
      .map(mv => {
        const metricId = metricCodeMap.get(mv.metricCode)
        if (!metricId) return null
        return {
          metricId,
          value: mv.value,
          confidence: mv.confidence
        }
      })
      .filter(Boolean) as BenchmarkItem['metrics']

    this.createBenchmark({
      projectId,
      competitor: competitor.competitor,
      model: competitor.model,
      variant: competitor.variant,
      metrics,
      source: competitor.source,
      sourceUrl: competitor.sourceUrl,
      measurementCondition: competitor.measurementCondition,
      releaseDate: competitor.releaseDate,
      addedBy: 'system'
    })
  }

  /**
   * 获取竞品雷达图数据
   */
  getCompetitorRadarData(projectId: string, metricCodes: string[]) {
    const projectMetrics = this.getMetricsByProject(projectId)
    const benchmarks = this.getBenchmarksByProject(projectId)

    // 项目目标数据
    const projectData = metricCodes.map(code => {
      const metric = projectMetrics.find(m => m.code === code)
      if (!metric) return null
      return {
        metricCode: code,
        metricName: metric.name,
        value: metric.targetValue,
        unit: metric.unit
      }
    }).filter(Boolean)

    // 竞品数据
    const competitorData = benchmarks.map(benchmark => {
      const data = metricCodes.map(code => {
        const metric = projectMetrics.find(m => m.code === code)
        if (!metric) return null
        
        const benchmarkMetric = benchmark.metrics.find(bm => bm.metricId === metric.id)
        if (!benchmarkMetric) return null

        return {
          metricCode: code,
          metricName: metric.name,
          value: benchmarkMetric.value,
          unit: metric.unit
        }
      }).filter(Boolean)

      return {
        name: `${benchmark.competitor} ${benchmark.model}`,
        data
      }
    })

    return {
      projectData,
      competitorData
    }
  }

  // ==================== 初始化模拟数据 ====================

  private initializeMockData(): void {
    // 为默认项目初始化预置指标体系
    this.initializePresetMetrics('project_1')
    // 为其他常见项目也初始化
    this.initializePresetMetrics('project_2')
    this.initializePresetMetrics('project_3')
  }
}

export const metricsService = new MetricsService();
export default metricsService;
