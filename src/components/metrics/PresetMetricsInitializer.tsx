/**
 * 预置指标体系初始化器
 * 用于快速为项目加载预置的指标体系和竞品数据
 */

import { useState } from 'react'
import { 
  Target, 
  Download, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  TrendingUp,
  DollarSign,
  Shield,
  FileCheck
} from 'lucide-react@0.487.0'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader } from '../ui/card'
import { Badge } from '../ui/badge'
import { Alert, AlertDescription } from '../ui/alert'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog'
import { metricsService } from '../../services/MetricsService'
import { PRESET_METRICS, PRESET_COMPETITORS } from '../../data/presetMetrics'
import { toast } from 'sonner@2.0.3'

interface PresetMetricsInitializerProps {
  projectId: string
  onInitialized?: () => void
}

export function PresetMetricsInitializer({
  projectId,
  onInitialized
}: PresetMetricsInitializerProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const existingMetrics = metricsService.getMetricsByProject(projectId)
  const hasMetrics = existingMetrics.length > 0

  const handleInitialize = () => {
    setLoading(true)
    
    try {
      // 初始化预置指标
      const createdMetrics = metricsService.initializePresetMetrics(projectId)
      
      toast.success(
        `成功初始化 ${createdMetrics.length} 个指标和 ${PRESET_COMPETITORS.length} 个竞品数据`,
        {
          description: '您现在可以在任务管理中选择这些指标进行关联'
        }
      )
      
      setOpen(false)
      onInitialized?.()
    } catch (error: any) {
      toast.error('初始化失败', {
        description: error.message
      })
    } finally {
      setLoading(false)
    }
  }

  // 按类别统计预置指标
  const metricStats = {
    performance: PRESET_METRICS.filter(m => m.category === 'performance').length,
    cost: PRESET_METRICS.filter(m => m.category === 'cost').length,
    reliability: PRESET_METRICS.filter(m => m.category === 'reliability').length,
    safety: PRESET_METRICS.filter(m => m.category === 'safety').length,
    compliance: PRESET_METRICS.filter(m => m.category === 'compliance').length
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={hasMetrics ? "outline" : "default"} className="gap-2">
          <Download className="w-4 h-4" />
          {hasMetrics ? '重新加载预置指标' : '加载预置指标体系'}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>初始化预置指标体系</DialogTitle>
          <DialogDescription>
            为项目加载完整的汽车行业指标体系和竞品对标数据
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 py-4">
          {/* 警告信息 */}
          {hasMetrics && (
            <Alert variant="destructive">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>
                该项目已有 {existingMetrics.length} 个指标。初始化预置指标会添加新的指标，不会删除现有指标。
              </AlertDescription>
            </Alert>
          )}

          {/* 指标统计 */}
          <Card>
            <CardHeader>
              <h3 className="text-gray-900 flex items-center gap-2">
                <Target className="w-5 h-5" />
                预置指标概览
              </h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="text-sm text-gray-600">性能指标</div>
                    <div className="text-gray-900">{metricStats.performance} 项</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="text-sm text-gray-600">成本指标</div>
                    <div className="text-gray-900">{metricStats.cost} 项</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-purple-600" />
                  <div>
                    <div className="text-sm text-gray-600">可靠性指标</div>
                    <div className="text-gray-900">{metricStats.reliability} 项</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Shield className="w-5 h-5 text-red-600" />
                  <div>
                    <div className="text-sm text-gray-600">安全指标</div>
                    <div className="text-gray-900">{metricStats.safety} 项</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 border rounded-lg col-span-2">
                  <FileCheck className="w-5 h-5 text-orange-600" />
                  <div>
                    <div className="text-sm text-gray-600">合规性指标</div>
                    <div className="text-gray-900">{metricStats.compliance} 项</div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">指标总计</span>
                  <Badge variant="outline" className="text-base px-3 py-1">
                    {PRESET_METRICS.length} 项
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 竞品数据 */}
          <Card>
            <CardHeader>
              <h3 className="text-gray-900">竞品对标数据</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 mb-3">
                  包含以下 {PRESET_COMPETITORS.length} 个竞品的详细数据：
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {PRESET_COMPETITORS.map((comp, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-200"
                    >
                      <div className="flex-1">
                        <div className="text-sm text-gray-900">
                          {comp.competitor} {comp.model}
                        </div>
                        <div className="text-xs text-gray-500">
                          {comp.variant}
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {comp.metricValues.length} 项指标
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 功能说明 */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-2 text-sm text-gray-600">
                <h4 className="text-gray-900 mb-2">初始化后您可以：</h4>
                <ul className="space-y-1 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>在任务创建时选择关联指标，建立任务-指标追溯关系</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>使用雷达图可视化对比项目目标与竞品指标</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>在指标管理模块中编辑、调整或添加新的指标</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>进行权衡分析和设计空间探索</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            取消
          </Button>
          <Button onClick={handleInitialize} disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {loading ? '初始化中...' : '确认初始化'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
