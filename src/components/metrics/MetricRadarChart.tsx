/**
 * 指标雷达图组件
 * 用于可视化对比项目指标与竞品指标
 */

import { useMemo } from 'react'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts'
import { Card, CardContent, CardHeader } from '../ui/card'
import { Badge } from '../ui/badge'
import { TrendingUp, Target, Award } from 'lucide-react@0.487.0'
import { METRIC_NORMALIZATION } from '../../data/presetMetrics'

export interface RadarDataPoint {
  metricCode: string
  metricName: string
  value: number
  unit: string
}

export interface RadarSeriesData {
  name: string
  color: string
  data: RadarDataPoint[]
}

interface MetricRadarChartProps {
  title: string
  seriesData: RadarSeriesData[]
  showLegend?: boolean
  height?: number
}

export function MetricRadarChart({
  title,
  seriesData,
  showLegend = true,
  height = 400
}: MetricRadarChartProps) {
  // 归一化数据用于雷达图展示
  const normalizedData = useMemo(() => {
    if (seriesData.length === 0) return []

    // 获取所有指标代码
    const metricCodes = seriesData[0].data.map(d => d.metricCode)
    
    return metricCodes.map(metricCode => {
      const point = seriesData[0].data.find(d => d.metricCode === metricCode)
      if (!point) return null

      const result: any = {
        metric: point.metricName,
        metricCode: metricCode,
        fullMark: 100
      }

      // 为每个系列添加归一化值
      seriesData.forEach(series => {
        const seriesPoint = series.data.find(d => d.metricCode === metricCode)
        if (seriesPoint) {
          const normalized = normalizeMetricValue(metricCode, seriesPoint.value)
          result[series.name] = normalized
        }
      })

      return result
    }).filter(Boolean)
  }, [seriesData])

  // 计算综合得分
  const calculateScore = (seriesName: string) => {
    if (normalizedData.length === 0) return 0
    const total = normalizedData.reduce((sum, point) => sum + (point[seriesName] || 0), 0)
    return Math.round(total / normalizedData.length)
  }

  if (seriesData.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          暂无数据
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-gray-900">{title}</h3>
          <div className="flex gap-2">
            {seriesData.map(series => (
              <Badge
                key={series.name}
                variant="outline"
                className="gap-1"
                style={{ borderColor: series.color }}
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: series.color }}
                />
                {series.name}: {calculateScore(series.name)}分
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <RadarChart data={normalizedData}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis
              dataKey="metric"
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: '#6b7280', fontSize: 10 }}
            />
            
            {seriesData.map((series, index) => (
              <Radar
                key={series.name}
                name={series.name}
                dataKey={series.name}
                stroke={series.color}
                fill={series.color}
                fillOpacity={0.25 + index * 0.05}
                strokeWidth={2}
              />
            ))}
            
            {showLegend && <Legend />}
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length > 0) {
                  const data = payload[0].payload
                  return (
                    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
                      <p className="text-gray-900 mb-2">{data.metric}</p>
                      {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div
                            className="w-3 h-3 rounded"
                            style={{ backgroundColor: entry.color }}
                          />
                          <span className="text-gray-600">{entry.name}:</span>
                          <span className="text-gray-900">{entry.value}分</span>
                        </div>
                      ))}
                    </div>
                  )
                }
                return null
              }}
            />
          </RadarChart>
        </ResponsiveContainer>

        {/* 指标详细对比 */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Target className="w-4 h-4" />
            <span>各维度对比</span>
          </div>
          
          <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
            {seriesData[0].data.map((point) => {
              const metricConfig = METRIC_NORMALIZATION[point.metricCode]
              return (
                <div
                  key={point.metricCode}
                  className="flex items-center gap-2 p-2 bg-gray-50 rounded text-sm"
                >
                  <div className="flex-1 text-gray-700">{point.metricName}</div>
                  <div className="flex gap-3">
                    {seriesData.map(series => {
                      const seriesPoint = series.data.find(d => d.metricCode === point.metricCode)
                      return seriesPoint ? (
                        <div
                          key={series.name}
                          className="flex items-center gap-1"
                          style={{ color: series.color }}
                        >
                          <span className="w-16 text-right">
                            {seriesPoint.value}
                          </span>
                          <span className="text-gray-400 text-xs w-12">
                            {seriesPoint.unit}
                          </span>
                        </div>
                      ) : null
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * 归一化指标值到0-100范围
 */
function normalizeMetricValue(metricCode: string, value: number): number {
  const config = METRIC_NORMALIZATION[metricCode]
  if (!config) return 50 // 默认中间值

  const { min, max, reverseScale } = config
  
  // 限制在范围内
  const clampedValue = Math.max(min, Math.min(max, value))
  
  // 归一化到0-100
  let normalized = ((clampedValue - min) / (max - min)) * 100
  
  // 如果是反向缩放（值越小越好），则反转
  if (reverseScale) {
    normalized = 100 - normalized
  }
  
  return Math.round(normalized)
}

/**
 * 指标雷达图对比卡片
 * 用于显示多个竞品的对比
 */
interface MetricRadarComparisonProps {
  projectName: string
  projectData: RadarDataPoint[]
  competitorData: {
    name: string
    data: RadarDataPoint[]
  }[]
  highlightedCompetitor?: string
}

export function MetricRadarComparison({
  projectName,
  projectData,
  competitorData,
  highlightedCompetitor
}: MetricRadarComparisonProps) {
  const seriesData: RadarSeriesData[] = [
    {
      name: projectName,
      color: '#3b82f6', // 蓝色 - 项目目标
      data: projectData
    },
    ...competitorData.map((comp, index) => ({
      name: comp.name,
      color: comp.name === highlightedCompetitor
        ? '#ef4444' // 红色 - 突出显示的竞品
        : ['#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'][index % 5], // 其他颜色
      data: comp.data
    }))
  ]

  // 计算优势指标
  const advantages = useMemo(() => {
    if (competitorData.length === 0) return []
    
    const result: string[] = []
    projectData.forEach(projectPoint => {
      const metricConfig = METRIC_NORMALIZATION[projectPoint.metricCode]
      if (!metricConfig) return
      
      const projectNormalized = normalizeMetricValue(projectPoint.metricCode, projectPoint.value)
      
      let isBest = true
      for (const comp of competitorData) {
        const compPoint = comp.data.find(d => d.metricCode === projectPoint.metricCode)
        if (compPoint) {
          const compNormalized = normalizeMetricValue(projectPoint.metricCode, compPoint.value)
          if (compNormalized > projectNormalized) {
            isBest = false
            break
          }
        }
      }
      
      if (isBest) {
        result.push(projectPoint.metricName)
      }
    })
    
    return result
  }, [projectData, competitorData])

  return (
    <div className="space-y-4">
      <MetricRadarChart
        title="项目指标 vs 竞品对标"
        seriesData={seriesData}
        height={450}
      />
      
      {/* 优势分析 */}
      {advantages.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Award className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm text-gray-900 mb-2">优势指标</div>
                <div className="flex flex-wrap gap-2">
                  {advantages.map(metric => (
                    <Badge key={metric} variant="outline" className="bg-yellow-50 border-yellow-200 text-yellow-700">
                      {metric}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
