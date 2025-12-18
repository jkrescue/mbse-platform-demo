/**
 * TradeStudyAnalysis - 权衡研究分析页面
 * 提供多目标优化分析、帕累托前沿可视化和方案推荐功能
 */

import React, { useState, useEffect } from 'react';
import { Plus, BarChart3, TrendingUp, AlertCircle, CheckCircle, Edit, Trash2, Play } from 'lucide-react@0.487.0';
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
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useProject } from '../ProjectContext';
import metricsService from '../../services/MetricsService';
import { TradeStudy, Metric } from '../../types/metrics';
import {
  ScatterChart,
  Scatter,
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
  Cell,
} from 'recharts';

export const TradeStudyAnalysis: React.FC = () => {
  const { currentProject } = useProject();
  const [studies, setStudies] = useState<TradeStudy[]>([]);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [selectedStudy, setSelectedStudy] = useState<TradeStudy | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStudy, setEditingStudy] = useState<TradeStudy | null>(null);

  useEffect(() => {
    if (currentProject) {
      loadData();
    }
  }, [currentProject]);

  const loadData = () => {
    if (!currentProject) return;
    const projectStudies = metricsService.getTradeStudiesByProject(currentProject.id);
    const projectMetrics = metricsService.getMetricsByProject(currentProject.id);
    setStudies(projectStudies);
    setMetrics(projectMetrics);
    if (projectStudies.length > 0) {
      setSelectedStudy(projectStudies[0]);
    }
  };

  const handleCreateStudy = () => {
    setEditingStudy(null);
    setIsDialogOpen(true);
  };

  const handleEditStudy = (study: TradeStudy) => {
    setEditingStudy(study);
    setIsDialogOpen(true);
  };

  const handleDeleteStudy = (studyId: string) => {
    if (confirm('确定要删除此权衡研究吗？')) {
      metricsService.deleteTradeStudy(studyId);
      loadData();
      if (selectedStudy?.id === studyId) {
        setSelectedStudy(null);
      }
    }
  };

  const handleCalculatePareto = (study: TradeStudy) => {
    const paretoFrontier = metricsService.calculateParetoFrontier(study);
    metricsService.updateTradeStudy(study.id, { paretoFrontier });
    loadData();
  };

  const getStatusBadge = (status: string) => {
    const config = {
      draft: { label: '草稿', variant: 'secondary' as const },
      review: { label: '评审中', variant: 'outline' as const, className: 'border-yellow-500 text-yellow-600' },
      approved: { label: '已批准', variant: 'default' as const, className: 'bg-green-500' },
      adopted: { label: '已采纳', variant: 'default' as const, className: 'bg-blue-500' },
    };
    return config[status as keyof typeof config] || config.draft;
  };

  // 准备帕累托图数据
  const prepareParetoData = (study: TradeStudy) => {
    if (study.objectives.length < 2) return [];

    const obj1 = study.objectives[0];
    const obj2 = study.objectives[1];

    return study.candidates.map(candidate => {
      const value1 = candidate.metricValues.find(m => m.metricId === obj1.metricId)?.value || 0;
      const value2 = candidate.metricValues.find(m => m.metricId === obj2.metricId)?.value || 0;
      
      return {
        name: candidate.name,
        id: candidate.id,
        x: obj1.direction === 'maximize' ? value1 : -value1,
        y: obj2.direction === 'maximize' ? value2 : -value2,
        isPareto: study.paretoFrontier.includes(candidate.id),
        isRecommended: candidate.id === study.recommendedCandidateId,
      };
    });
  };

  // 准备雷达图数据
  const prepareRadarData = (study: TradeStudy) => {
    const metricIds = study.objectives.map(obj => obj.metricId);
    
    return metricIds.map(metricId => {
      const metric = metrics.find(m => m.id === metricId);
      if (!metric) return null;

      const dataPoint: any = {
        metric: metric.name,
      };

      study.candidates.forEach(candidate => {
        const value = candidate.metricValues.find(m => m.metricId === metricId)?.value || 0;
        // 归一化到0-100
        const normalized = metric.targetValue > 0 ? (value / metric.targetValue) * 100 : 0;
        dataPoint[candidate.name] = normalized;
      });

      return dataPoint;
    }).filter(Boolean);
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl">权衡研究</h1>
            <p className="text-gray-500 mt-1">多目标优化与方案权衡分析</p>
          </div>
          <Button onClick={handleCreateStudy}>
            <Plus className="h-4 w-4 mr-2" />
            创建权衡研究
          </Button>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-hidden flex">
        {/* 左侧：研究列表 */}
        <div className="w-80 border-r bg-white p-4 overflow-auto">
          <h3 className="font-medium mb-4">权衡研究列表</h3>
          <div className="space-y-2">
            {studies.map(study => (
              <Card
                key={study.id}
                className={`cursor-pointer hover:bg-gray-50 ${
                  selectedStudy?.id === study.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedStudy(study)}
              >
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium">{study.name}</h4>
                    <Badge
                      variant={getStatusBadge(study.status).variant}
                      className={getStatusBadge(study.status).className}
                    >
                      {getStatusBadge(study.status).label}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500 space-y-1">
                    <div>目标: {study.objectives.length} 项</div>
                    <div>方案: {study.candidates.length} 个</div>
                    <div>创建: {new Date(study.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={e => {
                        e.stopPropagation();
                        handleEditStudy(study);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={e => {
                        e.stopPropagation();
                        handleDeleteStudy(study.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {studies.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                暂无权衡研究
              </div>
            )}
          </div>
        </div>

        {/* 右侧：研究详情 */}
        <div className="flex-1 overflow-auto p-6">
          {selectedStudy ? (
            <div className="space-y-6">
              {/* 研究信息 */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{selectedStudy.name}</CardTitle>
                      <CardDescription>{selectedStudy.description}</CardDescription>
                    </div>
                    <Button onClick={() => handleCalculatePareto(selectedStudy)}>
                      <Play className="h-4 w-4 mr-2" />
                      计算帕累托前沿
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">优化目标</p>
                      <p className="text-2xl mt-1">{selectedStudy.objectives.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">候选方案</p>
                      <p className="text-2xl mt-1">{selectedStudy.candidates.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">帕累托最优</p>
                      <p className="text-2xl mt-1">{selectedStudy.paretoFrontier.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 可视化分析 */}
              <div className="grid grid-cols-2 gap-6">
                {/* 帕累托前沿图 */}
                {selectedStudy.objectives.length >= 2 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>帕累托前沿</CardTitle>
                      <CardDescription>
                        {metrics.find(m => m.id === selectedStudy.objectives[0].metricId)?.name} vs{' '}
                        {metrics.find(m => m.id === selectedStudy.objectives[1].metricId)?.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <ScatterChart>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            type="number"
                            dataKey="x"
                            name={metrics.find(m => m.id === selectedStudy.objectives[0].metricId)?.name}
                          />
                          <YAxis
                            type="number"
                            dataKey="y"
                            name={metrics.find(m => m.id === selectedStudy.objectives[1].metricId)?.name}
                          />
                          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                          <Legend />
                          <Scatter
                            name="候选方案"
                            data={prepareParetoData(selectedStudy)}
                            fill="#8884d8"
                          >
                            {prepareParetoData(selectedStudy).map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={
                                  entry.isRecommended
                                    ? '#10b981'
                                    : entry.isPareto
                                    ? '#3b82f6'
                                    : '#9ca3af'
                                }
                              />
                            ))}
                          </Scatter>
                        </ScatterChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                )}

                {/* 雷达图 */}
                <Card>
                  <CardHeader>
                    <CardTitle>方案综合对比</CardTitle>
                    <CardDescription>所有目标的综合对比</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RadarChart data={prepareRadarData(selectedStudy)}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="metric" />
                        <PolarRadiusAxis angle={90} domain={[0, 150]} />
                        {selectedStudy.candidates.map((candidate, idx) => (
                          <Radar
                            key={candidate.id}
                            name={candidate.name}
                            dataKey={candidate.name}
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

              {/* 候选方案详情 */}
              <Card>
                <CardHeader>
                  <CardTitle>候选方案详情</CardTitle>
                  <CardDescription>各方案的详细对比</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>方案名称</TableHead>
                        <TableHead>描述</TableHead>
                        {selectedStudy.objectives.map(obj => {
                          const metric = metrics.find(m => m.id === obj.metricId);
                          return (
                            <TableHead key={obj.metricId}>
                              {metric?.name}
                              <div className="text-xs text-gray-500">
                                {obj.direction === 'maximize' ? '↑最大化' : '↓最小化'}
                              </div>
                            </TableHead>
                          );
                        })}
                        <TableHead>成本</TableHead>
                        <TableHead>可行性</TableHead>
                        <TableHead>状态</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedStudy.candidates.map(candidate => {
                        const isPareto = selectedStudy.paretoFrontier.includes(candidate.id);
                        const isRecommended = candidate.id === selectedStudy.recommendedCandidateId;

                        return (
                          <TableRow key={candidate.id} className={isPareto ? 'bg-blue-50' : ''}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {isRecommended && <CheckCircle className="h-4 w-4 text-green-500" />}
                                {candidate.name}
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-gray-600">
                              {candidate.description}
                            </TableCell>
                            {selectedStudy.objectives.map(obj => {
                              const value = candidate.metricValues.find(
                                m => m.metricId === obj.metricId
                              )?.value;
                              const metric = metrics.find(m => m.id === obj.metricId);
                              return (
                                <TableCell key={obj.metricId}>
                                  {value} {metric?.unit}
                                </TableCell>
                              );
                            })}
                            <TableCell>¥{candidate.cost.toLocaleString()}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-blue-500 h-2 rounded-full"
                                    style={{ width: `${candidate.feasibility * 100}%` }}
                                  />
                                </div>
                                <span className="text-sm">{(candidate.feasibility * 100).toFixed(0)}%</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {isPareto && <Badge variant="outline">帕累托最优</Badge>}
                              {isRecommended && (
                                <Badge className="bg-green-500 ml-2">推荐</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* 推荐意见 */}
              {selectedStudy.recommendation && (
                <Card>
                  <CardHeader>
                    <CardTitle>推荐意见</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{selectedStudy.recommendation}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              从左侧选择一个权衡研究查看详情
            </div>
          )}
        </div>
      </div>

      {/* 创建/编辑对话框 */}
      <TradeStudyDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        study={editingStudy}
        projectId={currentProject.id}
        metrics={metrics}
        onSave={loadData}
      />
    </div>
  );
};

// 权衡研究编辑对话框
interface TradeStudyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  study: TradeStudy | null;
  projectId: string;
  metrics: Metric[];
  onSave: () => void;
}

const TradeStudyDialog: React.FC<TradeStudyDialogProps> = ({
  isOpen,
  onClose,
  study,
  projectId,
  metrics,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'draft' as const,
  });

  useEffect(() => {
    if (study) {
      setFormData({
        name: study.name,
        description: study.description || '',
        status: study.status,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        status: 'draft',
      });
    }
  }, [study, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (study) {
      metricsService.updateTradeStudy(study.id, formData);
    } else {
      metricsService.createTradeStudy({
        ...formData,
        projectId,
        objectives: [],
        constraints: [],
        candidates: [],
        paretoFrontier: [],
        recommendation: '',
        createdBy: 'current_user',
      });
    }

    onSave();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{study ? '编辑权衡研究' : '创建权衡研究'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>研究名称 *</Label>
            <Input
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="例如：续航vs加速权衡分析"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>描述</Label>
            <Textarea
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="详细描述研究目的和背景"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>状态</Label>
            <Select
              value={formData.status}
              onValueChange={v => setFormData(prev => ({ ...prev, status: v as any }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">草稿</SelectItem>
                <SelectItem value="review">评审中</SelectItem>
                <SelectItem value="approved">已批准</SelectItem>
                <SelectItem value="adopted">已采纳</SelectItem>
              </SelectContent>
            </Select>
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

export default TradeStudyAnalysis;
