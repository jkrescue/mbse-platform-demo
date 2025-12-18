import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface VehicleSafetyArchNodeConfigProps {
  node: any;
  onSave: (config: any) => void;
  userRole?: string;
}

export function VehicleSafetyArchNodeConfig({ node, onSave, userRole }: VehicleSafetyArchNodeConfigProps) {
  const [config, setConfig] = useState({
    nodeName: node?.name || '整车安全架构设计',
    description: node?.description || '进行功能与架构的详细设计',
    timeout: node?.config?.timeout || 900,
    retryCount: node?.config?.retryCount || 2,
    autoRun: node?.config?.autoRun || false,
    // 整车安全架构设计特有配置
    safetyStandard: node?.config?.parameters?.safetyStandard || 'iso26262',
    asilLevel: node?.config?.parameters?.asilLevel || 'ASIL-B',
    safetyArchitecture: node?.config?.parameters?.safetyArchitecture || 'distributed',
    functionalSafety: node?.config?.parameters?.functionalSafety || {
      hazardAnalysis: true,
      riskAssessment: true,
      safetyGoals: true,
      technicalRequirements: true
    },
    safetyMechanisms: node?.config?.parameters?.safetyMechanisms || [
      'redundancy',
      'monitoring',
      'degradation',
      'fail-safe'
    ],
    designLevel: node?.config?.parameters?.designLevel || 'system',
    includeTestCases: node?.config?.parameters?.includeTestCases || true,
    operationMode: node?.config?.parameters?.operationMode || 'ea',
    toolType: node?.config?.parameters?.toolType || 'EA',
    validationLevel: node?.config?.parameters?.validationLevel || 'comprehensive',
    complianceCheck: node?.config?.parameters?.complianceCheck || true,
    generateSafetyCase: node?.config?.parameters?.generateSafetyCase || true,
  });

  const handleSave = () => {
    const saveConfig = {
      ...config,
      parameters: {
        safetyStandard: config.safetyStandard,
        asilLevel: config.asilLevel,
        safetyArchitecture: config.safetyArchitecture,
        functionalSafety: config.functionalSafety,
        safetyMechanisms: config.safetyMechanisms,
        designLevel: config.designLevel,
        includeTestCases: config.includeTestCases,
        operationMode: config.operationMode,
        toolType: config.toolType,
        validationLevel: config.validationLevel,
        complianceCheck: config.complianceCheck,
        generateSafetyCase: config.generateSafetyCase,
      }
    };
    onSave(saveConfig);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">整车安全架构设计配置</h3>
        <p className="text-sm text-muted-foreground mt-1">
          配置整车安全架构设计的功能安全要求和验证参数
        </p>
      </div>

      <Separator />

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">基础设置</TabsTrigger>
          <TabsTrigger value="safety">安全标准</TabsTrigger>
          <TabsTrigger value="mechanisms">安全机制</TabsTrigger>
          <TabsTrigger value="validation">验证配置</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
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
                <SelectItem value="ASTRÉE">Astrée</SelectItem>
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
        </TabsContent>

        <TabsContent value="safety" className="space-y-4">
          <div>
            <Label htmlFor="safetyStandard">安全标准</Label>
            <Select value={config.safetyStandard} onValueChange={(value) => setConfig({ ...config, safetyStandard: value })}>
              <SelectTrigger>
                <SelectValue placeholder="选择安全标准" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="iso26262">ISO 26262</SelectItem>
                <SelectItem value="iec61508">IEC 61508</SelectItem>
                <SelectItem value="do178c">DO-178C</SelectItem>
                <SelectItem value="en50128">EN 50128</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="asilLevel">ASIL等级</Label>
            <Select value={config.asilLevel} onValueChange={(value) => setConfig({ ...config, asilLevel: value })}>
              <SelectTrigger>
                <SelectValue placeholder="选择ASIL等级" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="QM">QM</SelectItem>
                <SelectItem value="ASIL-A">ASIL-A</SelectItem>
                <SelectItem value="ASIL-B">ASIL-B</SelectItem>
                <SelectItem value="ASIL-C">ASIL-C</SelectItem>
                <SelectItem value="ASIL-D">ASIL-D</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="safetyArchitecture">安全架构</Label>
            <Select value={config.safetyArchitecture} onValueChange={(value) => setConfig({ ...config, safetyArchitecture: value })}>
              <SelectTrigger>
                <SelectValue placeholder="选择安全架构" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="centralized">集中式</SelectItem>
                <SelectItem value="distributed">分布式</SelectItem>
                <SelectItem value="hierarchical">分层式</SelectItem>
                <SelectItem value="federated">联邦式</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>功能安全要素</Label>
            <div className="space-y-2 mt-2">
              {[
                { key: 'hazardAnalysis', label: '危害分析' },
                { key: 'riskAssessment', label: '风险评估' },
                { key: 'safetyGoals', label: '安全目标' },
                { key: 'technicalRequirements', label: '技术要求' }
              ].map((element) => (
                <div key={element.key} className="flex items-center space-x-2">
                  <Switch
                    id={element.key}
                    checked={config.functionalSafety[element.key as keyof typeof config.functionalSafety]}
                    onCheckedChange={(checked) => setConfig({
                      ...config,
                      functionalSafety: {
                        ...config.functionalSafety,
                        [element.key]: checked
                      }
                    })}
                  />
                  <Label htmlFor={element.key}>{element.label}</Label>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="mechanisms" className="space-y-4">
          <div>
            <Label>安全机制</Label>
            <div className="space-y-2 mt-2">
              {[
                { key: 'redundancy', label: '冗余机制' },
                { key: 'monitoring', label: '监控机制' },
                { key: 'degradation', label: '降级机制' },
                { key: 'fail-safe', label: '故障安全' },
                { key: 'fail-operational', label: '故障运行' },
                { key: 'diagnosis', label: '诊断机制' },
                { key: 'prevention', label: '预防机制' },
                { key: 'mitigation', label: '缓解机制' }
              ].map((mechanism) => (
                <div key={mechanism.key} className="flex items-center space-x-2">
                  <Switch
                    id={mechanism.key}
                    checked={config.safetyMechanisms.includes(mechanism.key)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setConfig({
                          ...config,
                          safetyMechanisms: [...config.safetyMechanisms, mechanism.key]
                        });
                      } else {
                        setConfig({
                          ...config,
                          safetyMechanisms: config.safetyMechanisms.filter(m => m !== mechanism.key)
                        });
                      }
                    }}
                  />
                  <Label htmlFor={mechanism.key}>{mechanism.label}</Label>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="validation" className="space-y-4">
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
              id="complianceCheck"
              checked={config.complianceCheck}
              onCheckedChange={(checked) => setConfig({ ...config, complianceCheck: checked })}
            />
            <Label htmlFor="complianceCheck">合规性检查</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="generateSafetyCase"
              checked={config.generateSafetyCase}
              onCheckedChange={(checked) => setConfig({ ...config, generateSafetyCase: checked })}
            />
            <Label htmlFor="generateSafetyCase">生成安全案例</Label>
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
        </TabsContent>
      </Tabs>

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