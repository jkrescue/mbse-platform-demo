/**
 * 指标体系演示卡片
 * 用于在项目仪表板中快速查看预置指标体系概况
 */

import { 
  Target, 
  TrendingUp,
  Award,
  Users,
  BarChart3
} from 'lucide-react@0.487.0'
import { Card, CardContent, CardHeader } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Progress } from '../ui/progress'
import { metricsService } from '../../services/MetricsService'
import { PRESET_METRICS, PRESET_COMPETITORS } from '../../data/presetMetrics'

interface MetricsDemoCardProps {
  projectId: string
  onViewDetails?: () => void
}

export function MetricsDemoCard({
  projectId,
  onViewDetails
}: MetricsDemoCardProps) {
  const projectMetrics = metricsService.getMetricsByProject(projectId)
  const projectBenchmarks = metricsService.getBenchmarksByProject(projectId)

  // 统计各类别指标数量
  const metricsByCategory = {
    performance: projectMetrics.filter(m => m.category === 'performance').length,
    cost: projectMetrics.filter(m => m.category === 'cost').length,
    reliability: projectMetrics.filter(m => m.category === 'reliability').length,
    safety: projectMetrics.filter(m => m.category === 'safety').length,
    compliance: projectMetrics.filter(m => m.category === 'compliance').length
  }

  const totalMetrics = projectMetrics.length
  const hasMetrics = totalMetrics > 0

  // 计算指标完成度（基于currentValue vs targetValue）
  const metricsWithProgress = projectMetrics.filter(m => 
    m.currentValue !== undefined && m.predictedValue !== undefined
  )
  const avgProgress = metricsWithProgress.length > 0
    ? metricsWithProgress.reduce((sum, m) => {
        const progress = (m.currentValue! / m.targetValue) * 100
        return sum + Math.min(progress, 100)
      }, 0) / metricsWithProgress.length
    : 0

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            <h3 className="text-gray-900">指标体系概览</h3>
          </div>
          {hasMetrics && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {totalMetrics} 项指标
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {hasMetrics ? (
          <>
            {/* 指标分类统计 */}
            <div className="grid grid-cols-5 gap-2">
              <div className="text-center p-2 bg-blue-50 rounded">
                <div className="text-blue-900">{metricsByCategory.performance}</div>
                <div className="text-xs text-blue-600 mt-1">性能</div>
              </div>
              <div className="text-center p-2 bg-green-50 rounded">
                <div className="text-green-900">{metricsByCategory.cost}</div>
                <div className="text-xs text-green-600 mt-1">成本</div>
              </div>
              <div className="text-center p-2 bg-purple-50 rounded">
                <div className="text-purple-900">{metricsByCategory.reliability}</div>
                <div className="text-xs text-purple-600 mt-1">可靠性</div>
              </div>
              <div className="text-center p-2 bg-red-50 rounded">
                <div className="text-red-900">{metricsByCategory.safety}</div>
                <div className="text-xs text-red-600 mt-1">安全</div>
              </div>
              <div className="text-center p-2 bg-orange-50 rounded">
                <div className="text-orange-900">{metricsByCategory.compliance}</div>
                <div className="text-xs text-orange-600 mt-1">合规</div>
              </div>
            </div>

            {/* 平均达成度 */}
            {metricsWithProgress.length > 0 && (
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    平均指标达成度
                  </span>
                  <span className="text-gray-900">{Math.round(avgProgress)}%</span>
                </div>
                <Progress value={avgProgress} className="h-2" />
              </div>
            )}

            {/* 竞品对标 */}
            {projectBenchmarks.length > 0 && (
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Users className="w-4 h-4" />
                  <span>竞品对标</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {projectBenchmarks.slice(0, 6).map((benchmark, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {benchmark.competitor} {benchmark.model}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* 操作按钮 */}
            <div className="pt-2 border-t flex gap-2">
              <Button variant="outline" className="flex-1" size="sm" onClick={onViewDetails}>
                <BarChart3 className="w-4 h-4 mr-1" />
                查看雷达图
              </Button>
              <Button variant="outline" className="flex-1" size="sm">
                <Target className="w-4 h-4 mr-1" />
                管理指标
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 mb-4">暂未加载指标体系</p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>预置指标体系包含：</p>
              <div className="flex justify-center gap-2 text-xs">
                <Badge variant="secondary">17项指标</Badge>
                <Badge variant="secondary">6个竞品</Badge>
                <Badge variant="secondary">雷达图对比</Badge>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
