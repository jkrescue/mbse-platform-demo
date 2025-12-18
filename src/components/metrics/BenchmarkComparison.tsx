/**
 * BenchmarkComparison - 竞品对标页面
 * 提供竞品数据管理和对比分析功能
 */

import React, { useState, useEffect } from 'react';
import { Plus, BarChart3, TrendingUp, ExternalLink, Edit, Trash2 } from 'lucide-react@0.487.0';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useProject } from '../ProjectContext';
import metricsService from '../../services/MetricsService';
import { BenchmarkItem, Metric } from '../../types/metrics';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

export const BenchmarkComparison: React.FC = () => {
  const { currentProject } = useProject();
  const [benchmarks, setBenchmarks] = useState<BenchmarkItem[]>([]);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBenchmark, setEditingBenchmark] = useState<BenchmarkItem | null>(null);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);

  useEffect(() => {
    if (currentProject) {
      loadData();
    }
  }, [currentProject]);

  const loadData = () => {
    if (!currentProject) return;
    const projectBenchmarks = metricsService.getBenchmarksByProject(currentProject.id);
    const projectMetrics = metricsService.getMetricsByProject(currentProject.id);
    setBenchmarks(projectBenchmarks);
    setMetrics(projectMetrics);
    if (projectMetrics.length > 0) {
      setSelectedMetrics([projectMetrics[0].id]);
    }
  };

  const handleCreateBenchmark = () => {
    setEditingBenchmark(null);
    setIsDialogOpen(true);
  };

  const handleEditBenchmark = (benchmark: BenchmarkItem) => {
    setEditingBenchmark(benchmark);
    setIsDialogOpen(true);
  };

  const handleDeleteBenchmark = (benchmarkId: string) => {
    if (confirm('确定要删除此竞品数据吗？')) {
      metricsService.deleteBenchmark(benchmarkId);
      loadData();
    }
  };

  const getConfidenceBadge = (confidence: string) => {
    const config = {
      confirmed: { label: '已确认', variant: 'default' as const, className: 'bg-green-500' },
      estimated: { label: '估算', variant: 'outline' as const, className: 'border-yellow-500 text-yellow-600' },
      rumored: { label: '传闻', variant: 'secondary' as const },
    };
    return config[confidence as keyof typeof config] || config.estimated;
  };

  // 准备对比图表数据
  const prepareComparisonData = () => {
    const data: any[] = [];

    selectedMetrics.forEach(metricId => {
      const metric = metrics.find(m => m.id === metricId);
      if (!metric) return;

      const dataPoint: any = {
        metricName: metric.name,
        目标值: metric.targetValue,
        当前值: metric.currentValue || 0,
      };

      benchmarks.forEach(benchmark => {
        const metricData = benchmark.metrics.find(m => m.metricId === metricId);
        if (metricData) {
          dataPoint[`${benchmark.competitor} ${benchmark.model}`] = metricData.value;
        }
      });

      data.push(dataPoint);
    });

    return data;
  };

  // 准备雷达图数据
  const prepareRadarData = () => {
    if (selectedMetrics.length === 0) return [];

    const data: any[] = [];
    
    selectedMetrics.forEach(metricId => {
      const metric = metrics.find(m => m.id === metricId);
      if (!metric) return;

      const point: any = {
        metric: metric.name,
        我方: metric.currentValue ? (metric.currentValue / metric.targetValue) * 100 : 0,
      };

      benchmarks.forEach((benchmark, idx) => {
        const metricData = benchmark.metrics.find(m => m.metricId === metricId);
        if (metricData && metric.targetValue > 0) {
          point[benchmark.competitor] = (metricData.value / metric.targetValue) * 100;
        }
      });

      data.push(point);
    });

    return data;
  };

  const comparisonData = prepareComparisonData();
  const radarData = prepareRadarData();

  if (!currentProject) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">请先选择项目</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* 顶部栏 */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl">竞品对标</h1>
            <p className="text-gray-500 mt-1">管理竞品数据并进行对比分析</p>
          </div>
          <Button onClick={handleCreateBenchmark}>
            <Plus className="h-4 w-4 mr-2" />
            添加竞品数据
          </Button>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* 可视化对比 */}
        <div className="grid grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>指标对比</CardTitle>
              <CardDescription>与竞品的关键指标对比</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Label>选择对比指标</Label>
                <Select
                  value={selectedMetrics[0] || ''}
                  onValueChange={v => setSelectedMetrics([v])}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择指标" />
                  </SelectTrigger>
                  <SelectContent>
                    {metrics.map(metric => (
                      <SelectItem key={metric.id} value={metric.id}>
                        {metric.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="metricName" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="目标值" fill="#3b82f6" />
                  <Bar dataKey="当前值" fill="#10b981" />
                  {benchmarks.map((benchmark, idx) => (
                    <Bar
                      key={benchmark.id}
                      dataKey={`${benchmark.competitor} ${benchmark.model}`}
                      fill={`hsl(${idx * 60}, 70%, 50%)`}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>综合对比雷达图</CardTitle>
              <CardDescription>多维度性能对比</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis angle={90} domain={[0, 150]} />
                  <Radar name="我方" dataKey="我方" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  {benchmarks.map((benchmark, idx) => (
                    <Radar
                      key={benchmark.id}
                      name={benchmark.competitor}
                      dataKey={benchmark.competitor}
                      stroke={`hsl(${idx * 60}, 70%, 50%)`}
                      fill={`hsl(${idx * 60}, 70%, 50%)`}
                      fillOpacity={0.3}
                    />
                  ))}
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* 竞品数据表格 */}
        <Card>
          <CardHeader>
            <CardTitle>竞品数据库</CardTitle>
            <CardDescription>所有竞品的详细数据</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>厂商</TableHead>
                  <TableHead>车型</TableHead>
                  <TableHead>版本</TableHead>
                  <TableHead>发布日期</TableHead>
                  <TableHead>指标数</TableHead>
                  <TableHead>测试工况</TableHead>
                  <TableHead>数据来源</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {benchmarks.map(benchmark => (
                  <TableRow key={benchmark.id}>
                    <TableCell>{benchmark.competitor}</TableCell>
                    <TableCell>{benchmark.model}</TableCell>
                    <TableCell>{benchmark.variant}</TableCell>
                    <TableCell>{new Date(benchmark.releaseDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{benchmark.metrics.length} 项</Badge>
                    </TableCell>
                    <TableCell>{benchmark.measurementCondition}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{benchmark.source}</span>
                        {benchmark.sourceUrl && (
                          <a
                            href={benchmark.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditBenchmark(benchmark)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteBenchmark(benchmark.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {benchmarks.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                暂无竞品数据，点击右上角按钮添加
              </div>
            )}
          </CardContent>
        </Card>

        {/* 详细指标对比 */}
        {benchmarks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>详细指标对比</CardTitle>
              <CardDescription>各项指标的详细对比</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>指标</TableHead>
                    <TableHead>我方目标</TableHead>
                    <TableHead>我方当前</TableHead>
                    {benchmarks.map(b => (
                      <TableHead key={b.id}>
                        {b.competitor} {b.model}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metrics.map(metric => {
                    const hasData = benchmarks.some(b =>
                      b.metrics.some(m => m.metricId === metric.id)
                    );
                    if (!hasData && !metric.currentValue) return null;

                    return (
                      <TableRow key={metric.id}>
                        <TableCell>
                          <div>
                            <div>{metric.name}</div>
                            <div className="text-sm text-gray-500">{metric.unit}</div>
                          </div>
                        </TableCell>
                        <TableCell>{metric.targetValue}</TableCell>
                        <TableCell>{metric.currentValue || '-'}</TableCell>
                        {benchmarks.map(benchmark => {
                          const metricData = benchmark.metrics.find(m => m.metricId === metric.id);
                          return (
                            <TableCell key={benchmark.id}>
                              {metricData ? (
                                <div className="flex items-center gap-2">
                                  <span>{metricData.value}</span>
                                  <Badge
                                    variant={getConfidenceBadge(metricData.confidence).variant}
                                    className={getConfidenceBadge(metricData.confidence).className}
                                  >
                                    {getConfidenceBadge(metricData.confidence).label}
                                  </Badge>
                                </div>
                              ) : (
                                '-'
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 添加/编辑竞品对话框 */}
      <BenchmarkDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        benchmark={editingBenchmark}
        projectId={currentProject.id}
        metrics={metrics}
        onSave={loadData}
      />
    </div>
  );
};

// 竞品数据编辑对话框
interface BenchmarkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  benchmark: BenchmarkItem | null;
  projectId: string;
  metrics: Metric[];
  onSave: () => void;
}

const BenchmarkDialog: React.FC<BenchmarkDialogProps> = ({
  isOpen,
  onClose,
  benchmark,
  projectId,
  metrics,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    competitor: '',
    model: '',
    variant: '',
    source: '',
    sourceUrl: '',
    measurementCondition: 'CLTC',
    releaseDate: new Date().toISOString().split('T')[0],
    metrics: [] as { metricId: string; value: number; confidence: string }[],
  });

  useEffect(() => {
    if (benchmark) {
      setFormData({
        competitor: benchmark.competitor,
        model: benchmark.model,
        variant: benchmark.variant,
        source: benchmark.source,
        sourceUrl: benchmark.sourceUrl || '',
        measurementCondition: benchmark.measurementCondition,
        releaseDate: benchmark.releaseDate.split('T')[0],
        metrics: benchmark.metrics,
      });
    } else {
      setFormData({
        competitor: '',
        model: '',
        variant: '',
        source: '',
        sourceUrl: '',
        measurementCondition: 'CLTC',
        releaseDate: new Date().toISOString().split('T')[0],
        metrics: [],
      });
    }
  }, [benchmark, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (benchmark) {
      metricsService.updateBenchmark(benchmark.id, {
        ...formData,
        releaseDate: new Date(formData.releaseDate).toISOString(),
      });
    } else {
      metricsService.createBenchmark({
        ...formData,
        projectId,
        releaseDate: new Date(formData.releaseDate).toISOString(),
        addedBy: 'current_user',
      });
    }

    onSave();
    onClose();
  };

  const handleMetricValueChange = (metricId: string, value: number, confidence: string) => {
    const existingIndex = formData.metrics.findIndex(m => m.metricId === metricId);
    const newMetrics = [...formData.metrics];

    if (existingIndex >= 0) {
      newMetrics[existingIndex] = { metricId, value, confidence };
    } else {
      newMetrics.push({ metricId, value, confidence });
    }

    setFormData(prev => ({ ...prev, metrics: newMetrics }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{benchmark ? '编辑竞品数据' : '添加竞品数据'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>厂商 *</Label>
              <Input
                value={formData.competitor}
                onChange={e => setFormData(prev => ({ ...prev, competitor: e.target.value }))}
                placeholder="例如：特斯拉"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>车型 *</Label>
              <Input
                value={formData.model}
                onChange={e => setFormData(prev => ({ ...prev, model: e.target.value }))}
                placeholder="例如：Model 3"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>版本 *</Label>
              <Input
                value={formData.variant}
                onChange={e => setFormData(prev => ({ ...prev, variant: e.target.value }))}
                placeholder="例如：长续航版"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>发布日期 *</Label>
              <Input
                type="date"
                value={formData.releaseDate}
                onChange={e => setFormData(prev => ({ ...prev, releaseDate: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>数据来源 *</Label>
              <Input
                value={formData.source}
                onChange={e => setFormData(prev => ({ ...prev, source: e.target.value }))}
                placeholder="例如：官网、测评"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>来源链接</Label>
              <Input
                value={formData.sourceUrl}
                onChange={e => setFormData(prev => ({ ...prev, sourceUrl: e.target.value }))}
                placeholder="https://"
              />
            </div>

            <div className="space-y-2">
              <Label>测试工况 *</Label>
              <Select
                value={formData.measurementCondition}
                onValueChange={v => setFormData(prev => ({ ...prev, measurementCondition: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CLTC">CLTC</SelectItem>
                  <SelectItem value="WLTP">WLTP</SelectItem>
                  <SelectItem value="NEDC">NEDC</SelectItem>
                  <SelectItem value="EPA">EPA</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <Label>指标数据</Label>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {metrics.map(metric => {
                const metricData = formData.metrics.find(m => m.metricId === metric.id);
                return (
                  <div key={metric.id} className="grid grid-cols-3 gap-3 items-center">
                    <div className="text-sm">
                      {metric.name} ({metric.unit})
                    </div>
                    <Input
                      type="number"
                      step="any"
                      placeholder="数值"
                      value={metricData?.value || ''}
                      onChange={e =>
                        handleMetricValueChange(
                          metric.id,
                          parseFloat(e.target.value) || 0,
                          metricData?.confidence || 'estimated'
                        )
                      }
                    />
                    <Select
                      value={metricData?.confidence || 'estimated'}
                      onValueChange={v =>
                        handleMetricValueChange(metric.id, metricData?.value || 0, v)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="confirmed">已确认</SelectItem>
                        <SelectItem value="estimated">估算</SelectItem>
                        <SelectItem value="rumored">传闻</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                );
              })}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              取消
            </Button>
            <Button type="submit">保存</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BenchmarkComparison;
