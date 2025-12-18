/**
 * 预置指标体系数据
 * 包含汽车行业MBSE系统的完整指标体系和竞品对标数据
 */

import { Metric, BenchmarkItem } from '../types/metrics'

// ==================== 预置指标定义 ====================
export const PRESET_METRICS: Omit<Metric, 'id' | 'projectId' | 'createdAt' | 'lastUpdated'>[] = [
  // ==================== 性能指标 (Performance) ====================
  {
    name: '续航里程',
    code: 'PERF_RANGE',
    category: 'performance',
    level: 'project',
    unit: 'km',
    targetValue: 600,
    lowerBound: 550,
    tolerance: 5,
    weight: 0.95,
    priority: 'must',
    trend: 'improving',
    verificationMethod: 'simulation',
    childMetricIds: [],
    owner: 'system',
    source: '客户需求 & 竞品对标',
    createdBy: 'system'
  },
  {
    name: '0-100km/h加速时间',
    code: 'PERF_ACCEL',
    category: 'performance',
    level: 'project',
    unit: 's',
    targetValue: 5.8,
    upperBound: 6.5,
    tolerance: 0.2,
    weight: 0.75,
    priority: 'should',
    trend: 'improving',
    verificationMethod: 'test',
    childMetricIds: [],
    owner: 'system',
    source: '市场竞争',
    createdBy: 'system'
  },
  {
    name: '最高车速',
    code: 'PERF_TOP_SPEED',
    category: 'performance',
    level: 'project',
    unit: 'km/h',
    targetValue: 180,
    lowerBound: 170,
    tolerance: 3,
    weight: 0.45,
    priority: 'nice-to-have',
    trend: 'stable',
    verificationMethod: 'test',
    childMetricIds: [],
    owner: 'system',
    source: '法规要求',
    createdBy: 'system'
  },
  {
    name: '百公里能耗',
    code: 'PERF_ENERGY_CONSUMPTION',
    category: 'performance',
    level: 'project',
    unit: 'kWh/100km',
    targetValue: 13.5,
    upperBound: 15.0,
    tolerance: 0.5,
    weight: 0.85,
    priority: 'must',
    trend: 'improving',
    verificationMethod: 'simulation',
    childMetricIds: [],
    owner: 'system',
    source: '客户需求',
    createdBy: 'system'
  },
  {
    name: '制动距离(100-0km/h)',
    code: 'PERF_BRAKING',
    category: 'performance',
    level: 'system',
    unit: 'm',
    targetValue: 36,
    upperBound: 38,
    tolerance: 1,
    weight: 0.65,
    priority: 'must',
    trend: 'stable',
    verificationMethod: 'test',
    childMetricIds: [],
    owner: 'system',
    source: '安全法规',
    createdBy: 'system'
  },
  {
    name: '电机最大功率',
    code: 'PERF_MOTOR_POWER',
    category: 'performance',
    level: 'system',
    unit: 'kW',
    targetValue: 200,
    lowerBound: 180,
    tolerance: 5,
    weight: 0.7,
    priority: 'should',
    trend: 'improving',
    verificationMethod: 'test',
    childMetricIds: [],
    owner: 'system',
    source: '动力性能需求',
    createdBy: 'system'
  },
  {
    name: '电机最大扭矩',
    code: 'PERF_MOTOR_TORQUE',
    category: 'performance',
    level: 'system',
    unit: 'N·m',
    targetValue: 360,
    lowerBound: 340,
    tolerance: 10,
    weight: 0.65,
    priority: 'should',
    trend: 'stable',
    verificationMethod: 'test',
    childMetricIds: [],
    owner: 'system',
    source: '动力性能需求',
    createdBy: 'system'
  },
  {
    name: '爬坡度',
    code: 'PERF_GRADIENT',
    category: 'performance',
    level: 'project',
    unit: '%',
    targetValue: 30,
    lowerBound: 25,
    tolerance: 2,
    weight: 0.5,
    priority: 'should',
    trend: 'stable',
    verificationMethod: 'test',
    childMetricIds: [],
    owner: 'system',
    source: '通过性需求',
    createdBy: 'system'
  },
  {
    name: '充电功率(快充)',
    code: 'PERF_CHARGE_POWER',
    category: 'performance',
    level: 'system',
    unit: 'kW',
    targetValue: 120,
    lowerBound: 100,
    tolerance: 5,
    weight: 0.8,
    priority: 'must',
    trend: 'improving',
    verificationMethod: 'test',
    childMetricIds: [],
    owner: 'system',
    source: '用户体验需求',
    createdBy: 'system'
  },
  {
    name: '30%-80%充电时间',
    code: 'PERF_CHARGE_TIME',
    category: 'performance',
    level: 'system',
    unit: '分钟',
    targetValue: 30,
    upperBound: 35,
    tolerance: 2,
    weight: 0.85,
    priority: 'must',
    trend: 'improving',
    verificationMethod: 'test',
    childMetricIds: [],
    owner: 'system',
    source: '用户体验需求',
    createdBy: 'system'
  },

  // ==================== 成本指标 (Cost) ====================
  {
    name: '整车成本',
    code: 'COST_VEHICLE',
    category: 'cost',
    level: 'project',
    unit: '万元',
    targetValue: 18,
    upperBound: 20,
    tolerance: 1,
    weight: 0.95,
    priority: 'must',
    trend: 'improving',
    verificationMethod: 'analysis',
    childMetricIds: [],
    owner: 'system',
    source: '成本控制目标',
    createdBy: 'system'
  },
  {
    name: '电池包成本',
    code: 'COST_BATTERY',
    category: 'cost',
    level: 'system',
    unit: '元/kWh',
    targetValue: 750,
    upperBound: 850,
    tolerance: 50,
    weight: 0.85,
    priority: 'must',
    trend: 'improving',
    verificationMethod: 'analysis',
    childMetricIds: [],
    owner: 'system',
    source: '供应链成本',
    createdBy: 'system'
  },
  {
    name: '三电系统成本',
    code: 'COST_POWERTRAIN',
    category: 'cost',
    level: 'system',
    unit: '万元',
    targetValue: 6.5,
    upperBound: 7.5,
    tolerance: 0.5,
    weight: 0.75,
    priority: 'should',
    trend: 'stable',
    verificationMethod: 'analysis',
    childMetricIds: [],
    owner: 'system',
    source: '成本分解',
    createdBy: 'system'
  },
  {
    name: '电机成本',
    code: 'COST_MOTOR',
    category: 'cost',
    level: 'component',
    unit: '元',
    targetValue: 8000,
    upperBound: 10000,
    tolerance: 500,
    weight: 0.6,
    priority: 'should',
    trend: 'improving',
    verificationMethod: 'analysis',
    childMetricIds: [],
    owner: 'system',
    source: '供应商报价',
    createdBy: 'system'
  },
  {
    name: '电控成本',
    code: 'COST_CONTROLLER',
    category: 'cost',
    level: 'component',
    unit: '元',
    targetValue: 5000,
    upperBound: 6000,
    tolerance: 300,
    weight: 0.55,
    priority: 'should',
    trend: 'stable',
    verificationMethod: 'analysis',
    childMetricIds: [],
    owner: 'system',
    source: '供应商报价',
    createdBy: 'system'
  },
  {
    name: '车身成本',
    code: 'COST_BODY',
    category: 'cost',
    level: 'system',
    unit: '万元',
    targetValue: 3.5,
    upperBound: 4.0,
    tolerance: 0.3,
    weight: 0.65,
    priority: 'should',
    trend: 'stable',
    verificationMethod: 'analysis',
    childMetricIds: [],
    owner: 'system',
    source: '成本分解',
    createdBy: 'system'
  },
  {
    name: '底盘成本',
    code: 'COST_CHASSIS',
    category: 'cost',
    level: 'system',
    unit: '万元',
    targetValue: 2.8,
    upperBound: 3.5,
    tolerance: 0.3,
    weight: 0.6,
    priority: 'should',
    trend: 'stable',
    verificationMethod: 'analysis',
    childMetricIds: [],
    owner: 'system',
    source: '成本分解',
    createdBy: 'system'
  },

  // ==================== 可靠性指标 (Reliability) ====================
  {
    name: '电池循环寿命',
    code: 'RELI_BATTERY_LIFE',
    category: 'reliability',
    level: 'system',
    unit: '次',
    targetValue: 2000,
    lowerBound: 1800,
    tolerance: 100,
    weight: 0.85,
    priority: 'must',
    trend: 'improving',
    verificationMethod: 'test',
    childMetricIds: [],
    owner: 'system',
    source: '质保要求',
    createdBy: 'system'
  },
  {
    name: '整车故障率',
    code: 'RELI_FAILURE_RATE',
    category: 'reliability',
    level: 'project',
    unit: 'PPM',
    targetValue: 300,
    upperBound: 500,
    tolerance: 50,
    weight: 0.9,
    priority: 'must',
    trend: 'improving',
    verificationMethod: 'analysis',
    childMetricIds: [],
    owner: 'system',
    source: '质量目标',
    createdBy: 'system'
  },
  {
    name: '电机MTBF',
    code: 'RELI_MOTOR_MTBF',
    category: 'reliability',
    level: 'component',
    unit: '小时',
    targetValue: 50000,
    lowerBound: 45000,
    tolerance: 2000,
    weight: 0.7,
    priority: 'should',
    trend: 'stable',
    verificationMethod: 'test',
    childMetricIds: [],
    owner: 'system',
    source: '可靠性要求',
    createdBy: 'system'
  },
  {
    name: '电池容量保持率(3年)',
    code: 'RELI_BATTERY_RETENTION',
    category: 'reliability',
    level: 'system',
    unit: '%',
    targetValue: 90,
    lowerBound: 85,
    tolerance: 2,
    weight: 0.8,
    priority: 'must',
    trend: 'improving',
    verificationMethod: 'test',
    childMetricIds: [],
    owner: 'system',
    source: '质保承诺',
    createdBy: 'system'
  },
  {
    name: '电控系统MTBF',
    code: 'RELI_CONTROLLER_MTBF',
    category: 'reliability',
    level: 'component',
    unit: '小时',
    targetValue: 60000,
    lowerBound: 55000,
    tolerance: 2500,
    weight: 0.65,
    priority: 'should',
    trend: 'stable',
    verificationMethod: 'test',
    childMetricIds: [],
    owner: 'system',
    source: '可靠性要求',
    createdBy: 'system'
  },
  {
    name: '高压系统绝缘电阻',
    code: 'RELI_HV_INSULATION',
    category: 'reliability',
    level: 'system',
    unit: 'MΩ',
    targetValue: 500,
    lowerBound: 100,
    tolerance: 50,
    weight: 0.75,
    priority: 'must',
    trend: 'stable',
    verificationMethod: 'test',
    childMetricIds: [],
    owner: 'system',
    source: 'GB 18384',
    createdBy: 'system'
  },

  // ==================== 安全指标 (Safety) ====================
  {
    name: 'C-NCAP评分',
    code: 'SAFE_CNCAP',
    category: 'safety',
    level: 'project',
    unit: '星',
    targetValue: 5,
    lowerBound: 5,
    tolerance: 0,
    weight: 1.0,
    priority: 'must',
    trend: 'stable',
    verificationMethod: 'test',
    childMetricIds: [],
    owner: 'system',
    source: '法规认证',
    createdBy: 'system'
  },
  {
    name: '电池碰撞安全等级',
    code: 'SAFE_BATTERY_CRASH',
    category: 'safety',
    level: 'system',
    unit: '级别',
    targetValue: 1,
    lowerBound: 1,
    tolerance: 0,
    weight: 1.0,
    priority: 'must',
    trend: 'stable',
    verificationMethod: 'test',
    childMetricIds: [],
    owner: 'system',
    source: 'GB 38031',
    createdBy: 'system'
  },
  {
    name: '热失控预警时间',
    code: 'SAFE_THERMAL_WARNING',
    category: 'safety',
    level: 'system',
    unit: '分钟',
    targetValue: 5,
    lowerBound: 5,
    tolerance: 0,
    weight: 1.0,
    priority: 'must',
    trend: 'stable',
    verificationMethod: 'test',
    childMetricIds: [],
    owner: 'system',
    source: 'GB 38031',
    createdBy: 'system'
  },
  {
    name: '主动安全评分',
    code: 'SAFE_ADAS_SCORE',
    category: 'safety',
    level: 'system',
    unit: '分',
    targetValue: 90,
    lowerBound: 85,
    tolerance: 2,
    weight: 0.85,
    priority: 'must',
    trend: 'improving',
    verificationMethod: 'test',
    childMetricIds: [],
    owner: 'system',
    source: 'C-NCAP主动安全',
    createdBy: 'system'
  },
  {
    name: '正面碰撞得分',
    code: 'SAFE_FRONTAL_IMPACT',
    category: 'safety',
    level: 'system',
    unit: '分',
    targetValue: 16,
    lowerBound: 14,
    tolerance: 0.5,
    weight: 0.9,
    priority: 'must',
    trend: 'stable',
    verificationMethod: 'test',
    childMetricIds: [],
    owner: 'system',
    source: 'C-NCAP',
    createdBy: 'system'
  },
  {
    name: '侧面碰撞得分',
    code: 'SAFE_SIDE_IMPACT',
    category: 'safety',
    level: 'system',
    unit: '分',
    targetValue: 18,
    lowerBound: 16,
    tolerance: 0.5,
    weight: 0.85,
    priority: 'must',
    trend: 'stable',
    verificationMethod: 'test',
    childMetricIds: [],
    owner: 'system',
    source: 'C-NCAP',
    createdBy: 'system'
  },
  {
    name: '鞭打试验得分',
    code: 'SAFE_WHIPLASH',
    category: 'safety',
    level: 'system',
    unit: '分',
    targetValue: 4,
    lowerBound: 3.5,
    tolerance: 0.2,
    weight: 0.6,
    priority: 'should',
    trend: 'stable',
    verificationMethod: 'test',
    childMetricIds: [],
    owner: 'system',
    source: 'C-NCAP',
    createdBy: 'system'
  },

  // ==================== 合规性指标 (Compliance) ====================
  {
    name: 'CLTC工况续航',
    code: 'COMP_CLTC_RANGE',
    category: 'compliance',
    level: 'project',
    unit: 'km',
    targetValue: 620,
    lowerBound: 600,
    tolerance: 3,
    weight: 0.95,
    priority: 'must',
    trend: 'improving',
    verificationMethod: 'test',
    childMetricIds: [],
    owner: 'system',
    source: 'GB/T 38146.1',
    createdBy: 'system'
  },
  {
    name: '电磁兼容性等级',
    code: 'COMP_EMC',
    category: 'compliance',
    level: 'system',
    unit: '级别',
    targetValue: 5,
    lowerBound: 4,
    tolerance: 0,
    weight: 0.8,
    priority: 'must',
    trend: 'stable',
    verificationMethod: 'test',
    childMetricIds: [],
    owner: 'system',
    source: 'GB/T 18387',
    createdBy: 'system'
  },
  {
    name: 'WLTC工况续航',
    code: 'COMP_WLTC_RANGE',
    category: 'compliance',
    level: 'project',
    unit: 'km',
    targetValue: 550,
    lowerBound: 520,
    tolerance: 5,
    weight: 0.7,
    priority: 'should',
    trend: 'improving',
    verificationMethod: 'test',
    childMetricIds: [],
    owner: 'system',
    source: '国际标准',
    createdBy: 'system'
  },
  {
    name: '涉水深度',
    code: 'COMP_WADING_DEPTH',
    category: 'compliance',
    level: 'project',
    unit: 'mm',
    targetValue: 300,
    lowerBound: 250,
    tolerance: 20,
    weight: 0.55,
    priority: 'should',
    trend: 'stable',
    verificationMethod: 'test',
    childMetricIds: [],
    owner: 'system',
    source: 'IP防护等级',
    createdBy: 'system'
  },
  {
    name: '噪音水平(车内)',
    code: 'COMP_NOISE_LEVEL',
    category: 'compliance',
    level: 'project',
    unit: 'dB(A)',
    targetValue: 65,
    upperBound: 70,
    tolerance: 2,
    weight: 0.65,
    priority: 'should',
    trend: 'improving',
    verificationMethod: 'test',
    childMetricIds: [],
    owner: 'system',
    source: 'GB 1495',
    createdBy: 'system'
  },
  {
    name: '排放积分',
    code: 'COMP_NEV_CREDITS',
    category: 'compliance',
    level: 'project',
    unit: '分',
    targetValue: 5.5,
    lowerBound: 5.0,
    tolerance: 0.2,
    weight: 0.75,
    priority: 'must',
    trend: 'stable',
    verificationMethod: 'analysis',
    childMetricIds: [],
    owner: 'system',
    source: '双积分政策',
    createdBy: 'system'
  }
]

