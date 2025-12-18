/**
 * 指标选择器组件
 * 用于任务创建时选择关联指标，包含雷达图可视化
 */

import { useState, useMemo } from 'react'
import { 
  Target, 
  TrendingUp, 
  DollarSign, 
  Shield, 
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  Radar as RadarIcon
} from 'lucide-react@0.487.0'
import { Card, CardContent, CardHeader } from '../ui/card'
import { Badge } from '../ui/badge'
import { Checkbox } from '../ui/checkbox'
import { Button } from '../ui/button'
import { ScrollArea } from '../ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { MetricRadarComparison, RadarDataPoint } from './MetricRadarChart'
import { metricsService } from '../../services/MetricsService'
import { Metric } from '../../types/metrics'
import { RADAR_CHART_CATEGORIES } from '../../data/presetMetrics'

interface MetricSelectorProps {
  projectId: string
  selectedMetricIds: string[]
  onSelectionChange: (metricIds: string[]) => void
  maxSelection?: number
  showRadarChart?: boolean
}

export function MetricSelector({
  projectId,
  selectedMetricIds,
  onSelectionChange,
  maxSelection,
  showRadarChart = true
}: MetricSelectorProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['performance', 'cost'])
  )
  const [radarCategory, setRadarCategory] = useState('性能指标')

  const metrics = metricsService.getMetricsByProject(projectId)

  // 按类别分组指标
  const metricsByCategory = useMemo(() => {
    const groups: Record<string, Metric[]> = {
      performance: [],
      cost: [],
      reliability: [],
      safety: [],
      compliance: []
    }

    metrics.forEach(metric => {
      if (groups[metric.category]) {
        groups[metric.category].push(metric)
      }
    })

    return groups
  }, [metrics])

  // 获取类别信息
  const categoryInfo: Record<string, {
    name: string
    icon: any
    color: string
  }> = {
    performance: {
      name: '性能指标',
      icon: TrendingUp,
      color: 'text-blue-600'
    },
    cost: {
      name: '成本指标',
      icon: DollarSign,
      color: 'text-green-600'
    },
    reliability: {
      name: '可靠性指标',
      icon: CheckCircle2,
      color: 'text-purple-600'
    },
    safety: {
      name: '安全指标',
      icon: Shield,
      color: 'text-red-600'
    },
    compliance: {
      name: '合规性指标',
      icon: Target,
      color: 'text-orange-600'
    }
  }

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(category)) {
      newExpanded.delete(category)
    } else {
      newExpanded.add(category)
    }
    setExpandedCategories(newExpanded)
  }

  const toggleMetric = (metricId: string) => {
    const newSelection = selectedMetricIds.includes(metricId)
      ? selectedMetricIds.filter(id => id !== metricId)
      : [...selectedMetricIds, metricId]

    if (maxSelection && newSelection.length > maxSelection) {
      return
    }

    onSelectionChange(newSelection)
  }

  const selectAll = (category: string) => {
    const categoryMetrics = metricsByCategory[category]
    const categoryMetricIds = categoryMetrics.map(m => m.id)
    const newSelection = Array.from(new Set([...selectedMetricIds, ...categoryMetricIds]))
    
    if (maxSelection && newSelection.length > maxSelection) {
      return
    }
    
    onSelectionChange(newSelection)
  }

  const deselectAll = (category: string) => {
    const categoryMetricIds = metricsByCategory[category].map(m => m.id)
    const newSelection = selectedMetricIds.filter(id => !categoryMetricIds.includes(id))
    onSelectionChange(newSelection)
  }

  // 准备雷达图数据
  const radarData = useMemo(() => {
    const categoryConfig = RADAR_CHART_CATEGORIES.find(c => c.name === radarCategory)
    if (!categoryConfig) return null

    const metricCodes = categoryConfig.metricCodes
    return metricsService.getCompetitorRadarData(projectId, metricCodes)
  }, [projectId, radarCategory])

  return (
    <div className="space-y-4">
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list">指标列表</TabsTrigger>
          <TabsTrigger value="radar" disabled={!showRadarChart}>
            <RadarIcon className="w-4 h-4 mr-1" />
            雷达图对比
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-gray-900">选择任务关联指标</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    已选择 {selectedMetricIds.length} 项指标
                    {maxSelection && ` / 最多 ${maxSelection} 项`}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-2">
                  {Object.entries(metricsByCategory).map(([category, categoryMetrics]) => {
                    if (categoryMetrics.length === 0) return null
                    
                    const info = categoryInfo[category]
                    const Icon = info.icon
                    const isExpanded = expandedCategories.has(category)
                    const selectedCount = categoryMetrics.filter(m => 
                      selectedMetricIds.includes(m.id)
                    ).length

                    return (
                      <div key={category} className="border border-gray-200 rounded-lg">
                        {/* 类别头部 */}
                        <div className="p-3 bg-gray-50 flex items-center justify-between">
                          <button
                            onClick={() => toggleCategory(category)}
                            className="flex items-center gap-2 flex-1 text-left"
                          >
                            <Icon className={`w-4 h-4 ${info.color}`} />
                            <span className="text-gray-900">{info.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {selectedCount}/{categoryMetrics.length}
                            </Badge>
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-gray-400 ml-auto" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-gray-400 ml-auto" />
                            )}
                          </button>
                          
                          <div className="flex gap-1 ml-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => selectAll(category)}
                              className="h-7 text-xs"
                            >
                              全选
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deselectAll(category)}
                              className="h-7 text-xs"
                            >
                              清除
                            </Button>
                          </div>
                        </div>

                        {/* 类别内容 */}
                        {isExpanded && (
                          <div className="p-3 space-y-2">
                            {categoryMetrics.map(metric => {
                              const isSelected = selectedMetricIds.includes(metric.id)
                              
                              return (
                                <div
                                  key={metric.id}
                                  className={`
                                    flex items-start gap-3 p-3 rounded-lg border cursor-pointer
                                    transition-colors
                                    ${isSelected 
                                      ? 'border-blue-300 bg-blue-50' 
                                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                    }
                                  `}
                                  onClick={() => toggleMetric(metric.id)}
                                >
                                  <Checkbox
                                    checked={isSelected}
                                    onCheckedChange={() => toggleMetric(metric.id)}
                                    className="mt-0.5"
                                  />
                                  
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-gray-900">
                                        {metric.name}
                                      </span>
                                      <Badge variant="outline" className="text-xs">
                                        {metric.code}
                                      </Badge>
                                      <Badge
                                        variant={
                                          metric.priority === 'must' ? 'destructive' :
                                          metric.priority === 'should' ? 'default' :
                                          'secondary'
                                        }
                                        className="text-xs"
                                      >
                                        {metric.priority === 'must' ? '必须' :
                                         metric.priority === 'should' ? '应该' :
                                         '可选'}
                                      </Badge>
                                    </div>
                                    
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                      <span>
                                        目标: {metric.targetValue} {metric.unit}
                                      </span>
                                      {metric.lowerBound !== undefined && (
                                        <span className="text-xs">
                                          下限: {metric.lowerBound} {metric.unit}
                                        </span>
                                      )}
                                      {metric.upperBound !== undefined && (
                                        <span className="text-xs">
                                          上限: {metric.upperBound} {metric.unit}
                                        </span>
                                      )}
                                    </div>

                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="text-xs text-gray-500">
                                        来源: {metric.source}
                                      </span>
                                      <span className="text-xs text-gray-400">·</span>
                                      <span className="text-xs text-gray-500">
                                        验证: {
                                          metric.verificationMethod === 'simulation' ? '仿真' :
                                          metric.verificationMethod === 'test' ? '测试' :
                                          metric.verificationMethod === 'analysis' ? '分析' :
                                          '检查'
                                        }
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="radar" className="mt-4">
          <div className="space-y-4">
            {/* 类别选择 */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">选择对比维度:</span>
                  <div className="flex gap-2 flex-wrap">
                    {RADAR_CHART_CATEGORIES.map(cat => (
                      <Button
                        key={cat.name}
                        variant={radarCategory === cat.name ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setRadarCategory(cat.name)}
                      >
                        {cat.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 雷达图 */}
            {radarData && (
              <MetricRadarComparison
                projectName="项目目标"
                projectData={radarData.projectData as RadarDataPoint[]}
                competitorData={radarData.competitorData.map(c => ({
                  name: c.name,
                  data: c.data as RadarDataPoint[]
                }))}
                highlightedCompetitor="特斯拉 Model 3"
              />
            )}

            {/* 说明 */}
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-gray-600 space-y-2">
                  <p className="flex items-start gap-2">
                    <Circle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>雷达图展示了项目目标指标与竞品的对比情况</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <Circle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>所有指标已归一化到0-100分制，便于不同量纲的指标对比</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <Circle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>蓝色区域代表项目目标，其他颜色代表不同竞品</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
