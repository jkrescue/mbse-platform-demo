import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';

interface EnergyRequirementSyncNodeConfigProps {
  node: any;
  onSave: (config: any) => void;
  onCancel?: () => void;
  userRole?: string;
}

export function EnergyRequirementSyncNodeConfig({ node, onSave, onCancel, userRole }: EnergyRequirementSyncNodeConfigProps) {
  const [config, setConfig] = useState({
    nodeName: node?.name || '能量管理需求同步',
    description: node?.description || '同步新能源汽车能量管理相关需求',
    timeout: node?.config?.timeout || 300,
    retryCount: node?.config?.retryCount || 3,
    autoRun: node?.config?.autoRun || true,
    // 能量管理需求同步特有配置
    syncMode: node?.config?.parameters?.syncMode || 'incremental',
    batchSize: node?.config?.parameters?.batchSize || 100,
    energySystemType: node?.config?.parameters?.energySystemType || 'hybrid',
    requirementCategories: node?.config?.parameters?.requirementCategories || ['power', 'efficiency', 'thermal'],
    enableValidation: node?.config?.parameters?.enableValidation || true,
    priorityLevel: node?.config?.parameters?.priorityLevel || 'high',
  });

  const handleSave = () => {
    const saveConfig = {
      ...config,
      parameters: {
        syncMode: config.syncMode,
        batchSize: config.batchSize,
        energySystemType: config.energySystemType,
        requirementCategories: config.requirementCategories,
        enableValidation: config.enableValidation,
        priorityLevel: config.priorityLevel,
      }
    };
    onSave(saveConfig);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">能量管理需求同步配置</h3>
        <p className="text-sm text-muted-foreground mt-1">
          配置新能源汽车能量管理需求同步参数
        </p>
      </div>

      <Separator />

      <div className="space-y-4">
        <div>
          <Label htmlFor="nodeName">节点名称</Label>
          <Input
            id="nodeName"
            value={config.nodeName}
            onChange={(e) => setConfig({ ...config, nodeName: e.target.value })}
            placeholder="请输入节点名称"
          />
        </div>

        <div>
          <Label htmlFor="description">节点描述</Label>
          <Textarea
            id="description"
            value={config.description}
            onChange={(e) => setConfig({ ...config, description: e.target.value })}
            placeholder="请输入节点描述"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="energySystemType">能量系统类型</Label>
          <Select value={config.energySystemType} onValueChange={(value) => setConfig({ ...config, energySystemType: value })}>
            <SelectTrigger>
              <SelectValue placeholder="选择能量系统类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pure-electric">纯电动</SelectItem>
              <SelectItem value="hybrid">混合动力</SelectItem>
              <SelectItem value="fuel-cell">燃料电池</SelectItem>
              <SelectItem value="plug-in-hybrid">插电式混合动力</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="syncMode">同步模式</Label>
          <Select value={config.syncMode} onValueChange={(value) => setConfig({ ...config, syncMode: value })}>
            <SelectTrigger>
              <SelectValue placeholder="选择同步模式" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="incremental">增量同步</SelectItem>
              <SelectItem value="full">全量同步</SelectItem>
              <SelectItem value="delta">差异同步</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="priorityLevel">优先级</Label>
          <Select value={config.priorityLevel} onValueChange={(value) => setConfig({ ...config, priorityLevel: value })}>
            <SelectTrigger>
              <SelectValue placeholder="选择优先级" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">低</SelectItem>
              <SelectItem value="medium">中</SelectItem>
              <SelectItem value="high">高</SelectItem>
              <SelectItem value="critical">关键</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="autoExecute">自动执行</Label>
          <Switch
            id="autoExecute"
            checked={config.autoRun}
            onCheckedChange={(checked) =>
              setConfig({
                ...config,
                autoRun: checked,
              })
            }
          />
        </div>

        <div>
          <Label htmlFor="batchSize">批处理大小</Label>
          <Input
            id="batchSize"
            type="number"
            value={config.batchSize}
            onChange={(e) => setConfig({ ...config, batchSize: parseInt(e.target.value) || 100 })}
            min="1"
            max="1000"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="enableValidation"
            checked={config.enableValidation}
            onCheckedChange={(checked) => setConfig({ ...config, enableValidation: checked })}
          />
          <Label htmlFor="enableValidation">启用需求验证</Label>
        </div>



        <div>
          <Label htmlFor="timeout">超时时间（秒）</Label>
          <Input
            id="timeout"
            type="number"
            value={config.timeout}
            onChange={(e) => setConfig({ ...config, timeout: parseInt(e.target.value) || 300 })}
            min="1"
          />
        </div>

        <div>
          <Label htmlFor="retryCount">重试次数</Label>
          <Input
            id="retryCount"
            type="number"
            value={config.retryCount}
            onChange={(e) => setConfig({ ...config, retryCount: parseInt(e.target.value) || 3 })}
            min="0"
            max="10"
          />
        </div>
      </div>

      <div className="flex justify-center space-x-3 pt-4">
        <Button variant="outline" onClick={onCancel}>
          取消
        </Button>
        <Button onClick={handleSave}>
          保存配置
        </Button>
      </div>
    </div>
  );
}