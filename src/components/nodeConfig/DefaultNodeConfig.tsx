import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';

interface DefaultNodeConfigProps {
  node: any;
  onSave: (config: any) => void;
  onCancel?: () => void;
  userRole?: string;
}

export function DefaultNodeConfig({ node, onSave, onCancel, userRole }: DefaultNodeConfigProps) {
  const [config, setConfig] = useState({
    nodeName: node?.name || '节点',
    description: node?.description || '',
    timeout: node?.config?.timeout || 300,
    retryCount: node?.config?.retryCount || 1,
    autoRun: node?.config?.autoRun || false,
    // 通用配置参数
    executionPriority: node?.config?.parameters?.executionPriority || 'normal',
    enableLogging: node?.config?.parameters?.enableLogging || true,
    logLevel: node?.config?.parameters?.logLevel || 'info',
    maxMemoryUsage: node?.config?.parameters?.maxMemoryUsage || 1024,
  });

  const handleSave = () => {
    const saveConfig = {
      ...config,
      parameters: {
        executionPriority: config.executionPriority,
        enableLogging: config.enableLogging,
        logLevel: config.logLevel,
        maxMemoryUsage: config.maxMemoryUsage,
      }
    };
    onSave(saveConfig);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">节点配置</h3>
        <p className="text-sm text-muted-foreground mt-1">
          配置节点的基本参数和执行选项
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
          <Label htmlFor="executionPriority">执行优先级</Label>
          <Select value={config.executionPriority} onValueChange={(value) => setConfig({ ...config, executionPriority: value })}>
            <SelectTrigger>
              <SelectValue placeholder="选择执行优先级" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">低</SelectItem>
              <SelectItem value="normal">正常</SelectItem>
              <SelectItem value="high">高</SelectItem>
              <SelectItem value="critical">关键</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="logLevel">日志级别</Label>
          <Select value={config.logLevel} onValueChange={(value) => setConfig({ ...config, logLevel: value })}>
            <SelectTrigger>
              <SelectValue placeholder="选择日志级别" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="error">错误</SelectItem>
              <SelectItem value="warn">警告</SelectItem>
              <SelectItem value="info">信息</SelectItem>
              <SelectItem value="debug">调试</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="maxMemoryUsage">最大内存使用（MB）</Label>
          <Input
            id="maxMemoryUsage"
            type="number"
            value={config.maxMemoryUsage}
            onChange={(e) => setConfig({ ...config, maxMemoryUsage: parseInt(e.target.value) || 1024 })}
            min="128"
            max="8192"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="enableLogging"
            checked={config.enableLogging}
            onCheckedChange={(checked) => setConfig({ ...config, enableLogging: checked })}
          />
          <Label htmlFor="enableLogging">启用日志记录</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="autoRun"
            checked={config.autoRun}
            onCheckedChange={(checked) => setConfig({ ...config, autoRun: checked })}
          />
          <Label htmlFor="autoRun">自动运行</Label>
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
            onChange={(e) => setConfig({ ...config, retryCount: parseInt(e.target.value) || 1 })}
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