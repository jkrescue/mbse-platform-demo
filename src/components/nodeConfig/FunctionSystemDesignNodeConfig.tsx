import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';

interface FunctionSystemDesignNodeConfigProps {
  node: any;
  onSave: (config: any) => void;
  userRole?: string;
}

export function FunctionSystemDesignNodeConfig({ node, onSave, userRole }: FunctionSystemDesignNodeConfigProps) {
  const [config, setConfig] = useState({
    nodeName: node?.name || '功能&系统设计',
    description: node?.description || '进行功能与系统的详细设计',
    timeout: node?.config?.timeout || 900,
    retryCount: node?.config?.retryCount || 2,
    autoRun: node?.config?.autoRun || false,
    // 功能&系统设计特有配置
    designLevel: node?.config?.parameters?.designLevel || 'system',
    includeTestCases: node?.config?.parameters?.includeTestCases || true,
    operationMode: node?.config?.parameters?.operationMode || 'ea',
    toolType: node?.config?.parameters?.toolType || 'EA',
    selectedModel: node?.config?.parameters?.selectedModel || '',
    autoExecute: node?.config?.parameters?.autoExecute || true,
    autoTrace: node?.config?.parameters?.autoTrace || false,
    designPatterns: node?.config?.parameters?.designPatterns || 'standard',
    validationLevel: node?.config?.parameters?.validationLevel || 'standard',
  });

  const handleSave = () => {
    const saveConfig = {
      ...config,
      parameters: {
        designLevel: config.designLevel,
        includeTestCases: config.includeTestCases,
        operationMode: config.operationMode,
        toolType: config.toolType,
        selectedModel: config.selectedModel,
        autoExecute: config.autoExecute,
        autoTrace: config.autoTrace,
        designPatterns: config.designPatterns,
        validationLevel: config.validationLevel,
      }
    };
    onSave(saveConfig);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">功能&系统设计配置</h3>
        <p className="text-sm text-muted-foreground mt-1">
          配置功能与系统详细设计的参数和选项
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
          <Label htmlFor="operationMode">操作模式</Label>
          <Select value={config.operationMode} onValueChange={(value) => setConfig({ ...config, operationMode: value })}>
            <SelectTrigger>
              <SelectValue placeholder="选择操作模式" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ea">EA模式</SelectItem>
              <SelectItem value="load">加载模式</SelectItem>
              <SelectItem value="hybrid">混合模式</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="toolType">工具类型</Label>
          <Select value={config.toolType} onValueChange={(value) => setConfig({ ...config, toolType: value })}>
            <SelectTrigger>
              <SelectValue placeholder="选择工具类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EA">Enterprise Architect</SelectItem>
              <SelectItem value="CAPELLA">Capella</SelectItem>
              <SelectItem value="RHAPSODY">Rhapsody</SelectItem>
              <SelectItem value="PAPYRUS">Papyrus</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="designLevel">设计层级</Label>
          <Select value={config.designLevel} onValueChange={(value) => setConfig({ ...config, designLevel: value })}>
            <SelectTrigger>
              <SelectValue placeholder="选择设计层级" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="concept">概念级</SelectItem>
              <SelectItem value="system">系统级</SelectItem>
              <SelectItem value="subsystem">子系统级</SelectItem>
              <SelectItem value="component">组件级</SelectItem>
              <SelectItem value="thermal-system">热管理系统</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="designPatterns">设计模式</Label>
          <Select value={config.designPatterns} onValueChange={(value) => setConfig({ ...config, designPatterns: value })}>
            <SelectTrigger>
              <SelectValue placeholder="选择设计模式" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">标准模式</SelectItem>
              <SelectItem value="layered">分层模式</SelectItem>
              <SelectItem value="modular">模块化模式</SelectItem>
              <SelectItem value="service-oriented">面向服务模式</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="validationLevel">验证级别</Label>
          <Select value={config.validationLevel} onValueChange={(value) => setConfig({ ...config, validationLevel: value })}>
            <SelectTrigger>
              <SelectValue placeholder="选择验证级别" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basic">基础验证</SelectItem>
              <SelectItem value="standard">标准验证</SelectItem>
              <SelectItem value="comprehensive">全面验证</SelectItem>
              <SelectItem value="strict">严格验证</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="selectedModel">选择模型</Label>
          <Input
            id="selectedModel"
            value={config.selectedModel}
            onChange={(e) => setConfig({ ...config, selectedModel: e.target.value })}
            placeholder="请输入模型名称或路径"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="includeTestCases"
            checked={config.includeTestCases}
            onCheckedChange={(checked) => setConfig({ ...config, includeTestCases: checked })}
          />
          <Label htmlFor="includeTestCases">包含测试用例</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="autoExecute"
            checked={config.autoExecute}
            onCheckedChange={(checked) => setConfig({ ...config, autoExecute: checked })}
          />
          <Label htmlFor="autoExecute">自动执行</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="autoTrace"
            checked={config.autoTrace}
            onCheckedChange={(checked) => setConfig({ ...config, autoTrace: checked })}
          />
          <Label htmlFor="autoTrace">自动追溯</Label>
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
            onChange={(e) => setConfig({ ...config, timeout: parseInt(e.target.value) || 900 })}
            min="1"
          />
        </div>

        <div>
          <Label htmlFor="retryCount">重试次数</Label>
          <Input
            id="retryCount"
            type="number"
            value={config.retryCount}
            onChange={(e) => setConfig({ ...config, retryCount: parseInt(e.target.value) || 2 })}
            min="0"
            max="10"
          />
        </div>
      </div>

      <div className="flex justify-center space-x-3 pt-4">
        <Button variant="outline" onClick={() => {/* 处理取消 */}}>
          取消
        </Button>
        <Button onClick={handleSave}>
          保存配置
        </Button>
      </div>
    </div>
  );
}