// ==================== 竞品对标数据 ====================
export interface CompetitorPreset {
  competitor: string
  model: string
  variant: string
  releaseDate: string
  source: string
  sourceUrl?: string
  measurementCondition: string
  metricValues: {
    metricCode: string
    value: number
    confidence: 'confirmed' | 'estimated' | 'rumored'
  }[]
}

export const PRESET_COMPETITORS: CompetitorPreset[] = [
  // ==================== 特斯拉 ====================
  {
    competitor: '特斯拉',
    model: 'Model 3',
    variant: '长续航全驱版',
    releaseDate: '2023-06-01',
    source: '官网数据',
    sourceUrl: 'https://www.tesla.cn',
    measurementCondition: 'CLTC',
    metricValues: [
      { metricCode: 'PERF_RANGE', value: 713, confidence: 'confirmed' },
      { metricCode: 'PERF_ACCEL', value: 4.4, confidence: 'confirmed' },
      { metricCode: 'PERF_TOP_SPEED', value: 201, confidence: 'confirmed' },
      { metricCode: 'PERF_ENERGY_CONSUMPTION', value: 12.5, confidence: 'estimated' },
      { metricCode: 'PERF_BRAKING', value: 35, confidence: 'estimated' },
      { metricCode: 'PERF_MOTOR_POWER', value: 258, confidence: 'confirmed' },
      { metricCode: 'PERF_MOTOR_TORQUE', value: 420, confidence: 'estimated' },
      { metricCode: 'PERF_GRADIENT', value: 32, confidence: 'estimated' },
      { metricCode: 'PERF_CHARGE_POWER', value: 170, confidence: 'confirmed' },
      { metricCode: 'PERF_CHARGE_TIME', value: 27, confidence: 'estimated' },
      { metricCode: 'COST_VEHICLE', value: 28.99, confidence: 'confirmed' },
      { metricCode: 'COST_BATTERY', value: 900, confidence: 'estimated' },
      { metricCode: 'COST_POWERTRAIN', value: 7.2, confidence: 'estimated' },
      { metricCode: 'RELI_BATTERY_LIFE', value: 2500, confidence: 'estimated' },
      { metricCode: 'RELI_FAILURE_RATE', value: 280, confidence: 'estimated' },
      { metricCode: 'RELI_MOTOR_MTBF', value: 52000, confidence: 'estimated' },
      { metricCode: 'RELI_BATTERY_RETENTION', value: 92, confidence: 'estimated' },
      { metricCode: 'SAFE_CNCAP', value: 5, confidence: 'confirmed' },
      { metricCode: 'SAFE_ADAS_SCORE', value: 92, confidence: 'confirmed' },
      { metricCode: 'SAFE_FRONTAL_IMPACT', value: 15.8, confidence: 'confirmed' },
      { metricCode: 'SAFE_SIDE_IMPACT', value: 17.5, confidence: 'confirmed' },
      { metricCode: 'COMP_CLTC_RANGE', value: 713, confidence: 'confirmed' },
      { metricCode: 'COMP_WLTC_RANGE', value: 629, confidence: 'confirmed' },
      { metricCode: 'COMP_EMC', value: 5, confidence: 'estimated' },
      { metricCode: 'COMP_NOISE_LEVEL', value: 63, confidence: 'estimated' }
    ]
  },
  {
    competitor: '特斯拉',
    model: 'Model Y',
    variant: '长续航全驱版',
    releaseDate: '2023-08-15',
    source: '官网数据',
    sourceUrl: 'https://www.tesla.cn',
    measurementCondition: 'CLTC',
    metricValues: [
      { metricCode: 'PERF_RANGE', value: 688, confidence: 'confirmed' },
      { metricCode: 'PERF_ACCEL', value: 5.0, confidence: 'confirmed' },
      { metricCode: 'PERF_TOP_SPEED', value: 217, confidence: 'confirmed' },
      { metricCode: 'PERF_ENERGY_CONSUMPTION', value: 13.2, confidence: 'estimated' },
      { metricCode: 'PERF_BRAKING', value: 36, confidence: 'estimated' },
      { metricCode: 'PERF_MOTOR_POWER', value: 258, confidence: 'confirmed' },
      { metricCode: 'PERF_MOTOR_TORQUE', value: 440, confidence: 'estimated' },
      { metricCode: 'PERF_CHARGE_POWER', value: 170, confidence: 'confirmed' },
      { metricCode: 'PERF_CHARGE_TIME', value: 28, confidence: 'estimated' },
      { metricCode: 'COST_VEHICLE', value: 30.99, confidence: 'confirmed' },
      { metricCode: 'COST_BATTERY', value: 920, confidence: 'estimated' },
      { metricCode: 'RELI_BATTERY_LIFE', value: 2400, confidence: 'estimated' },
      { metricCode: 'RELI_FAILURE_RATE', value: 290, confidence: 'estimated' },
      { metricCode: 'SAFE_CNCAP', value: 5, confidence: 'confirmed' },
      { metricCode: 'COMP_CLTC_RANGE', value: 688, confidence: 'confirmed' }
    ]
  },

  // ==================== 比亚迪 ====================
  {
    competitor: '比亚迪',
    model: '海豹',
    variant: '700km长续航后驱版',
    releaseDate: '2023-03-15',
    source: '官网数据',
    sourceUrl: 'https://www.bydauto.com.cn',
    measurementCondition: 'CLTC',
    metricValues: [
      { metricCode: 'PERF_RANGE', value: 700, confidence: 'confirmed' },
      { metricCode: 'PERF_ACCEL', value: 5.9, confidence: 'confirmed' },
      { metricCode: 'PERF_TOP_SPEED', value: 180, confidence: 'confirmed' },
      { metricCode: 'PERF_ENERGY_CONSUMPTION', value: 12.7, confidence: 'estimated' },
      { metricCode: 'PERF_BRAKING', value: 34.5, confidence: 'estimated' },
      { metricCode: 'PERF_MOTOR_POWER', value: 150, confidence: 'confirmed' },
      { metricCode: 'PERF_MOTOR_TORQUE', value: 310, confidence: 'confirmed' },
      { metricCode: 'PERF_GRADIENT', value: 28, confidence: 'estimated' },
      { metricCode: 'PERF_CHARGE_POWER', value: 110, confidence: 'confirmed' },
      { metricCode: 'PERF_CHARGE_TIME', value: 30, confidence: 'estimated' },
      { metricCode: 'COST_VEHICLE', value: 20.98, confidence: 'confirmed' },
      { metricCode: 'COST_BATTERY', value: 700, confidence: 'estimated' },
      { metricCode: 'COST_POWERTRAIN', value: 5.8, confidence: 'estimated' },
      { metricCode: 'RELI_BATTERY_LIFE', value: 3000, confidence: 'estimated' },
      { metricCode: 'RELI_FAILURE_RATE', value: 250, confidence: 'estimated' },
      { metricCode: 'RELI_MOTOR_MTBF', value: 55000, confidence: 'estimated' },
      { metricCode: 'RELI_BATTERY_RETENTION', value: 95, confidence: 'estimated' },
      { metricCode: 'SAFE_CNCAP', value: 5, confidence: 'confirmed' },
      { metricCode: 'SAFE_ADAS_SCORE', value: 88, confidence: 'confirmed' },
      { metricCode: 'SAFE_FRONTAL_IMPACT', value: 16.2, confidence: 'confirmed' },
      { metricCode: 'SAFE_SIDE_IMPACT', value: 18.1, confidence: 'confirmed' },
      { metricCode: 'COMP_CLTC_RANGE', value: 700, confidence: 'confirmed' },
      { metricCode: 'COMP_WLTC_RANGE', value: 580, confidence: 'estimated' },
      { metricCode: 'COMP_EMC', value: 4, confidence: 'estimated' },
      { metricCode: 'COMP_NOISE_LEVEL', value: 64, confidence: 'estimated' }
    ]
  },
  {
    competitor: '比亚迪',
    model: '汉EV',
    variant: '冠军版605km尊贵型',
    releaseDate: '2023-05-10',
    source: '官网数据',
    sourceUrl: 'https://www.bydauto.com.cn',
    measurementCondition: 'CLTC',
    metricValues: [
      { metricCode: 'PERF_RANGE', value: 605, confidence: 'confirmed' },
      { metricCode: 'PERF_ACCEL', value: 7.9, confidence: 'confirmed' },
      { metricCode: 'PERF_TOP_SPEED', value: 185, confidence: 'confirmed' },
      { metricCode: 'PERF_ENERGY_CONSUMPTION', value: 13.8, confidence: 'estimated' },
      { metricCode: 'PERF_MOTOR_POWER', value: 150, confidence: 'confirmed' },
      { metricCode: 'PERF_MOTOR_TORQUE', value: 310, confidence: 'confirmed' },
      { metricCode: 'PERF_CHARGE_POWER', value: 110, confidence: 'confirmed' },
      { metricCode: 'COST_VEHICLE', value: 20.98, confidence: 'confirmed' },
      { metricCode: 'COST_BATTERY', value: 680, confidence: 'estimated' },
      { metricCode: 'RELI_BATTERY_LIFE', value: 3000, confidence: 'estimated' },
      { metricCode: 'SAFE_CNCAP', value: 5, confidence: 'confirmed' },
      { metricCode: 'COMP_CLTC_RANGE', value: 605, confidence: 'confirmed' }
    ]
  },

  // ==================== 蔚来 ====================
  {
    competitor: '蔚来',
    model: 'ET5',
    variant: '75kWh标准续航版',
    releaseDate: '2023-01-20',
    source: '官网数据',
    sourceUrl: 'https://www.nio.cn',
    measurementCondition: 'CLTC',
    metricValues: [
      { metricCode: 'PERF_RANGE', value: 560, confidence: 'confirmed' },
      { metricCode: 'PERF_ACCEL', value: 4.0, confidence: 'confirmed' },
      { metricCode: 'PERF_TOP_SPEED', value: 200, confidence: 'confirmed' },
      { metricCode: 'PERF_ENERGY_CONSUMPTION', value: 13.8, confidence: 'estimated' },
      { metricCode: 'PERF_BRAKING', value: 33.9, confidence: 'estimated' },
      { metricCode: 'PERF_MOTOR_POWER', value: 360, confidence: 'confirmed' },
      { metricCode: 'PERF_MOTOR_TORQUE', value: 700, confidence: 'confirmed' },
      { metricCode: 'PERF_GRADIENT', value: 35, confidence: 'estimated' },
      { metricCode: 'PERF_CHARGE_POWER', value: 140, confidence: 'confirmed' },
      { metricCode: 'PERF_CHARGE_TIME', value: 25, confidence: 'estimated' },
      { metricCode: 'COST_VEHICLE', value: 29.80, confidence: 'confirmed' },
      { metricCode: 'COST_BATTERY', value: 850, confidence: 'estimated' },
      { metricCode: 'COST_POWERTRAIN', value: 8.5, confidence: 'estimated' },
      { metricCode: 'RELI_BATTERY_LIFE', value: 2200, confidence: 'estimated' },
      { metricCode: 'RELI_FAILURE_RATE', value: 320, confidence: 'estimated' },
      { metricCode: 'RELI_MOTOR_MTBF', value: 48000, confidence: 'estimated' },
      { metricCode: 'RELI_BATTERY_RETENTION', value: 88, confidence: 'estimated' },
      { metricCode: 'SAFE_CNCAP', value: 5, confidence: 'confirmed' },
      { metricCode: 'SAFE_ADAS_SCORE', value: 94, confidence: 'confirmed' },
      { metricCode: 'SAFE_FRONTAL_IMPACT', value: 15.5, confidence: 'confirmed' },
      { metricCode: 'SAFE_SIDE_IMPACT', value: 17.8, confidence: 'confirmed' },
      { metricCode: 'COMP_CLTC_RANGE', value: 560, confidence: 'confirmed' },
      { metricCode: 'COMP_WLTC_RANGE', value: 480, confidence: 'estimated' },
      { metricCode: 'COMP_EMC', value: 5, confidence: 'estimated' },
      { metricCode: 'COMP_NOISE_LEVEL', value: 62, confidence: 'estimated' }
    ]
  },
  {
    competitor: '蔚来',
    model: 'ET7',
    variant: '100kWh长续航版',
    releaseDate: '2023-03-01',
    source: '官网数据',
    sourceUrl: 'https://www.nio.cn',
    measurementCondition: 'CLTC',
    metricValues: [
      { metricCode: 'PERF_RANGE', value: 730, confidence: 'confirmed' },
      { metricCode: 'PERF_ACCEL', value: 3.8, confidence: 'confirmed' },
      { metricCode: 'PERF_TOP_SPEED', value: 200, confidence: 'confirmed' },
      { metricCode: 'PERF_ENERGY_CONSUMPTION', value: 13.6, confidence: 'estimated' },
      { metricCode: 'PERF_MOTOR_POWER', value: 360, confidence: 'confirmed' },
      { metricCode: 'PERF_MOTOR_TORQUE', value: 700, confidence: 'confirmed' },
      { metricCode: 'PERF_CHARGE_POWER', value: 140, confidence: 'confirmed' },
      { metricCode: 'COST_VEHICLE', value: 42.80, confidence: 'confirmed' },
      { metricCode: 'COST_BATTERY', value: 880, confidence: 'estimated' },
      { metricCode: 'RELI_BATTERY_LIFE', value: 2300, confidence: 'estimated' },
      { metricCode: 'SAFE_CNCAP', value: 5, confidence: 'confirmed' },
      { metricCode: 'COMP_CLTC_RANGE', value: 730, confidence: 'confirmed' }
    ]
  },

  // ==================== 小鹏 ====================
  {
    competitor: '小鹏',
    model: 'P7i',
    variant: '702km超长续航智行版',
    releaseDate: '2023-04-10',
    source: '官网数据',
    sourceUrl: 'https://www.xiaopeng.com',
    measurementCondition: 'CLTC',
    metricValues: [
      { metricCode: 'PERF_RANGE', value: 702, confidence: 'confirmed' },
      { metricCode: 'PERF_ACCEL', value: 6.4, confidence: 'confirmed' },
      { metricCode: 'PERF_TOP_SPEED', value: 170, confidence: 'confirmed' },
      { metricCode: 'PERF_ENERGY_CONSUMPTION', value: 13.1, confidence: 'estimated' },
      { metricCode: 'PERF_BRAKING', value: 36.5, confidence: 'estimated' },
      { metricCode: 'PERF_MOTOR_POWER', value: 196, confidence: 'confirmed' },
      { metricCode: 'PERF_MOTOR_TORQUE', value: 390, confidence: 'confirmed' },
      { metricCode: 'PERF_GRADIENT', value: 29, confidence: 'estimated' },
      { metricCode: 'PERF_CHARGE_POWER', value: 95, confidence: 'confirmed' },
      { metricCode: 'PERF_CHARGE_TIME', value: 35, confidence: 'estimated' },
      { metricCode: 'COST_VEHICLE', value: 22.39, confidence: 'confirmed' },
      { metricCode: 'COST_BATTERY', value: 750, confidence: 'estimated' },
      { metricCode: 'COST_POWERTRAIN', value: 6.2, confidence: 'estimated' },
      { metricCode: 'RELI_BATTERY_LIFE', value: 2100, confidence: 'estimated' },
      { metricCode: 'RELI_FAILURE_RATE', value: 350, confidence: 'estimated' },
      { metricCode: 'RELI_MOTOR_MTBF', value: 47000, confidence: 'estimated' },
      { metricCode: 'RELI_BATTERY_RETENTION', value: 87, confidence: 'estimated' },
      { metricCode: 'SAFE_CNCAP', value: 5, confidence: 'confirmed' },
      { metricCode: 'SAFE_ADAS_SCORE', value: 91, confidence: 'confirmed' },
      { metricCode: 'SAFE_FRONTAL_IMPACT', value: 15.3, confidence: 'confirmed' },
      { metricCode: 'SAFE_SIDE_IMPACT', value: 17.2, confidence: 'confirmed' },
      { metricCode: 'COMP_CLTC_RANGE', value: 702, confidence: 'confirmed' },
      { metricCode: 'COMP_WLTC_RANGE', value: 590, confidence: 'estimated' },
      { metricCode: 'COMP_EMC', value: 4, confidence: 'estimated' },
      { metricCode: 'COMP_NOISE_LEVEL', value: 65, confidence: 'estimated' }
    ]
  },
  {
    competitor: '小鹏',
    model: 'G9',
    variant: '702km长续航PRO',
    releaseDate: '2023-07-05',
    source: '官网数据',
    sourceUrl: 'https://www.xiaopeng.com',
    measurementCondition: 'CLTC',
    metricValues: [
      { metricCode: 'PERF_RANGE', value: 702, confidence: 'confirmed' },
      { metricCode: 'PERF_ACCEL', value: 6.4, confidence: 'confirmed' },
      { metricCode: 'PERF_TOP_SPEED', value: 200, confidence: 'confirmed' },
      { metricCode: 'PERF_ENERGY_CONSUMPTION', value: 14.2, confidence: 'estimated' },
      { metricCode: 'PERF_MOTOR_POWER', value: 230, confidence: 'confirmed' },
      { metricCode: 'PERF_MOTOR_TORQUE', value: 430, confidence: 'confirmed' },
      { metricCode: 'PERF_CHARGE_POWER', value: 300, confidence: 'confirmed' },
      { metricCode: 'PERF_CHARGE_TIME', value: 15, confidence: 'confirmed' },
      { metricCode: 'COST_VEHICLE', value: 30.99, confidence: 'confirmed' },
      { metricCode: 'COST_BATTERY', value: 780, confidence: 'estimated' },
      { metricCode: 'SAFE_CNCAP', value: 5, confidence: 'confirmed' },
      { metricCode: 'COMP_CLTC_RANGE', value: 702, confidence: 'confirmed' }
    ]
  },

  // ==================== 理想 ====================
  {
    competitor: '理想',
    model: 'L7',
    variant: 'Air',
    releaseDate: '2023-02-08',
    source: '官网数据',
    sourceUrl: 'https://www.lixiang.com',
    measurementCondition: 'CLTC',
    metricValues: [
      { metricCode: 'PERF_RANGE', value: 210, confidence: 'confirmed' },
      { metricCode: 'PERF_ACCEL', value: 5.3, confidence: 'confirmed' },
      { metricCode: 'PERF_TOP_SPEED', value: 180, confidence: 'confirmed' },
      { metricCode: 'PERF_ENERGY_CONSUMPTION', value: 17.5, confidence: 'estimated' },
      { metricCode: 'PERF_BRAKING', value: 37.2, confidence: 'estimated' },
      { metricCode: 'PERF_MOTOR_POWER', value: 330, confidence: 'confirmed' },
      { metricCode: 'PERF_MOTOR_TORQUE', value: 620, confidence: 'confirmed' },
      { metricCode: 'PERF_GRADIENT', value: 31, confidence: 'estimated' },
      { metricCode: 'PERF_CHARGE_POWER', value: 80, confidence: 'confirmed' },
      { metricCode: 'PERF_CHARGE_TIME', value: 32, confidence: 'estimated' },
      { metricCode: 'COST_VEHICLE', value: 31.98, confidence: 'confirmed' },
      { metricCode: 'COST_BATTERY', value: 950, confidence: 'estimated' },
      { metricCode: 'COST_POWERTRAIN', value: 9.5, confidence: 'estimated' },
      { metricCode: 'RELI_BATTERY_LIFE', value: 1800, confidence: 'estimated' },
      { metricCode: 'RELI_FAILURE_RATE', value: 380, confidence: 'estimated' },
      { metricCode: 'RELI_MOTOR_MTBF', value: 45000, confidence: 'estimated' },
      { metricCode: 'RELI_BATTERY_RETENTION', value: 85, confidence: 'estimated' },
      { metricCode: 'SAFE_CNCAP', value: 5, confidence: 'confirmed' },
      { metricCode: 'SAFE_ADAS_SCORE', value: 89, confidence: 'confirmed' },
      { metricCode: 'SAFE_FRONTAL_IMPACT', value: 15.1, confidence: 'confirmed' },
      { metricCode: 'SAFE_SIDE_IMPACT', value: 16.8, confidence: 'confirmed' },
      { metricCode: 'COMP_CLTC_RANGE', value: 210, confidence: 'confirmed' },
      { metricCode: 'COMP_EMC', value: 4, confidence: 'estimated' },
      { metricCode: 'COMP_NOISE_LEVEL', value: 66, confidence: 'estimated' }
    ]
  },
  {
    competitor: '理想',
    model: 'L9',
    variant: 'Max',
    releaseDate: '2023-04-20',
    source: '官网数据',
    sourceUrl: 'https://www.lixiang.com',
    measurementCondition: 'CLTC',
    metricValues: [
      { metricCode: 'PERF_RANGE', value: 215, confidence: 'confirmed' },
      { metricCode: 'PERF_ACCEL', value: 5.3, confidence: 'confirmed' },
      { metricCode: 'PERF_TOP_SPEED', value: 180, confidence: 'confirmed' },
      { metricCode: 'PERF_ENERGY_CONSUMPTION', value: 18.2, confidence: 'estimated' },
      { metricCode: 'PERF_MOTOR_POWER', value: 330, confidence: 'confirmed' },
      { metricCode: 'PERF_MOTOR_TORQUE', value: 620, confidence: 'confirmed' },
      { metricCode: 'COST_VEHICLE', value: 42.98, confidence: 'confirmed' },
      { metricCode: 'COST_BATTERY', value: 980, confidence: 'estimated' },
      { metricCode: 'SAFE_CNCAP', value: 5, confidence: 'confirmed' },
      { metricCode: 'COMP_CLTC_RANGE', value: 215, confidence: 'confirmed' }
    ]
  },

  // ==================== 极氪 ====================
  {
    competitor: '极氪',
    model: '001',
    variant: 'WE版',
    releaseDate: '2023-05-20',
    source: '官网数据',
    sourceUrl: 'https://www.zeekrlife.com',
    measurementCondition: 'CLTC',
    metricValues: [
      { metricCode: 'PERF_RANGE', value: 741, confidence: 'confirmed' },
      { metricCode: 'PERF_ACCEL', value: 3.8, confidence: 'confirmed' },
      { metricCode: 'PERF_TOP_SPEED', value: 200, confidence: 'confirmed' },
      { metricCode: 'PERF_ENERGY_CONSUMPTION', value: 13.6, confidence: 'estimated' },
      { metricCode: 'PERF_BRAKING', value: 34.2, confidence: 'estimated' },
      { metricCode: 'PERF_MOTOR_POWER', value: 400, confidence: 'confirmed' },
      { metricCode: 'PERF_MOTOR_TORQUE', value: 768, confidence: 'confirmed' },
      { metricCode: 'PERF_GRADIENT', value: 36, confidence: 'estimated' },
      { metricCode: 'PERF_CHARGE_POWER', value: 360, confidence: 'confirmed' },
      { metricCode: 'PERF_CHARGE_TIME', value: 12, confidence: 'confirmed' },
      { metricCode: 'COST_VEHICLE', value: 30.00, confidence: 'confirmed' },
      { metricCode: 'COST_BATTERY', value: 820, confidence: 'estimated' },
      { metricCode: 'COST_POWERTRAIN', value: 8.8, confidence: 'estimated' },
      { metricCode: 'RELI_BATTERY_LIFE', value: 2300, confidence: 'estimated' },
      { metricCode: 'RELI_FAILURE_RATE', value: 310, confidence: 'estimated' },
      { metricCode: 'RELI_MOTOR_MTBF', value: 51000, confidence: 'estimated' },
      { metricCode: 'RELI_BATTERY_RETENTION', value: 91, confidence: 'estimated' },
      { metricCode: 'SAFE_CNCAP', value: 5, confidence: 'confirmed' },
      { metricCode: 'SAFE_ADAS_SCORE', value: 93, confidence: 'confirmed' },
      { metricCode: 'SAFE_FRONTAL_IMPACT', value: 16.5, confidence: 'confirmed' },
      { metricCode: 'SAFE_SIDE_IMPACT', value: 18.3, confidence: 'confirmed' },
      { metricCode: 'COMP_CLTC_RANGE', value: 741, confidence: 'confirmed' },
      { metricCode: 'COMP_WLTC_RANGE', value: 640, confidence: 'estimated' },
      { metricCode: 'COMP_EMC', value: 5, confidence: 'estimated' },
      { metricCode: 'COMP_NOISE_LEVEL', value: 61, confidence: 'estimated' }
    ]
  },
  {
    competitor: '极氪',
    model: '007',
    variant: '智驾版',
    releaseDate: '2023-12-27',
    source: '官网数据',
    sourceUrl: 'https://www.zeekrlife.com',
    measurementCondition: 'CLTC',
    metricValues: [
      { metricCode: 'PERF_RANGE', value: 688, confidence: 'confirmed' },
      { metricCode: 'PERF_ACCEL', value: 2.84, confidence: 'confirmed' },
      { metricCode: 'PERF_TOP_SPEED', value: 210, confidence: 'confirmed' },
      { metricCode: 'PERF_ENERGY_CONSUMPTION', value: 12.8, confidence: 'estimated' },
      { metricCode: 'PERF_MOTOR_POWER', value: 475, confidence: 'confirmed' },
      { metricCode: 'PERF_MOTOR_TORQUE', value: 810, confidence: 'confirmed' },
      { metricCode: 'PERF_CHARGE_POWER', value: 360, confidence: 'confirmed' },
      { metricCode: 'PERF_CHARGE_TIME', value: 10.5, confidence: 'confirmed' },
      { metricCode: 'COST_VEHICLE', value: 22.99, confidence: 'confirmed' },
      { metricCode: 'COST_BATTERY', value: 740, confidence: 'estimated' },
      { metricCode: 'SAFE_CNCAP', value: 5, confidence: 'confirmed' },
      { metricCode: 'COMP_CLTC_RANGE', value: 688, confidence: 'confirmed' }
    ]
  },

  // ==================== 问界 ====================
  {
    competitor: '问界',
    model: 'M7',
    variant: 'Plus增程版',
    releaseDate: '2023-09-12',
    source: '官网数据',
    sourceUrl: 'https://www.seres.cn',
    measurementCondition: 'CLTC',
    metricValues: [
      { metricCode: 'PERF_RANGE', value: 240, confidence: 'confirmed' },
      { metricCode: 'PERF_ACCEL', value: 4.8, confidence: 'confirmed' },
      { metricCode: 'PERF_TOP_SPEED', value: 190, confidence: 'confirmed' },
      { metricCode: 'PERF_ENERGY_CONSUMPTION', value: 16.5, confidence: 'estimated' },
      { metricCode: 'PERF_MOTOR_POWER', value: 365, confidence: 'confirmed' },
      { metricCode: 'PERF_MOTOR_TORQUE', value: 675, confidence: 'confirmed' },
      { metricCode: 'PERF_CHARGE_POWER', value: 70, confidence: 'confirmed' },
      { metricCode: 'COST_VEHICLE', value: 28.98, confidence: 'confirmed' },
      { metricCode: 'COST_BATTERY', value: 870, confidence: 'estimated' },
      { metricCode: 'SAFE_CNCAP', value: 5, confidence: 'confirmed' },
      { metricCode: 'SAFE_ADAS_SCORE', value: 90, confidence: 'confirmed' },
      { metricCode: 'COMP_CLTC_RANGE', value: 240, confidence: 'confirmed' }
    ]
  },

  // ==================== 智己 ====================
  {
    competitor: '智己',
    model: 'LS6',
    variant: 'Max长续航智驾版',
    releaseDate: '2023-10-28',
    source: '官网数据',
    sourceUrl: 'https://www.im.auto',
    measurementCondition: 'CLTC',
    metricValues: [
      { metricCode: 'PERF_RANGE', value: 702, confidence: 'confirmed' },
      { metricCode: 'PERF_ACCEL', value: 4.8, confidence: 'confirmed' },
      { metricCode: 'PERF_TOP_SPEED', value: 200, confidence: 'confirmed' },
      { metricCode: 'PERF_ENERGY_CONSUMPTION', value: 13.4, confidence: 'estimated' },
      { metricCode: 'PERF_MOTOR_POWER', value: 379, confidence: 'confirmed' },
      { metricCode: 'PERF_MOTOR_TORQUE', value: 720, confidence: 'confirmed' },
      { metricCode: 'PERF_CHARGE_POWER', value: 396, confidence: 'confirmed' },
      { metricCode: 'PERF_CHARGE_TIME', value: 9, confidence: 'confirmed' },
      { metricCode: 'COST_VEHICLE', value: 25.98, confidence: 'confirmed' },
      { metricCode: 'COST_BATTERY', value: 760, confidence: 'estimated' },
      { metricCode: 'SAFE_CNCAP', value: 5, confidence: 'confirmed' },
      { metricCode: 'SAFE_ADAS_SCORE', value: 95, confidence: 'confirmed' },
      { metricCode: 'COMP_CLTC_RANGE', value: 702, confidence: 'confirmed' }
    ]
  },

  // ==================== 阿维塔 ====================
  {
    competitor: '阿维塔',
    model: '12',
    variant: '700超长续航版',
    releaseDate: '2023-11-10',
    source: '官网数据',
    sourceUrl: 'https://www.avatr.com',
    measurementCondition: 'CLTC',
    metricValues: [
      { metricCode: 'PERF_RANGE', value: 700, confidence: 'confirmed' },
      { metricCode: 'PERF_ACCEL', value: 4.5, confidence: 'confirmed' },
      { metricCode: 'PERF_TOP_SPEED', value: 200, confidence: 'confirmed' },
      { metricCode: 'PERF_ENERGY_CONSUMPTION', value: 13.9, confidence: 'estimated' },
      { metricCode: 'PERF_MOTOR_POWER', value: 313, confidence: 'confirmed' },
      { metricCode: 'PERF_MOTOR_TORQUE', value: 650, confidence: 'confirmed' },
      { metricCode: 'PERF_CHARGE_POWER', value: 240, confidence: 'confirmed' },
      { metricCode: 'PERF_CHARGE_TIME', value: 18, confidence: 'estimated' },
      { metricCode: 'COST_VEHICLE', value: 26.58, confidence: 'confirmed' },
      { metricCode: 'COST_BATTERY', value: 790, confidence: 'estimated' },
      { metricCode: 'SAFE_CNCAP', value: 5, confidence: 'confirmed' },
      { metricCode: 'COMP_CLTC_RANGE', value: 700, confidence: 'confirmed' }
    ]
  }
]

