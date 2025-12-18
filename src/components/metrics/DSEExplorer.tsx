/**
 * DSEExplorer - 设计空间探索页面
 * 提供参数扫描、DOE、遗传算法等优化方法的配置和执行
 */

import React, { useState, useEffect } from 'react';
import { Plus, Play, Pause, RotateCcw, Download, Settings, TrendingUp } from 'lucide-react@0.487.0';
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
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useProject } from '../ProjectContext';
import metricsService from '../../services/MetricsService';
import { DSERun } from '../../types/metrics';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
} from 'recharts';

export const DSEExplorer: React.FC = () => {
  const { currentProject } = useProject();
  const [runs, setRuns] = useState<DSERun[]>([]);
  const [selectedRun, setSelectedRun] = useState<DSERun | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (currentProject) {
      loadRuns();
      
      // 轮询更新运行状态
      const interval = setInterval(() => {
        loadRuns();
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [currentProject]);

  const loadRuns = () => {
    if (!currentProject) return;
    const projectRuns = metricsService.getDSERunsByProject(currentProject.id);
    setRuns(projectRuns);
  };

  const handleCreateRun = () => {
    setIsDialogOpen(true);
  };

  const handleStartRun = (runId: string) => {
    metricsService.updateDSERun(runId, { status: 'running', progress: 0 });
    loadRuns();
  };

  const handleStopRun = (runId: string) => {
    metricsService.updateDSERun(runId, { status: 'queued' });
    loadRuns();
  };

  const handleDeleteRun = (runId: string) => {
    if (confirm('确定要删除此DSE运行吗？')) {
      metricsService.deleteDSERun(runId);
      loadRuns();
      if (selectedRun?.id === runId) {
        setSelectedRun(null);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      queued: { label: '排队中', variant: 'secondary' as const },
      running: { label: '运行中', variant: 'outline' as const, className: 'border-blue-500 text-blue-600' },
      completed: { label: '已完成', variant: 'default' as const, className: 'bg-green-500' },
      failed: { label: '失败', variant: 'destructive' as const },
    };
    return config[status as keyof typeof config] || config.queued;
  };

  const getMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      sweep: '参数扫描',
      doe: '实验设计 (DOE)',
      genetic: '遗传算法',
      pso: '粒子群优化',
      montecarlo: '蒙特卡洛',
    };
    return labels[method] || method;
  };

  // 准备灵敏度分析图表数据
  const prepareSensitivityData = (run: DSERun) => {
    if (!run.resultSummary?.sensitivityAnalysis) return [];
    
    return run.resultSummary.sensitivityAnalysis
      .sort((a, b) => b.influence - a.influence)
      .map(item => ({
        parameter: item.parameter,
        影响度: (item.influence * 100).toFixed(1),
      }));
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
            <h1 className="text-2xl">设计空间探索 (DSE)</h1>
            <p className="text-gray-500 mt-1">参数优化与设计空间分析</p>
          </div>
          <Button onClick={handleCreateRun}>
            <Plus className="h-4 w-4 mr-2" />
            创建DSE运行
          </Button>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-hidden flex">
        {/* 左侧：运行列表 */}
        <div className="w-96 border-r bg-white p-4 overflow-auto">
          <h3 className="font-medium mb-4">DSE 运行列表</h3>
          <div className="space-y-2">
            {runs.map(run => (
              <Card
                key={run.id}
                className={`cursor-pointer hover:bg-gray-50 ${
                  selectedRun?.id === run.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedRun(run)}
              >
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium">{run.name}</h4>
                    <Badge
                      variant={getStatusBadge(run.status).variant}
                      className={getStatusBadge(run.status).className}
                    >
                      {getStatusBadge(run.status).label}
                    </Badge>
                  </div>

                  <div className="text-sm text-gray-500 space-y-1 mb-3">
                    <div>方法: {getMethodLabel(run.method)}</div>
                    <div>参数: {run.parameters.length} 个</div>
                    <div>创建: {new Date(run.startTime).toLocaleDateString()}</div>
                  </div>

                  {run.status === 'running' && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>进度</span>
                        <span>{run.progress}%</span>
                      </div>
                      <Progress value={run.progress} />
                    </div>
                  )}

                  {run.status === 'completed' && run.resultSummary && (
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>总运行: {run.resultSummary.totalRuns}</div>
                      <div>可行解: {run.resultSummary.feasibleRuns}</div>
                      <div>帕累托: {run.resultSummary.paretoSolutions}</div>
                    </div>
                  )}

                  <div className="flex gap-2 mt-3">
                    {run.status === 'queued' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={e => {
                          e.stopPropagation();
                          handleStartRun(run.id);
                        }}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
                    {run.status === 'running' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={e => {
                          e.stopPropagation();
                          handleStopRun(run.id);
                        }}
                      >
                        <Pause className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={e => {
                        e.stopPropagation();
                        handleDeleteRun(run.id);
                      }}
                    >
                      删除
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {runs.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                暂无DSE运行
              </div>
            )}
          </div>
        </div>

        {/* 右侧：运行详情 */}
        <div className="flex-1 overflow-auto p-6">
          {selectedRun ? (
            <div className="space-y-6">
              {/* 运行配置 */}
              <Card>
                <CardHeader>
                  <CardTitle>运行配置</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">方法</p>
                      <p className="font-medium mt-1">{getMethodLabel(selectedRun.method)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">状态</p>
                      <Badge
                        variant={getStatusBadge(selectedRun.status).variant}
                        className={getStatusBadge(selectedRun.status).className + ' mt-1'}
                      >
                        {getStatusBadge(selectedRun.status).label}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">计算时间</p>
                      <p className="font-medium mt-1">
                        {selectedRun.computeTime
                          ? `${(selectedRun.computeTime / 60).toFixed(1)} 分钟`
                          : '-'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 参数配置 */}
              <Card>
                <CardHeader>
                  <CardTitle>参数空间</CardTitle>
                  <CardDescription>探索的参数范围和分布</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>参数名称</TableHead>
                        <TableHead>最小值</TableHead>
                        <TableHead>最大值</TableHead>
                        <TableHead>步长</TableHead>
                        <TableHead>分布</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedRun.parameters.map((param, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{param.name}</TableCell>
                          <TableCell>{param.minValue}</TableCell>
                          <TableCell>{param.maxValue}</TableCell>
                          <TableCell>{param.step || '-'}</TableCell>
                          <TableCell>
                            {param.distribution ? (
                              <Badge variant="outline">{param.distribution}</Badge>
                            ) : (
                              '-'
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* 算法配置 */}
              {selectedRun.optimizationConfig && (
                <Card>
                  <CardHeader>
                    <CardTitle>优化算法配置</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">算法</p>
                        <p className="font-medium mt-1">
                          {selectedRun.optimizationConfig.algorithm.toUpperCase()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">种群大小</p>
                        <p className="font-medium mt-1">
                          {selectedRun.optimizationConfig.populationSize}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">代数</p>
                        <p className="font-medium mt-1">
                          {selectedRun.optimizationConfig.generations}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">收敛容差</p>
                        <p className="font-medium mt-1">
                          {selectedRun.optimizationConfig.convergenceTolerance}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* DOE配置 */}
              {selectedRun.doeConfig && (
                <Card>
                  <CardHeader>
                    <CardTitle>实验设计配置</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">DOE类型</p>
                        <p className="font-medium mt-1">{selectedRun.doeConfig.type}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">样本数</p>
                        <p className="font-medium mt-1">{selectedRun.doeConfig.sampleSize}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 结果分析 */}
              {selectedRun.status === 'completed' && selectedRun.resultSummary && (
                <>
                  {/* 结果概览 */}
                  <Card>
                    <CardHeader>
                      <CardTitle>结果概览</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">总运行数</p>
                          <p className="text-2xl mt-1">{selectedRun.resultSummary.totalRuns}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">可行解</p>
                          <p className="text-2xl mt-1 text-green-600">
                            {selectedRun.resultSummary.feasibleRuns}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">帕累托解</p>
                          <p className="text-2xl mt-1 text-blue-600">
                            {selectedRun.resultSummary.paretoSolutions}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">成功率</p>
                          <p className="text-2xl mt-1">
                            {(
                              (selectedRun.resultSummary.feasibleRuns /
                                selectedRun.resultSummary.totalRuns) *
                              100
                            ).toFixed(1)}
                            %
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 灵敏度分析 */}
                  <Card>
                    <CardHeader>
                      <CardTitle>参数灵敏度分析</CardTitle>
                      <CardDescription>各参数对目标的影响程度</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={prepareSensitivityData(selectedRun)}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="parameter" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="影响度" fill="#3b82f6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* 最优解 */}
                  <Card>
                    <CardHeader>
                      <CardTitle>最优解</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">参数值</h4>
                          <div className="grid grid-cols-3 gap-3">
                            {Object.entries(selectedRun.resultSummary.bestSolution.parameters).map(
                              ([key, value]) => (
                                <div key={key} className="bg-gray-50 p-3 rounded">
                                  <p className="text-sm text-gray-500">{key}</p>
                                  <p className="font-medium">{value as number}</p>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              从左侧选择一个DSE运行查看详情
            </div>
          )}
        </div>
      </div>

      {/* 创建DSE运行对话框 */}
      <DSERunDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        projectId={currentProject.id}
        onSave={loadRuns}
      />
    </div>
  );
};

// DSE运行创建对话框
interface DSERunDialogProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  onSave: () => void;
}

const DSERunDialog: React.FC<DSERunDialogProps> = ({ isOpen, onClose, projectId, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    method: 'sweep' as const,
    parameters: [{ name: '', minValue: 0, maxValue: 100, step: 10 }],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    metricsService.createDSERun({
      ...formData,
      projectId,
      status: 'queued',
      progress: 0,
      createdBy: 'current_user',
    });

    onSave();
    onClose();
  };

  const addParameter = () => {
    setFormData(prev => ({
      ...prev,
      parameters: [...prev.parameters, { name: '', minValue: 0, maxValue: 100, step: 10 }],
    }));
  };

  const updateParameter = (index: number, field: string, value: any) => {
    const newParams = [...formData.parameters];
    newParams[index] = { ...newParams[index], [field]: value };
    setFormData(prev => ({ ...prev, parameters: newParams }));
  };

  const removeParameter = (index: number) => {
    setFormData(prev => ({
      ...prev,
      parameters: prev.parameters.filter((_, i) => i !== index),
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>创建DSE运行</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>运行名称 *</Label>
            <Input
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="例如：电池参数优化"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>探索方法 *</Label>
            <Select
              value={formData.method}
              onValueChange={v => setFormData(prev => ({ ...prev, method: v as any }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sweep">参数扫描</SelectItem>
                <SelectItem value="doe">实验设计 (DOE)</SelectItem>
                <SelectItem value="genetic">遗传算法</SelectItem>
                <SelectItem value="pso">粒子群优化</SelectItem>
                <SelectItem value="montecarlo">蒙特卡洛</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>参数配置</Label>
              <Button type="button" variant="outline" size="sm" onClick={addParameter}>
                <Plus className="h-4 w-4 mr-1" />
                添加参数
              </Button>
            </div>

            {formData.parameters.map((param, idx) => (
              <div key={idx} className="grid grid-cols-5 gap-2 items-center">
                <Input
                  placeholder="参数名"
                  value={param.name}
                  onChange={e => updateParameter(idx, 'name', e.target.value)}
                  required
                />
                <Input
                  type="number"
                  placeholder="最小值"
                  value={param.minValue}
                  onChange={e => updateParameter(idx, 'minValue', parseFloat(e.target.value))}
                  required
                />
                <Input
                  type="number"
                  placeholder="最大值"
                  value={param.maxValue}
                  onChange={e => updateParameter(idx, 'maxValue', parseFloat(e.target.value))}
                  required
                />
                <Input
                  type="number"
                  placeholder="步长"
                  value={param.step}
                  onChange={e => updateParameter(idx, 'step', parseFloat(e.target.value))}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeParameter(idx)}
                  disabled={formData.parameters.length === 1}
                >
                  删除
                </Button>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              取消
            </Button>
            <Button type="submit">创建并排队</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DSEExplorer;
