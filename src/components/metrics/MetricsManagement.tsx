/**
 * MetricsManagement - 指标管理主页面
 * 提供指标的CRUD、分类查看、层级展示等功能
 */

import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, TrendingUp, TrendingDown, Minus, Target, BarChart3, AlertTriangle } from 'lucide-react@0.487.0';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Progress } from '../ui/progress';
import { useProject } from '../ProjectContext';
import metricsService from '../../services/MetricsService';
import { Metric } from '../../types/metrics';
import { MetricEditor } from './MetricEditor';

export const MetricsManagement: React.FC = () => {
  const { currentProject } = useProject();
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [filteredMetrics, setFilteredMetrics] = useState<Metric[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingMetric, setEditingMetric] = useState<Metric | null>(null);

  useEffect(() => {
    if (currentProject) {
      loadMetrics();
    }
  }, [currentProject]);

  useEffect(() => {
    filterMetrics();
  }, [metrics, searchTerm, selectedCategory, selectedLevel]);

  const loadMetrics = () => {
    if (!currentProject) return;
    const projectMetrics = metricsService.getMetricsByProject(currentProject.id);
    setMetrics(projectMetrics);
  };

  const filterMetrics = () => {
    let filtered = [...metrics];

    if (searchTerm) {
      filtered = filtered.filter(
        m =>
          m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(m => m.category === selectedCategory);
    }

    if (selectedLevel !== 'all') {
      filtered = filtered.filter(m => m.level === selectedLevel);
    }

    setFilteredMetrics(filtered);
  };

  const handleCreateMetric = () => {
    setEditingMetric(null);
    setIsEditorOpen(true);
  };

  const handleEditMetric = (metric: Metric) => {
    setEditingMetric(metric);
    setIsEditorOpen(true);
  };

  const handleSaveMetric = () => {
    setIsEditorOpen(false);
    setEditingMetric(null);
    loadMetrics();
  };

  const handleDeleteMetric = (metricId: string) => {
    if (confirm('确定要删除此指标吗？')) {
      metricsService.deleteMetric(metricId);
      loadMetrics();
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      performance: '性能',
      cost: '成本',
      reliability: '可靠性',
      compliance: '合规性',
      safety: '安全性',
    };
    return labels[category] || category;
  };

  const getLevelLabel = (level: string) => {
    const labels: Record<string, string> = {
      project: '项目级',
      system: '系统级',
      subsystem: '子系统级',
      component: '组件级',
    };
    return labels[level] || level;
  };

  const getPriorityLabel = (priority: string) => {
    const labels: Record<string, string> = {
      must: '必须',
      should: '应该',
      'nice-to-have': '可选',
    };
    return labels[priority] || priority;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getMetricStatus = (metric: Metric): 'good' | 'warning' | 'bad' => {
    if (!metric.currentValue) return 'warning';
    
    const deviation = Math.abs(metric.currentValue - metric.targetValue);
    const toleranceValue = (metric.targetValue * metric.tolerance) / 100;

    if (deviation <= toleranceValue) return 'good';
    if (deviation <= toleranceValue * 2) return 'warning';
    return 'bad';
  };

  const getStatusBadge = (status: 'good' | 'warning' | 'bad') => {
    const config = {
      good: { label: '达标', variant: 'default' as const, className: 'bg-green-500' },
      warning: { label: '预警', variant: 'outline' as const, className: 'border-yellow-500 text-yellow-600' },
      bad: { label: '不达标', variant: 'destructive' as const },
    };
    return config[status];
  };

  const calculateProgress = (metric: Metric): number => {
    if (!metric.currentValue) return 0;
    return Math.min(100, (metric.currentValue / metric.targetValue) * 100);
  };

  // 统计数据
  const stats = {
    total: metrics.length,
    good: metrics.filter(m => getMetricStatus(m) === 'good').length,
    warning: metrics.filter(m => getMetricStatus(m) === 'warning').length,
    bad: metrics.filter(m => getMetricStatus(m) === 'bad').length,
  };

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
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl">指标管理</h1>
            <p className="text-gray-500 mt-1">管理项目性能指标、目标和约束</p>
          </div>
          <Button onClick={handleCreateMetric}>
            <Plus className="h-4 w-4 mr-2" />
            创建指标
          </Button>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">总指标数</p>
                  <p className="text-2xl mt-1">{stats.total}</p>
                </div>
                <Target className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">达标</p>
                  <p className="text-2xl mt-1 text-green-600">{stats.good}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">预警</p>
                  <p className="text-2xl mt-1 text-yellow-600">{stats.warning}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">不达标</p>
                  <p className="text-2xl mt-1 text-red-600">{stats.bad}</p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col p-6">
          <Card className="flex-1 flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="搜索指标名称或编码..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="分类" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部分类</SelectItem>
                    <SelectItem value="performance">性能</SelectItem>
                    <SelectItem value="cost">成本</SelectItem>
                    <SelectItem value="reliability">可靠性</SelectItem>
                    <SelectItem value="compliance">合规性</SelectItem>
                    <SelectItem value="safety">安全性</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="层级" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部层级</SelectItem>
                    <SelectItem value="project">项目级</SelectItem>
                    <SelectItem value="system">系统级</SelectItem>
                    <SelectItem value="subsystem">子系统级</SelectItem>
                    <SelectItem value="component">组件级</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>编码</TableHead>
                    <TableHead>指标名称</TableHead>
                    <TableHead>分类</TableHead>
                    <TableHead>层级</TableHead>
                    <TableHead>目标值</TableHead>
                    <TableHead>当前值</TableHead>
                    <TableHead>完成度</TableHead>
                    <TableHead>趋势</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>优先级</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMetrics.map(metric => {
                    const status = getMetricStatus(metric);
                    const statusConfig = getStatusBadge(status);
                    const progress = calculateProgress(metric);

                    return (
                      <TableRow key={metric.id}>
                        <TableCell className="font-mono text-sm">{metric.code}</TableCell>
                        <TableCell>
                          <div>
                            <div>{metric.name}</div>
                            <div className="text-sm text-gray-500">{metric.owner}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{getCategoryLabel(metric.category)}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{getLevelLabel(metric.level)}</Badge>
                        </TableCell>
                        <TableCell>
                          {metric.targetValue} {metric.unit}
                        </TableCell>
                        <TableCell>
                          {metric.currentValue ? `${metric.currentValue} ${metric.unit}` : '-'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={progress} className="w-20" />
                            <span className="text-sm text-gray-500">{progress.toFixed(0)}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{getTrendIcon(metric.trend)}</TableCell>
                        <TableCell>
                          <Badge variant={statusConfig.variant} className={statusConfig.className}>
                            {statusConfig.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={metric.priority === 'must' ? 'destructive' : 'outline'}
                          >
                            {getPriorityLabel(metric.priority)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditMetric(metric)}
                            >
                              编辑
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteMetric(metric.id)}
                            >
                              删除
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {filteredMetrics.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  暂无指标数据
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 指标编辑器对话框 */}
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingMetric ? '编辑指标' : '创建指标'}</DialogTitle>
          </DialogHeader>
          <MetricEditor
            metric={editingMetric}
            projectId={currentProject.id}
            onSave={handleSaveMetric}
            onCancel={() => setIsEditorOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MetricsManagement;
