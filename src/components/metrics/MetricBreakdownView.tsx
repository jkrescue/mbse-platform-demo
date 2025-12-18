/**
 * MetricBreakdownView - RFLP分解视图
 * 显示指标到RFLP四层的映射关系和模型绑定
 */

import React, { useState, useEffect } from 'react';
import { Link2, FileText, Boxes, Cpu, Database, Plus, X } from 'lucide-react@0.487.0';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import metricsService from '../../services/MetricsService';
import { Metric, MetricBreakdown } from '../../types/metrics';

interface MetricBreakdownViewProps {
  metric: Metric;
  onUpdate?: () => void;
}

export const MetricBreakdownView: React.FC<MetricBreakdownViewProps> = ({ metric, onUpdate }) => {
  const [breakdown, setBreakdown] = useState<MetricBreakdown | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadBreakdown();
  }, [metric.id]);

  const loadBreakdown = () => {
    const bd = metricsService.getMetricBreakdown(metric.id);
    setBreakdown(bd || createEmptyBreakdown());
  };

  const createEmptyBreakdown = (): MetricBreakdown => ({
    metricId: metric.id,
    physicalIds: [],
    modelBindings: [],
    verificationItems: [],
  });

  const handleSave = (updatedBreakdown: MetricBreakdown) => {
    metricsService.setMetricBreakdown(updatedBreakdown);
    setBreakdown(updatedBreakdown);
    setIsEditing(false);
    onUpdate?.();
  };

  if (!breakdown) return null;

  return (
    <div className="space-y-6">
      {/* 概览卡片 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>RFLP分解</CardTitle>
              <CardDescription>指标到需求、功能、逻辑、物理四层的映射</CardDescription>
            </div>
            <Button onClick={() => setIsEditing(true)}>编辑分解</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-6">
            {/* Requirement */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-5 w-5 text-blue-500" />
                <h4 className="font-medium">需求 (R)</h4>
              </div>
              {breakdown.requirementId ? (
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-sm text-blue-900">{breakdown.requirementId}</p>
                  <Badge variant="outline" className="mt-2">Polarion</Badge>
                </div>
              ) : (
                <p className="text-sm text-gray-400">未关联</p>
              )}
            </div>

            {/* Functional */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Boxes className="h-5 w-5 text-green-500" />
                <h4 className="font-medium">功能 (F)</h4>
              </div>
              {breakdown.functionalId ? (
                <div className="bg-green-50 p-3 rounded">
                  <p className="text-sm text-green-900">{breakdown.functionalId}</p>
                  <Badge variant="outline" className="mt-2">SysML</Badge>
                </div>
              ) : (
                <p className="text-sm text-gray-400">未关联</p>
              )}
            </div>

            {/* Logical */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Cpu className="h-5 w-5 text-purple-500" />
                <h4 className="font-medium">逻辑 (L)</h4>
              </div>
              {breakdown.logicalId ? (
                <div className="bg-purple-50 p-3 rounded">
                  <p className="text-sm text-purple-900">{breakdown.logicalId}</p>
                  <Badge variant="outline" className="mt-2">架构</Badge>
                </div>
              ) : (
                <p className="text-sm text-gray-400">未关联</p>
              )}
            </div>

            {/* Physical */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Database className="h-5 w-5 text-orange-500" />
                <h4 className="font-medium">物理 (P)</h4>
              </div>
              {breakdown.physicalIds.length > 0 ? (
                <div className="space-y-2">
                  {breakdown.physicalIds.map((id, idx) => (
                    <div key={idx} className="bg-orange-50 p-2 rounded">
                      <p className="text-sm text-orange-900">{id}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">未关联</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 分解公式 */}
      {breakdown.decompositionFormula && (
        <Card>
          <CardHeader>
            <CardTitle>分解公式</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded font-mono text-sm">
              {breakdown.decompositionFormula}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 模型绑定 */}
      <Card>
        <CardHeader>
          <CardTitle>模型参数绑定</CardTitle>
          <CardDescription>关联的仿真模型和参数</CardDescription>
        </CardHeader>
        <CardContent>
          {breakdown.modelBindings.length > 0 ? (
            <div className="space-y-3">
              {breakdown.modelBindings.map((binding, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded">
                  <div className="flex-1">
                    <p className="font-medium">{binding.modelId}</p>
                    <p className="text-sm text-gray-500">{binding.parameterPath}</p>
                  </div>
                  <Badge
                    variant={
                      binding.parameterType === 'output'
                        ? 'default'
                        : binding.parameterType === 'input'
                        ? 'secondary'
                        : 'outline'
                    }
                  >
                    {binding.parameterType === 'output'
                      ? '输出'
                      : binding.parameterType === 'input'
                      ? '输入'
                      : '约束'}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">暂无模型绑定</p>
          )}
        </CardContent>
      </Card>

      {/* 验证手段 */}
      <Card>
        <CardHeader>
          <CardTitle>验证手段</CardTitle>
          <CardDescription>关联的仿真工作流和测试用例</CardDescription>
        </CardHeader>
        <CardContent>
          {breakdown.verificationItems.length > 0 ? (
            <div className="space-y-3">
              {breakdown.verificationItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded">
                  <Badge>{item.type === 'simulation' ? '仿真' : '测试'}</Badge>
                  <div className="flex-1">
                    {item.workflowId && (
                      <p className="text-sm">工作流: {item.workflowId}</p>
                    )}
                    {item.testCaseId && (
                      <p className="text-sm">测试用例: {item.testCaseId}</p>
                    )}
                    {item.evidenceId && (
                      <p className="text-sm text-gray-500">证据: {item.evidenceId}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">暂无验证配置</p>
          )}
        </CardContent>
      </Card>

      {/* 编辑对话框 */}
      <BreakdownEditor
        isOpen={isEditing}
        breakdown={breakdown}
        onClose={() => setIsEditing(false)}
        onSave={handleSave}
      />
    </div>
  );
};

// 分解编辑器
interface BreakdownEditorProps {
  isOpen: boolean;
  breakdown: MetricBreakdown;
  onClose: () => void;
  onSave: (breakdown: MetricBreakdown) => void;
}

const BreakdownEditor: React.FC<BreakdownEditorProps> = ({
  isOpen,
  breakdown,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<MetricBreakdown>(breakdown);

  useEffect(() => {
    setFormData(breakdown);
  }, [breakdown, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const addPhysicalId = () => {
    setFormData(prev => ({
      ...prev,
      physicalIds: [...prev.physicalIds, ''],
    }));
  };

  const updatePhysicalId = (index: number, value: string) => {
    const newIds = [...formData.physicalIds];
    newIds[index] = value;
    setFormData(prev => ({ ...prev, physicalIds: newIds }));
  };

  const removePhysicalId = (index: number) => {
    setFormData(prev => ({
      ...prev,
      physicalIds: prev.physicalIds.filter((_, i) => i !== index),
    }));
  };

  const addModelBinding = () => {
    setFormData(prev => ({
      ...prev,
      modelBindings: [
        ...prev.modelBindings,
        { modelId: '', parameterPath: '', parameterType: 'output' },
      ],
    }));
  };

  const updateModelBinding = (index: number, field: string, value: any) => {
    const newBindings = [...formData.modelBindings];
    newBindings[index] = { ...newBindings[index], [field]: value };
    setFormData(prev => ({ ...prev, modelBindings: newBindings }));
  };

  const removeModelBinding = (index: number) => {
    setFormData(prev => ({
      ...prev,
      modelBindings: prev.modelBindings.filter((_, i) => i !== index),
    }));
  };

  const addVerificationItem = () => {
    setFormData(prev => ({
      ...prev,
      verificationItems: [
        ...prev.verificationItems,
        { type: 'simulation', workflowId: '' },
      ],
    }));
  };

  const updateVerificationItem = (index: number, field: string, value: any) => {
    const newItems = [...formData.verificationItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData(prev => ({ ...prev, verificationItems: newItems }));
  };

  const removeVerificationItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      verificationItems: prev.verificationItems.filter((_, i) => i !== index),
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>编辑RFLP分解</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="rflp">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="rflp">RFLP层</TabsTrigger>
              <TabsTrigger value="models">模型绑定</TabsTrigger>
              <TabsTrigger value="verification">验证手段</TabsTrigger>
              <TabsTrigger value="formula">分解公式</TabsTrigger>
            </TabsList>

            <TabsContent value="rflp" className="space-y-4">
              <div className="space-y-2">
                <Label>需求 ID (Requirement)</Label>
                <Input
                  value={formData.requirementId || ''}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, requirementId: e.target.value }))
                  }
                  placeholder="Polarion需求ID"
                />
              </div>

              <div className="space-y-2">
                <Label>功能 ID (Functional)</Label>
                <Input
                  value={formData.functionalId || ''}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, functionalId: e.target.value }))
                  }
                  placeholder="功能架构元素ID"
                />
              </div>

              <div className="space-y-2">
                <Label>逻辑 ID (Logical)</Label>
                <Input
                  value={formData.logicalId || ''}
                  onChange={e => setFormData(prev => ({ ...prev, logicalId: e.target.value }))}
                  placeholder="逻辑架构元素ID"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>物理 IDs (Physical)</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addPhysicalId}>
                    <Plus className="h-4 w-4 mr-1" />
                    添加
                  </Button>
                </div>
                {formData.physicalIds.map((id, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input
                      value={id}
                      onChange={e => updatePhysicalId(idx, e.target.value)}
                      placeholder="物理模型/参数ID"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removePhysicalId(idx)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="models" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <Label>模型参数绑定</Label>
                <Button type="button" variant="outline" size="sm" onClick={addModelBinding}>
                  <Plus className="h-4 w-4 mr-1" />
                  添加绑定
                </Button>
              </div>

              {formData.modelBindings.map((binding, idx) => (
                <div key={idx} className="grid grid-cols-3 gap-3 p-3 border rounded">
                  <div className="space-y-2">
                    <Label className="text-xs">模型ID</Label>
                    <Input
                      value={binding.modelId}
                      onChange={e => updateModelBinding(idx, 'modelId', e.target.value)}
                      placeholder="模型ID"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">参数路径</Label>
                    <Input
                      value={binding.parameterPath}
                      onChange={e => updateModelBinding(idx, 'parameterPath', e.target.value)}
                      placeholder="battery.energyDensity"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">类型</Label>
                    <div className="flex gap-2">
                      <Select
                        value={binding.parameterType}
                        onValueChange={v => updateModelBinding(idx, 'parameterType', v)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="input">输入</SelectItem>
                          <SelectItem value="output">输出</SelectItem>
                          <SelectItem value="constraint">约束</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeModelBinding(idx)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="verification" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <Label>验证手段</Label>
                <Button type="button" variant="outline" size="sm" onClick={addVerificationItem}>
                  <Plus className="h-4 w-4 mr-1" />
                  添加验证项
                </Button>
              </div>

              {formData.verificationItems.map((item, idx) => (
                <div key={idx} className="grid grid-cols-4 gap-3 p-3 border rounded">
                  <div className="space-y-2">
                    <Label className="text-xs">类型</Label>
                    <Select
                      value={item.type}
                      onValueChange={v => updateVerificationItem(idx, 'type', v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="simulation">仿真</SelectItem>
                        <SelectItem value="test">测试</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">工作流ID</Label>
                    <Input
                      value={item.workflowId || ''}
                      onChange={e => updateVerificationItem(idx, 'workflowId', e.target.value)}
                      placeholder="可选"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">测试用例ID</Label>
                    <Input
                      value={item.testCaseId || ''}
                      onChange={e => updateVerificationItem(idx, 'testCaseId', e.target.value)}
                      placeholder="可选"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">操作</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeVerificationItem(idx)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="formula" className="space-y-4">
              <div className="space-y-2">
                <Label>分解公式</Label>
                <Textarea
                  value={formData.decompositionFormula || ''}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, decompositionFormula: e.target.value }))
                  }
                  placeholder="例如：RANGE = f(batteryCapacity, efficiency, CdA)"
                  rows={4}
                />
                <p className="text-sm text-gray-500">
                  描述指标如何从子指标或模型参数计算得出
                </p>
              </div>
            </TabsContent>
          </Tabs>

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

export default MetricBreakdownView;