// ==================== 雷达图配置 ====================
export const RADAR_CHART_CATEGORIES = [
  {
    name: '性能指标',
    metricCodes: ['PERF_RANGE', 'PERF_ACCEL', 'PERF_TOP_SPEED', 'PERF_ENERGY_CONSUMPTION', 'PERF_CHARGE_TIME']
  },
  {
    name: '成本指标',
    metricCodes: ['COST_VEHICLE', 'COST_BATTERY', 'COST_POWERTRAIN']
  },
  {
    name: '可靠性指标',
    metricCodes: ['RELI_BATTERY_LIFE', 'RELI_FAILURE_RATE', 'RELI_MOTOR_MTBF', 'RELI_BATTERY_RETENTION']
  },
  {
    name: '安全指标',
    metricCodes: ['SAFE_CNCAP', 'SAFE_ADAS_SCORE', 'SAFE_FRONTAL_IMPACT', 'SAFE_SIDE_IMPACT']
  },
  {
    name: '合规性指标',
    metricCodes: ['COMP_CLTC_RANGE', 'COMP_EMC', 'COMP_NOISE_LEVEL']
  }
]

// ==================== 指标归一化配置（用于雷达图） ====================
export const METRIC_NORMALIZATION: Record<string, {
  min: number
  max: number
  reverseScale: boolean // 是否反向缩放（值越小越好）
}> = {
  // 性能指标
  'PERF_RANGE': { min: 0, max: 800, reverseScale: false },
  'PERF_ACCEL': { min: 2.5, max: 8, reverseScale: true },
  'PERF_TOP_SPEED': { min: 150, max: 220, reverseScale: false },
  'PERF_ENERGY_CONSUMPTION': { min: 10, max: 20, reverseScale: true },
  'PERF_BRAKING': { min: 30, max: 40, reverseScale: true },
  'PERF_MOTOR_POWER': { min: 100, max: 500, reverseScale: false },
  'PERF_MOTOR_TORQUE': { min: 250, max: 850, reverseScale: false },
  'PERF_GRADIENT': { min: 20, max: 40, reverseScale: false },
  'PERF_CHARGE_POWER': { min: 50, max: 400, reverseScale: false },
  'PERF_CHARGE_TIME': { min: 5, max: 40, reverseScale: true },
  
  // 成本指标
  'COST_VEHICLE': { min: 15, max: 45, reverseScale: true },
  'COST_BATTERY': { min: 600, max: 1000, reverseScale: true },
  'COST_POWERTRAIN': { min: 5, max: 10, reverseScale: true },
  'COST_MOTOR': { min: 5000, max: 15000, reverseScale: true },
  'COST_CONTROLLER': { min: 3000, max: 8000, reverseScale: true },
  'COST_BODY': { min: 2.5, max: 5, reverseScale: true },
  'COST_CHASSIS': { min: 2, max: 4.5, reverseScale: true },
  
  // 可靠性指标
  'RELI_BATTERY_LIFE': { min: 1500, max: 3500, reverseScale: false },
  'RELI_FAILURE_RATE': { min: 200, max: 500, reverseScale: true },
  'RELI_MOTOR_MTBF': { min: 40000, max: 60000, reverseScale: false },
  'RELI_BATTERY_RETENTION': { min: 80, max: 100, reverseScale: false },
  'RELI_CONTROLLER_MTBF': { min: 50000, max: 70000, reverseScale: false },
  'RELI_HV_INSULATION': { min: 100, max: 600, reverseScale: false },
  
  // 安全指标
  'SAFE_CNCAP': { min: 0, max: 5, reverseScale: false },
  'SAFE_BATTERY_CRASH': { min: 0, max: 3, reverseScale: false },
  'SAFE_THERMAL_WARNING': { min: 0, max: 10, reverseScale: false },
  'SAFE_ADAS_SCORE': { min: 0, max: 100, reverseScale: false },
  'SAFE_FRONTAL_IMPACT': { min: 0, max: 20, reverseScale: false },
  'SAFE_SIDE_IMPACT': { min: 0, max: 20, reverseScale: false },
  'SAFE_WHIPLASH': { min: 0, max: 5, reverseScale: false },
  
  // 合规性指标
  'COMP_CLTC_RANGE': { min: 0, max: 800, reverseScale: false },
  'COMP_EMC': { min: 0, max: 5, reverseScale: false },
  'COMP_WLTC_RANGE': { min: 0, max: 700, reverseScale: false },
  'COMP_WADING_DEPTH': { min: 200, max: 400, reverseScale: false },
  'COMP_NOISE_LEVEL': { min: 55, max: 75, reverseScale: true },
  'COMP_NEV_CREDITS': { min: 0, max: 6, reverseScale: false }
}

