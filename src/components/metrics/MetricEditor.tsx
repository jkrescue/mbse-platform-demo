/**
 * MetricEditor - 指标编辑器
 * 用于创建和编辑指标的表单组件
 */

import React, { useState, useEffect } from 'react';
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
import { Slider } from '../ui/slider';
import metricsService from '../../services/MetricsService';
import { Metric } from '../../types/metrics';

interface MetricEditorProps {
  metric: Metric | null;
  projectId: string;
  onSave: () => void;
  onCancel: () => void;
}

export const MetricEditor: React.FC<MetricEditorProps> = ({
  metric,
  projectId,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category: 'performance' as const,
    level: 'project' as const,
    unit: '',
    targetValue: 0,
    lowerBound: undefined as number | undefined,
    upperBound: undefined as number | undefined,
    tolerance: 5,
    weight: 0.5,
    priority: 'should' as const,
    currentValue: undefined as number | undefined,
    predictedValue: undefined as number | undefined,
    trend: 'stable' as const,
    verificationMethod: 'simulation' as const,
    owner: '',
    source: '',
  });

  useEffect(() => {
    if (metric) {
      setFormData({
        name: metric.name,
        code: metric.code,
        category: metric.category,
        level: metric.level,
        unit: metric.unit,
        targetValue: metric.targetValue,
        lowerBound: metric.lowerBound,
        upperBound: metric.upperBound,
        tolerance: metric.tolerance,
        weight: metric.weight,
        priority: metric.priority,
        currentValue: metric.currentValue,
        predictedValue: metric.predictedValue,
        trend: metric.trend,
        verificationMethod: metric.verificationMethod,
        owner: metric.owner,
        source: metric.source,
      });
    }
  }, [metric]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (metric) {
      metricsService.updateMetric(metric.id, formData);
    } else {
      metricsService.createMetric({
        ...formData,
        projectId,
        childMetricIds: [],
        createdBy: 'current_user',
      });
    }

    onSave();
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 基本信息 */}
      <div className="space-y-4">
        <h3 className="font-medium">基本信息</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">指标名称 *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={e => handleChange('name', e.target.value)}
              placeholder="例如：续航里程"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="code">指标编码 *</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={e => handleChange('code', e.target.value)}
              placeholder="例如：RANGE_001"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">分类 *</Label>
            <Select value={formData.category} onValueChange={v => handleChange('category', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="performance">性能</SelectItem>
                <SelectItem value="cost">成本</SelectItem>
                <SelectItem value="reliability">可靠性</SelectItem>
                <SelectItem value="compliance">合规性</SelectItem>
                <SelectItem value="safety">安全性</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="level">层级 *</Label>
            <Select value={formData.level} onValueChange={v => handleChange('level', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="project">项目级</SelectItem>
                <SelectItem value="system">系统级</SelectItem>
                <SelectItem value="subsystem">子系统级</SelectItem>
                <SelectItem value="component">组件级</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="owner">负责人 *</Label>
            <Input
              id="owner"
              value={formData.owner}
              onChange={e => handleChange('owner', e.target.value)}
              placeholder="负责人姓名"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="source">来源 *</Label>
            <Input
              id="source"
              value={formData.source}
              onChange={e => handleChange('source', e.target.value)}
              placeholder="例如：客户需求、法规要求"
              required
            />
          </div>
        </div>
      </div>

      {/* 目标与约束 */}
      <div className="space-y-4">
        <h3 className="font-medium">目标与约束</h3>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="targetValue">目标值 *</Label>
            <Input
              id="targetValue"
              type="number"
              step="any"
              value={formData.targetValue}
              onChange={e => handleChange('targetValue', parseFloat(e.target.value))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="unit">单位 *</Label>
            <Input
              id="unit"
              value={formData.unit}
              onChange={e => handleChange('unit', e.target.value)}
              placeholder="例如：km, s, kWh"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tolerance">容差 (%) *</Label>
            <Input
              id="tolerance"
              type="number"
              step="0.1"
              value={formData.tolerance}
              onChange={e => handleChange('tolerance', parseFloat(e.target.value))}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="lowerBound">下限值</Label>
            <Input
              id="lowerBound"
              type="number"
              step="any"
              value={formData.lowerBound ?? ''}
              onChange={e =>
                handleChange('lowerBound', e.target.value ? parseFloat(e.target.value) : undefined)
              }
              placeholder="可选"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="upperBound">上限值</Label>
            <Input
              id="upperBound"
              type="number"
              step="any"
              value={formData.upperBound ?? ''}
              onChange={e =>
                handleChange('upperBound', e.target.value ? parseFloat(e.target.value) : undefined)
              }
              placeholder="可选"
            />
          </div>
        </div>
      </div>

      {/* 优先级与权重 */}
      <div className="space-y-4">
        <h3 className="font-medium">优先级与权重</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="priority">优先级 *</Label>
            <Select value={formData.priority} onValueChange={v => handleChange('priority', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="must">必须 (Must)</SelectItem>
                <SelectItem value="should">应该 (Should)</SelectItem>
                <SelectItem value="nice-to-have">可选 (Nice-to-have)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>权重: {formData.weight.toFixed(2)}</Label>
            <Slider
              value={[formData.weight]}
              onValueChange={v => handleChange('weight', v[0])}
              min={0}
              max={1}
              step={0.05}
              className="mt-2"
            />
            <p className="text-sm text-gray-500">用于多目标优化的权重系数</p>
          </div>
        </div>
      </div>

      {/* 当前状态 */}
      <div className="space-y-4">
        <h3 className="font-medium">当前状态</h3>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="currentValue">当前值</Label>
            <Input
              id="currentValue"
              type="number"
              step="any"
              value={formData.currentValue ?? ''}
              onChange={e =>
                handleChange('currentValue', e.target.value ? parseFloat(e.target.value) : undefined)
              }
              placeholder="实际测量值"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="predictedValue">预测值</Label>
            <Input
              id="predictedValue"
              type="number"
              step="any"
              value={formData.predictedValue ?? ''}
              onChange={e =>
                handleChange(
                  'predictedValue',
                  e.target.value ? parseFloat(e.target.value) : undefined
                )
              }
              placeholder="仿真预测值"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="trend">趋势 *</Label>
            <Select value={formData.trend} onValueChange={v => handleChange('trend', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="improving">改善中</SelectItem>
                <SelectItem value="stable">稳定</SelectItem>
                <SelectItem value="declining">下降中</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="verificationMethod">验证方式 *</Label>
          <Select
            value={formData.verificationMethod}
            onValueChange={v => handleChange('verificationMethod', v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="simulation">仿真</SelectItem>
              <SelectItem value="test">测试</SelectItem>
              <SelectItem value="analysis">分析</SelectItem>
              <SelectItem value="inspection">检查</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          取消
        </Button>
        <Button type="submit">保存</Button>
      </div>
    </form>
  );
};

export default MetricEditor;