// ==================== 指标分类映射 ====================
export const METRIC_CATEGORIES = {
  performance: '性能指标',
  cost: '成本指标',
  reliability: '可靠性指标',
  safety: '安全指标',
  compliance: '合规性指标'
} as const

// ==================== 指标级别映射 ====================
export const METRIC_LEVELS = {
  project: '项目级',
  system: '系统级',
  subsystem: '子系统级',
  component: '组件级'
} as const

// ==================== 优先级映射 ====================
export const PRIORITY_LABELS = {
  'must': '必须',
  'should': '应当',
  'nice-to-have': '期望'
} as const

// ==================== 验证方法映射 ====================
export const VERIFICATION_METHODS = {
  'simulation': '仿真',
  'test': '测试',
  'analysis': '分析',
  'inspection': '检查'
} as const

// ==================== 趋势映射 ====================
export const TREND_LABELS = {
  'improving': '改善中',
  'stable': '稳定',
  'declining': '下降'
} as const

// ==================== 工具函数 ====================

/**
 * 归一化指标值（用于雷达图）
 */
export function normalizeMetricValue(metricCode: string, value: number): number {
  const config = METRIC_NORMALIZATION[metricCode]
  if (!config) return 0
  
  const { min, max, reverseScale } = config
  let normalized = (value - min) / (max - min)
  
  // 限制在0-1范围内
  normalized = Math.max(0, Math.min(1, normalized))
  
  // 如果是反向缩放，反转值
  if (reverseScale) {
    normalized = 1 - normalized
  }
  
  return normalized * 100 // 返回0-100的值用于雷达图
}

/**
 * 获取指标的显示颜色
 */
export function getMetricCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    performance: '#3b82f6',  // 蓝色
    cost: '#10b981',         // 绿色
    reliability: '#f59e0b',  // 橙色
    safety: '#ef4444',       // 红色
    compliance: '#8b5cf6'    // 紫色
  }
  return colors[category] || '#6b7280'
}

/**
 * 获取指标趋势图标
 */
export function getMetricTrendIcon(trend: string): string {
  const icons: Record<string, string> = {
    improving: '↗',
    stable: '→',
    declining: '↘'
  }
  return icons[trend] || '—'
}

/**
 * 根据指标代码查找预置指标
 */
export function findPresetMetric(metricCode: string) {
  return PRESET_METRICS.find(m => m.code === metricCode)
}

/**
 * 根据竞品和车型查找竞品数据
 */
export function findCompetitor(competitor: string, model: string, variant?: string) {
  return PRESET_COMPETITORS.find(c => 
    c.competitor === competitor && 
    c.model === model && 
    (!variant || c.variant === variant)
  )
}

/**
 * 获取所有竞品品牌列表
 */
export function getAllCompetitors(): string[] {
  return Array.from(new Set(PRESET_COMPETITORS.map(c => c.competitor)))
}

/**
 * 获取特定品牌的所有车型
 */
export function getCompetitorModels(competitor: string): string[] {
  return Array.from(new Set(
    PRESET_COMPETITORS
      .filter(c => c.competitor === competitor)
      .map(c => c.model)
  ))
}

/**
 * 获取特定车型的所有配置
 */
export function getModelVariants(competitor: string, model: string): string[] {
  return PRESET_COMPETITORS
    .filter(c => c.competitor === competitor && c.model === model)
    .map(c => c.variant)
}
